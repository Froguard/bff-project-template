import type { Metadata } from "next";
import "driver.js/dist/driver.css";
import "./globals.css";

import { AppProviders } from "@/app/providers";
import { ThemeInitializationScript } from "@/core/theme";

const gitCommitSha = process.env.NEXT_PUBLIC_GIT_COMMIT_SHA ?? "unknown";

export const metadata: Metadata = {
  title: "bff-project-template",
  description: "A frontend template for BFF projects.",
};

/** 渲染应用根布局并装配全局 Provider 与页面元数据。 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta httpEquiv="etag" content={gitCommitSha} />
        <ThemeInitializationScript />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
