import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { posterUrl } from "@/api/config";
import type { WatchOptions, WatchProvider } from "@/api/types";
import { colors, font, radius, spacing } from "@/theme";

interface GroupConfig {
  key: keyof Omit<WatchOptions, "link">;
  label: string;
  hint: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

// Order matters: free options first so cinephiles see the cheapest path.
const GROUPS: GroupConfig[] = [
  {
    key: "free",
    label: "Free",
    hint: "Watch legally at no cost",
    icon: "gift-outline",
    color: colors.green,
  },
  {
    key: "ads",
    label: "Free with ads",
    hint: "Free, ad-supported services",
    icon: "tv-outline",
    color: colors.green,
  },
  {
    key: "flatrate",
    label: "Stream (subscription)",
    hint: "Included with these subscriptions",
    icon: "play-circle-outline",
    color: colors.accent,
  },
  {
    key: "rent",
    label: "Rent",
    hint: "Rent for a one-time fee",
    icon: "cash-outline",
    color: colors.blue,
  },
  {
    key: "buy",
    label: "Buy",
    hint: "Own it permanently",
    icon: "bag-outline",
    color: colors.blue,
  },
];

function ProviderChip({ provider }: { provider: WatchProvider }) {
  const logo = posterUrl(provider.logoPath, "w185");
  return (
    <View style={styles.provider}>
      {logo ? (
        <Image source={logo} style={styles.logo} contentFit="cover" />
      ) : (
        <View style={[styles.logo, styles.logoFallback]}>
          <Text style={styles.logoFallbackText}>
            {provider.providerName.slice(0, 1)}
          </Text>
        </View>
      )}
      <Text numberOfLines={1} style={styles.providerName}>
        {provider.providerName}
      </Text>
    </View>
  );
}

export function WatchProviders({ options }: { options: WatchOptions | null }) {
  if (!options) return null;

  const activeGroups = GROUPS.filter((g) => options[g.key].length > 0);
  const isEmpty = activeGroups.length === 0;

  return (
    <View>
      {isEmpty ? (
        <View style={styles.emptyBox}>
          <Ionicons name="information-circle-outline" size={18} color={colors.textMuted} />
          <Text style={styles.emptyText}>
            No streaming options found for your region yet. Check back near
            release.
          </Text>
        </View>
      ) : (
        activeGroups.map((group) => (
          <View key={group.key} style={styles.group}>
            <View style={styles.groupHeader}>
              <Ionicons name={group.icon} size={16} color={group.color} />
              <Text style={[styles.groupLabel, { color: group.color }]}>
                {group.label}
              </Text>
              <Text style={styles.groupHint}>· {group.hint}</Text>
            </View>
            <View style={styles.providerWrap}>
              {options[group.key].map((p) => (
                <ProviderChip key={`${group.key}-${p.providerId}`} provider={p} />
              ))}
            </View>
          </View>
        ))
      )}

      {options.link ? (
        <Pressable
          style={styles.linkBtn}
          onPress={() => Linking.openURL(options.link as string)}
        >
          <Ionicons name="open-outline" size={16} color={colors.text} />
          <Text style={styles.linkText}>See all options & links</Text>
        </Pressable>
      ) : null}

      <Text style={styles.attribution}>
        Availability data by JustWatch via TMDB.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: spacing.lg,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.md,
    flexWrap: "wrap",
  },
  groupLabel: {
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
  },
  groupHint: {
    color: colors.textFaint,
    fontSize: font.size.xs,
  },
  providerWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  provider: {
    alignItems: "center",
    width: 64,
    gap: 4,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
  },
  logoFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoFallbackText: {
    color: colors.text,
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
  },
  providerName: {
    color: colors.textMuted,
    fontSize: font.size.xs,
    textAlign: "center",
  },
  emptyBox: {
    flexDirection: "row",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: font.size.sm,
    flex: 1,
    lineHeight: 19,
  },
  linkBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.xs,
  },
  linkText: {
    color: colors.text,
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
  },
  attribution: {
    color: colors.textFaint,
    fontSize: font.size.xs,
    marginTop: spacing.md,
    textAlign: "center",
  },
});
