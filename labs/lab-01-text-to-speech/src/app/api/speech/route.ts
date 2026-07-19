import { randomUUID } from "node:crypto";

import { AppError, errorResponse, normalizeError } from "@/lib/errors";
import { logVoiceRequest } from "@/lib/observability";
import { getOpenAIClient } from "@/lib/openai";
import { guardApiRequest, rateLimitHeaders } from "@/lib/request-guard";
import { speechRequestSchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_JSON_BYTES = 16 * 1024;
const CONTENT_TYPES = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  opus: "audio/ogg; codecs=opus",
} as const;

export async function POST(request: Request): Promise<Response> {
  const requestId = randomUUID();
  const startedAt = performance.now();
  let responseHeaders: Record<string, string> = {};

  try {
    const rateLimit = guardApiRequest(request, "speech");
    responseHeaders = rateLimitHeaders(rateLimit);
    assertJsonSize(request);

    const payload = speechRequestSchema.parse(await request.json());
    const openai = getOpenAIClient();
    const speech = await openai.audio.speech.create(
      {
        model: "gpt-4o-mini-tts",
        input: payload.text,
        voice: payload.voice,
        ...(payload.instructions ? { instructions: payload.instructions } : {}),
        response_format: payload.format,
        speed: payload.speed,
        stream_format: "audio",
      },
      { signal: request.signal },
    );

    if (!speech.body) {
      throw new AppError(502, "empty_audio_stream", "OpenAI returned an empty audio stream.");
    }

    const upstreamHeadersMs = Math.round(performance.now() - startedAt);
    logVoiceRequest("info", {
      event: "speech.stream_started",
      requestId,
      route: "speech",
      durationMs: upstreamHeadersMs,
      status: 200,
      model: "gpt-4o-mini-tts",
      inputSize: payload.text.length,
    });

    return new Response(speech.body, {
      status: 200,
      headers: {
        ...responseHeaders,
        "Cache-Control": "no-store",
        "Content-Disposition": `inline; filename="voice-${requestId}.${payload.format}"`,
        "Content-Type": CONTENT_TYPES[payload.format],
        "Server-Timing": `openai;dur=${upstreamHeadersMs}`,
        "X-Model": "gpt-4o-mini-tts",
        "X-Request-Id": requestId,
      },
    });
  } catch (error) {
    const normalized = normalizeError(error);
    logVoiceRequest("error", {
      event: "speech.failed",
      requestId,
      route: "speech",
      durationMs: Math.round(performance.now() - startedAt),
      status: normalized.status,
    });
    return errorResponse(normalized, requestId, responseHeaders);
  }
}

function assertJsonSize(request: Request): void {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_JSON_BYTES) {
    throw new AppError(413, "request_too_large", "The speech request is too large.");
  }
}
