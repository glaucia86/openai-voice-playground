export const runtime = "nodejs";

export function GET(): Response {
  return Response.json(
    {
      ok: true,
      lab: "lab-01-text-to-speech",
      stage: "starter",
      integrationReady: false,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
