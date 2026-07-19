import {
  CLIENT_SECRET_TTL_SECONDS,
  MAX_CONVERSATION_GOAL_CHARACTERS,
  REALTIME_MODEL,
  REALTIME_SESSION_LIMIT_SECONDS,
  REALTIME_VOICE_IDS,
} from "@/lib/constants";
import { getSecurityConfiguration } from "@/lib/security-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(): Response {
  const security = getSecurityConfiguration();
  const configurationIssues = [
    ...(!process.env.OPENAI_API_KEY ? ["OPENAI_API_KEY"] : []),
    ...security.missingVariables,
  ];

  return Response.json(
    {
      ok: true,
      service: "openai-voice-lab-02-realtime-agent",
      configured: configurationIssues.length === 0,
      configurationIssues,
      requiresAccessToken: security.requiresAccessToken,
      distributedRateLimit: security.distributedRateLimit,
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
