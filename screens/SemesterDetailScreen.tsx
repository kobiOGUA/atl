import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import { useAchievements } from '@/contexts/AchievementContext';
import { Spacing, BorderRadius } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { getSemesters, deleteSemester } from '@/services/storageService';
import { Semester, Course } from '@/types';
import { getGradeColor, scoreToGrade, calculateCATotal } from '@/utils/calculations';
import { useScreenInsets } from '@/hooks/useScreenInsets';

export default function SemesterDetailScreen({ route, navigation }: any) {
  const { semesterId } = route.params;
  const { theme } = useTheme();
  const { user } = useAuth();
  const { checkAchievements } = useAchievements();
  const { paddingBottom } = useScreenInsets();
  const [semester, setSemester] = useState<Semester | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadSemester();
      checkAchievements();
    }, [semesterId, user])
  );

  const loadSemester = async () => {
    if (!user) return;
    const semesters = await getSemesters(user.uid);
    const found = semesters.find(s => s.id === semesterId);
    if (found) {
      setSemester(found);
      navigation.setOptions({ title: found.name });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Semester',
      'Are you sure you want to delete this semester? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            try {
              await deleteSemester(user.uid, semesterId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete semester');
            }
          },
        },
      ]
    );
  };

  if (!semester) return null;

  const totalUnits = semester.courses.reduce((sum, c) => sum + c.unitHours, 0);

  return (
    <>
      <ScreenScrollView style={{ backgroundColor: theme.backgroundRoot }} contentContainerStyle={{ paddingBottom }}>
        <View style={styles.container}>
          <View style={[styles.statsCard, { backgroundColor: theme.backgroundDefault }]}>
            <View style={styles.statRow}>
              <View style={styles.stat}>
                <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>GPA</ThemedText>
                <ThemedText style={[styles.statValue, { color: theme.primary }]}>
                  {semester.gpa.toFixed(2)}
                </ThemedText>
              </View>
              <View style={styles.stat}>
                <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>Total Units</ThemedText>
                <ThemedText style={[styles.statValue, { color: theme.text }]}>{totalUnits}</ThemedText>
              </View>
              <View style={styles.stat}>
                <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>Courses</ThemedText>
                <ThemedText style={[styles.statValue, { color: theme.text }]}>{semester.courses.length}</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>Courses</ThemedText>
            {semester.courses.length > 0 ? (
              semester.courses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  semesterType={semester.type}
                  theme={theme}
                  onPress={() => navigation.navigate('CourseDetail', { semesterId, courseId: course.id })}
                />
              ))
            ) : (
              <View style={[styles.emptyState, { backgroundColor: theme.backgroundDefault }]}>
                <Feather name="file-text" size={48} color={theme.textSecondary} />
                <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
                  No courses yet
                </ThemedText>
              </View>
            )}
          </View>

          <Button
            label="Delete Semester"
            onPress={handleDelete}
            variant="destructive"
          />
        </View>
      </ScreenScrollView>

      <Pressable
        style={[styles.fab, { backgroundColor: theme.primary, bottom: paddingBottom }]}
        onPress={() => navigation.navigate('AddCourse', { semesterId })}
      >
        <Feather name="plus" size={24} color="#FFFFFF" />
      </Pressable>
    </>
  );
}

function CourseCard({ course, semesterType, theme, onPress }: any) {
  const grade = course.finalScore !== undefined ? scoreToGrade(course.finalScore) : null;
  const caTotal = calculateCATotal(course.caScores);

  return (
    <Pressable
      style={[styles.courseCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}
      onPress={onPress}
    >
      <View style={[styles.accentBar, { backgroundColor: grade ? getGradeColor(grade, theme) : theme.primary }]} />
      <View style={styles.courseContent}>
        <View style={styles.courseHeader}>
          <View style={{ flex: 1 }}>
            <ThemedText style={[styles.courseName, { color: theme.text }]}>{course.name}</ThemedText>
            <ThemedText style={[styles.courseCode, { color: theme.textSecondary }]}>{course.code}</ThemedText>
          </View>
          {grade ? (
            <View style={[styles.gradeChip, { backgroundColor: getGradeColor(grade, theme) }]}>
              <ThemedText style={styles.gradeText}>{grade}</ThemedText>
            </View>
          ) : null}
        </View>
        <View style={styles.courseFooter}>
          <ThemedText style={{ color: theme.textSecondary, fontSize: 14 }}>
            {course.unitHours} {course.unitHours === 1 ? 'unit' : 'units'}
          </ThemedText>
          {semesterType === 'current' && !course.finalScore ? (
            <ThemedText style={{ color: theme.textSecondary, fontSize: 14 }}>
              CA: {caTotal}/60
            </ThemedText>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    gap: Spacing['2xl'],
  },
  statsCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  courseCard: {
    flexDirection: 'row',
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  accentBar: {
    width: 4,
  },
  courseContent: {
    flex: 1,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
  },
  courseCode: {
    fontSize: 14,
  },
  gradeChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
