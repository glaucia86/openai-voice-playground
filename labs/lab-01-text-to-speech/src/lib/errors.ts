import OpenAI from "openai";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

type ErrorBody = {
  error: {
    code: string;
    message: string;
    requestId: string;
  };
};

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  if (error instanceof ZodError) {
    return new AppError(
      400,
      "invalid_request",
      error.issues[0]?.message ?? "The request is invalid.",
    );
  }

  if (error instanceof SyntaxError) {
    return new AppError(400, "invalid_json", "The request body is not valid JSON.");
  }

  if (error instanceof OpenAI.APIError) {
    if (error.status === 429) {
      return new AppError(
        429,
        "upstream_rate_limit",
        "The voice service is busy. Please try again shortly.",
      );
    }

    if (error.status === 401 || error.status === 403) {
      return new AppError(
        503,
        "upstream_authentication_error",
        "The voice service is temporarily unavailable.",
      );
    }

    return new AppError(
      502,
      "upstream_error",
      "OpenAI could not complete the request. Please try again.",
    );
  }

  if (error instanceof Error && error.name === "AbortError") {
    return new AppError(499, "request_cancelled", "The request was cancelled.");
  }

  return new AppError(500, "internal_error", "Something went wrong. Please try again.");
}

export function errorResponse(
  error: unknown,
  requestId: string,
  headers?: HeadersInit,
): Response {
  const normalized = normalizeError(error);
  const body: ErrorBody = {
    error: {
      code: normalized.code,
      message: normalized.message,
      requestId,
    },
  };

  return Response.json(body, {
    status: normalized.status,
    headers: {
      "Cache-Control": "no-store",
      "X-Request-Id": requestId,
      ...headers,
    },
  });
}
