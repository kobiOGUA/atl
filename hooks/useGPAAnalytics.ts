import { useMemo } from 'react';
import { Semester, Course } from '@/types';
import { calculateGPA, getGradeFromScore } from '@/utils/calculations';

export interface GPATrendData {
  semesterName: string;
  gpa: number;
  timestamp: number;
}

export interface CoursePerformance {
  course: Course;
  semesterName: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  performance: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface AnalyticsInsights {
  trendData: GPATrendData[];
  averageGPA: number;
  highestGPA: number;
  lowestGPA: number;
  bestPerformingCourses: CoursePerformance[];
  worstPerformingCourses: CoursePerformance[];
  recommendations: string[];
}

export function useGPAAnalytics(semesters: Semester[]): AnalyticsInsights {
  return useMemo(() => {
    const pastSemesters = semesters
      .filter(s => !s.isCurrent)
      .sort((a, b) => a.timestamp - b.timestamp);

    const trendData: GPATrendData[] = pastSemesters.map(semester => ({
      semesterName: semester.name,
      gpa: calculateGPA(semester.courses),
      timestamp: semester.timestamp,
    }));

    const allCoursePerformances: CoursePerformance[] = [];
    pastSemesters.forEach(semester => {
      semester.courses.forEach(course => {
        if (course.finalScore !== undefined) {
          const performance = assessCoursePerformance(course, semester);
          allCoursePerformances.push(performance);
        }
      });
    });

    allCoursePerformances.sort((a, b) => {
      const scoreA = a.course.finalScore || 0;
      const scoreB = b.course.finalScore || 0;
      return scoreB - scoreA;
    });

    const bestPerformingCourses = allCoursePerformances.slice(0, 5);
    const worstPerformingCourses = allCoursePerformances.slice(-5).reverse();

    const gpas = trendData.map(t => t.gpa);
    const averageGPA = gpas.length > 0 ? gpas.reduce((sum, gpa) => sum + gpa, 0) / gpas.length : 0;
    const highestGPA = gpas.length > 0 ? Math.max(...gpas) : 0;
    const lowestGPA = gpas.length > 0 ? Math.min(...gpas) : 0;

    const recommendations = generateRecommendations(
      trendData,
      allCoursePerformances,
      averageGPA
    );

    return {
      trendData,
      averageGPA,
      highestGPA,
      lowestGPA,
      bestPerformingCourses,
      worstPerformingCourses,
      recommendations,
    };
  }, [semesters]);
}

function assessCoursePerformance(course: Course, semester: Semester): CoursePerformance {
  const score = course.finalScore || 0;
  const caScore = course.caScore || 0;
  
  let difficulty: 'easy' | 'moderate' | 'hard' = 'moderate';
  if (caScore >= 50) {
    difficulty = 'easy';
  } else if (caScore < 40) {
    difficulty = 'hard';
  }

  let performance: 'excellent' | 'good' | 'fair' | 'poor' = 'fair';
  if (score >= 80) {
    performance = 'excellent';
  } else if (score >= 70) {
    performance = 'good';
  } else if (score >= 50) {
    performance = 'fair';
  } else {
    performance = 'poor';
  }

  return {
    course,
    semesterName: semester.name,
    difficulty,
    performance,
  };
}

function generateRecommendations(
  trendData: GPATrendData[],
  coursePerformances: CoursePerformance[],
  averageGPA: number
): string[] {
  const recommendations: string[] = [];

  if (trendData.length >= 2) {
    const recentTrend = trendData.slice(-3);
    const isImproving = recentTrend.every((t, i) => 
      i === 0 || t.gpa >= recentTrend[i - 1].gpa
    );
    const isDeclining = recentTrend.every((t, i) => 
      i === 0 || t.gpa <= recentTrend[i - 1].gpa
    );

    if (isImproving) {
      recommendations.push('Great progress! Your GPA trend shows consistent improvement.');
    } else if (isDeclining) {
      recommendations.push('Consider reviewing your study habits. Your GPA has been declining.');
    }
  }

  if (averageGPA >= 4.5) {
    recommendations.push('Excellent academic performance! Keep up the great work.');
  } else if (averageGPA >= 3.5) {
    recommendations.push('Good academic standing. Focus on challenging courses to boost your GPA.');
  } else if (averageGPA >= 2.5) {
    recommendations.push('Consider seeking academic support or tutoring for difficult courses.');
  } else {
    recommendations.push('Academic intervention recommended. Speak with your academic advisor.');
  }

  const hardCourses = coursePerformances.filter(c => 
    c.difficulty === 'hard' && c.performance === 'poor'
  );
  
  if (hardCourses.length > 0) {
    recommendations.push(`Focus more attention on challenging courses to improve overall performance.`);
  }

  const highUnitCourses = coursePerformances.filter(c => 
    c.course.units >= 3 && c.performance !== 'excellent'
  );
  
  if (highUnitCourses.length >= 3) {
    recommendations.push('Prioritize high-unit courses as they have greater impact on your GPA.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Keep maintaining your current study patterns and stay consistent.');
  }

  return recommendations;
}
