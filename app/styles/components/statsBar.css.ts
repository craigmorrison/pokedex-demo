import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
});

export const statRow = style({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
});

export const statName = style({
  width: "80px",
  fontSize: "0.875rem",
  fontWeight: "500",
  color: "#64748b",
  textTransform: "uppercase",
});

export const statBarContainer = style({
  flex: 1,
  height: "8px",
  backgroundColor: "#f1f5f9",
  borderRadius: "9999px",
  overflow: "hidden",
});

export const statBar = style({
  height: "100%",
  borderRadius: "9999px",
  transition: "width 0.5s ease-out",
});

export const statValue = style({
  width: "40px",
  fontSize: "0.875rem",
  fontWeight: "600",
  color: "#0f172a",
  textAlign: "right",
});
