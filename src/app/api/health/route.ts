import {
  MAX_AUDIO_BYTES,
  MAX_SPEECH_CHARACTERS,
  TRANSCRIPTION_MODELS,
} from "@/lib/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(): Response {
  return Response.json(
    {
      ok: true,
      service: "openai-voice-playground",
      configured: Boolean(process.env.OPENAI_API_KEY),
      requiresAccessToken: Boolean(process.env.PLAYGROUND_ACCESS_TOKEN?.trim()),
      capabilities: {
        speechModel: "gpt-4o-mini-tts",
        transcriptionModels: TRANSCRIPTION_MODELS,
        streamedSpeech: true,
      },
      limits: {
        speechCharacters: MAX_SPEECH_CHARACTERS,
        audioBytes: MAX_AUDIO_BYTES,
        requestsPerMinute: 10,
      },
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
