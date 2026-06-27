import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { profileUrl } from "@/api/config";
import { colors, font, radius, spacing } from "@/theme";
import { RatingBadge } from "./RatingBadge";

interface Props {
  author: string;
  avatarPath?: string | null;
  rating?: number | null;
  content: string;
  meta?: string;
  onDelete?: () => void;
}

export function ReviewCard({
  author,
  avatarPath,
  rating,
  content,
  meta,
  onDelete,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const avatar = profileUrl(avatarPath, "w185");
  const isLong = content.length > 240;
  const text = expanded || !isLong ? content : `${content.slice(0, 240).trim()}…`;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {avatar ? (
          <Image source={avatar} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarText}>
              {author.replace("@", "").slice(0, 1).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.headerText}>
          <Text style={styles.author} numberOfLines={1}>
            {author}
          </Text>
          {meta ? <Text style={styles.meta}>{meta}</Text> : null}
        </View>
        {rating ? <RatingBadge value={rating} /> : null}
        {onDelete ? (
          <Pressable onPress={onDelete} hitSlop={8} style={styles.delete}>
            <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      <Text style={styles.content}>{text}</Text>
      {isLong ? (
        <Pressable onPress={() => setExpanded((e) => !e)}>
          <Text style={styles.more}>{expanded ? "Show less" : "Read more"}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
  },
  avatarFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.text,
    fontWeight: font.weight.bold,
    fontSize: font.size.md,
  },
  headerText: {
    flex: 1,
  },
  author: {
    color: colors.text,
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
  },
  meta: {
    color: colors.textFaint,
    fontSize: font.size.xs,
    marginTop: 1,
  },
  delete: {
    padding: 2,
  },
  content: {
    color: colors.textMuted,
    fontSize: font.size.sm,
    lineHeight: 21,
  },
  more: {
    color: colors.accentSoft,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    marginTop: spacing.sm,
  },
});
