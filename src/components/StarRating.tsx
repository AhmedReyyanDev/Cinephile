import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { colors } from "@/theme";

interface Props {
  /** 0..10 scale (rendered as 5 stars, half-steps). */
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
}

export function StarRating({ value, onChange, size = 28, readOnly }: Props) {
  const stars = [1, 2, 3, 4, 5];
  // value is 0..10; each star = 2 points.
  return (
    <View style={styles.row}>
      {stars.map((star) => {
        const filledTo = value / 2; // 0..5
        let name: keyof typeof Ionicons.glyphMap = "star-outline";
        if (filledTo >= star) name = "star";
        else if (filledTo >= star - 0.5) name = "star-half";

        return (
          <Pressable
            key={star}
            disabled={readOnly}
            hitSlop={6}
            onPress={() => onChange?.(star * 2)}
          >
            <Ionicons name={name} size={size} color={colors.gold} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 4,
  },
});
