"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  elderMode: boolean;
  toggleElderMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [elderMode, setElderMode] = useState(false);

  // On mount, respect saved preference (localStorage is safe here — this runs
  // in the user's real browser, not the Claude.ai artifact sandbox).
  useEffect(() => {
    const saved = window.localStorage.getItem("noor-theme") as Theme | null;
    const savedElder = window.localStorage.getItem("noor-elder-mode");
    if (saved) setTheme(saved);
    if (savedElder === "true") setElderMode(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("noor-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle("elder-mode", elderMode);
    window.localStorage.setItem("noor-elder-mode", String(elderMode));
  }, [elderMode]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
        elderMode,
        toggleElderMode: () => setElderMode((e) => !e),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
