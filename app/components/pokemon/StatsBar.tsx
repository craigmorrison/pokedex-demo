import type { PokemonStat } from "~/lib/pokemon";
import * as styles from "~/styles/components/statsBar.css";

const statNames: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SP. ATK",
  "special-defense": "SP. DEF",
  speed: "SPD",
};

const statColors: Record<string, string> = {
  hp: "#ff5959",
  attack: "#f5ac78",
  defense: "#fae078",
  "special-attack": "#9db7f5",
  "special-defense": "#a7db8d",
  speed: "#fa92b2",
};

interface StatsBarProps {
  stats: PokemonStat[];
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className={styles.container}>
      {stats.map((stat) => {
        const name = statNames[stat.stat.name] || stat.stat.name;
        const color = statColors[stat.stat.name] || "#dc2626";
        const percentage = Math.min((stat.base_stat / 255) * 100, 100);

        return (
          <div key={stat.stat.name} className={styles.statRow}>
            <span className={styles.statName}>{name}</span>
            <div className={styles.statBarContainer}>
              <div
                className={styles.statBar}
                style={{
                  width: `${percentage}%`,
                  backgroundColor: color,
                }}
              />
            </div>
            <span className={styles.statValue}>{stat.base_stat}</span>
          </div>
        );
      })}
    </div>
  );
}
