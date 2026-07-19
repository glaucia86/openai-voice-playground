import { MAX_SPEECH_CHARACTERS } from "@/lib/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(): Response {
  return Response.json(
    {
      ok: true,
      service: "openai-voice-lab-01-text-to-speech",
      configured: Boolean(process.env.OPENAI_API_KEY),
      requiresAccessToken: Boolean(process.env.PLAYGROUND_ACCESS_TOKEN?.trim()),
      capabilities: {
        speechModel: "gpt-4o-mini-tts",
        streamedSpeech: true,
      },
      limits: {
        speechCharacters: MAX_SPEECH_CHARACTERS,
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
