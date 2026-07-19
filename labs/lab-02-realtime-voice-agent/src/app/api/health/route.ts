export const runtime = "nodejs";

export function GET(): Response {
  return Response.json(
    {
      ok: true,
      lab: "lab-02-realtime-voice-agent",
      stage: "starter",
      integrationReady: false,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
