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

export default function LoginScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
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
        
        <ThemedText style={[styles.title, { color: theme.text }]}>Student Atlas</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          Track your academic journey
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

          <Button
            label={loading ? 'Signing In...' : 'Sign In'}
            onPress={handleLogin}
            disabled={loading}
            style={styles.button}
          />

          <Pressable onPress={() => navigation.navigate('Signup')} style={styles.signupPrompt}>
            <ThemedText style={{ color: theme.textSecondary }}>
              Don't have an account?{' '}
              <ThemedText style={{ color: theme.primary, fontWeight: '600' }}>Sign Up</ThemedText>
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
  signupPrompt: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
});
