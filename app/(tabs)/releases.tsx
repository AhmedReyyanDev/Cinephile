import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { posterUrl, hasTmdbKey } from "@/api/config";
import { tmdb } from "@/api/tmdb";
import type { Movie } from "@/api/types";
import { ApiKeyNotice } from "@/components/ApiKeyNotice";
import { EmptyState } from "@/components/EmptyState";
import { Loading } from "@/components/Loading";
import { RatingBadge } from "@/components/RatingBadge";
import { useAsync } from "@/hooks/useAsync";
import { colors, font, radius, spacing } from "@/theme";
import { daysUntil, formatDate, releaseLabel } from "@/utils/format";

interface Section {
  key: string;
  label: string;
  movies: Movie[];
}

function ReleaseItem({ movie }: { movie: Movie }) {
  const router = useRouter();
  const uri = posterUrl(movie.posterPath, "w342");
  const tag = releaseLabel(movie.releaseDate);
  const upcoming = (daysUntil(movie.releaseDate) ?? -1) >= 0;

  return (
    <Pressable
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
      onPress={() => router.push(`/movie/${movie.id}`)}
    >
      {uri ? (
        <Image source={uri} style={styles.poster} contentFit="cover" transition={150} />
      ) : (
        <View style={[styles.poster, styles.posterFallback]}>
          <Ionicons name="film-outline" size={22} color={colors.textFaint} />
        </View>
      )}
      <View style={styles.itemBody}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {movie.title}
        </Text>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={13} color={colors.textMuted} />
          <Text style={styles.date}>{formatDate(movie.releaseDate)}</Text>
        </View>
        <View style={styles.metaRow}>
          {tag ? (
            <View style={[styles.tag, upcoming ? styles.tagUpcoming : styles.tagOut]}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ) : null}
          <RatingBadge value={movie.voteAverage} size="sm" />
        </View>
        <View style={styles.whereRow}>
          <Ionicons name="tv-outline" size={13} color={colors.accentSoft} />
          <Text style={styles.where}>Tap for where to watch</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
    </Pressable>
  );
}

export default function ReleasesScreen() {
  const keyReady = hasTmdbKey();

  const { data, loading, error, refetch } = useAsync(async () => {
    const [upcoming, nowPlaying] = await Promise.all([
      tmdb.upcoming(),
      tmdb.nowPlaying(),
    ]);
    return { upcoming, nowPlaying };
  }, [keyReady]);

  const sections = useMemo<Section[]>(() => {
    if (!data) return [];
    const seen = new Set<number>();
    const dedupe = (list: Movie[]) =>
      list.filter((m) => (seen.has(m.id) ? false : (seen.add(m.id), true)));

    const justReleased = dedupe(
      [...data.nowPlaying].sort((a, b) =>
        b.releaseDate.localeCompare(a.releaseDate)
      )
    );
    const coming = dedupe(
      [...data.upcoming]
        .filter((m) => (daysUntil(m.releaseDate) ?? -1) >= 0)
        .sort((a, b) => a.releaseDate.localeCompare(b.releaseDate))
    );

    return [
      { key: "coming", label: "Coming soon", movies: coming },
      { key: "now", label: "Now in theaters", movies: justReleased },
    ].filter((s) => s.movies.length > 0);
  }, [data]);

  if (!keyReady) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ApiKeyNotice />
      </SafeAreaView>
    );
  }

  if (loading && !data) return <Loading label="Finding new releases…" />;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Releases</Text>
        <Text style={styles.subtitle}>
          New & upcoming movies — and where to stream them
        </Text>
      </View>

      {error ? (
        <EmptyState
          icon="cloud-offline-outline"
          title="Couldn't load releases"
          subtitle={error.message}
        />
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(s) => s.key}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refetch}
              tintColor={colors.accent}
            />
          }
          renderItem={({ item: section }) => (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>{section.label}</Text>
              {section.movies.map((m) => (
                <ReleaseItem key={m.id} movie={m} />
              ))}
            </View>
          )}
          ListEmptyComponent={
            <EmptyState title="No releases found" subtitle="Pull to refresh." />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: font.size.xxl,
    fontWeight: font.weight.heavy,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: font.size.sm,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  pressed: { opacity: 0.7 },
  poster: {
    width: 64,
    height: 96,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
  },
  posterFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  itemBody: {
    flex: 1,
    gap: 5,
  },
  itemTitle: {
    color: colors.text,
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  date: {
    color: colors.textMuted,
    fontSize: font.size.xs,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  tagUpcoming: {
    backgroundColor: colors.accent,
  },
  tagOut: {
    backgroundColor: colors.green,
  },
  tagText: {
    color: colors.bg,
    fontSize: font.size.xs,
    fontWeight: font.weight.bold,
  },
  whereRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 1,
  },
  where: {
    color: colors.accentSoft,
    fontSize: font.size.xs,
    fontWeight: font.weight.semibold,
  },
});
