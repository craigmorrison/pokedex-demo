import { typeColors } from "~/styles/theme.css";
import * as uiStyles from "~/styles/components/ui.css";

interface TypeBadgeProps {
  type: string;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const color = typeColors[type] || "#A8A77A";
  
  return (
    <span
      className={uiStyles.badge}
      style={{ backgroundColor: color, color: "white" }}
    >
      {type}
    </span>
  );
}

interface TypeListProps {
  types: string[];
}

export function TypeList({ types }: TypeListProps) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      {types.map((type) => (
        <TypeBadge key={type} type={type} />
      ))}
    </div>
  );
}
