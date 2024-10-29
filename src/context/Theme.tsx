import React, { ReactNode, createContext, useState } from "react";
import useThemeDetector from "../hooks/themeDetector";

type Props = {
  children: ReactNode;
};

export type themeType = "dark" | "light";
export type systemThemeType = themeType | "system";

type contextType = {
  theme: themeType;
  setTheme: React.Dispatch<React.SetStateAction<themeType>>;
};

const ThemeContext = createContext<contextType | null>(null);
export default ThemeContext;

export function ThemeProvider({ children }: Props) {
  const isDarkTheme = useThemeDetector();

  const [theme, setTheme] = useState<themeType>(() => {
    const theme = localStorage.getItem("theme") as systemThemeType;
    const systemTheme = isDarkTheme ? "dark" : "light";
    if (theme) {
      document.body.classList.add(theme === "system" ? systemTheme : theme);
      return theme === "system" ? systemTheme : theme;
    } else {
      localStorage.setItem("theme", "system");
      document.body.classList.add(systemTheme);
      return systemTheme;
    }
  });

  const context: contextType = {
    theme,
    setTheme,
  };
  return (
    <ThemeContext.Provider value={context}>{children}</ThemeContext.Provider>
  );
}
