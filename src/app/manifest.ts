import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OpenAI Voice Playground",
    short_name: "Voice Playground",
    description: "Learn production-minded voice engineering with OpenAI.",
    start_url: "/",
    display: "standalone",
    background_color: "#070b12",
    theme_color: "#070b12",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
