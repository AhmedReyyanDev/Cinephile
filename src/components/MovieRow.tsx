import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import type { Movie } from "@/api/types";
import { colors, font, spacing } from "@/theme";
import { PosterCard } from "./PosterCard";

interface Props {
  title: string;
  subtitle?: string;
  movies: Movie[];
  showReleaseTag?: boolean;
}

export function MovieRow({ title, subtitle, movies, showReleaseTag }: Props) {
  const router = useRouter();
  if (movies.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <FlatList
        horizontal
        data={movies}
        keyExtractor={(m) => String(m.id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <PosterCard
            movie={item}
            showReleaseTag={showReleaseTag}
            onPress={() => router.push(`/movie/${item.id}`)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: font.size.sm,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
});
