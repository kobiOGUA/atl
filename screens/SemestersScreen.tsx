import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import { Spacing, BorderRadius } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { getSemesters } from '@/services/storageService';
import { Semester } from '@/types';
import { useScreenInsets } from '@/hooks/useScreenInsets';

export default function SemestersScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { paddingBottom } = useScreenInsets();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadSemesters();
    }, [user])
  );

  const loadSemesters = async () => {
    if (!user) return;
    try {
      const data = await getSemesters(user.uid);
      setSemesters(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load semesters');
    } finally {
      setLoading(false);
    }
  };

  const currentSemester = semesters.find(s => s.type === 'current');
  const pastSemesters = semesters.filter(s => s.type === 'past').sort((a, b) => b.timestamp - a.timestamp);

  return (
    <ScreenScrollView style={{ backgroundColor: theme.backgroundRoot }} contentContainerStyle={{ paddingBottom }}>
      {currentSemester ? (
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>Current Semester</ThemedText>
          <SemesterCard semester={currentSemester} theme={theme} onPress={() => navigation.navigate('SemesterDetail', { semesterId: currentSemester.id })} />
        </View>
      ) : null}

      <View style={styles.section}>
        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>Past Semesters</ThemedText>
        {pastSemesters.length > 0 ? (
          pastSemesters.map(semester => (
            <SemesterCard
              key={semester.id}
              semester={semester}
              theme={theme}
              onPress={() => navigation.navigate('SemesterDetail', { semesterId: semester.id })}
            />
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: theme.backgroundDefault }]}>
            <Feather name="book" size={48} color={theme.textSecondary} />
            <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
              No past semesters yet
            </ThemedText>
          </View>
        )}
      </View>

      <Pressable
        style={[styles.fab, { backgroundColor: theme.primary, bottom: paddingBottom }]}
        onPress={() => navigation.navigate('AddSemester')}
      >
        <Feather name="plus" size={24} color="#FFFFFF" />
      </Pressable>
    </ScreenScrollView>
  );
}

function SemesterCard({ semester, theme, onPress }: { semester: Semester; theme: any; onPress: () => void }) {
  return (
    <Pressable
      style={[styles.card, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}
      onPress={onPress}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <ThemedText style={[styles.cardTitle, { color: theme.text }]}>{semester.name}</ThemedText>
          {semester.type === 'current' ? (
            <View style={[styles.badge, { backgroundColor: theme.primary }]}>
              <ThemedText style={styles.badgeText}>Current</ThemedText>
            </View>
          ) : null}
        </View>
        <View style={styles.cardStats}>
          <ThemedText style={{ color: theme.textSecondary }}>
            {semester.courses.length} {semester.courses.length === 1 ? 'course' : 'courses'}
          </ThemedText>
          <View style={styles.gpaContainer}>
            <ThemedText style={[styles.gpaLabel, { color: theme.textSecondary }]}>GPA</ThemedText>
            <ThemedText style={[styles.gpaValue, { color: theme.primary }]}>
              {semester.gpa.toFixed(2)}
            </ThemedText>
          </View>
        </View>
      </View>
      <Feather name="chevron-right" size={20} color={theme.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  cardContent: {
    flex: 1,
    gap: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gpaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  gpaLabel: {
    fontSize: 14,
  },
  gpaValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptyState: {
    padding: Spacing['4xl'],
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 4,
  },
});
