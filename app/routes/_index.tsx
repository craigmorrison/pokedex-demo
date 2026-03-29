import { useLoaderData, Link, useNavigation, useSearchParams } from "react-router";
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

const PAGE_LIMIT = 20;

export async function clientLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const rawOffset = parseInt(url.searchParams.get("offset") || "0", 10);
  const offset = Number.isNaN(rawOffset) ? 0 : Math.max(0, rawOffset);
  const search = url.searchParams.get("q") || "";
  const type = url.searchParams.get("type") || "";

  try {
    let filtered: PokemonListItem[];

    if (type) {
      filtered = await getPokemonByType(type);
    } else if (search) {
      const allData = await getPokemonList(0, 2000);
      filtered = allData.results.filter((p: PokemonListItem) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    } else {
      const listData = await getPokemonList(offset, PAGE_LIMIT);
      const pokemonData = await Promise.all(
        listData.results.map(async (p: PokemonListItem) => {
          try {
            const details = await getPokemon(p.name);
            return { ...details, name: p.name };
          } catch {
            return { id: 0, name: p.name, types: [], abilities: [], stats: [], height: 0, weight: 0, sprites: {} as any, species: { name: p.name, url: p.url } };
          }
        })
      );
      return {
        pokemon: pokemonData,
        count: listData.count,
        nextOffset: listData.next ? offset + PAGE_LIMIT : null,
        prevOffset: offset > 0 ? Math.max(0, offset - PAGE_LIMIT) : null,
        currentOffset: offset,
        search: "",
        type: "",
      };
    }

    const paginatedNames = filtered.slice(offset, offset + PAGE_LIMIT);
    const pokemonData = await Promise.all(
      paginatedNames.map(async (p: PokemonListItem) => {
        try {
          return await getPokemon(p.name);
        } catch {
          return { id: 0, name: p.name, types: [], abilities: [], stats: [], height: 0, weight: 0, sprites: {} as any, species: { name: p.name, url: "" } };
        }
      })
    );

    return {
      pokemon: pokemonData,
      count: filtered.length,
      nextOffset: offset + PAGE_LIMIT < filtered.length ? offset + PAGE_LIMIT : null,
      prevOffset: offset > 0 ? Math.max(0, offset - PAGE_LIMIT) : null,
      currentOffset: offset,
      search,
      type,
    };
  } catch {
    throw new Response("Failed to load Pokemon data. Please try again.", { status: 500 });
  }
}

const TYPE_FILTERS = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

export default function Home() {
  const { pokemon, count, nextOffset, prevOffset, currentOffset, search, type } = useLoaderData<typeof clientLoader>();
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();

  const isLoading = navigation.state === "loading";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const q = (formData.get("q") as string) || "";
    setSearchParams((prev) => {
      if (q) {
        prev.set("q", q);
      } else {
        prev.delete("q");
      }
      prev.delete("offset");
      return prev;
    });
  };

  const handleTypeClick = (typeName: string) => {
    setSearchParams((prev) => {
      if (typeName && typeName !== type) {
        prev.set("type", typeName);
      } else {
        prev.delete("type");
      }
      prev.delete("offset");
      prev.delete("q");
      return prev;
    });
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
            aria-hidden="true"
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
            name="q"
            placeholder="Search Pokemon..."
            className={homeStyles.searchInput}
            defaultValue={search}
          />
        </form>

        <div className={homeStyles.filters}>
          <span className={homeStyles.filterLabel}>Filter by type:</span>
          <div className={homeStyles.typeFilters}>
            <button
              className={homeStyles.typeButton}
              style={{ backgroundColor: !type ? "#dc2626" : "#64748b" }}
              aria-pressed={!type}
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
                aria-pressed={type === typeName}
                onClick={() => handleTypeClick(typeName)}
              >
                {typeName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className={uiStyles.loadingGrid} aria-busy="true" aria-label="Loading Pokemon">
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
