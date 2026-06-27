import { OMDB_API_KEY, OMDB_BASE_URL, hasOmdbKey } from "./config";
import type { ExternalRatings } from "./types";

/**
 * OMDB enriches a movie with IMDb / Rotten Tomatoes / Metacritic ratings.
 * It is optional: if no key is configured we simply skip it.
 */
export async function fetchExternalRatings(
  imdbId: string | null
): Promise<ExternalRatings | null> {
  if (!imdbId || !hasOmdbKey()) return null;

  const url = new URL(OMDB_BASE_URL);
  url.searchParams.set("apikey", OMDB_API_KEY);
  url.searchParams.set("i", imdbId);
  url.searchParams.set("tomatoes", "true");

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const data = (await res.json()) as {
      Response?: string;
      imdbRating?: string;
      Rated?: string;
      Awards?: string;
      Ratings?: { Source: string; Value: string }[];
    };
    if (data.Response === "False") return null;

    const find = (source: string) =>
      data.Ratings?.find((r) => r.Source === source)?.Value ?? null;

    const clean = (v: string | null | undefined) =>
      !v || v === "N/A" ? null : v;

    return {
      imdbRating: clean(data.imdbRating),
      rottenTomatoes: clean(find("Rotten Tomatoes")),
      metacritic: clean(find("Metacritic")),
      rated: clean(data.Rated),
      awards: clean(data.Awards),
    };
  } catch {
    return null;
  }
}
