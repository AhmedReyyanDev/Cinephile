import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, font, radius, spacing } from "@/theme";
import { StarRating } from "./StarRating";

interface Props {
  onSubmit: (rating: number, text: string) => Promise<void> | void;
}

export function ReviewComposer({ onSubmit }: Props) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = rating > 0 && text.trim().length >= 3 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await onSubmit(rating, text.trim());
      setRating(0);
      setText("");
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.ratingRow}>
        <StarRating
          value={rating}
          onChange={(v) => {
            setRating(v);
            if (Platform.OS !== "web") Haptics.selectionAsync();
          }}
        />
        <Text style={styles.ratingLabel}>
          {rating > 0 ? `${rating}/10` : "Tap to rate"}
        </Text>
      </View>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="What did you think? Share your take…"
        placeholderTextColor={colors.textFaint}
        style={styles.input}
        multiline
        textAlignVertical="top"
      />
      <Pressable
        style={[styles.button, !canSubmit && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!canSubmit}
      >
        <Text style={styles.buttonText}>
          {submitting ? "Posting…" : "Post review"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratingLabel: {
    color: colors.textMuted,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
  },
  input: {
    minHeight: 90,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text,
    fontSize: font.size.md,
    lineHeight: 21,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: colors.surfaceAlt,
  },
  buttonText: {
    color: colors.text,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
  },
});
