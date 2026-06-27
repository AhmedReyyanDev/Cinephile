import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "cinephile:reviews";

/** A review written by the cinephile using the app (stored on-device). */
export interface UserReview {
  id: string;
  movieId: number;
  movieTitle: string;
  posterPath: string | null;
  rating: number; // 1..10
  text: string;
  createdAt: number; // epoch ms
}

async function readAll(): Promise<UserReview[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as UserReview[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(reviews: UserReview[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(reviews));
}

export const reviewStore = {
  all: readAll,

  async forMovie(movieId: number): Promise<UserReview[]> {
    const all = await readAll();
    return all
      .filter((r) => r.movieId === movieId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  async add(
    input: Omit<UserReview, "id" | "createdAt">
  ): Promise<UserReview> {
    const review: UserReview = {
      ...input,
      id: `${input.movieId}-${Date.now()}`,
      createdAt: Date.now(),
    };
    const all = await readAll();
    await writeAll([review, ...all]);
    return review;
  },

  async remove(id: string): Promise<void> {
    const all = await readAll();
    await writeAll(all.filter((r) => r.id !== id));
  },
};
