import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { Card } from '@/components/Card';
import { ThemedText } from '@/components/ThemedText';
import { GPATrendChart } from '@/components/GPATrendChart';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/contexts/AuthContext';
import { getSemesters } from '@/services/storageService';
import { useGPAAnalytics, CoursePerformance } from '@/hooks/useGPAAnalytics';
import { Semester } from '@/types';
import { Spacing } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';

export default function AnalyticsDashboardScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const analytics = useGPAAnalytics(semesters);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    const data = await getSemesters(user.uid);
    setSemesters(data);
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#8BC34A';
      case 'fair': return '#FFC107';
      case 'poor': return '#FF5722';
      default: return theme.textSecondary;
    }
  };

  return (
    <ScreenScrollView>
      <View style={styles.container}>
        <ThemedText type="title" style={[styles.title, { color: theme.text }]}>
          Analytics Dashboard
        </ThemedText>

        <Card style={styles.statsCard}>
          <ThemedText type="subtitle" style={[styles.cardTitle, { color: theme.text }]}>
            GPA Overview
          </ThemedText>
          <View style={styles.statsGrid}>
            <StatItem
              label="Average GPA"
              value={analytics.averageGPA.toFixed(2)}
              icon="bar-chart-2"
              theme={theme}
            />
            <StatItem
              label="Highest GPA"
              value={analytics.highestGPA.toFixed(2)}
              icon="trending-up"
              theme={theme}
            />
            <StatItem
              label="Lowest GPA"
              value={analytics.lowestGPA.toFixed(2)}
              icon="trending-down"
              theme={theme}
            />
            <StatItem
              label="Semesters"
              value={analytics.trendData.length.toString()}
              icon="calendar"
              theme={theme}
            />
          </View>
        </Card>

        <Card style={styles.chartCard}>
          <ThemedText type="subtitle" style={[styles.cardTitle, { color: theme.text }]}>
            GPA Trend
          </ThemedText>
          <GPATrendChart data={analytics.trendData} />
        </Card>

        <Card style={styles.coursesCard}>
          <ThemedText type="subtitle" style={[styles.cardTitle, { color: theme.text }]}>
            Top Performing Courses
          </ThemedText>
          {analytics.bestPerformingCourses.length > 0 ? (
            analytics.bestPerformingCourses.map((coursePerf, index) => (
              <CoursePerformanceItem
                key={index}
                coursePerformance={coursePerf}
                theme={theme}
                getPerformanceColor={getPerformanceColor}
              />
            ))
          ) : (
            <ThemedText style={{ color: theme.textSecondary }}>
              No course data available yet
            </ThemedText>
          )}
        </Card>

        <Card style={styles.coursesCard}>
          <ThemedText type="subtitle" style={[styles.cardTitle, { color: theme.text }]}>
            Courses Needing Attention
          </ThemedText>
          {analytics.worstPerformingCourses.length > 0 ? (
            analytics.worstPerformingCourses.map((coursePerf, index) => (
              <CoursePerformanceItem
                key={index}
                coursePerformance={coursePerf}
                theme={theme}
                getPerformanceColor={getPerformanceColor}
              />
            ))
          ) : (
            <ThemedText style={{ color: theme.textSecondary }}>
              No course data available yet
            </ThemedText>
          )}
        </Card>

        <Card style={styles.recommendationsCard}>
          <ThemedText type="subtitle" style={[styles.cardTitle, { color: theme.text }]}>
            Recommendations
          </ThemedText>
          {analytics.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Feather name="check-circle" size={16} color={theme.primary} />
              <ThemedText style={[styles.recommendationText, { color: theme.textSecondary }]}>
                {recommendation}
              </ThemedText>
            </View>
          ))}
        </Card>
      </View>
    </ScreenScrollView>
  );
}

function StatItem({ label, value, icon, theme }: any) {
  return (
    <View style={styles.statItem}>
      <Feather name={icon} size={20} color={theme.primary} />
      <ThemedText style={[styles.statValue, { color: theme.text }]}>{value}</ThemedText>
      <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>{label}</ThemedText>
    </View>
  );
}

function CoursePerformanceItem({ coursePerformance, theme, getPerformanceColor }: any) {
  const { course, semesterName, performance } = coursePerformance;
  
  return (
    <View style={[styles.courseItem, { backgroundColor: theme.backgroundSecondary }]}>
      <View style={styles.courseInfo}>
        <ThemedText style={[styles.courseCode, { color: theme.text }]}>
          {course.code}
        </ThemedText>
        <ThemedText style={[styles.courseTitle, { color: theme.textSecondary }]}>
          {course.title}
        </ThemedText>
        <ThemedText style={[styles.courseSemester, { color: theme.textSecondary }]}>
          {semesterName}
        </ThemedText>
      </View>
      <View style={styles.courseStats}>
        <View style={[styles.performanceBadge, { backgroundColor: getPerformanceColor(performance) }]}>
          <ThemedText style={styles.performanceText}>
            {performance.toUpperCase()}
          </ThemedText>
        </View>
        <ThemedText style={[styles.courseScore, { color: theme.text }]}>
          {course.finalScore}%
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.lg,
  },
  statsCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  chartCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  coursesCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  recommendationsCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statItem: {
    alignItems: 'center',
    gap: Spacing.xs,
    width: '45%',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  courseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.sm,
  },
  courseInfo: {
    flex: 1,
  },
  courseCode: {
    fontSize: 14,
    fontWeight: '600',
  },
  courseTitle: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  courseSemester: {
    fontSize: 11,
    marginTop: Spacing.xs,
  },
  courseStats: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  performanceBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  performanceText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  courseScore: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recommendationItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    alignItems: 'flex-start',
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
