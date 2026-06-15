"use client";
import { createContext, useCallback, useContext, useRef, useState } from "react";
import { themes, resolveThemeVars, THEME_STORAGE_KEY } from "@/lib/themes";

type WipeFn = (accentColor: string, onMidpoint: () => void) => void;

interface ThemeContextValue {
  themeIndex: number;
  cycleTheme: () => void;
  registerWipe: (fn: WipeFn) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

function readInitialIndex(): number {
  if (typeof document === "undefined") return 0;
  const idx = parseInt(
    document.documentElement.getAttribute("data-theme-index") ?? "0",
    10,
  );
  return isNaN(idx) ? 0 : idx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeIndex, setThemeIndex] = useState(readInitialIndex);
  const wipeFnRef = useRef<WipeFn | null>(null);

  const applyVars = useCallback((index: number) => {
    const vars = resolveThemeVars(themes[index]);
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
    root.setAttribute("data-theme-index", String(index));
  }, []);

  const cycleTheme = useCallback(() => {
    const total = themes.length;
    let current = 0;
    try {
      const stored = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) ?? "null");
      if (stored !== null && typeof stored.index === "number") current = stored.index;
    } catch {}

    const nextThemeIdx = (current + 1) % total;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ index: nextThemeIdx }));
    } catch {}

    const incomingAccent = themes[nextThemeIdx].colors[2];

    if (wipeFnRef.current) {
      wipeFnRef.current(incomingAccent, () => {
        applyVars(nextThemeIdx);
        setThemeIndex(nextThemeIdx);
      });
    } else {
      applyVars(nextThemeIdx);
      setThemeIndex(nextThemeIdx);
    }
  }, [applyVars]);

  const registerWipe = useCallback((fn: WipeFn) => {
    wipeFnRef.current = fn;
  }, []);

  return (
    <ThemeContext.Provider value={{ themeIndex, cycleTheme, registerWipe }}>
      {children}
    </ThemeContext.Provider>
  );
}
