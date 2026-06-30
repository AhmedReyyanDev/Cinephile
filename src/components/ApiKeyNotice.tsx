import { Ionicons } from "@expo/vector-icons";
import { Linking, StyleSheet, Text, View } from "react-native";
import { colors, font, radius, spacing } from "@/theme";

/** Shown when the TMDB key is missing so the app explains how to fix it. */
export function ApiKeyNotice() {
  return (
    <View style={styles.container}>
      <Ionicons name="key-outline" size={40} color={colors.gold} />
      <Text style={styles.title}>Add your free TMDB API key</Text>
      <Text style={styles.body}>
        Cinephile uses The Movie Database (TMDB) for movie data, and it&apos;s
        free. Create a key, then add it to the app.
      </Text>

      <View style={styles.steps}>
        <Step n={1} text="Sign up at themoviedb.org and request an API key (free)." />
        <Step
          n={2}
          text='Open app.json and set expo.extra.tmdbApiKey to your key.'
        />
        <Step
          n={3}
          text="Or set EXPO_PUBLIC_TMDB_API_KEY in a .env file, then restart."
        />
      </View>

      <Text
        style={styles.link}
        onPress={() => Linking.openURL("https://www.themoviedb.org/settings/api")}
      >
        Get a TMDB API key →
      </Text>
    </View>
  );
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <View style={styles.step}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{n}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
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
  },
  title: {
    color: colors.text,
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  body: {
    color: colors.textMuted,
    fontSize: font.size.sm,
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 320,
  },
  steps: {
    gap: spacing.md,
    marginTop: spacing.md,
    alignSelf: "stretch",
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: colors.text,
    fontWeight: font.weight.bold,
    fontSize: font.size.sm,
  },
  stepText: {
    color: colors.textMuted,
    fontSize: font.size.sm,
    flex: 1,
    lineHeight: 20,
  },
  link: {
    color: colors.accentSoft,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    marginTop: spacing.md,
  },
});
