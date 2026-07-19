import { MAX_SPEECH_CHARACTERS } from "@/lib/constants";
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
      service: "openai-voice-lab-01-text-to-speech",
      configured: configurationIssues.length === 0,
      configurationIssues,
      requiresAccessToken: security.requiresAccessToken,
      distributedRateLimit: security.distributedRateLimit,
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
