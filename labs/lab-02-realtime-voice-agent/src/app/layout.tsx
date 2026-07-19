import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Lab 02 · Starter",
  description: "Starter project for the OpenAI Realtime Voice Agent workshop.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
