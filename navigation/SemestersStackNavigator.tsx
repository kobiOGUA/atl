import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "./screenOptions";

import SemestersScreen from "@/screens/SemestersScreen";
import SemesterDetailScreen from "@/screens/SemesterDetailScreen";
import CourseDetailScreen from "@/screens/CourseDetailScreen";
import AddSemesterScreen from "@/screens/AddSemesterScreen";
import AddCourseScreen from "@/screens/AddCourseScreen";

export type SemestersStackParamList = {
  Semesters: undefined;
  SemesterDetail: { semesterId: string };
  CourseDetail: { semesterId: string; courseId: string };
  AddSemester: undefined;
  AddCourse: { semesterId: string };
};

const Stack = createNativeStackNavigator<SemestersStackParamList>();

export default function SemestersStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions({ theme, isDark })}>
      <Stack.Screen
        name="Semesters"
        component={SemestersScreen}
        options={{ title: "Student Atlas" }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="SemesterDetail"
          component={SemesterDetailScreen}
          options={{ headerTransparent: false }}
        />
        <Stack.Screen
          name="CourseDetail"
          component={CourseDetailScreen}
          options={{ headerTransparent: false }}
        />
        <Stack.Screen
          name="AddSemester"
          component={AddSemesterScreen}
          options={{ title: "New Semester", headerTransparent: false }}
        />
        <Stack.Screen
          name="AddCourse"
          component={AddCourseScreen}
          options={{ title: "Add Course", headerTransparent: false }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
