# Lab 01 — OpenAI Text to Speech

Build an accessible, production-minded text-to-speech interface with Next.js 15, TypeScript 7, the OpenAI SDK, validated server boundaries, streamed audio, and carefully designed loading and error states.

[Versão em português](README-PT-BR.md) · [Workshop index](../../docs/README.md) · [Standalone English tutorial](tutorial/tutorial-en.md) · [Tutorial em português](tutorial/tutorial.md) · [Back to all labs](../../README.md)

| Duration | Level | Prerequisites | Outcome | Cost |
| --- | --- | --- | --- | --- |
| 2–3 h | beginner | Node.js 22+, Git, OpenAI API account | text becomes playable, downloadable audio | offline tests: none; voice: usage-based billing |

Want to see it before building? Open **[Start in 5 minutes](tutorial/tutorial-en.md#start-in-5-minutes)**. Lab 01 is the recommended starting point.

## What this lab teaches

- why bounded TTS is a request/response problem, not a Realtime session;
- how to keep `OPENAI_API_KEY` in a server-only Route Handler;
- how to validate a small product contract with Zod;
- how to forward OpenAI’s audio stream without buffering it on the server;
- how to expose cancellation, progress, playback, download, and accessible errors;
- how production fails closed behind mandatory access protection and a distributed quota.

## Choose your workshop path

1. **Run and study:** use `main` and inspect the completed application.
2. **Build from the starter (recommended):** begin at [`workshop/lab-01-v1-starter`](https://github.com/glaucia86/openai-voice-playground/tree/workshop/lab-01-v1-starter), implement one slice at a time, and compare against read-only checkpoints.
3. **Rebuild from zero:** follow the empty-directory commands in the tutorial, including project scaffolding.

The **[English workshop guide](../../docs/workshop-guide.md)** explains cloning, checkpoint comparison, and recovery without discarding your branch. The [Portuguese guide](../../docs/workshop-guide-pt-br.md) covers the same workflow.

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

Import the repository and set **Root Directory** to `labs/lab-01-text-to-speech`. In Vercel Environment Variables, add `OPENAI_API_KEY`, `PLAYGROUND_ACCESS_TOKEN`, `APP_ORIGIN`, `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN`, then deploy from `main`. Vercel supplies the trusted `x-vercel-forwarded-for` identity header. See the [hands-on run and deployment chapter](tutorial/en/03-run-test-deploy.md) for validation and production caveats.

## Responsible use

The UI discloses that the output is AI-generated. Do not use the application to impersonate real people or mislead listeners. The workshop token and IP quota protect a demo, not user accounts; a public product still needs real identity, per-user authorization, budgets, monitoring, and an abuse-response process.
