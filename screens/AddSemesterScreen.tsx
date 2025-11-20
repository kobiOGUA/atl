import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import { Spacing, BorderRadius } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createSemester } from '@/services/storageService';
import { SemesterType } from '@/types';

export default function AddSemesterScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [type, setType] = useState<SemesterType>('current');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a semester name');
      return;
    }

    if (!user) return;

    setLoading(true);
    try {
      await createSemester(user.uid, name.trim(), type);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create semester');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: Spacing.xl, paddingBottom: insets.bottom + Spacing.xl }]}>
      <View style={styles.content}>
        <View style={styles.form}>
          <View style={styles.field}>
            <ThemedText style={[styles.label, { color: theme.text }]}>Semester Name</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border }]}
              placeholder="e.g., 200 Level 1st Semester"
              placeholderTextColor={theme.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.field}>
            <ThemedText style={[styles.label, { color: theme.text }]}>Semester Type</ThemedText>
            <View style={styles.typeSelector}>
              <Pressable
                style={[
                  styles.typeOption,
                  { borderColor: theme.border },
                  type === 'past' && { backgroundColor: theme.primary, borderColor: theme.primary }
                ]}
                onPress={() => setType('past')}
              >
                <ThemedText style={[styles.typeText, { color: type === 'past' ? '#FFFFFF' : theme.text }]}>
                  Past
                </ThemedText>
              </Pressable>
              <Pressable
                style={[
                  styles.typeOption,
                  { borderColor: theme.border },
                  type === 'current' && { backgroundColor: theme.primary, borderColor: theme.primary }
                ]}
                onPress={() => setType('current')}
              >
                <ThemedText style={[styles.typeText, { color: type === 'current' ? '#FFFFFF' : theme.text }]}>
                  Current
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            label="Cancel"
            onPress={() => navigation.goBack()}
            variant="secondary"
          />
          <Button
            label={loading ? 'Creating...' : 'Create Semester'}
            onPress={handleCreate}
            disabled={loading}
          />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'space-between',
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
  typeSelector: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  typeOption: {
    flex: 1,
    height: Spacing.inputHeight,
    borderWidth: 2,
    borderRadius: BorderRadius.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    gap: Spacing.md,
  },
});
