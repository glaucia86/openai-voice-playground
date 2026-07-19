import { createHash, timingSafeEqual } from "node:crypto";

import { AppError } from "@/lib/errors";
import {
  checkRateLimit,
  rateLimitHeaders,
  type RateLimitResult,
} from "@/lib/rate-limit";
import { getSecurityConfiguration } from "@/lib/security-config";

const AUTH_ATTEMPTS_PER_MINUTE = 30;
const REQUESTS_PER_MINUTE = 10;
const WINDOW_MS = 60_000;

export async function guardApiRequest(
  request: Request,
  scope: string,
): Promise<RateLimitResult> {
  const security = getSecurityConfiguration();
  if (!security.ready) {
    throw new AppError(
      503,
      "security_configuration_incomplete",
      "The service security configuration is incomplete.",
    );
  }

  assertSameOrigin(request);
  const clientKey = hashIdentifier(getClientAddress(request, security.clientIpHeader));
  const authenticationLimit = await applyRateLimit(
    `authentication:${clientKey}`,
    AUTH_ATTEMPTS_PER_MINUTE,
  );
  assertAccessToken(request, rateLimitHeaders(authenticationLimit));

  return applyRateLimit(`${scope}:${clientKey}`, REQUESTS_PER_MINUTE);
}

export { rateLimitHeaders };

async function applyRateLimit(key: string, limit: number): Promise<RateLimitResult> {
  let result: RateLimitResult;
  try {
    result = await checkRateLimit(key, { limit, windowMs: WINDOW_MS });
  } catch {
    throw new AppError(
      503,
      "rate_limiter_unavailable",
      "The service cannot safely verify request quota right now. Please try again.",
    );
  }

  if (!result.allowed) {
    throw new AppError(
      429,
      "rate_limit_exceeded",
      "Too many requests. Please wait a moment and try again.",
      rateLimitHeaders(result),
    );
  }
  return result;
}

function assertSameOrigin(request: Request): void {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") {
    throw new AppError(403, "cross_origin_request", "Cross-origin requests are blocked.");
  }

  const origin = request.headers.get("origin");
  if (!origin) return;

  const expectedOrigin = process.env.APP_ORIGIN || new URL(request.url).origin;

  try {
    if (new URL(origin).origin !== new URL(expectedOrigin).origin) {
      throw new AppError(
        403,
        "cross_origin_request",
        "Cross-origin requests are blocked.",
      );
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(403, "invalid_origin", "The request origin is invalid.");
  }
}

function assertAccessToken(request: Request, headers: Record<string, string>): void {
  const expected = process.env.PLAYGROUND_ACCESS_TOKEN?.trim();
  if (!expected) return;

  const authorization = request.headers.get("authorization");
  const received = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";

  if (!safeEqual(received, expected)) {
    throw new AppError(
      401,
      "unauthorized",
      "A valid playground access token is required.",
      headers,
    );
  }
}

function safeEqual(received: string, expected: string): boolean {
  const receivedDigest = createHash("sha256").update(received).digest();
  const expectedDigest = createHash("sha256").update(expected).digest();
  return timingSafeEqual(receivedDigest, expectedDigest);
}

function getClientAddress(request: Request, headerName: string): string {
  const address = request.headers.get(headerName)?.split(",")[0]?.trim();
  return address?.slice(0, 256) || "unidentified-client";
}

function hashIdentifier(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}
