import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { useTheme } from '@/hooks/useTheme';
import { useThemeContext } from '@/contexts/ThemeContext';
import { Spacing, BorderRadius, ThemeName, Colors } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';

const THEMES: { name: ThemeName; label: string; preview: string }[] = [
  { name: 'defaultDark', label: 'Default Dark', preview: Colors.defaultDark.primary },
  { name: 'dark', label: 'Dark', preview: Colors.dark.primary },
  { name: 'blue', label: 'Blue', preview: Colors.blue.primary },
  { name: 'lightPink', label: 'Light Pink', preview: Colors.lightPink.primary },
  { name: 'light', label: 'Light', preview: Colors.light.primary },
];

export default function SettingsScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { theme: currentTheme, setTheme } = useThemeContext();

  return (
    <ScreenScrollView style={{ backgroundColor: theme.backgroundRoot }}>
      <View style={styles.container}>
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>Appearance</ThemedText>
          <View style={styles.themesGrid}>
            {THEMES.map(themeOption => (
              <Pressable
                key={themeOption.name}
                style={[
                  styles.themeChip,
                  currentTheme === themeOption.name && { borderColor: theme.primary, borderWidth: 3 }
                ]}
                onPress={() => setTheme(themeOption.name)}
              >
                <View style={[styles.themePreview, { backgroundColor: themeOption.preview }]} />
                <ThemedText style={[styles.themeLabel, { color: theme.text }]}>{themeOption.label}</ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>Data</ThemedText>
          <SettingsItem
            icon="download"
            label="Export & Backup"
            theme={theme}
            onPress={() => navigation.navigate('DataManagement')}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>Account</ThemedText>
          <SettingsItem
            icon="user"
            label="Account Settings"
            theme={theme}
            onPress={() => navigation.navigate('Account')}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>About</ThemedText>
          <SettingsItem
            icon="info"
            label="About Student Atlas"
            theme={theme}
            onPress={() => navigation.navigate('About')}
          />
        </View>
      </View>
    </ScreenScrollView>
  );
}

function SettingsItem({ icon, label, theme, onPress }: any) {
  return (
    <Pressable
      style={[styles.settingsItem, { backgroundColor: theme.backgroundDefault }]}
      onPress={onPress}
    >
      <View style={styles.settingsItemContent}>
        <Feather name={icon} size={20} color={theme.text} />
        <ThemedText style={[styles.settingsItemLabel, { color: theme.text }]}>{label}</ThemedText>
      </View>
      <Feather name="chevron-right" size={20} color={theme.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    gap: Spacing['3xl'],
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  themeChip: {
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: BorderRadius.xs,
    borderWidth: 2,
    borderColor: 'transparent',
    width: 100,
  },
  themePreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  themeLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xs,
  },
  settingsItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingsItemLabel: {
    fontSize: 16,
  },
});
