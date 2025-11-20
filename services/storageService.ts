import AsyncStorage from '@react-native-async-storage/async-storage';
import { Semester, Course, SemesterType } from '@/types';
import { calculateSemesterGPA } from '@/utils/calculations';

const SEMESTERS_KEY = '@semesters_';

export async function getSemesters(userId: string): Promise<Semester[]> {
  try {
    const data = await AsyncStorage.getItem(`${SEMESTERS_KEY}${userId}`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load semesters:', error);
    return [];
  }
}

export async function saveSemesters(userId: string, semesters: Semester[]): Promise<void> {
  try {
    await AsyncStorage.setItem(`${SEMESTERS_KEY}${userId}`, JSON.stringify(semesters));
  } catch (error) {
    console.error('Failed to save semesters:', error);
    throw error;
  }
}

export async function createSemester(
  userId: string,
  name: string,
  type: SemesterType
): Promise<Semester> {
  const semesters = await getSemesters(userId);
  
  if (type === 'current') {
    const existingCurrent = semesters.find(s => s.type === 'current');
    if (existingCurrent) {
      throw new Error('A current semester already exists. Please convert it to a past semester first.');
    }
  }

  const newSemester: Semester = {
    id: `sem_${Date.now()}`,
    name,
    type,
    timestamp: Date.now(),
    gpa: 0,
    courses: [],
  };

  semesters.push(newSemester);
  await saveSemesters(userId, semesters);
  return newSemester;
}

export async function updateSemester(
  userId: string,
  semesterId: string,
  updates: Partial<Semester>
): Promise<void> {
  const semesters = await getSemesters(userId);
  const index = semesters.findIndex(s => s.id === semesterId);
  
  if (index === -1) throw new Error('Semester not found');

  semesters[index] = { ...semesters[index], ...updates };
  
  if (semesters[index].courses.length > 0) {
    semesters[index].gpa = calculateSemesterGPA(semesters[index].courses);
  }

  await saveSemesters(userId, semesters);
}

export async function deleteSemester(userId: string, semesterId: string): Promise<void> {
  const semesters = await getSemesters(userId);
  const filtered = semesters.filter(s => s.id !== semesterId);
  await saveSemesters(userId, filtered);
}

export async function addCourse(
  userId: string,
  semesterId: string,
  course: Omit<Course, 'id'>
): Promise<Course> {
  const semesters = await getSemesters(userId);
  const semester = semesters.find(s => s.id === semesterId);
  
  if (!semester) throw new Error('Semester not found');

  const newCourse: Course = {
    ...course,
    id: `course_${Date.now()}`,
  };

  semester.courses.push(newCourse);
  semester.gpa = calculateSemesterGPA(semester.courses);

  await saveSemesters(userId, semesters);
  return newCourse;
}

export async function updateCourse(
  userId: string,
  semesterId: string,
  courseId: string,
  updates: Partial<Course>
): Promise<void> {
  const semesters = await getSemesters(userId);
  const semester = semesters.find(s => s.id === semesterId);
  
  if (!semester) throw new Error('Semester not found');

  const courseIndex = semester.courses.findIndex(c => c.id === courseId);
  if (courseIndex === -1) throw new Error('Course not found');

  semester.courses[courseIndex] = { ...semester.courses[courseIndex], ...updates };
  semester.gpa = calculateSemesterGPA(semester.courses);

  const allCoursesHaveFinalScores = semester.courses.every(c => c.finalScore !== undefined);
  if (semester.type === 'current' && allCoursesHaveFinalScores && semester.courses.length > 0) {
    semester.type = 'past';
  }

  await saveSemesters(userId, semesters);
}

export async function deleteCourse(
  userId: string,
  semesterId: string,
  courseId: string
): Promise<void> {
  const semesters = await getSemesters(userId);
  const semester = semesters.find(s => s.id === semesterId);
  
  if (!semester) throw new Error('Semester not found');

  semester.courses = semester.courses.filter(c => c.id !== courseId);
  semester.gpa = calculateSemesterGPA(semester.courses);

  await saveSemesters(userId, semesters);
}

export async function deleteSemesters(userId: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(`${SEMESTERS_KEY}${userId}`);
  } catch (error) {
    console.error('Failed to delete semesters:', error);
    throw error;
  }
}

export const storageService = {
  getSemesters,
  saveSemesters,
  createSemester,
  updateSemester,
  deleteSemester,
  addCourse,
  updateCourse,
  deleteCourse,
  deleteSemesters,
};
