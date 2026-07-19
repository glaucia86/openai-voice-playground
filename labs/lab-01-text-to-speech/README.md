# Lab 01 — OpenAI Text to Speech

Build an accessible, production-minded text-to-speech interface with Next.js 15, TypeScript 7, the OpenAI SDK, validated server boundaries, streamed audio, and carefully designed loading and error states.

[Versão em português](README-PT-BR.md) · [Detailed Portuguese workshop](tutorial/tutorial.md) · [Back to all labs](../../README.md)

## What this lab teaches

- why bounded TTS is a request/response problem, not a Realtime session;
- how to keep `OPENAI_API_KEY` in a server-only Route Handler;
- how to validate a small product contract with Zod;
- how to forward OpenAI’s audio stream without buffering it on the server;
- how to expose cancellation, progress, playback, download, and accessible errors;
- where local rate limiting and shared access tokens stop being sufficient.

## Run locally

From this directory:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Add your project key to `.env.local`:

```dotenv
OPENAI_API_KEY=your_project_key
```

Open <http://localhost:3000>. The environment file is ignored by Git. Never commit it, paste it into an issue, or prefix the key with `NEXT_PUBLIC_`.

## Quality gate

```bash
npm run lint
npm run typecheck
npm test
npm run build
# or all four:
npm run check
```

Tests do not make paid OpenAI requests.

## API surface

- `GET /api/health` reports non-secret configuration and limits.
- `POST /api/speech` accepts validated text, voice, instructions, format, and speed, then returns streamed audio.

## Deploy to Vercel

Import the repository and set **Root Directory** to `labs/lab-01-text-to-speech`. Add `OPENAI_API_KEY` in Vercel’s Environment Variables and deploy from `main`. See the [workshop deployment chapter](tutorial/tutorial.md#11-faça-deploy-na-vercel) for validation and production caveats.

## Responsible use

The UI discloses that the output is AI-generated. Do not use the application to impersonate real people or mislead listeners. Public deployments need real identity, distributed quotas, budgets, monitoring, and an abuse-response process.
