"use client";

import { useEffect, useSyncExternalStore } from "react";

export type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const storageKey = "theme";
const themeChangeEvent = "themechange";

function isValidTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readTheme(): Theme {
  if (typeof window === "undefined") {
    return "system";
  }

  const storedTheme = window.localStorage.getItem(storageKey);
  return isValidTheme(storedTheme) ? storedTheme : "system";
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey) {
      callback();
    }
  };
  const onThemeChange = () => callback();
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const onMediaChange = () => callback();

  window.addEventListener("storage", onStorage);
  window.addEventListener(themeChangeEvent, onThemeChange);
  mediaQuery.addEventListener("change", onMediaChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(themeChangeEvent, onThemeChange);
    mediaQuery.removeEventListener("change", onMediaChange);
  };
}

function applyThemeToDocument(theme: Theme) {
  if (typeof document === "undefined") {
    return;
  }

  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  document.documentElement.style.colorScheme = resolvedTheme;
}

function emitThemeChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(themeChangeEvent));
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore<Theme>(subscribe, readTheme, (): Theme => "system");

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  return <>{children}</>;
}

export function useTheme() {
  const theme = useSyncExternalStore<Theme>(subscribe, readTheme, (): Theme => "system");
  const systemTheme = useSyncExternalStore<ResolvedTheme>(
    subscribe,
    getSystemTheme,
    (): ResolvedTheme => "light",
  );
  const resolvedTheme = theme === "system" ? systemTheme : theme;

  const setTheme = (nextTheme: Theme) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, nextTheme);
      applyThemeToDocument(nextTheme);
      emitThemeChange();
    }
  };

  return {
    resolvedTheme,
    setTheme,
    theme,
  };
}
