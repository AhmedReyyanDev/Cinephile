import {
  TMDB_API_KEY,
  TMDB_BASE_URL,
  hasTmdbKey,
} from "./config";
import type {
  CommunityReview,
  Movie,
  MovieDetails,
  WatchOptions,
  WatchProvider,
} from "./types";

export class MissingApiKeyError extends Error {
  constructor() {
    super("TMDB API key is missing. Add it in app.json or via EXPO_PUBLIC_TMDB_API_KEY.");
    this.name = "MissingApiKeyError";
  }
}

async function tmdbGet<T>(
  path: string,
  params: Record<string, string | number | undefined> = {}
): Promise<T> {
  if (!hasTmdbKey()) throw new MissingApiKeyError();

  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  url.searchParams.set("language", "en-US");
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`TMDB ${res.status}: ${body.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

// ---- Mappers (TMDB snake_case -> our camelCase) -----------------------------

interface RawMovie {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
  popularity?: number;
}

function mapMovie(raw: RawMovie): Movie {
  return {
    id: raw.id,
    title: raw.title ?? raw.name ?? "Untitled",
    overview: raw.overview ?? "",
    posterPath: raw.poster_path ?? null,
    backdropPath: raw.backdrop_path ?? null,
    releaseDate: raw.release_date ?? "",
    voteAverage: raw.vote_average ?? 0,
    voteCount: raw.vote_count ?? 0,
    genreIds: raw.genre_ids ?? [],
    popularity: raw.popularity ?? 0,
  };
}

interface Paginated<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

async function getMovieList(
  path: string,
  params: Record<string, string | number | undefined> = {}
): Promise<Movie[]> {
  const data = await tmdbGet<Paginated<RawMovie>>(path, params);
  return data.results.map(mapMovie);
}

// ---- Public API -------------------------------------------------------------

export const tmdb = {
  trending: (window: "day" | "week" = "week") =>
    getMovieList(`/trending/movie/${window}`),

  nowPlaying: () => getMovieList("/movie/now_playing", { region: "US" }),

  upcoming: () => getMovieList("/movie/upcoming", { region: "US" }),

  popular: () => getMovieList("/movie/popular"),

  topRated: () => getMovieList("/movie/top_rated"),

  search: (query: string, page = 1) =>
    getMovieList("/search/movie", { query, page, include_adult: "false" }),

  async details(id: number): Promise<MovieDetails> {
    const raw = await tmdbGet<
      RawMovie & {
        runtime?: number | null;
        genres?: { id: number; name: string }[];
        tagline?: string | null;
        status?: string;
        homepage?: string | null;
        imdb_id?: string | null;
        credits?: {
          cast?: {
            id: number;
            name: string;
            character: string;
            profile_path: string | null;
          }[];
        };
      }
    >(`/movie/${id}`, { append_to_response: "credits" });

    return {
      ...mapMovie(raw),
      runtime: raw.runtime ?? null,
      genres: raw.genres ?? [],
      tagline: raw.tagline ?? null,
      status: raw.status ?? "",
      homepage: raw.homepage ?? null,
      imdbId: raw.imdb_id ?? null,
      cast: (raw.credits?.cast ?? []).slice(0, 12).map((c) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profilePath: c.profile_path,
      })),
    };
  },

  async watchProviders(id: number, region = "US"): Promise<WatchOptions> {
    interface RawProvider {
      provider_id: number;
      provider_name: string;
      logo_path: string | null;
    }
    interface RegionData {
      link?: string;
      free?: RawProvider[];
      ads?: RawProvider[];
      flatrate?: RawProvider[];
      rent?: RawProvider[];
      buy?: RawProvider[];
    }

    const data = await tmdbGet<{ results: Record<string, RegionData> }>(
      `/movie/${id}/watch/providers`
    );
    const r = data.results[region] ?? {};
    const map = (list?: RawProvider[]): WatchProvider[] =>
      (list ?? []).map((p) => ({
        providerId: p.provider_id,
        providerName: p.provider_name,
        logoPath: p.logo_path,
      }));

    return {
      link: r.link ?? null,
      free: map(r.free),
      ads: map(r.ads),
      flatrate: map(r.flatrate),
      rent: map(r.rent),
      buy: map(r.buy),
    };
  },

  async reviews(id: number): Promise<CommunityReview[]> {
    interface RawReview {
      id: string;
      author: string;
      content: string;
      created_at: string;
      url: string;
      author_details?: {
        username?: string;
        avatar_path?: string | null;
        rating?: number | null;
      };
    }
    const data = await tmdbGet<Paginated<RawReview>>(`/movie/${id}/reviews`);
    return data.results.map((r) => ({
      id: r.id,
      author: r.author,
      authorUsername: r.author_details?.username ?? null,
      avatarPath: r.author_details?.avatar_path ?? null,
      rating: r.author_details?.rating ?? null,
      content: r.content,
      createdAt: r.created_at,
      url: r.url ?? null,
    }));
  },
};
