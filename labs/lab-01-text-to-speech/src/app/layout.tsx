import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/manrope";
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://openai-voice-playground.vercel.app"),
  title: {
    default: "Lab 01 · OpenAI Text to Speech",
    template: "%s · OpenAI Voice Labs",
  },
  description:
    "A production-minded workshop for building OpenAI text-to-speech applications with Next.js.",
  applicationName: "OpenAI Voice Labs · Lab 01",
  authors: [{ name: "Glaucia Lemos", url: "https://github.com/glaucia86" }],
  keywords: ["OpenAI", "voice", "text to speech", "TTS", "Next.js", "TypeScript"],
  openGraph: {
    title: "Lab 01 · OpenAI Text to Speech",
    description: "Build a responsible, production-minded text-to-speech experience with OpenAI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lab 01 · OpenAI Text to Speech",
    description: "Build a responsible, production-minded text-to-speech experience with OpenAI.",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#070b12",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await headers();
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
