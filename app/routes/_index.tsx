import { useState } from "react";
import { useLoaderData, Link, useNavigation } from "react-router";
import type { MetaFunction } from "react-router";
import { getPokemonList, getPokemonByType, getPokemon, type Pokemon, type PokemonListItem } from "~/lib/pokemon";
import { PokemonCard } from "~/components/pokemon/PokemonCard";
import * as homeStyles from "~/styles/components/home.css";
import * as uiStyles from "~/styles/components/ui.css";
import { typeColors } from "~/styles/theme.css";

export const meta: MetaFunction = () => {
  return [
    { title: "Pokédex - Discover Pokemon" },
    { name: "description", content: "Browse and discover your favorite Pokemon" },
  ];
};

export async function clientLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);
  const limit = 20;
  const search = url.searchParams.get("q") || "";
  const type = url.searchParams.get("type") || "";
  
  let filtered: PokemonListItem[];
  
  if (type) {
    // Use PokeAPI's type endpoint - much faster
    filtered = await getPokemonByType(type);
  } else if (search) {
    // For search, get all names and filter
    const allData = await getPokemonList(0, 2000);
    filtered = allData.results.filter((p: PokemonListItem) => 
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  } else {
    // No filter - just get paginated list
    const listData = await getPokemonList(offset, limit);
    const pokemonData = await Promise.all(
      listData.results.map(async (p: PokemonListItem) => {
        const details = await getPokemon(p.name);
        return { name: p.name, url: p.url, ...details } as PokemonListItem & Pokemon;
      })
    );
    return {
      pokemon: pokemonData,
      count: listData.count,
      nextOffset: listData.next ? offset + limit : null,
      prevOffset: offset > 0 ? Math.max(0, offset - limit) : null,
      currentOffset: offset,
      search: "",
      type: "",
    };
  }
  
  // Get details for paginated results
  const paginatedNames = filtered.slice(offset, offset + limit);
  const pokemonData = await Promise.all(
    paginatedNames.map(async (p: PokemonListItem) => {
      const details = await getPokemon(p.name);
      return details;
    })
  );

  return {
    pokemon: pokemonData,
    count: filtered.length,
    nextOffset: offset + limit < filtered.length ? offset + limit : null,
    prevOffset: offset > 0 ? Math.max(0, offset - limit) : null,
    currentOffset: offset,
    search,
    type,
  };
}

const TYPE_FILTERS = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

export default function Home() {
  const { pokemon, count, nextOffset, prevOffset, currentOffset, search, type } = useLoaderData<typeof clientLoader>();
  const navigation = useNavigation();
  const [searchInput, setSearchInput] = useState(search);

  const isLoading = navigation.state === "loading";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    if (searchInput) {
      params.set("q", searchInput);
    } else {
      params.delete("q");
    }
    params.delete("offset");
    window.location.search = params.toString();
  };

  const handleTypeClick = (typeName: string) => {
    const params = new URLSearchParams(window.location.search);
    if (typeName && typeName !== type) {
      params.set("type", typeName);
    } else {
      params.delete("type");
    }
    params.delete("offset");
    params.delete("q"); // Clear search when changing type
    window.location.search = params.toString();
  };

  return (
    <div className={homeStyles.page}>
      <div className={homeStyles.searchSection}>
        <form onSubmit={handleSearch} className={homeStyles.searchContainer}>
          <svg
            className={homeStyles.searchIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search Pokemon..."
            className={homeStyles.searchInput}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        <div className={homeStyles.filters}>
          <span className={homeStyles.filterLabel}>Filter by type:</span>
          <div className={homeStyles.typeFilters}>
            <button
              className={homeStyles.typeButton}
              style={{ backgroundColor: !type ? "#dc2626" : "#64748b" }}
              onClick={() => handleTypeClick("")}
            >
              All
            </button>
            {TYPE_FILTERS.map((typeName) => (
              <button
                key={typeName}
                className={`${homeStyles.typeButton} ${type === typeName ? homeStyles.typeButtonActive : ""}`}
                style={{ 
                  backgroundColor: typeColors[typeName],
                  opacity: type === typeName ? 1 : 0.7,
                }}
                onClick={() => handleTypeClick(typeName)}
              >
                {typeName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className={uiStyles.loadingGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <PokemonCard key={i} pokemon={{ name: "", url: "" }} />
          ))}
        </div>
      ) : (
        <>
          <div className={homeStyles.grid}>
            {pokemon.map((p: Pokemon) => (
              <PokemonCard
                key={p.name}
                pokemon={{ name: p.name, url: `https://pokeapi.co/api/v2/pokemon/${p.id}/` }}
              />
            ))}
          </div>

          {pokemon.length === 0 && (
            <div className={uiStyles.error}>
              <p className={uiStyles.errorTitle}>No Pokemon found</p>
              <p className={uiStyles.errorMessage}>Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}

      {(nextOffset !== null || prevOffset !== null) && (
        <div className={homeStyles.pagination}>
          {prevOffset !== null && (
            <Link
              to={`/?offset=${prevOffset}${search ? `&q=${search}` : ""}${type ? `&type=${type}` : ""}`}
              className={uiStyles.buttonSecondary}
              prefetch="intent"
            >
              Previous
            </Link>
          )}
          <span className={homeStyles.pageInfo}>
            Showing {currentOffset + 1}-{Math.min(currentOffset + pokemon.length, count)} of {count}
          </span>
          {nextOffset !== null && (
            <Link
              to={`/?offset=${nextOffset}${search ? `&q=${search}` : ""}${type ? `&type=${type}` : ""}`}
              className={uiStyles.buttonPrimary}
              prefetch="intent"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
