import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "./screenOptions";

import GPAScreen from "@/screens/GPAScreen";
import AnalyticsDashboardScreen from "@/screens/AnalyticsDashboardScreen";

export type GPAStackParamList = {
  GPA: undefined;
};

const Stack = createNativeStackNavigator<GPAStackParamList>();

export default function GPAStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions({ theme, isDark })}>
      <Stack.Screen
        name="GPA"
        component={GPAScreen}
        options={{ title: "My GPA" }}
      />
      <Stack.Screen
        name="AnalyticsDashboard"
        component={AnalyticsDashboardScreen}
        options={{ title: "Analytics Dashboard" }}
      />
    </Stack.Navigator>
  );
}
