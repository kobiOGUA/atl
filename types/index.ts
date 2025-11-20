export type TargetGrade = 'A' | 'B' | 'C';
export type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type SemesterType = 'past' | 'current';

export interface CAScores {
  midterm: number;
  assignment: number;
  quiz: number;
  attendance: number;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  unitHours: number;
  caScores: CAScores;
  targetGrade: TargetGrade;
  difficulty: 1 | 2 | 3 | 4 | 5;
  finalScore?: number;
  grade?: Grade;
}

export interface Semester {
  id: string;
  name: string;
  type: SemesterType;
  timestamp: number;
  gpa: number;
  predictedGPA?: number;
  courses: Course[];
}

export interface ExamTarget {
  caTotal: number;
  targetGrade: TargetGrade;
  requiredExam: number;
  achievable: boolean;
}
