import Constants from "expo-constants";

/**
 * API keys are read from (in priority order):
 *   1. Public env vars (EXPO_PUBLIC_TMDB_API_KEY / EXPO_PUBLIC_OMDB_API_KEY)
 *   2. app.json -> expo.extra.{tmdbApiKey,omdbApiKey}
 *
 * Both TMDB and OMDB offer free API keys. See README for setup.
 */

const extra = (Constants.expoConfig?.extra ?? {}) as {
  tmdbApiKey?: string;
  omdbApiKey?: string;
};

export const TMDB_API_KEY: string =
  process.env.EXPO_PUBLIC_TMDB_API_KEY || extra.tmdbApiKey || "";

export const OMDB_API_KEY: string =
  process.env.EXPO_PUBLIC_OMDB_API_KEY || extra.omdbApiKey || "";

export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const OMDB_BASE_URL = "https://www.omdbapi.com";

// TMDB image CDN. Sizes documented at https://developer.themoviedb.org/docs/image-basics
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export const hasTmdbKey = () => TMDB_API_KEY.trim().length > 0;
export const hasOmdbKey = () => OMDB_API_KEY.trim().length > 0;

export function posterUrl(
  path: string | null | undefined,
  size: "w185" | "w342" | "w500" | "w780" | "original" = "w500"
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function backdropUrl(
  path: string | null | undefined,
  size: "w780" | "w1280" | "original" = "w1280"
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function profileUrl(
  path: string | null | undefined,
  size: "w185" | "w342" | "original" = "w185"
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
