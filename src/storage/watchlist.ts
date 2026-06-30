import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Movie } from "@/api/types";

const KEY = "cinephile:watchlist";

export interface WatchlistItem {
  id: number;
  title: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
  addedAt: number;
}

async function readAll(): Promise<WatchlistItem[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as WatchlistItem[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(items: WatchlistItem[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

export const watchlistStore = {
  all: readAll,

  async has(movieId: number): Promise<boolean> {
    const all = await readAll();
    return all.some((m) => m.id === movieId);
  },

  async toggle(movie: Movie): Promise<boolean> {
    const all = await readAll();
    const exists = all.some((m) => m.id === movie.id);
    if (exists) {
      await writeAll(all.filter((m) => m.id !== movie.id));
      return false;
    }
    const item: WatchlistItem = {
      id: movie.id,
      title: movie.title,
      posterPath: movie.posterPath,
      releaseDate: movie.releaseDate,
      voteAverage: movie.voteAverage,
      addedAt: Date.now(),
    };
    await writeAll([item, ...all]);
    return true;
  },

  async remove(movieId: number): Promise<void> {
    const all = await readAll();
    await writeAll(all.filter((m) => m.id !== movieId));
  },
};
