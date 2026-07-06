"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider, useAtomValue, useSetAtom } from "jotai";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

import i18n from "@/i18n/client";
import { isSupportedLanguage, languageAtom } from "@/core/state/preferences";

function LanguageBootstrap({ children }: { children: React.ReactNode }) {
  const language = useAtomValue(languageAtom);
  const setLanguage = useSetAtom(languageAtom);

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem("language");

    if (isSupportedLanguage(storedLanguage)) {
      setLanguage(storedLanguage);
    }
  }, [setLanguage]);

  useEffect(() => {
    void i18n.changeLanguage(language);
  }, [language]);

  return children;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 30_000,
          },
        },
      }),
  );

  return (
    <JotaiProvider>
      <LanguageBootstrap>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </LanguageBootstrap>
    </JotaiProvider>
  );
}
