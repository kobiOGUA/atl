import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ScreenKeyboardAwareScrollView } from '@/components/ScreenKeyboardAwareScrollView';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import { Spacing, BorderRadius } from '@/constants/theme';
import { getSemesters, updateCourse, deleteCourse } from '@/services/storageService';
import { TargetGrade, CAScores, Course } from '@/types';
import { calculateRequiredExamScore, calculateCATotal } from '@/utils/calculations';
import { Feather } from '@expo/vector-icons';

export default function CourseDetailScreen({ route, navigation }: any) {
  const { semesterId, courseId } = route.params;
  const { theme } = useTheme();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [semesterType, setSemesterType] = useState<'past' | 'current'>('current');
  const [caScores, setCAScores] = useState<CAScores>({ midterm: 0, assignment: 0, quiz: 0, attendance: 0 });
  const [targetGrade, setTargetGrade] = useState<TargetGrade>('A');
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [finalScore, setFinalScore] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCourse();
  }, []);

  const loadCourse = async () => {
    if (!user) return;
    const semesters = await getSemesters(user.uid);
    const semester = semesters.find(s => s.id === semesterId);
    if (semester) {
      setSemesterType(semester.type);
      const foundCourse = semester.courses.find(c => c.id === courseId);
      if (foundCourse) {
        setCourse(foundCourse);
        setCAScores(foundCourse.caScores);
        setTargetGrade(foundCourse.targetGrade);
        setDifficulty(foundCourse.difficulty);
        setFinalScore(foundCourse.finalScore?.toString() || '');
        navigation.setOptions({ title: foundCourse.name });
      }
    }
  };

  const handleSave = async () => {
    if (!user || !course) return;

    setLoading(true);
    try {
      const updates: Partial<Course> = {
        caScores,
        targetGrade,
        difficulty,
      };

      if (finalScore) {
        const score = parseFloat(finalScore);
        if (!isNaN(score) && score >= 0 && score <= 100) {
          updates.finalScore = score;
        }
      }

      await updateCourse(user.uid, semesterId, courseId, updates);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Course',
      'Are you sure you want to delete this course?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            try {
              await deleteCourse(user.uid, semesterId, courseId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete course');
            }
          },
        },
      ]
    );
  };

  if (!course) return null;

  const caTotal = calculateCATotal(caScores);
  const examTargets = (['A', 'B', 'C'] as TargetGrade[]).map(grade => calculateRequiredExamScore(caTotal, grade));

  return (
    <ScreenKeyboardAwareScrollView style={{ backgroundColor: theme.backgroundRoot }}>
      <View style={styles.container}>
        <View style={[styles.infoCard, { backgroundColor: theme.backgroundDefault }]}>
          <View style={styles.infoRow}>
            <ThemedText style={[styles.infoLabel, { color: theme.textSecondary }]}>Name</ThemedText>
            <ThemedText style={[styles.infoValue, { color: theme.text }]}>{course.name}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={[styles.infoLabel, { color: theme.textSecondary }]}>Code</ThemedText>
            <ThemedText style={[styles.infoValue, { color: theme.text }]}>{course.code}</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={[styles.infoLabel, { color: theme.textSecondary }]}>Units</ThemedText>
            <ThemedText style={[styles.infoValue, { color: theme.text }]}>{course.unitHours}</ThemedText>
          </View>
        </View>

        {semesterType === 'current' ? (
          <>
            <View style={styles.form}>
              <View style={styles.field}>
                <ThemedText style={[styles.label, { color: theme.text }]}>CA Scores (Total: {caTotal}/60)</ThemedText>
                <View style={styles.caGrid}>
                  <CAInput label="Midterm (20)" value={caScores.midterm} max={20} onChange={(val: number) => setCAScores({ ...caScores, midterm: val })} theme={theme} />
                  <CAInput label="Assignment (20)" value={caScores.assignment} max={20} onChange={(val: number) => setCAScores({ ...caScores, assignment: val })} theme={theme} />
                  <CAInput label="Quiz (10)" value={caScores.quiz} max={10} onChange={(val: number) => setCAScores({ ...caScores, quiz: val })} theme={theme} />
                  <CAInput label="Attendance (10)" value={caScores.attendance} max={10} onChange={(val: number) => setCAScores({ ...caScores, attendance: val })} theme={theme} />
                </View>
              </View>

              <View style={styles.field}>
                <ThemedText style={[styles.label, { color: theme.text }]}>Target Grade</ThemedText>
                <View style={styles.gradeSelector}>
                  {(['A', 'B', 'C'] as TargetGrade[]).map(grade => (
                    <Pressable
                      key={grade}
                      style={[
                        styles.gradeChip,
                        { borderColor: theme.border },
                        targetGrade === grade && { backgroundColor: theme.primary, borderColor: theme.primary }
                      ]}
                      onPress={() => setTargetGrade(grade)}
                    >
                      <ThemedText style={[styles.gradeText, { color: targetGrade === grade ? '#FFFFFF' : theme.text }]}>
                        {grade}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.field}>
                <ThemedText style={[styles.label, { color: theme.text }]}>Difficulty</ThemedText>
                <View style={styles.difficultySelector}>
                  {[1, 2, 3, 4, 5].map(level => (
                    <Pressable
                      key={level}
                      onPress={() => setDifficulty(level as any)}
                    >
                      <Feather
                        name="star"
                        size={32}
                        color={level <= difficulty ? theme.primary : theme.textSecondary}
                        fill={level <= difficulty ? theme.primary : 'transparent'}
                      />
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.field}>
              <ThemedText style={[styles.label, { color: theme.text }]}>Exam Target Table</ThemedText>
              <View style={[styles.table, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
                <View style={[styles.tableHeader, { backgroundColor: theme.backgroundSecondary }]}>
                  <ThemedText style={[styles.tableHeaderText, { color: theme.text }]}>Target Grade</ThemedText>
                  <ThemedText style={[styles.tableHeaderText, { color: theme.text }]}>Required Exam</ThemedText>
                  <ThemedText style={[styles.tableHeaderText, { color: theme.text }]}>Achievable</ThemedText>
                </View>
                {examTargets.map(target => (
                  <View key={target.targetGrade} style={[styles.tableRow, { borderTopColor: theme.border }]}>
                    <ThemedText style={[styles.tableCell, { color: theme.text }]}>{target.targetGrade}</ThemedText>
                    <ThemedText style={[styles.tableCell, { color: theme.text }]}>{target.requiredExam.toFixed(1)}/40</ThemedText>
                    <ThemedText style={[styles.tableCell, { color: target.achievable ? theme.success : theme.error }]}>
                      {target.achievable ? 'Yes' : 'No'}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <ThemedText style={[styles.label, { color: theme.text }]}>Final Score (Optional)</ThemedText>
              <ThemedText style={[styles.hint, { color: theme.textSecondary }]}>
                Enter your final score when you receive your result
              </ThemedText>
              <TextInput
                style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border }]}
                placeholder="e.g., 85"
                placeholderTextColor={theme.textSecondary}
                value={finalScore}
                onChangeText={setFinalScore}
                keyboardType="decimal-pad"
              />
            </View>
          </>
        ) : (
          <View style={[styles.finalScoreCard, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText style={[styles.label, { color: theme.text }]}>Final Score</ThemedText>
            <ThemedText style={[styles.finalScoreValue, { color: theme.primary }]}>
              {course.finalScore?.toFixed(1)}
            </ThemedText>
          </View>
        )}

        <View style={styles.actions}>
          {semesterType === 'current' ? (
            <Button
              label={loading ? 'Saving...' : 'Save Changes'}
              onPress={handleSave}
              disabled={loading}
            />
          ) : null}
          <Button
            label="Delete Course"
            onPress={handleDelete}
            variant="destructive"
          />
        </View>
      </View>
    </ScreenKeyboardAwareScrollView>
  );
}

function CAInput({ label, value, max, onChange, theme }: any) {
  const [text, setText] = useState(value.toString());

  const handleChange = (val: string) => {
    setText(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && num <= max) {
      onChange(num);
    } else if (val === '') {
      onChange(0);
    }
  };

  return (
    <View style={styles.caInputContainer}>
      <ThemedText style={[styles.caLabel, { color: theme.textSecondary }]}>{label}</ThemedText>
      <TextInput
        style={[styles.caInput, { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border }]}
        value={text}
        onChangeText={handleChange}
        keyboardType="decimal-pad"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    gap: Spacing['2xl'],
  },
  infoCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    gap: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
  },
  form: {
    gap: Spacing['2xl'],
  },
  field: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    fontSize: 14,
  },
  input: {
    height: Spacing.inputHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  caGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  caInputContainer: {
    width: '48%',
    gap: Spacing.xs,
  },
  caLabel: {
    fontSize: 14,
  },
  caInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  gradeSelector: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  gradeChip: {
    flex: 1,
    height: 48,
    borderWidth: 2,
    borderRadius: BorderRadius.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeText: {
    fontSize: 18,
    fontWeight: '700',
  },
  difficultySelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  table: {
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    padding: Spacing.md,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  tableCell: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  finalScoreCard: {
    padding: Spacing['2xl'],
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  finalScoreValue: {
    fontSize: 48,
    fontWeight: '700',
  },
  actions: {
    gap: Spacing.md,
  },
});
