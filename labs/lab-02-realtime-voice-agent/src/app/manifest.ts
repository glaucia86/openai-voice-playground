import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OpenAI Voice Labs · Lab 02 Realtime Voice Agent",
    short_name: "Voice Lab 02",
    description: "Learn production-minded Realtime voice-agent engineering with OpenAI.",
    start_url: "/",
    display: "standalone",
    background_color: "#070b12",
    theme_color: "#070b12",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
