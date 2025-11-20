import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import { Spacing, BorderRadius } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

export default function SignupScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { signUp } = useAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email.trim() || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Feather name="book-open" size={64} color={theme.primary} />
        </View>
        
        <ThemedText style={[styles.title, { color: theme.text }]}>Create Account</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          Start tracking your academic success
        </ThemedText>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border }]}
            placeholder="Email"
            placeholderTextColor={theme.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />

          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border }]}
            placeholder="Password"
            placeholderTextColor={theme.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TextInput
            style={[styles.input, { backgroundColor: theme.backgroundDefault, color: theme.text, borderColor: theme.border }]}
            placeholder="Confirm Password"
            placeholderTextColor={theme.textSecondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <Button
            label={loading ? 'Creating Account...' : 'Sign Up'}
            onPress={handleSignup}
            disabled={loading}
            style={styles.button}
          />

          <Pressable onPress={() => navigation.goBack()} style={styles.loginPrompt}>
            <ThemedText style={{ color: theme.textSecondary }}>
              Already have an account?{' '}
              <ThemedText style={{ color: theme.primary, fontWeight: '600' }}>Sign In</ThemedText>
            </ThemedText>
          </Pressable>
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
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: Spacing['4xl'],
  },
  form: {
    gap: Spacing.lg,
  },
  input: {
    height: Spacing.inputHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  button: {
    marginTop: Spacing.md,
  },
  loginPrompt: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
});
