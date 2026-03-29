import { useLoaderData, Link } from "react-router";
import type { MetaFunction } from "react-router";
import { getPokemon, getPokemonSpecies, getEvolutionChain, type Pokemon } from "~/lib/pokemon";
import { TypeList } from "~/components/pokemon/TypeBadge";
import { StatsBar } from "~/components/pokemon/StatsBar";
import { getPokemonImage } from "~/lib/pokemon";
import * as styles from "~/styles/components/pokemonDetail.css";

export const meta: MetaFunction<typeof clientLoader> = ({ data }) => {
  if (!data) {
    return [{ title: "Pokemon Not Found" }];
  }
  return [
    { title: `${data.pokemon.name.charAt(0).toUpperCase() + data.pokemon.name.slice(1)} - Pokédex` },
    { name: "description", content: `Learn about ${data.pokemon.name}, its stats, abilities, and evolution chain.` },
  ];
};

export async function clientLoader({ params }: { params: Record<string, string | undefined> }) {
  const name = params.name;
  if (!name) {
    throw new Response("Not Found", { status: 404 });
  }

  const pokemon = await getPokemon(name);
  const species = await getPokemonSpecies(name);
  const evolutionChain = await getEvolutionChain(species.evolution_chain.url);

  return { pokemon, species, evolutionChain };
}

function extractEvolutions(chain: { chain: { species: { name: string; url: string }; evolves_to: any[] } }): Array<{ name: string; id: number }> {
  const evolutions: Array<{ name: string; id: number }> = [];
  
  function traverse(node: { species: { name: string; url: string }; evolves_to: any[] }) {
    const id = parseInt(node.species.url.split("/").filter(Boolean).pop() || "0", 10);
    evolutions.push({ name: node.species.name, id });
    node.evolves_to?.forEach(traverse);
  }
  
  traverse(chain.chain);
  return evolutions;
}

export default function PokemonDetail() {
  const { pokemon, species, evolutionChain } = useLoaderData<typeof clientLoader>();
  const evolutions = extractEvolutions(evolutionChain);

  return (
    <div className={styles.pageContainer}>
      <Link to="/" className={styles.backLink}>
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Pokédex
      </Link>

      <div className={styles.header}>
        <div className={styles.titleSection}>
          <span className={styles.pokemonId}>#{String(pokemon.id).padStart(3, "0")}</span>
          <h1 className={styles.pokemonName}>{pokemon.name}</h1>
          <TypeList types={pokemon.types.map((t: { type: { name: string } }) => t.type.name)} />
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.imageSection}>
          <img
            src={getPokemonImage(pokemon.id)}
            alt={pokemon.name}
            className={styles.mainImage}
          />
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h2 className={styles.infoTitle}>Base Stats</h2>
            <StatsBar stats={pokemon.stats} />
          </div>

          <div className={styles.infoCard}>
            <h2 className={styles.infoTitle}>Profile</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Height</span>
                <span className={styles.infoValue}>{pokemon.height / 10} m</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Weight</span>
                <span className={styles.infoValue}>{pokemon.weight / 10} kg</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Base Experience</span>
                <span className={styles.infoValue}>{species.base_experience || "N/A"}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Habitat</span>
                <span className={styles.infoValue} style={{ textTransform: "capitalize" }}>
                  {species.habitat?.name || "Unknown"}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.infoCard}>
            <h2 className={styles.infoTitle}>Abilities</h2>
            <div className={styles.abilitiesList}>
              {pokemon.abilities.map((ability: { ability: { name: string }; is_hidden: boolean }) => (
                <span 
                  key={ability.ability.name} 
                  className={`${styles.ability} ${ability.is_hidden ? styles.hiddenAbility : ""}`}
                >
                  {ability.ability.name.replace("-", " ")}
                  {ability.is_hidden && " (hidden)"}
                </span>
              ))}
            </div>
          </div>

          {evolutions.length > 1 && (
            <div className={styles.infoCard}>
              <h2 className={styles.infoTitle}>Evolution Chain</h2>
              <div className={styles.evolutionChain}>
                {evolutions.map((evolution, index) => (
                  <div key={evolution.name} className={styles.evolutionItem}>
                    <Link to={`/pokemon/${evolution.name}`}>
                      <img
                        src={getPokemonImage(evolution.id)}
                        alt={evolution.name}
                        className={styles.evolutionImage}
                      />
                    </Link>
                    <span className={styles.evolutionName}>{evolution.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
