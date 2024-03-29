import { createContext, useContext, useEffect, useState } from "react";

type Themes = "dark" | "light";

type ThemeContextValues = {
	theme: Themes;
	toggleTheme: () => void;
};

const DEFAULT_THEME = "light";
const THEME_KEY = "theme";

const ThemeContext = createContext<ThemeContextValues>({
  theme: DEFAULT_THEME,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeContextProvider = ({
  children,
}: {
	children: React.ReactNode;
}) => {
  const [theme, setTheme] = useState<Themes>(DEFAULT_THEME);
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    localStorage.setItem(THEME_KEY, newTheme);
    setTheme(newTheme);
  };

  useEffect(() => {
    setTheme((localStorage.getItem(THEME_KEY) ?? DEFAULT_THEME) as Themes);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
