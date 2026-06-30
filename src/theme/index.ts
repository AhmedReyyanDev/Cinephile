/**
 * Central design tokens for Cinephile.
 * A single dark, cinematic theme keeps the UI clean and consistent.
 */

export const colors = {
  // Backgrounds
  bg: "#0B0B0F",
  surface: "#15151D",
  surfaceAlt: "#1E1E29",
  elevated: "#23232F",

  // Text
  text: "#F5F5F7",
  textMuted: "#A0A0B0",
  textFaint: "#6C6C7C",

  // Brand / accent
  accent: "#E50914", // cinematic red
  accentSoft: "#FF4D57",
  gold: "#F5C518", // rating gold (IMDb-style)
  green: "#46D369", // "free" / available
  blue: "#4DA6FF",

  // Utility
  border: "#26262F",
  overlay: "rgba(0,0,0,0.55)",
  transparent: "transparent",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const font = {
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    huge: 34,
  },
  weight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    heavy: "800" as const,
  },
} as const;

/** Explicit absolute-fill (StyleSheet.absoluteFillObject types are unreliable here). */
export const fill = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
} as const;

export const shadow = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;
