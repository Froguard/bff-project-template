import type { Metadata } from "next";
import "driver.js/dist/driver.css";
import "./globals.css";

import { AppProviders } from "@/app/providers";

const gitCommitSha = process.env.NEXT_PUBLIC_GIT_COMMIT_SHA ?? "unknown";

export const metadata: Metadata = {
  title: "bff-project-template",
  description: "A frontend template for BFF projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta httpEquiv="etag" content={gitCommitSha} />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
