import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Lab 01 · Starter",
  description: "Starter project for the OpenAI text-to-speech workshop.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
