import { style } from "@vanilla-extract/css";
import { vars } from "../theme.css";

export const page = style({
  paddingBottom: vars.space.xxl,
});

export const searchSection = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.lg,
  marginBottom: vars.space.xl,
});

export const searchContainer = style({
  position: "relative",
  width: "100%",
  maxWidth: "400px",
});

export const searchInput = style({
  width: "100%",
  padding: `${vars.space.md} ${vars.space.lg}`,
  paddingLeft: "calc(1rem + 24px)",
  fontSize: vars.fontSize.base,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.lg,
  backgroundColor: vars.color.card,
  outline: "none",
  transition: `border-color ${vars.transition.fast}, box-shadow ${vars.transition.fast}`,
  "::placeholder": {
    color: vars.color.text.muted,
  },
  ":focus": {
    borderColor: vars.color.primary,
    boxShadow: `0 0 0 3px ${vars.color.primary}20`,
  },
});

export const searchIcon = style({
  position: "absolute",
  left: vars.space.md,
  top: "50%",
  transform: "translateY(-50%)",
  width: "20px",
  height: "20px",
  color: vars.color.text.muted,
  pointerEvents: "none",
});

export const filters = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.space.sm,
  alignItems: "center",
});

export const filterLabel = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.text.secondary,
  fontWeight: vars.fontWeight.medium,
});

export const typeFilters = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.space.xs,
});

export const typeButton = style({
  padding: `${vars.space.xs} ${vars.space.md}`,
  borderRadius: vars.radius.full,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.medium,
  border: "none",
  cursor: "pointer",
  transition: `all ${vars.transition.fast}`,
  textTransform: "capitalize",
  color: "white",
  opacity: 0.6,
  ":hover": {
    opacity: 1,
  },
});

export const typeButtonActive = style({
  opacity: 1,
  transform: "scale(1.05)",
});

export const grid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  gap: vars.space.lg,
});

export const pagination = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: vars.space.md,
  marginTop: vars.space.xl,
  paddingTop: vars.space.xl,
});

export const pageInfo = style({
  color: vars.color.text.secondary,
  fontSize: vars.fontSize.sm,
});
