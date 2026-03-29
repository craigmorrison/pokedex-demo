import { Link } from "react-router";
import type { PokemonListItem } from "~/lib/pokemon";
import { getPokemonId, getPokemonImage } from "~/lib/pokemon";
import * as styles from "~/styles/components/card.css";
import * as uiStyles from "~/styles/components/ui.css";

interface PokemonCardProps {
  pokemon: PokemonListItem;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const id = getPokemonId(pokemon.url);
  const image = getPokemonImage(id);

  return (
    <Link 
      to={`/pokemon/${pokemon.name}`} 
      className={styles.card}
      prefetch="intent"
      aria-label={`View ${pokemon.name} details`}
    >
      <img
        src={image}
        alt={pokemon.name}
        className={styles.cardImage}
        loading="lazy"
      />
      <div className={styles.cardContent}>
        <span className={styles.cardSubtitle}>#{String(id).padStart(3, "0")}</span>
        <h3 className={styles.cardTitle}>{pokemon.name}</h3>
      </div>
    </Link>
  );
}

export function PokemonCardSkeleton() {
  return (
    <div className={uiStyles.loadingCard}>
      <div className={uiStyles.loadingImage} />
      <div className={uiStyles.loadingTitle} />
    </div>
  );
}
