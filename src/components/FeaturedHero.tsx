import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { backdropUrl } from "@/api/config";
import type { Movie } from "@/api/types";
import { colors, fill, font, radius, spacing } from "@/theme";
import { formatYear } from "@/utils/format";
import { RatingBadge } from "./RatingBadge";

export function FeaturedHero({ movie }: { movie: Movie }) {
  const router = useRouter();
  const uri = backdropUrl(movie.backdropPath, "w1280");

  return (
    <Pressable
      style={styles.container}
      onPress={() => router.push(`/movie/${movie.id}`)}
    >
      {uri ? (
        <Image source={uri} style={styles.image} contentFit="cover" transition={250} />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}
      <LinearGradient
        colors={["transparent", "rgba(11,11,15,0.4)", colors.bg]}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <View style={styles.badgeRow}>
          <View style={styles.featuredTag}>
            <Ionicons name="flame" size={12} color={colors.text} />
            <Text style={styles.featuredText}>Trending now</Text>
          </View>
          <RatingBadge value={movie.voteAverage} />
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.meta}>{formatYear(movie.releaseDate)}</Text>
        <View style={styles.cta}>
          <Ionicons name="information-circle" size={18} color={colors.text} />
          <Text style={styles.ctaText}>Details & where to watch</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 420,
    marginBottom: spacing.lg,
  },
  image: {
    ...fill,
  },
  placeholder: {
    backgroundColor: colors.surface,
  },
  gradient: {
    ...fill,
  },
  content: {
    position: "absolute",
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    gap: spacing.sm,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  featuredTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  featuredText: {
    color: colors.text,
    fontSize: font.size.xs,
    fontWeight: font.weight.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    color: colors.text,
    fontSize: font.size.huge,
    fontWeight: font.weight.heavy,
    lineHeight: 38,
  },
  meta: {
    color: colors.textMuted,
    fontSize: font.size.sm,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignSelf: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    marginTop: spacing.sm,
  },
  ctaText: {
    color: colors.text,
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
  },
});
