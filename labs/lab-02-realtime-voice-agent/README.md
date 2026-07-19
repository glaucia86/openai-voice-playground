# Lab 02 — OpenAI Realtime Voice Agent

Build a fluid, interruptible speech-to-speech conversational agent with Next.js 15, TypeScript 7, OpenAI Realtime, WebRTC, and the OpenAI Agents SDK.

[Versão em português](README-PT-BR.md) · [Detailed Portuguese workshop](tutorial/tutorial.md) · [Back to all labs](../../README.md)

## What this lab teaches

- why a live conversation is a stateful session rather than a chain of audio uploads;
- how a server Route Handler mints a short-lived Realtime client secret;
- how the browser uses WebRTC without receiving the standard OpenAI project key;
- how to model authorization, connection, listening, thinking, speaking, interruption, and failure;
- how semantic turn detection, mute, barge-in, text fallback, and explicit cleanup interact;
- which privacy, abuse, cost, and observability controls still belong to your production system.

## Run locally

Requirements: Node.js 20+, npm, an OpenAI project API key, and a browser that supports WebRTC and microphone access.

From this directory:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Add your project key only to `.env.local`:

```dotenv
OPENAI_API_KEY=your_project_key
```

Open <http://localhost:3000>, read the consent notice, and start the session through the explicit button. Use headphones to reduce acoustic echo.

`.env.local` is ignored by Git. Never commit it, expose it through `NEXT_PUBLIC_`, log it, or replace the ephemeral client-secret flow with a route that returns the standard key.

## Architecture

```text
Browser ── POST /api/realtime/token ──> Next.js server ──> OpenAI
Browser <──────── short-lived ek_… ──── Next.js server <── OpenAI
Browser <════════════ WebRTC audio and events ═══════════> OpenAI
```

The app uses `gpt-realtime-2.1`, semantic VAD, `gpt-4o-mini-transcribe` for visual input transcripts, and an ephemeral client secret with a 60-second issuance TTL. The lab does not persist application transcripts or audio.

## Quality gate

```bash
npm run lint
npm run typecheck
npm test
npm run build
# or all four:
npm run check
```

Automated tests validate local contracts without starting a paid Realtime session.

## Deploy to Vercel

Import the repository and set **Root Directory** to `labs/lab-02-realtime-voice-agent`. Add `OPENAI_API_KEY` in Vercel’s Environment Variables and deploy from `main`. HTTPS is required for microphone use outside localhost. See the [workshop deployment chapter](tutorial/tutorial.md#13-faça-deploy-na-vercel-e-valide-a-sessão-real).

## Production boundary

The sample includes same-origin checks, strict schemas, sanitized errors, a process-local limiter, optional shared access protection, short-lived credentials, explicit session cleanup, and content-free logs. A public product still needs user identity, distributed quotas, budgets, consent and retention policy, telemetry, abuse response, reconnect design, and authorization for every consequential agent tool.
