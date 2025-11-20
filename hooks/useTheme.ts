import { Colors } from "@/constants/theme";
import { useThemeContext } from "@/contexts/ThemeContext";

export function useTheme() {
  const { theme: themeName } = useThemeContext();
  const theme = Colors[themeName];
  const isDark = themeName === 'defaultDark' || themeName === 'dark';

  return {
    theme,
    isDark,
    themeName,
  };
}
