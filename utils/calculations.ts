import { Grade, TargetGrade, CAScores, Course, Semester, ExamTarget } from '@/types';

export const GRADE_POINTS: Record<Grade, number> = {
  A: 5.0,
  B: 4.0,
  C: 3.0,
  D: 2.0,
  E: 1.0,
  F: 0.0,
};

export const GRADE_RANGES: Record<Grade, { min: number; max: number }> = {
  A: { min: 80, max: 100 },
  B: { min: 60, max: 79 },
  C: { min: 50, max: 59 },
  D: { min: 40, max: 49 },
  E: { min: 30, max: 39 },
  F: { min: 0, max: 29 },
};

export function scoreToGrade(score: number): Grade {
  if (score >= 80) return 'A';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  if (score >= 40) return 'D';
  if (score >= 30) return 'E';
  return 'F';
}

export function calculateCATotal(caScores: CAScores): number {
  return caScores.midterm + caScores.assignment + caScores.quiz + caScores.attendance;
}

export function calculateRequiredExamScore(caTotal: number, targetGrade: TargetGrade): ExamTarget {
  const minScore = GRADE_RANGES[targetGrade].min;
  const requiredExam = minScore - caTotal;
  const achievable = requiredExam >= 0 && requiredExam <= 40;

  return {
    caTotal,
    targetGrade,
    requiredExam: Math.max(0, Math.min(40, requiredExam)),
    achievable,
  };
}

export function calculatePredictedScore(course: Course): number {
  const caTotal = calculateCATotal(course.caScores);
  const examTarget = calculateRequiredExamScore(caTotal, course.targetGrade);
  return caTotal + examTarget.requiredExam;
}

export function calculateSemesterGPA(courses: Course[]): number {
  if (courses.length === 0) return 0;

  let totalPoints = 0;
  let totalUnits = 0;

  courses.forEach(course => {
    const grade = course.finalScore !== undefined 
      ? scoreToGrade(course.finalScore) 
      : scoreToGrade(calculatePredictedScore(course));
    
    totalPoints += GRADE_POINTS[grade] * course.unitHours;
    totalUnits += course.unitHours;
  });

  return totalUnits > 0 ? parseFloat((totalPoints / totalUnits).toFixed(2)) : 0;
}

export function calculateCGPA(semesters: Semester[]): number {
  const pastSemesters = semesters.filter(s => s.type === 'past');
  if (pastSemesters.length === 0) return 0;

  let totalWeightedGPA = 0;
  let totalUnits = 0;

  pastSemesters.forEach(semester => {
    const semesterUnits = semester.courses.reduce((sum, course) => sum + course.unitHours, 0);
    totalWeightedGPA += semester.gpa * semesterUnits;
    totalUnits += semesterUnits;
  });

  return totalUnits > 0 ? parseFloat((totalWeightedGPA / totalUnits).toFixed(2)) : 0;
}

export function calculatePredictedCGPA(semesters: Semester[]): number {
  const pastSemesters = semesters.filter(s => s.type === 'past');
  const currentSemester = semesters.find(s => s.type === 'current');

  if (pastSemesters.length === 0 && !currentSemester) return 0;

  let totalWeightedGPA = 0;
  let totalUnits = 0;

  pastSemesters.forEach(semester => {
    const semesterUnits = semester.courses.reduce((sum, course) => sum + course.unitHours, 0);
    totalWeightedGPA += semester.gpa * semesterUnits;
    totalUnits += semesterUnits;
  });

  if (currentSemester && currentSemester.courses.length > 0) {
    const predictedGPA = calculateSemesterGPA(currentSemester.courses);
    const currentUnits = currentSemester.courses.reduce((sum, course) => sum + course.unitHours, 0);
    totalWeightedGPA += predictedGPA * currentUnits;
    totalUnits += currentUnits;
  }

  return totalUnits > 0 ? parseFloat((totalWeightedGPA / totalUnits).toFixed(2)) : 0;
}

export function getGradeColor(grade: Grade, colors: any): string {
  if (grade === 'A') return colors.success;
  if (grade === 'B') return colors.primary;
  if (grade === 'C') return colors.warning;
  return colors.error;
}

export function getGPAColor(gpa: number, colors: any): string {
  if (gpa >= 4.5) return colors.success;
  if (gpa >= 4.0) return colors.primary;
  if (gpa >= 3.0) return colors.warning;
  return colors.error;
}
