import { act, render, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ThemeProvider, useTheme } from "@/core/theme";

function mockSystemTheme(matchesDark: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn().mockImplementation((query: string): MediaQueryList => {
      const mediaQueryList = {
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: matchesDark,
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      };

      return mediaQueryList as unknown as MediaQueryList;
    }),
    writable: true,
  });
}

describe("theme", () => {
  it("resolves the system theme when no explicit theme is stored", () => {
    mockSystemTheme(true);

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("system");
    expect(result.current.resolvedTheme).toBe("dark");
  });

  it("persists explicit theme changes and applies them to the document", () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme("dark");
    });

    expect(result.current.theme).toBe("dark");
    expect(result.current.resolvedTheme).toBe("dark");
    expect(window.localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });

  it("applies the stored theme through ThemeProvider", () => {
    window.localStorage.setItem("theme", "dark");

    render(
      <ThemeProvider>
        <div>content</div>
      </ThemeProvider>,
    );

    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });
});
