import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, font, radius, spacing } from "@/theme";

interface Props {
  label: string;
  active?: boolean;
  onPress?: () => void;
  color?: string;
}

export function Chip({ label, active, onPress, color }: Props) {
  const Wrapper: any = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      style={[
        styles.chip,
        active && styles.active,
        color && active ? { backgroundColor: color } : null,
      ]}
    >
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  active: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  label: {
    color: colors.textMuted,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
  },
  labelActive: {
    color: colors.text,
  },
});
