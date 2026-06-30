import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, font, spacing } from "@/theme";

export function Loading({ label }: { label?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.accent} size="large" />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.md,
    backgroundColor: colors.bg,
  },
  label: {
    color: colors.textMuted,
    fontSize: font.size.sm,
  },
});
