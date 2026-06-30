import { Ionicons } from "@expo/vector-icons";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { hasTmdbKey } from "@/api/config";
import { tmdb } from "@/api/tmdb";
import { ApiKeyNotice } from "@/components/ApiKeyNotice";
import { EmptyState } from "@/components/EmptyState";
import { FeaturedHero } from "@/components/FeaturedHero";
import { Loading } from "@/components/Loading";
import { MovieRow } from "@/components/MovieRow";
import { useAsync } from "@/hooks/useAsync";
import { colors, font, spacing } from "@/theme";

export default function DiscoverScreen() {
  const keyReady = hasTmdbKey();

  const { data, loading, error, refetch } = useAsync(async () => {
    const [trending, nowPlaying, popular, topRated] = await Promise.all([
      tmdb.trending("week"),
      tmdb.nowPlaying(),
      tmdb.popular(),
      tmdb.topRated(),
    ]);
    return { trending, nowPlaying, popular, topRated };
  }, [keyReady]);

  if (!keyReady) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ApiKeyNotice />
      </SafeAreaView>
    );
  }

  if (loading && !data) return <Loading label="Loading movies…" />;

  if (error) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <EmptyState
          icon="cloud-offline-outline"
          title="Couldn't load movies"
          subtitle={error.message}
        />
      </SafeAreaView>
    );
  }

  const featured = data?.trending[0];

  return (
    <View style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            tintColor={colors.accent}
          />
        }
      >
        <SafeAreaView edges={["top"]}>
          <View style={styles.brandRow}>
            <Ionicons name="film" size={22} color={colors.accent} />
            <Text style={styles.brand}>Cinephile</Text>
          </View>
        </SafeAreaView>

        {featured ? <FeaturedHero movie={featured} /> : null}

        <MovieRow
          title="Trending this week"
          subtitle="What everyone's watching"
          movies={data?.trending.slice(1) ?? []}
        />
        <MovieRow
          title="In theaters now"
          subtitle="Now playing near you"
          movies={data?.nowPlaying ?? []}
          showReleaseTag
        />
        <MovieRow title="Popular" movies={data?.popular ?? []} />
        <MovieRow
          title="Top rated of all time"
          subtitle="Cinephile favorites"
          movies={data?.topRated ?? []}
        />
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    paddingBottom: spacing.xl,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  brand: {
    color: colors.text,
    fontSize: font.size.xxl,
    fontWeight: font.weight.heavy,
    letterSpacing: -0.5,
  },
});
