import { randomUUID } from "node:crypto";

import {
  MAX_AUDIO_BYTES,
  type TranscriptionModel,
} from "@/lib/constants";
import { AppError, errorResponse, normalizeError } from "@/lib/errors";
import { logVoiceRequest } from "@/lib/observability";
import { getOpenAIClient } from "@/lib/openai";
import { guardApiRequest, rateLimitHeaders } from "@/lib/request-guard";
import { transcriptionFieldsSchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_MULTIPART_BYTES = MAX_AUDIO_BYTES + 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set([
  "flac",
  "m4a",
  "mp3",
  "mp4",
  "mpeg",
  "mpga",
  "ogg",
  "wav",
  "webm",
]);
const ALLOWED_MIME_TYPES = new Set([
  "audio/aac",
  "audio/flac",
  "audio/m4a",
  "audio/mp4",
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
  "audio/webm",
  "audio/x-m4a",
  "audio/x-wav",
  "video/mp4",
  "video/webm",
]);

export async function POST(request: Request): Promise<Response> {
  const requestId = randomUUID();
  const startedAt = performance.now();
  let responseHeaders: Record<string, string> = {};

  try {
    const rateLimit = guardApiRequest(request, "transcribe");
    responseHeaders = rateLimitHeaders(rateLimit);
    assertMultipartSize(request);

    const formData = await request.formData();
    const file = formData.get("audio");

    if (!(file instanceof File)) {
      throw new AppError(400, "audio_required", "Select or record an audio file first.");
    }

    assertAudioFile(file);

    const fields = transcriptionFieldsSchema.parse({
      model: formData.get("model") ?? undefined,
      language: formData.get("language") ?? "",
      prompt: formData.get("prompt") ?? "",
    });

    const openai = getOpenAIClient();
    const transcription = await openai.audio.transcriptions.create(
      {
        file,
        model: fields.model as TranscriptionModel,
        response_format: "json",
        ...(fields.language ? { language: fields.language } : {}),
        ...(fields.prompt ? { prompt: fields.prompt } : {}),
      },
      { signal: request.signal },
    );

    const durationMs = Math.round(performance.now() - startedAt);
    logVoiceRequest("info", {
      event: "transcription.completed",
      requestId,
      route: "transcribe",
      durationMs,
      status: 200,
      model: fields.model,
      inputSize: file.size,
      outputSize: transcription.text.length,
    });

    return Response.json(
      {
        text: transcription.text,
        meta: {
          requestId,
          model: fields.model,
          durationMs,
          audioBytes: file.size,
        },
      },
      {
        headers: {
          ...responseHeaders,
          "Cache-Control": "no-store",
          "Server-Timing": `openai;dur=${durationMs}`,
          "X-Model": fields.model,
          "X-Request-Id": requestId,
        },
      },
    );
  } catch (error) {
    const normalized = normalizeError(error);
    logVoiceRequest("error", {
      event: "transcription.failed",
      requestId,
      route: "transcribe",
      durationMs: Math.round(performance.now() - startedAt),
      status: normalized.status,
    });
    return errorResponse(normalized, requestId, responseHeaders);
  }
}

function assertMultipartSize(request: Request): void {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_MULTIPART_BYTES) {
    throw new AppError(413, "audio_too_large", "Audio files must be 25 MB or smaller.");
  }
}

function assertAudioFile(file: File): void {
  if (file.size === 0) {
    throw new AppError(400, "empty_audio", "The selected audio file is empty.");
  }

  if (file.size > MAX_AUDIO_BYTES) {
    throw new AppError(413, "audio_too_large", "Audio files must be 25 MB or smaller.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const hasAllowedType = file.type ? ALLOWED_MIME_TYPES.has(file.type) : false;
  const hasAllowedExtension = ALLOWED_EXTENSIONS.has(extension);

  if (!hasAllowedType && !hasAllowedExtension) {
    throw new AppError(
      415,
      "unsupported_audio",
      "Use MP3, MP4, M4A, MPEG, MPGA, WAV, WebM, OGG, or FLAC audio.",
    );
  }
}
