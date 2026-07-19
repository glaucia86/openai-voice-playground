import { fileURLToPath } from "node:url";

const isProduction = process.env.NODE_ENV === "production";
const sourceDirectory = fileURLToPath(new URL("./src", import.meta.url));

const securityHeaders = [
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  ...(isProduction
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000" }]
    : []),
];

/** @type {import("next").NextConfig} */
const nextConfig = {
  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
  poweredByHeader: false,
  reactStrictMode: true,
  // Next 15's embedded checker cannot load TypeScript 7. `npm run typecheck`
  // remains a required, separate gate before every build in `npm run check` and CI.
  typescript: {
    ignoreBuildErrors: true,
  },
  // Oxlint runs as a separate required gate. Next 15's embedded lint path also
  // attempts to replace TypeScript 7 with 5.8, so the duplicate pass is skipped.
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    // Next 15 does not read TS 7's path mapping correctly during bundling.
    config.resolve.alias["@"] = sourceDirectory;
    return config;
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
