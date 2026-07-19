import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/manrope";
import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://openai-voice-playground.vercel.app"),
  title: {
    default: "Lab 02 · OpenAI Realtime Voice Agent",
    template: "%s · OpenAI Voice Labs",
  },
  description:
    "Build a production-minded live conversational voice agent with OpenAI Realtime, WebRTC, and the Agents SDK.",
  applicationName: "OpenAI Voice Labs · Lab 02",
  authors: [{ name: "Glaucia Lemos", url: "https://github.com/glaucia86" }],
  keywords: ["OpenAI", "voice agent", "Realtime API", "WebRTC", "Agents SDK", "Next.js", "TypeScript"],
  openGraph: {
    title: "Lab 02 · OpenAI Realtime Voice Agent",
    description: "Learn to build a responsible, production-minded live voice agent with OpenAI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lab 02 · OpenAI Realtime Voice Agent",
    description: "Learn to build a responsible, production-minded live voice agent with OpenAI.",
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
