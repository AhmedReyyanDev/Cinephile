import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { posterUrl } from "@/api/config";
import type { Movie } from "@/api/types";
import { colors, font, radius, spacing } from "@/theme";
import { formatYear, releaseLabel } from "@/utils/format";
import { RatingBadge } from "./RatingBadge";

interface Props {
  movie: Movie;
  width?: number;
  onPress: () => void;
  showReleaseTag?: boolean;
}

const BLURHASH =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export function PosterCard({ movie, width = 130, onPress, showReleaseTag }: Props) {
  const uri = posterUrl(movie.posterPath, "w342");
  const tag = showReleaseTag ? releaseLabel(movie.releaseDate) : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ width }, pressed && styles.pressed]}
    >
      <View style={[styles.posterWrap, { width, height: width * 1.5 }]}>
        {uri ? (
          <Image
            source={uri}
            placeholder={BLURHASH}
            contentFit="cover"
            transition={200}
            style={styles.poster}
          />
        ) : (
          <View style={[styles.poster, styles.placeholder]}>
            <Ionicons name="film-outline" size={28} color={colors.textFaint} />
          </View>
        )}
        <View style={styles.ratingPos}>
          <RatingBadge value={movie.voteAverage} size="sm" />
        </View>
        {tag ? (
          <View style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ) : null}
      </View>
      <Text numberOfLines={1} style={styles.title}>
        {movie.title}
      </Text>
      <Text style={styles.year}>{formatYear(movie.releaseDate) || "—"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.75 },
  posterWrap: {
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  ratingPos: {
    position: "absolute",
    top: spacing.xs,
    left: spacing.xs,
  },
  tag: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.accent,
    paddingVertical: 3,
    alignItems: "center",
  },
  tagText: {
    color: colors.text,
    fontSize: font.size.xs,
    fontWeight: font.weight.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    color: colors.text,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    marginTop: spacing.sm,
  },
  year: {
    color: colors.textFaint,
    fontSize: font.size.xs,
    marginTop: 2,
  },
});
