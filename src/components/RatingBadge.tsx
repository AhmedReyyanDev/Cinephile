import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, font, radius } from "@/theme";

export function RatingBadge({
  value,
  size = "md",
}: {
  value: number;
  size?: "sm" | "md";
}) {
  if (!value) return null;
  const small = size === "sm";
  return (
    <View style={[styles.badge, small && styles.badgeSm]}>
      <Ionicons name="star" size={small ? 10 : 12} color={colors.gold} />
      <Text style={[styles.text, small && styles.textSm]}>
        {value.toFixed(1)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  badgeSm: {
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  text: {
    color: colors.text,
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
  },
  textSm: {
    fontSize: font.size.xs,
  },
});
