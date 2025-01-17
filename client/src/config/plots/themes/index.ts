import { darkTheme } from "./dark";
import { lightTheme } from "./light";

export const themes = {
  dark: darkTheme,
  light: lightTheme
} as const;

export type ThemeType = keyof typeof themes;

export * from "./dark";
export * from "./light";
