import { style } from "@vanilla-extract/css";

export const pageContainer = style({
  paddingBottom: "3rem",
});

export const header = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "2rem",
  marginBottom: "2rem",
});

export const backLink = style({
  alignSelf: "flex-start",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  color: "#64748b",
  textDecoration: "none",
  fontWeight: "500",
  transition: "color 150ms",
});

export const titleSection = style({
  textAlign: "center",
});

export const pokemonId = style({
  fontSize: "1.125rem",
  color: "#94a3b8",
  fontWeight: "500",
});

export const pokemonName = style({
  fontSize: "2.25rem",
  fontWeight: "700",
  color: "#0f172a",
  textTransform: "capitalize",
  marginBottom: "1rem",
});

export const mainContent = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "2rem",
});

export const imageSection = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "2rem",
});

export const mainImage = style({
  width: "100%",
  maxWidth: "400px",
  aspectRatio: "1",
  objectFit: "contain",
  backgroundColor: "#f1f5f9",
  borderRadius: "1rem",
});

export const infoSection = style({
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
});

export const infoCard = style({
  backgroundColor: "#ffffff",
  borderRadius: "0.75rem",
  padding: "1.5rem",
  boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
});

export const infoTitle = style({
  fontSize: "1.25rem",
  fontWeight: "600",
  color: "#0f172a",
  marginBottom: "1rem",
});

export const infoGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "1rem",
});

export const infoItem = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
});

export const infoLabel = style({
  fontSize: "0.875rem",
  color: "#94a3b8",
});

export const infoValue = style({
  fontSize: "1.125rem",
  fontWeight: "500",
  color: "#0f172a",
});

export const abilitiesList = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
});

export const ability = style({
  padding: "0.25rem 1rem",
  backgroundColor: "#f1f5f9",
  borderRadius: "0.5rem",
  fontSize: "0.875rem",
  textTransform: "capitalize",
});

export const hiddenAbility = style({
  fontStyle: "italic",
  opacity: 0.7,
});

export const evolutionChain = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "1.5rem",
  marginTop: "1rem",
});

export const evolutionItem = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.5rem",
});

export const evolutionImage = style({
  width: "80px",
  height: "80px",
  objectFit: "contain",
});

export const evolutionName = style({
  fontSize: "0.875rem",
  fontWeight: "500",
  textTransform: "capitalize",
  color: "#0f172a",
});

export const evolutionArrow = style({
  color: "#94a3b8",
  fontSize: "1.25rem",
});
