import { randomUUID } from "node:crypto";

import {
  CLIENT_SECRET_TTL_SECONDS,
  MAX_REALTIME_REQUEST_BYTES,
  REALTIME_MODEL,
  REALTIME_TRANSCRIPTION_MODEL,
} from "@/lib/constants";
import { AppError, errorResponse, normalizeError } from "@/lib/errors";
import { logVoiceRequest } from "@/lib/observability";
import { getOpenAIClient } from "@/lib/openai";
import { buildAgentInstructions } from "@/lib/realtime-config";
import { guardApiRequest, rateLimitHeaders } from "@/lib/request-guard";
import { realtimeSessionRequestSchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request): Promise<Response> {
  const requestId = randomUUID();
  const startedAt = performance.now();
  let responseHeaders: Record<string, string> = {};

  try {
    const rateLimit = guardApiRequest(request, "realtime-token");
    responseHeaders = rateLimitHeaders(rateLimit);
    assertRequestSize(request);

    const payload = realtimeSessionRequestSchema.parse(await request.json());
    const openai = getOpenAIClient();
    const clientSecret = await openai.realtime.clientSecrets.create(
      {
        expires_after: {
          anchor: "created_at",
          seconds: CLIENT_SECRET_TTL_SECONDS,
        },
        session: {
          type: "realtime",
          model: REALTIME_MODEL,
          output_modalities: ["audio"],
          instructions: buildAgentInstructions(payload),
          max_output_tokens: 1_024,
          reasoning: { effort: "low" },
          tracing: null,
          audio: {
            input: {
              noise_reduction: { type: payload.microphoneProfile },
              transcription: {
                model: REALTIME_TRANSCRIPTION_MODEL,
                language: payload.language,
              },
              turn_detection: {
                type: "semantic_vad",
                eagerness: "auto",
                create_response: true,
                interrupt_response: true,
              },
            },
            output: { voice: payload.voice },
          },
        },
      },
      { signal: request.signal },
    );

    const durationMs = Math.round(performance.now() - startedAt);
    logVoiceRequest("info", {
      event: "realtime.client_secret_created",
      requestId,
      route: "realtime-token",
      durationMs,
      status: 200,
      model: REALTIME_MODEL,
    });

    return Response.json(
      {
        clientSecret: clientSecret.value,
        expiresAt: clientSecret.expires_at,
        session: {
          model: REALTIME_MODEL,
          voice: payload.voice,
          transport: "webrtc",
        },
      },
      {
        headers: {
          ...responseHeaders,
          "Cache-Control": "no-store, private",
          "Pragma": "no-cache",
          "Server-Timing": `openai;dur=${durationMs}`,
          "X-Request-Id": requestId,
        },
      },
    );
  } catch (error) {
    const normalized = normalizeError(error);
    logVoiceRequest("error", {
      event: "realtime.client_secret_failed",
      requestId,
      route: "realtime-token",
      durationMs: Math.round(performance.now() - startedAt),
      status: normalized.status,
    });
    return errorResponse(normalized, requestId, responseHeaders);
  }
}

function assertRequestSize(request: Request): void {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REALTIME_REQUEST_BYTES) {
    throw new AppError(413, "request_too_large", "The Realtime session request is too large.");
  }
}
