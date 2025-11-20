import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ScreenKeyboardAwareScrollView } from '@/components/ScreenKeyboardAwareScrollView';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import { Spacing, BorderRadius } from '@/constants/theme';
import { addCourse, getSemesters } from '@/services/storageService';
import { TargetGrade, CAScores } from '@/types';
import { Feather } from '@expo/vector-icons';

export default function AddCourseScreen({ route, navigation }: any) {
  const { semesterId } = route.params;
  const { theme } = useTheme();
  const { user } = useAuth();
  const [semesterType, setSemesterType] = useState<'past' | 'current'>('current');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [unitHours, setUnitHours] = useState('');
  const [caScores, setCAScores] = useState<CAScores>({ midterm: 0, assignment: 0, quiz: 0, attendance: 0 });
  const [targetGrade, setTargetGrade] = useState<TargetGrade>('A');
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [finalScore, setFinalScore] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSemesterType();
  }, []);

  const loadSemesterType = async () => {
    if (!user) return;
    const semesters = await getSemesters(user.uid);
    const semester = semesters.find(s => s.id === semesterId);
    if (semester) {
      setSemesterType(semester.type);
    }
  };

  const handleAdd = async () => {
    if (!name.trim() || !code.trim() || !unitHours) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const units = parseInt(unitHours);
    if (isNaN(units) || units <= 0) {
      Alert.alert('Error', 'Please enter a valid unit hour');
      return;
    }

    if (semesterType === 'past' && (!finalScore || isNaN(parseFloat(finalScore)))) {
      Alert.alert('Error', 'Please enter a valid final score for past semester');
      return;
    }

    if (!user) return;

    setLoading(true);
    try {
      const courseData: any = {
        name: name.trim(),
        code: code.trim(),
        unitHours: units,
        caScores: semesterType === 'current' ? caScores : { midterm: 0, assignment: 0, quiz: 0, attendance: 0 },
        targetGrade: semesterType === 'current' ? targetGrade : 'A',
        difficulty: semesterType === 'current' ? difficulty : 3,
      };

      if (semesterType === 'past') {
        courseData.finalScore = parseFloat(finalScore);
      }

      await addCourse(user.uid, semesterId, courseData);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenKeyboardAwareScrollView style={{ backgroundColor: theme.backgroundRoot }}>
      <View style={styles.container}>
        <View style={styles.form}>
          <View style={styles.field}>
            <ThemedText style={[styles.label, { color: theme.text }]}>Course Name *</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border }]}
              placeholder="e.g., Introduction to Programming"
              placeholderTextColor={theme.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.field}>
            <ThemedText style={[styles.label, { color: theme.text }]}>Course Code *</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border }]}
              placeholder="e.g., CSC 201"
              placeholderTextColor={theme.textSecondary}
              value={code}
              onChangeText={setCode}
            />
          </View>

          <View style={styles.field}>
            <ThemedText style={[styles.label, { color: theme.text }]}>Unit Hours *</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border }]}
              placeholder="e.g., 3"
              placeholderTextColor={theme.textSecondary}
              value={unitHours}
              onChangeText={setUnitHours}
              keyboardType="number-pad"
            />
          </View>

          {semesterType === 'past' ? (
            <View style={styles.field}>
              <ThemedText style={[styles.label, { color: theme.text }]}>Final Score (out of 100) *</ThemedText>
              <TextInput
                style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border }]}
                placeholder="e.g., 85"
                placeholderTextColor={theme.textSecondary}
                value={finalScore}
                onChangeText={setFinalScore}
                keyboardType="decimal-pad"
              />
            </View>
          ) : (
            <>
              <View style={styles.field}>
                <ThemedText style={[styles.label, { color: theme.text }]}>CA Scores</ThemedText>
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
            </>
          )}
        </View>

        <View style={styles.actions}>
          <Button
            label="Cancel"
            onPress={() => navigation.goBack()}
            variant="secondary"
          />
          <Button
            label={loading ? 'Adding...' : 'Add Course'}
            onPress={handleAdd}
            disabled={loading}
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
    gap: Spacing['3xl'],
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
  actions: {
    gap: Spacing.md,
  },
});
