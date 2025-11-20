import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import { Spacing, BorderRadius } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AccountScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { user, signOut, deleteAccount } = useAuth();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you absolutely sure? This will permanently delete your account and all your data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'This is your last chance. Delete account and all data?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Yes, Delete Everything',
                  style: 'destructive',
                  onPress: async () => {
                    setLoading(true);
                    try {
                      await deleteAccount();
                    } catch (error) {
                      Alert.alert('Error', 'Failed to delete account');
                    } finally {
                      setLoading(false);
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: Spacing.xl, paddingBottom: insets.bottom + Spacing.xl }]}>
      <View style={styles.content}>
        <View style={[styles.infoCard, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText style={[styles.label, { color: theme.textSecondary }]}>Email</ThemedText>
          <ThemedText style={[styles.value, { color: theme.text }]}>{user?.email}</ThemedText>
        </View>

        <View style={styles.actions}>
          <Button
            label={loading ? 'Signing Out...' : 'Sign Out'}
            onPress={handleSignOut}
            disabled={loading}
            variant="secondary"
          />

          <Button
            label="Delete Account"
            onPress={handleDeleteAccount}
            disabled={loading}
            variant="destructive"
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
    gap: Spacing['3xl'],
  },
  infoCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xs,
    gap: Spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
  },
  actions: {
    gap: Spacing.lg,
  },
});
