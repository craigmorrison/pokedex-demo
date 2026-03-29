import { style } from "@vanilla-extract/css";
import { vars } from "./theme.css";

export const container = style({
  maxWidth: "1200px",
  margin: "0 auto",
  padding: `${vars.space.lg} ${vars.space.md}`,
});

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: `${vars.space.lg} 0`,
  borderBottom: `1px solid ${vars.color.border}`,
  marginBottom: vars.space.xl,
});

export const logo = style({
  fontSize: vars.fontSize["3xl"],
  fontWeight: vars.fontWeight.bold,
  color: vars.color.primary,
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
});

export const logoImage = style({
  width: "40px",
  height: "40px",
});

export const nav = style({
  display: "flex",
  gap: vars.space.lg,
});

export const navLink = style({
  color: vars.color.text.secondary,
  textDecoration: "none",
  fontWeight: vars.fontWeight.medium,
  transition: `color ${vars.transition.fast}`,
  ":hover": {
    color: vars.color.primary,
  },
});

export const main = style({
  minHeight: "calc(100vh - 200px)",
});
