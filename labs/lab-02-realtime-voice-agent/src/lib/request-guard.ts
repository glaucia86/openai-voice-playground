import { timingSafeEqual } from "node:crypto";

import { AppError } from "@/lib/errors";
import {
  checkRateLimit,
  rateLimitHeaders,
  type RateLimitResult,
} from "@/lib/rate-limit";

const REQUESTS_PER_MINUTE = 10;
const WINDOW_MS = 60_000;

export function guardApiRequest(request: Request, scope: string): RateLimitResult {
  assertSameOrigin(request);
  assertAccessToken(request);

  const result = checkRateLimit(`${scope}:${getClientAddress(request)}`, {
    limit: REQUESTS_PER_MINUTE,
    windowMs: WINDOW_MS,
  });

  if (!result.allowed) {
    throw new AppError(
      429,
      "rate_limit_exceeded",
      "Too many requests. Please wait a moment and try again.",
    );
  }

  return result;
}

export { rateLimitHeaders };

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

function assertAccessToken(request: Request): void {
  const expected = process.env.PLAYGROUND_ACCESS_TOKEN?.trim();
  if (!expected) return;

  const authorization = request.headers.get("authorization");
  const received = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";

  if (!safeEqual(received, expected)) {
    throw new AppError(401, "unauthorized", "A valid playground access token is required.");
  }
}

function safeEqual(received: string, expected: string): boolean {
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);

  return (
    receivedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(receivedBuffer, expectedBuffer)
  );
}

function getClientAddress(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "local";
}
