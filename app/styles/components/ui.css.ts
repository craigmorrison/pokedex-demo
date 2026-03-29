import { style, keyframes } from "@vanilla-extract/css";
import { vars, typeColors } from "../theme.css";

const pulse = keyframes({
  "0%, " : { opacity: "1" },
  "50%": { opacity: "0.5" },
  "100%": { opacity: "1" },
});

export const loading = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: vars.space.xxl,
  gap: vars.space.md,
});

export const loadingSpinner = style({
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  backgroundColor: vars.color.border,
  animation: `${pulse} 1.5s ease-in-out infinite`,
});

export const loadingText = style({
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
});

export const loadingGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  gap: vars.space.lg,
  padding: vars.space.md,
});

export const loadingCard = style({
  backgroundColor: vars.color.card,
  borderRadius: vars.radius.lg,
  padding: vars.space.md,
});

export const loadingImage = style({
  width: "100%",
  aspectRatio: "1",
  backgroundColor: vars.color.cardHover,
  borderRadius: vars.radius.md,
  animation: `${pulse} 1.5s ease-in-out infinite`,
});

export const loadingTitle = style({
  height: "24px",
  width: "60%",
  backgroundColor: vars.color.cardHover,
  borderRadius: vars.radius.sm,
  marginTop: vars.space.md,
  animation: `${pulse} 1.5s ease-in-out infinite`,
});

export const error = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: vars.space.xxl,
  textAlign: "center",
});

export const errorTitle = style({
  fontSize: vars.fontSize["2xl"],
  fontWeight: vars.fontWeight.bold,
  color: vars.color.primary,
  marginBottom: vars.space.sm,
});

export const errorMessage = style({
  color: vars.color.text.secondary,
  marginBottom: vars.space.lg,
});

export const button = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.space.sm,
  padding: `${vars.space.sm} ${vars.space.lg}`,
  borderRadius: vars.radius.md,
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeight.medium,
  cursor: "pointer",
  border: "none",
  transition: `all ${vars.transition.fast}`,
  textDecoration: "none",
});

export const buttonPrimary = style([button, {
  backgroundColor: vars.color.primary,
  color: "white",
  ":hover": {
    backgroundColor: vars.color.primaryHover,
  },
}]);

export const buttonSecondary = style([button, {
  backgroundColor: vars.color.card,
  color: vars.color.text.primary,
  border: `1px solid ${vars.color.border}`,
  ":hover": {
    backgroundColor: vars.color.cardHover,
  },
}]);

export const badge = style({
  display: "inline-flex",
  alignItems: "center",
  padding: `${vars.space.xs} ${vars.space.sm}`,
  borderRadius: vars.radius.full,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.medium,
  textTransform: "capitalize",
});

export const badgeColors = Object.fromEntries(
  Object.entries(typeColors).map(([type, color]) => [
    type,
    style({ backgroundColor: color, color: "white" }),
  ])
);
