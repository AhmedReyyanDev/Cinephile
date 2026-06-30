import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { backdropUrl, posterUrl, profileUrl } from "@/api/config";
import { fetchExternalRatings } from "@/api/omdb";
import { tmdb } from "@/api/tmdb";
import type {
  CommunityReview,
  ExternalRatings,
  MovieDetails,
  WatchOptions,
} from "@/api/types";
import { Chip } from "@/components/Chip";
import { EmptyState } from "@/components/EmptyState";
import { Loading } from "@/components/Loading";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewComposer } from "@/components/ReviewComposer";
import { WatchProviders } from "@/components/WatchProviders";
import { useAsync } from "@/hooks/useAsync";
import { reviewStore, type UserReview } from "@/storage/reviews";
import { watchlistStore } from "@/storage/watchlist";
import { colors, fill, font, radius, spacing } from "@/theme";
import {
  formatDate,
  formatRelative,
  formatRuntime,
  formatVotes,
  releaseLabel,
} from "@/utils/format";

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const movieId = Number(id);

  const [saved, setSaved] = useState(false);
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [externalRatings, setExternalRatings] = useState<ExternalRatings | null>(
    null
  );

  const { data, loading, error } = useAsync(async () => {
    const [details, providers, reviews] = await Promise.all([
      tmdb.details(movieId),
      tmdb.watchProviders(movieId).catch(() => null),
      tmdb.reviews(movieId).catch(() => [] as CommunityReview[]),
    ]);
    return { details, providers, reviews };
  }, [movieId]);

  const loadUserReviews = useCallback(() => {
    reviewStore.forMovie(movieId).then(setUserReviews);
  }, [movieId]);

  useEffect(() => {
    watchlistStore.has(movieId).then(setSaved);
    loadUserReviews();
  }, [movieId, loadUserReviews]);

  useEffect(() => {
    const imdbId = data?.details.imdbId;
    if (imdbId) fetchExternalRatings(imdbId).then(setExternalRatings);
  }, [data?.details.imdbId]);

  const toggleSave = async () => {
    if (!data) return;
    const next = await watchlistStore.toggle(data.details);
    setSaved(next);
  };

  if (loading && !data) return <Loading label="Loading details…" />;

  if (error || !data) {
    return (
      <SafeAreaView style={styles.safe}>
        <BackButton onPress={() => router.back()} />
        <EmptyState
          icon="cloud-offline-outline"
          title="Couldn't load this movie"
          subtitle={error?.message}
        />
      </SafeAreaView>
    );
  }

  const { details, providers, reviews } = data;
  const tag = releaseLabel(details.releaseDate);

  return (
    <View style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Hero details={details} tag={tag} />

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{details.title}</Text>
              {details.tagline ? (
                <Text style={styles.tagline}>{details.tagline}</Text>
              ) : null}
            </View>
            <Pressable style={styles.saveBtn} onPress={toggleSave} hitSlop={8}>
              <Ionicons
                name={saved ? "bookmark" : "bookmark-outline"}
                size={24}
                color={saved ? colors.accent : colors.text}
              />
            </Pressable>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>{formatDate(details.releaseDate)}</Text>
            {details.runtime ? (
              <>
                <Dot />
                <Text style={styles.metaItem}>{formatRuntime(details.runtime)}</Text>
              </>
            ) : null}
            {externalRatings?.rated ? (
              <>
                <Dot />
                <View style={styles.ratedBox}>
                  <Text style={styles.ratedText}>{externalRatings.rated}</Text>
                </View>
              </>
            ) : null}
          </View>

          {details.genres.length > 0 ? (
            <View style={styles.genres}>
              {details.genres.map((g) => (
                <Chip key={g.id} label={g.name} />
              ))}
            </View>
          ) : null}

          <RatingsStrip details={details} external={externalRatings} />

          {details.overview ? (
            <Section title="Overview">
              <Text style={styles.overview}>{details.overview}</Text>
            </Section>
          ) : null}

          <Section
            title="Where to watch"
            subtitle="Official streaming plus free, legal options"
          >
            <WatchProviders options={providers} />
          </Section>

          {details.cast.length > 0 ? (
            <Section title="Top cast">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.castList}
              >
                {details.cast.map((c) => (
                  <View key={c.id} style={styles.castItem}>
                    <Image
                      source={profileUrl(c.profilePath, "w185")}
                      style={styles.castPhoto}
                      contentFit="cover"
                    />
                    <Text style={styles.castName} numberOfLines={1}>
                      {c.name}
                    </Text>
                    <Text style={styles.castChar} numberOfLines={1}>
                      {c.character}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </Section>
          ) : null}

          <Section
            title="Your review"
            subtitle="Rate it and share your cinephile take"
          >
            <ReviewComposer
              onSubmit={async (rating, text) => {
                await reviewStore.add({
                  movieId: details.id,
                  movieTitle: details.title,
                  posterPath: details.posterPath,
                  rating,
                  text,
                });
                loadUserReviews();
              }}
            />
            {userReviews.map((r) => (
              <View key={r.id} style={{ marginTop: spacing.md }}>
                <ReviewCard
                  author="You"
                  rating={r.rating}
                  content={r.text}
                  meta={formatRelative(r.createdAt)}
                  onDelete={async () => {
                    await reviewStore.remove(r.id);
                    loadUserReviews();
                  }}
                />
              </View>
            ))}
          </Section>

          <Section
            title="Community reviews"
            subtitle={
              reviews.length > 0 ? `${reviews.length} from TMDB` : undefined
            }
          >
            {reviews.length > 0 ? (
              reviews
                .slice(0, 10)
                .map((r) => (
                  <ReviewCard
                    key={r.id}
                    author={r.authorUsername ? `@${r.authorUsername}` : r.author}
                    avatarPath={r.avatarPath}
                    rating={r.rating}
                    content={r.content}
                    meta={formatRelative(new Date(r.createdAt).getTime())}
                  />
                ))
            ) : (
              <Text style={styles.noReviews}>
                No community reviews yet. Be the first cinephile to weigh in
                above.
              </Text>
            )}
          </Section>

          {details.homepage ? (
            <Pressable
              style={styles.homepage}
              onPress={() => Linking.openURL(details.homepage as string)}
            >
              <Ionicons name="globe-outline" size={16} color={colors.text} />
              <Text style={styles.homepageText}>Official site</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>

      <SafeAreaView style={styles.floatBack} edges={["top"]} pointerEvents="box-none">
        <BackButton onPress={() => router.back()} />
      </SafeAreaView>
    </View>
  );
}

function Hero({ details, tag }: { details: MovieDetails; tag: string | null }) {
  const backdrop = backdropUrl(details.backdropPath, "w1280");
  const poster = posterUrl(details.posterPath, "w342");

  return (
    <View style={styles.hero}>
      {backdrop ? (
        <Image source={backdrop} style={styles.heroImage} contentFit="cover" transition={250} />
      ) : (
        <View style={[styles.heroImage, { backgroundColor: colors.surface }]} />
      )}
      <LinearGradient
        colors={["transparent", "rgba(11,11,15,0.6)", colors.bg]}
        style={styles.heroGradient}
      />
      <View style={styles.heroContent}>
        {poster ? (
          <Image source={poster} style={styles.heroPoster} contentFit="cover" />
        ) : null}
        {tag ? (
          <View style={styles.heroTag}>
            <Ionicons name="sparkles" size={12} color={colors.bg} />
            <Text style={styles.heroTagText}>{tag}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function RatingsStrip({
  details,
  external,
}: {
  details: MovieDetails;
  external: ExternalRatings | null;
}) {
  return (
    <View style={styles.ratings}>
      <RatingPill
        icon="star"
        color={colors.gold}
        value={details.voteAverage ? details.voteAverage.toFixed(1) : "—"}
        label={`TMDB · ${formatVotes(details.voteCount)}`}
      />
      {external?.imdbRating ? (
        <RatingPill icon="film" color={colors.gold} value={external.imdbRating} label="IMDb" />
      ) : null}
      {external?.rottenTomatoes ? (
        <RatingPill
          icon="leaf"
          color={colors.accentSoft}
          value={external.rottenTomatoes}
          label="Rotten Tomatoes"
        />
      ) : null}
      {external?.metacritic ? (
        <RatingPill
          icon="stats-chart"
          color={colors.green}
          value={external.metacritic}
          label="Metacritic"
        />
      ) : null}
    </View>
  );
}

function RatingPill({
  icon,
  color,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.ratingPill}>
      <Ionicons name={icon} size={16} color={color} />
      <Text style={styles.ratingValue}>{value}</Text>
      <Text style={styles.ratingLabel}>{label}</Text>
    </View>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSub}>{subtitle}</Text> : null}
      <View style={{ marginTop: spacing.md }}>{children}</View>
    </View>
  );
}

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.backBtn} onPress={onPress} hitSlop={8}>
      <Ionicons name="chevron-back" size={24} color={colors.text} />
    </Pressable>
  );
}

function Dot() {
  return <View style={styles.dot} />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingBottom: spacing.xxl },
  hero: { height: 360 },
  heroImage: { ...fill },
  heroGradient: { ...fill },
  heroContent: {
    position: "absolute",
    bottom: -40,
    left: spacing.lg,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.md,
  },
  heroPoster: {
    width: 110,
    height: 165,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  heroTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.gold,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginBottom: spacing.md,
  },
  heroTagText: {
    color: colors.bg,
    fontSize: font.size.xs,
    fontWeight: font.weight.bold,
  },
  floatBack: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    margin: spacing.sm,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: font.size.xxl,
    fontWeight: font.weight.heavy,
    lineHeight: 32,
  },
  tagline: {
    color: colors.textMuted,
    fontSize: font.size.sm,
    fontStyle: "italic",
    marginTop: 4,
  },
  saveBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.md,
    flexWrap: "wrap",
  },
  metaItem: {
    color: colors.textMuted,
    fontSize: font.size.sm,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.textFaint,
  },
  ratedBox: {
    borderWidth: 1,
    borderColor: colors.textFaint,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  ratedText: {
    color: colors.textMuted,
    fontSize: font.size.xs,
    fontWeight: font.weight.bold,
  },
  genres: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  ratings: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  ratingValue: {
    color: colors.text,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
  },
  ratingLabel: {
    color: colors.textFaint,
    fontSize: font.size.xs,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
  },
  sectionSub: {
    color: colors.textMuted,
    fontSize: font.size.sm,
    marginTop: 2,
  },
  overview: {
    color: colors.textMuted,
    fontSize: font.size.md,
    lineHeight: 23,
  },
  castList: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  castItem: {
    width: 88,
  },
  castPhoto: {
    width: 88,
    height: 110,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    marginBottom: 6,
  },
  castName: {
    color: colors.text,
    fontSize: font.size.xs,
    fontWeight: font.weight.semibold,
  },
  castChar: {
    color: colors.textFaint,
    fontSize: font.size.xs,
  },
  noReviews: {
    color: colors.textMuted,
    fontSize: font.size.sm,
    lineHeight: 21,
  },
  homepage: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.xl,
  },
  homepageText: {
    color: colors.text,
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
  },
});
