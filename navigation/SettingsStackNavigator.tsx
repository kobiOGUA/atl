import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "./screenOptions";

import SettingsScreen from "@/screens/SettingsScreen";
import AccountScreen from "@/screens/AccountScreen";
import AboutScreen from "@/screens/AboutScreen";

export type SettingsStackParamList = {
  Settings: undefined;
  Account: undefined;
  About: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions({ theme, isDark })}>
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={{ title: "Account", headerTransparent: false }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: "About", headerTransparent: false }}
      />
    </Stack.Navigator>
  );
}
