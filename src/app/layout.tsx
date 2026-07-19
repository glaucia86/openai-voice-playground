import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/manrope";
import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://openai-voice-playground.vercel.app"),
  title: {
    default: "OpenAI Voice Playground",
    template: "%s · OpenAI Voice Playground",
  },
  description:
    "A production-minded, educational playground for OpenAI speech generation and transcription APIs.",
  applicationName: "OpenAI Voice Playground",
  authors: [{ name: "Glaucia Lemos", url: "https://github.com/glaucia86" }],
  keywords: ["OpenAI", "voice", "text to speech", "speech to text", "Next.js", "TypeScript"],
  openGraph: {
    title: "OpenAI Voice Playground",
    description: "Learn to build responsible, production-minded voice experiences with OpenAI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenAI Voice Playground",
    description: "Learn to build responsible, production-minded voice experiences with OpenAI.",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#070b12",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
