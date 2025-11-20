import React, { useEffect } from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
} from 'react-native-reanimated';
import { ThemedText } from './ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { useAchievements, Achievement } from '@/contexts/AchievementContext';

export function AchievementPopup() {
  const { theme } = useTheme();
  const { currentAchievement, clearCurrentAchievement } = useAchievements();
  
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (currentAchievement) {
      scale.value = withSpring(1, { damping: 15 });
      opacity.value = withSpring(1);
    } else {
      scale.value = 0;
      opacity.value = 0;
    }
  }, [currentAchievement]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!currentAchievement) return null;

  return (
    <Modal transparent visible={!!currentAchievement} animationType="none">
      <Pressable style={styles.overlay} onPress={clearCurrentAchievement}>
        <Animated.View
          style={[
            styles.container,
            { backgroundColor: theme.backgroundDefault },
            animatedStyle,
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
            <Feather name={currentAchievement.icon as any} size={32} color="#FFFFFF" />
          </View>
          
          <View style={styles.content}>
            <ThemedText style={[styles.badge, { color: theme.primary }]}>
              ACHIEVEMENT UNLOCKED
            </ThemedText>
            <ThemedText type="subtitle" style={[styles.title, { color: theme.text }]}>
              {currentAchievement.title}
            </ThemedText>
            <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
              {currentAchievement.description}
            </ThemedText>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    width: '85%',
    maxWidth: 400,
    padding: Spacing['2xl'],
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    gap: Spacing.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  badge: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
});
