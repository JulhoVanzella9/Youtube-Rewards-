"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function readInitialTheme(): Theme {
  if (typeof document === "undefined") return "light";
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || attr === "light") return attr;
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    // ignore
  }
  return "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => readInitialTheme());

  const applyTheme = (newTheme: Theme) => {
    // Apply to document
    document.documentElement.setAttribute("data-theme", newTheme);
    document.body.setAttribute("data-theme", newTheme);
    document.documentElement.style.colorScheme = newTheme;
    
    // Update meta theme color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", newTheme === "dark" ? "#0F0F0F" : "#FFFFFF");
    }

    // Clear any forced inline overrides (CSS variables control visuals)
    document.body.style.backgroundColor = "";
    document.body.style.color = "";
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
    
    // Dispatch event for components that need to know
    window.dispatchEvent(new CustomEvent("themeChange", { detail: { theme: newTheme } }));
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  // Ensure theme is applied once on mount (sync with pre-init script)
  useEffect(() => {
    // If RootLayout script set a pending body theme before body existed
    const pending = document.documentElement.getAttribute("data-theme-pending-body");
    if (pending === "dark" || pending === "light") {
      document.body.setAttribute("data-theme", pending);
      document.documentElement.removeAttribute("data-theme-pending-body");
    }

    applyTheme(theme);

    const onStorage = (e: StorageEvent) => {
      if (e.key !== "theme") return;
      const next = e.newValue;
      if (next === "dark" || next === "light") {
        setThemeState(next);
        applyTheme(next);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
