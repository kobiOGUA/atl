import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { getSemesters } from '@/services/storageService';
import { calculateCGPA } from '@/utils/calculations';
import { notificationService } from '@/services/notificationService';
import * as Haptics from 'expo-haptics';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

interface AchievementContextType {
  achievements: Achievement[];
  checkAchievements: () => Promise<void>;
  showAchievement: (achievement: Achievement) => void;
  currentAchievement: Achievement | null;
  clearCurrentAchievement: () => void;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'first_semester',
    title: 'Getting Started',
    description: 'Complete your first semester',
    icon: 'award',
  },
  {
    id: 'gpa_4_0',
    title: 'Excellence',
    description: 'Achieve a CGPA of 4.0 or higher',
    icon: 'star',
  },
  {
    id: 'gpa_4_5',
    title: 'Outstanding',
    description: 'Achieve a CGPA of 4.5 or higher',
    icon: 'zap',
  },
  {
    id: 'perfect_semester',
    title: 'Perfect Semester',
    description: 'Get a 5.0 GPA in a semester',
    icon: 'trending-up',
  },
  {
    id: 'five_semesters',
    title: 'Consistency',
    description: 'Complete 5 semesters',
    icon: 'calendar',
  },
  {
    id: 'ten_courses',
    title: 'Dedicated Student',
    description: 'Complete 10 courses',
    icon: 'book',
  },
  {
    id: 'improvement',
    title: 'Rising Star',
    description: 'Improve your GPA for 3 consecutive semesters',
    icon: 'arrow-up',
  },
];

export function AchievementProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    loadAchievements();
  }, [user]);

  const loadAchievements = async () => {
    const stored = await getStoredAchievements();
    setAchievements(stored);
  };

  const getStoredAchievements = async (): Promise<Achievement[]> => {
    if (!user) {
      return ACHIEVEMENT_DEFINITIONS.map(def => ({
        ...def,
        unlocked: false,
      }));
    }

    try {
      const stored = await AsyncStorage.getItem(`achievements_${user.uid}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        return ACHIEVEMENT_DEFINITIONS.map(def => {
          const savedAchievement = parsed.find((a: Achievement) => a.id === def.id);
          return savedAchievement || { ...def, unlocked: false };
        });
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
    }

    return ACHIEVEMENT_DEFINITIONS.map(def => ({
      ...def,
      unlocked: false,
    }));
  };

  const saveAchievements = async (achievementsList: Achievement[]) => {
    if (!user) return;
    try {
      await AsyncStorage.setItem(`achievements_${user.uid}`, JSON.stringify(achievementsList));
    } catch (error) {
      console.error('Failed to save achievements:', error);
    }
  };

  const checkAchievements = async () => {
    if (!user) return;

    const semesters = await getSemesters(user.uid);
    const pastSemesters = semesters.filter(s => s.type === 'past');
    const cgpa = calculateCGPA(pastSemesters);
    const totalCourses = pastSemesters.reduce((sum, s) => sum + s.courses.length, 0);

    const newAchievements = [...achievements];
    let hasNewAchievement = false;

    if (pastSemesters.length >= 1 && !achievements.find(a => a.id === 'first_semester')?.unlocked) {
      unlockAchievement('first_semester', newAchievements);
      hasNewAchievement = true;
    }

    if (cgpa >= 4.0 && !achievements.find(a => a.id === 'gpa_4_0')?.unlocked) {
      unlockAchievement('gpa_4_0', newAchievements);
      hasNewAchievement = true;
    }

    if (cgpa >= 4.5 && !achievements.find(a => a.id === 'gpa_4_5')?.unlocked) {
      unlockAchievement('gpa_4_5', newAchievements);
      hasNewAchievement = true;
    }

    const perfectSemester = pastSemesters.find(s => s.gpa === 5.0);
    if (perfectSemester && !achievements.find(a => a.id === 'perfect_semester')?.unlocked) {
      unlockAchievement('perfect_semester', newAchievements);
      hasNewAchievement = true;
    }

    if (pastSemesters.length >= 5 && !achievements.find(a => a.id === 'five_semesters')?.unlocked) {
      unlockAchievement('five_semesters', newAchievements);
      hasNewAchievement = true;
    }

    if (totalCourses >= 10 && !achievements.find(a => a.id === 'ten_courses')?.unlocked) {
      unlockAchievement('ten_courses', newAchievements);
      hasNewAchievement = true;
    }

    const sortedSemesters = pastSemesters.sort((a, b) => a.timestamp - b.timestamp);
    if (sortedSemesters.length >= 3) {
      const last3 = sortedSemesters.slice(-3);
      const isImproving = last3.every((s, i) => i === 0 || s.gpa > last3[i - 1].gpa);
      if (isImproving && !achievements.find(a => a.id === 'improvement')?.unlocked) {
        unlockAchievement('improvement', newAchievements);
        hasNewAchievement = true;
      }
    }

    if (hasNewAchievement) {
      setAchievements(newAchievements);
      await saveAchievements(newAchievements);
    }
  };

  const unlockAchievement = (id: string, achievementsList: Achievement[]) => {
    const index = achievementsList.findIndex(a => a.id === id);
    if (index !== -1) {
      achievementsList[index] = {
        ...achievementsList[index],
        unlocked: true,
        unlockedAt: Date.now(),
      };
      
      const achievement = achievementsList[index];
      showAchievement(achievement);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      notificationService.sendImmediateNotification(
        'Achievement Unlocked!',
        `${achievement.title}: ${achievement.description}`
      );
    }
  };

  const showAchievement = (achievement: Achievement) => {
    setCurrentAchievement(achievement);
    setTimeout(() => {
      setCurrentAchievement(null);
    }, 5000);
  };

  const clearCurrentAchievement = () => {
    setCurrentAchievement(null);
  };

  return (
    <AchievementContext.Provider
      value={{
        achievements,
        checkAchievements,
        showAchievement,
        currentAchievement,
        clearCurrentAchievement,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
}
