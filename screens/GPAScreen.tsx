import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import { Spacing, BorderRadius } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { getSemesters } from '@/services/storageService';
import { Semester } from '@/types';
import { calculateCGPA, calculatePredictedCGPA, getGPAColor } from '@/utils/calculations';

export default function GPAScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [semesters, setSemesters] = useState<Semester[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadSemesters();
    }, [user])
  );

  const loadSemesters = async () => {
    if (!user) return;
    const data = await getSemesters(user.uid);
    setSemesters(data);
  };

  const cgpa = calculateCGPA(semesters);
  const predictedCGPA = calculatePredictedCGPA(semesters);
  const pastSemesters = semesters.filter(s => s.type === 'past').sort((a, b) => b.timestamp - a.timestamp);
  const currentSemester = semesters.find(s => s.type === 'current');
  const hasPastSemesters = pastSemesters.length > 0;

  return (
    <ScreenScrollView style={{ backgroundColor: theme.backgroundRoot }}>
      <View style={styles.container}>
        {hasPastSemesters ? (
          <View style={styles.summaryCards}>
            <View style={[styles.summaryCard, { backgroundColor: theme.backgroundDefault }]}>
              <ThemedText style={[styles.summaryLabel, { color: theme.textSecondary }]}>Current CGPA</ThemedText>
              <ThemedText style={[styles.summaryValue, { color: getGPAColor(cgpa, theme) }]}>
                {cgpa.toFixed(2)}
              </ThemedText>
              <View style={styles.scale}>
                <ThemedText style={[styles.scaleText, { color: theme.textSecondary }]}>out of 5.0</ThemedText>
              </View>
            </View>

            {currentSemester ? (
              <View style={[styles.summaryCard, { backgroundColor: theme.backgroundDefault }]}>
                <ThemedText style={[styles.summaryLabel, { color: theme.textSecondary }]}>Predicted CGPA</ThemedText>
                <ThemedText style={[styles.summaryValue, { color: getGPAColor(predictedCGPA, theme) }]}>
                  {predictedCGPA.toFixed(2)}
                </ThemedText>
                <View style={styles.scale}>
                  <ThemedText style={[styles.scaleText, { color: theme.textSecondary }]}>after current sem</ThemedText>
                </View>
              </View>
            ) : null}
          </View>
        ) : null}

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Semester GPAs</ThemedText>
          {pastSemesters.length > 0 ? (
            pastSemesters.map(semester => (
              <View key={semester.id} style={[styles.semesterRow, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
                <View style={styles.semesterInfo}>
                  <ThemedText style={[styles.semesterName, { color: theme.text }]}>{semester.name}</ThemedText>
                  <ThemedText style={{ color: theme.textSecondary, fontSize: 14 }}>
                    {semester.courses.reduce((sum, c) => sum + c.unitHours, 0)} units
                  </ThemedText>
                </View>
                <View style={[styles.gpaChip, { backgroundColor: theme.backgroundRoot }]}>
                  <ThemedText style={[styles.gpaChipValue, { color: getGPAColor(semester.gpa, theme) }]}>
                    {semester.gpa.toFixed(2)}
                  </ThemedText>
                </View>
              </View>
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: theme.backgroundDefault }]}>
              <Feather name="bar-chart-2" size={48} color={theme.textSecondary} />
              <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
                No semester data yet
              </ThemedText>
              <ThemedText style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                Complete your first semester to see your GPA
              </ThemedText>
            </View>
          )}

          {currentSemester && currentSemester.courses.length > 0 ? (
            <View style={[styles.currentSemesterCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.primary }]}>
              <View style={styles.semesterInfo}>
                <View style={styles.currentHeader}>
                  <ThemedText style={[styles.semesterName, { color: theme.text }]}>{currentSemester.name}</ThemedText>
                  <View style={[styles.currentBadge, { backgroundColor: theme.primary }]}>
                    <ThemedText style={styles.currentBadgeText}>Current</ThemedText>
                  </View>
                </View>
                <ThemedText style={{ color: theme.textSecondary, fontSize: 14 }}>
                  {currentSemester.courses.reduce((sum, c) => sum + c.unitHours, 0)} units · Predicted
                </ThemedText>
              </View>
              <View style={[styles.gpaChip, { backgroundColor: theme.backgroundRoot }]}>
                <ThemedText style={[styles.gpaChipValue, { color: theme.primary }]}>
                  {currentSemester.gpa.toFixed(2)}
                </ThemedText>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    gap: Spacing['2xl'],
  },
  summaryCards: {
    gap: Spacing.lg,
  },
  summaryCard: {
    padding: Spacing['2xl'],
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 48,
    fontWeight: '700',
  },
  scale: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scaleText: {
    fontSize: 14,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  semesterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
  },
  currentSemesterCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xs,
    borderWidth: 2,
  },
  semesterInfo: {
    flex: 1,
    gap: 4,
  },
  currentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  semesterName: {
    fontSize: 16,
    fontWeight: '600',
  },
  currentBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  currentBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  gpaChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
  },
  gpaChipValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptyState: {
    padding: Spacing['4xl'],
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
