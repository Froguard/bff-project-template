import type { Metadata } from "next";
import "driver.js/dist/driver.css";
import "./globals.css";

import { AppProviders } from "@/app/providers";

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
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
