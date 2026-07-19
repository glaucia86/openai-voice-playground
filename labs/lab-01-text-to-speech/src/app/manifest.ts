import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OpenAI Voice Labs · Lab 01 Text to Speech",
    short_name: "Voice Lab 01",
    description: "Learn production-minded OpenAI text-to-speech engineering.",
    start_url: "/",
    display: "standalone",
    background_color: "#070b12",
    theme_color: "#070b12",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
