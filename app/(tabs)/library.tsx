import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { posterUrl } from "@/api/config";
import { EmptyState } from "@/components/EmptyState";
import { RatingBadge } from "@/components/RatingBadge";
import { ReviewCard } from "@/components/ReviewCard";
import { reviewStore, type UserReview } from "@/storage/reviews";
import { watchlistStore, type WatchlistItem } from "@/storage/watchlist";
import { colors, font, radius, spacing } from "@/theme";
import { formatRelative, formatYear } from "@/utils/format";

type Tab = "watchlist" | "reviews";

export default function LibraryScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("watchlist");
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [reviews, setReviews] = useState<UserReview[]>([]);

  const reload = useCallback(() => {
    watchlistStore.all().then(setWatchlist);
    reviewStore.all().then(setReviews);
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  const removeReview = async (id: string) => {
    await reviewStore.remove(id);
    reload();
  };

  const removeFromWatchlist = async (id: number) => {
    await watchlistStore.remove(id);
    reload();
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>My List</Text>
        <View style={styles.tabs}>
          <TabButton
            label={`Watchlist (${watchlist.length})`}
            active={tab === "watchlist"}
            onPress={() => setTab("watchlist")}
          />
          <TabButton
            label={`Reviews (${reviews.length})`}
            active={tab === "reviews"}
            onPress={() => setTab("reviews")}
          />
        </View>
      </View>

      {tab === "watchlist" ? (
        <FlatList
          data={watchlist}
          keyExtractor={(m) => String(m.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={styles.wItem}
              onPress={() => router.push(`/movie/${item.id}`)}
            >
              <Image
                source={posterUrl(item.posterPath, "w185")}
                style={styles.wPoster}
                contentFit="cover"
              />
              <View style={styles.wBody}>
                <Text style={styles.wTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.wYear}>
                  {formatYear(item.releaseDate) || "—"}
                </Text>
                <RatingBadge value={item.voteAverage} size="sm" />
              </View>
              <Pressable
                hitSlop={8}
                onPress={() => removeFromWatchlist(item.id)}
                style={styles.remove}
              >
                <Ionicons name="bookmark" size={20} color={colors.accent} />
              </Pressable>
            </Pressable>
          )}
          ListEmptyComponent={
            <EmptyState
              icon="bookmark-outline"
              title="Your watchlist is empty"
              subtitle="Save movies you want to watch and they'll show up here."
            />
          }
        />
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(r) => r.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/movie/${item.movieId}`)}>
              <ReviewCard
                author={item.movieTitle}
                avatarPath={null}
                rating={item.rating}
                content={item.text}
                meta={formatRelative(item.createdAt)}
                onDelete={() => removeReview(item.id)}
              />
            </Pressable>
          )}
          ListEmptyComponent={
            <EmptyState
              icon="create-outline"
              title="No reviews yet"
              subtitle="Rate and review movies you've watched to build your cinephile diary."
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tabBtn, active && styles.tabBtnActive]}
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: font.size.xxl,
    fontWeight: font.weight.heavy,
  },
  tabs: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  tabBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  tabBtnActive: {
    backgroundColor: colors.accent,
  },
  tabText: {
    color: colors.textMuted,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
  },
  tabTextActive: {
    color: colors.text,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  wItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  wPoster: {
    width: 56,
    height: 84,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
  },
  wBody: {
    flex: 1,
    gap: 5,
  },
  wTitle: {
    color: colors.text,
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
  },
  wYear: {
    color: colors.textFaint,
    fontSize: font.size.xs,
  },
  remove: {
    padding: spacing.sm,
  },
});
