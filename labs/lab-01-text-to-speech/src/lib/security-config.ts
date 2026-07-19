export type SecurityConfiguration = {
  isProduction: boolean;
  ready: boolean;
  missingVariables: string[];
  clientIpHeader: string;
  distributedRateLimit: boolean;
  requiresAccessToken: boolean;
};

type RuntimeEnvironment = Record<string, string | undefined>;

const HEADER_NAME_PATTERN = /^[a-z0-9-]+$/;
const FORBIDDEN_IDENTITY_HEADERS = new Set([
  "authorization",
  "cookie",
  "proxy-authorization",
]);

export function getSecurityConfiguration(
  environment: RuntimeEnvironment = process.env,
): SecurityConfiguration {
  const isProduction = environment.NODE_ENV === "production";
  const accessToken = environment.PLAYGROUND_ACCESS_TOKEN?.trim();
  const redisUrl = environment.UPSTASH_REDIS_REST_URL?.trim();
  const redisToken = environment.UPSTASH_REDIS_REST_TOKEN?.trim();
  const configuredHeader = environment.CLIENT_IP_HEADER?.trim().toLowerCase();
  const clientIpHeader = configuredHeader || (environment.VERCEL ? "x-vercel-forwarded-for" : "");
  const validClientIpHeader = Boolean(
    clientIpHeader &&
      HEADER_NAME_PATTERN.test(clientIpHeader) &&
      !FORBIDDEN_IDENTITY_HEADERS.has(clientIpHeader),
  );

  const missingVariables: string[] = [];
  if (isProduction) {
    if (!accessToken) missingVariables.push("PLAYGROUND_ACCESS_TOKEN");
    if (!environment.APP_ORIGIN?.trim()) missingVariables.push("APP_ORIGIN");
    if (!redisUrl) missingVariables.push("UPSTASH_REDIS_REST_URL");
    if (!redisToken) missingVariables.push("UPSTASH_REDIS_REST_TOKEN");
    if (!validClientIpHeader) missingVariables.push("CLIENT_IP_HEADER");
  }

  return {
    isProduction,
    ready: missingVariables.length === 0,
    missingVariables,
    clientIpHeader: validClientIpHeader ? clientIpHeader : "x-forwarded-for",
    distributedRateLimit: Boolean(redisUrl && redisToken),
    requiresAccessToken: Boolean(accessToken) || isProduction,
  };
}
