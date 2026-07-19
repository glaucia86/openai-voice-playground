import {
  CLIENT_SECRET_TTL_SECONDS,
  MAX_CONVERSATION_GOAL_CHARACTERS,
  REALTIME_MODEL,
  REALTIME_SESSION_LIMIT_SECONDS,
  REALTIME_VOICE_IDS,
} from "@/lib/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(): Response {
  return Response.json(
    {
      ok: true,
      service: "openai-voice-lab-02-realtime-agent",
      configured: Boolean(process.env.OPENAI_API_KEY),
      requiresAccessToken: Boolean(process.env.PLAYGROUND_ACCESS_TOKEN?.trim()),
      capabilities: {
        model: REALTIME_MODEL,
        transport: "webrtc",
        voices: REALTIME_VOICE_IDS,
        ephemeralClientSecrets: true,
        semanticTurnDetection: true,
      },
      limits: {
        conversationGoalCharacters: MAX_CONVERSATION_GOAL_CHARACTERS,
        clientSecretTtlSeconds: CLIENT_SECRET_TTL_SECONDS,
        sessionSeconds: REALTIME_SESSION_LIMIT_SECONDS,
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
