export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string; // YYYY-MM-DD
  voteAverage: number; // 0..10
  voteCount: number;
  genreIds: number[];
  popularity: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

export interface MovieDetails extends Movie {
  runtime: number | null;
  genres: Genre[];
  tagline: string | null;
  status: string;
  homepage: string | null;
  imdbId: string | null;
  cast: CastMember[];
}

/** A single streaming/rental option for a movie in a given country. */
export interface WatchProvider {
  providerId: number;
  providerName: string;
  logoPath: string | null;
}

export type WatchKind = "free" | "flatrate" | "ads" | "rent" | "buy";

export interface WatchOptions {
  link: string | null; // JustWatch deep link
  free: WatchProvider[]; // free, no subscription
  ads: WatchProvider[]; // free with ads (Tubi, Pluto, etc.)
  flatrate: WatchProvider[]; // subscription (Netflix, Prime, etc.)
  rent: WatchProvider[];
  buy: WatchProvider[];
}

/** A review pulled from TMDB's community. */
export interface CommunityReview {
  id: string;
  author: string;
  authorUsername: string | null;
  avatarPath: string | null;
  rating: number | null; // 0..10
  content: string;
  createdAt: string;
  url: string | null;
}

/** External ratings aggregated by OMDB. */
export interface ExternalRatings {
  imdbRating: string | null; // e.g. "8.1"
  rottenTomatoes: string | null; // e.g. "94%"
  metacritic: string | null; // e.g. "78/100"
  rated: string | null; // e.g. "PG-13"
  awards: string | null;
}
