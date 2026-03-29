import { style } from "@vanilla-extract/css";
import { vars } from "../theme.css";

export const card = style({
  backgroundColor: vars.color.card,
  borderRadius: vars.radius.lg,
  boxShadow: vars.shadow.sm,
  overflow: "hidden",
  transition: `transform ${vars.transition.fast}, box-shadow ${vars.transition.fast}`,
  cursor: "pointer",
  textDecoration: "none",
  display: "block",
  ":hover": {
    transform: "translateY(-4px)",
    boxShadow: vars.shadow.lg,
  },
});

export const cardImage = style({
  width: "100%",
  aspectRatio: "1",
  objectFit: "contain",
  padding: vars.space.md,
  backgroundColor: vars.color.cardHover,
});

export const cardContent = style({
  padding: vars.space.md,
});

export const cardTitle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.text.primary,
  textTransform: "capitalize",
  marginBottom: vars.space.xs,
});

export const cardSubtitle = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.muted,
});

export const cardTypes = style({
  display: "flex",
  gap: vars.space.xs,
  flexWrap: "wrap",
  marginTop: vars.space.sm,
});
