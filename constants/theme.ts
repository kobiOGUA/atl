import { Platform } from "react-native";

export type ThemeName = 'defaultDark' | 'dark' | 'blue' | 'lightPink' | 'light';

export const Colors = {
  defaultDark: {
    text: "#FFFFFF",
    textSecondary: "#B3B3B3",
    buttonText: "#FFFFFF",
    tabIconDefault: "#B3B3B3",
    tabIconSelected: "#BB86FC",
    link: "#BB86FC",
    primary: "#BB86FC",
    backgroundRoot: "#121212",
    backgroundDefault: "#1E1E1E",
    backgroundSecondary: "#2A2A2A",
    backgroundTertiary: "#353535",
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
    border: "#333333",
  },
  dark: {
    text: "#FFFFFF",
    textSecondary: "#8E8E93",
    buttonText: "#FFFFFF",
    tabIconDefault: "#8E8E93",
    tabIconSelected: "#0A84FF",
    link: "#0A84FF",
    primary: "#0A84FF",
    backgroundRoot: "#000000",
    backgroundDefault: "#1C1C1C",
    backgroundSecondary: "#2A2A2A",
    backgroundTertiary: "#353535",
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
    border: "#2C2C2E",
  },
  blue: {
    text: "#1A237E",
    textSecondary: "#5C6BC0",
    buttonText: "#FFFFFF",
    tabIconDefault: "#5C6BC0",
    tabIconSelected: "#2196F3",
    link: "#2196F3",
    primary: "#2196F3",
    backgroundRoot: "#E3F2FD",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#F5F5F5",
    backgroundTertiary: "#E3F2FD",
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
    border: "#BBDEFB",
  },
  lightPink: {
    text: "#880E4F",
    textSecondary: "#AD1457",
    buttonText: "#FFFFFF",
    tabIconDefault: "#AD1457",
    tabIconSelected: "#E91E63",
    link: "#E91E63",
    primary: "#E91E63",
    backgroundRoot: "#FCE4EC",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#F8BBD0",
    backgroundTertiary: "#FCE4EC",
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
    border: "#F48FB1",
  },
  light: {
    text: "#000000",
    textSecondary: "#666666",
    buttonText: "#FFFFFF",
    tabIconDefault: "#666666",
    tabIconSelected: "#6200EE",
    link: "#6200EE",
    primary: "#6200EE",
    backgroundRoot: "#FFFFFF",
    backgroundDefault: "#F5F5F5",
    backgroundSecondary: "#EEEEEE",
    backgroundTertiary: "#E0E0E0",
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
    border: "#E0E0E0",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
