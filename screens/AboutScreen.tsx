import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';

export default function AboutScreen() {
  const { theme } = useTheme();

  return (
    <ScreenScrollView style={{ backgroundColor: theme.backgroundRoot }}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Feather name="book-open" size={80} color={theme.primary} />
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText style={[styles.title, { color: theme.text }]}>Student Atlas</ThemedText>
          <ThemedText style={[styles.version, { color: theme.textSecondary }]}>Version 1.0.0</ThemedText>
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>About</ThemedText>
          <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
            Student Atlas was an individual project by Kobi Oguadinma, a second-year Software Engineering student at Babcock University.
          </ThemedText>
          <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
            He frequently calculated his predicted grades manually and wanted a mobile app to automate this process, helping students track their academic journey with ease.
          </ThemedText>
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Features</ThemedText>
          <FeatureItem icon="folder" text="Organize courses by semesters" theme={theme} />
          <FeatureItem icon="trending-up" text="Track CA scores and predict grades" theme={theme} />
          <FeatureItem icon="bar-chart-2" text="Calculate GPA and CGPA automatically" theme={theme} />
          <FeatureItem icon="eye" text="Multiple theme options" theme={theme} />
          <FeatureItem icon="smartphone" text="Offline support" theme={theme} />
        </View>
      </View>
    </ScreenScrollView>
  );
}

function FeatureItem({ icon, text, theme }: any) {
  return (
    <View style={styles.featureItem}>
      <Feather name={icon} size={20} color={theme.primary} />
      <ThemedText style={{ color: theme.text }}>{text}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  iconContainer: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    gap: Spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  version: {
    fontSize: 14,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
});
