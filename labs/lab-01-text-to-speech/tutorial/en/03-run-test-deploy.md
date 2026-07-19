---
layout: default
title: "Lab 01 · Chapter 3 — Run, test, and deploy"
description: "Validate, run, diagnose, and deploy the Text to Speech application."
---

# Lab 01 · Chapter 3 — Run, test, diagnose, and deploy

[← File-by-file build](02-file-by-file-build.md) · [Português](../pt/03-execucao-testes-deploy.md) · [Overview](../tutorial-en.md)

The code exists. Now prove local responsibilities before spending a voice request, run one short smoke test, and prepare deployment.

## 1. Confirm the directory and secret

```bash
pwd
git check-ignore -v .env.local
```

The first command must end in `labs/lab-01-text-to-speech`; the second must print an ignore rule. Stop if the key is not protected.

## 2. Run gates without calling OpenAI

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run check
```

Expected result: no lint warning, no TypeScript error, every test passes, and Next.js creates a production build. No command generates speech. Fix the first failure before continuing; do not delete the lockfile as a generic troubleshooting step.

## 3. Start the local server

```bash
npm run dev
```

Open <http://localhost:3000>. In a second terminal:

```bash
cd openai-voice-playground/labs/lab-01-text-to-speech
curl http://localhost:3000/api/health
```

PowerShell:

```powershell
Invoke-RestMethod http://localhost:3000/api/health
```

The response must report `ok: true`, `configured: true`, model `gpt-4o-mini-tts`, and streaming enabled. It must never return the API key. If `configured` is false, check `.env.local`, save it, and restart the server.

## 4. Run one controlled voice test

1. Enter a short sentence with no personal data.
2. Select a voice.
3. Keep speed `1` and format `mp3`.
4. Generate and wait for the player.
5. Play and download the audio.
6. Start another generation and cancel it.
7. Confirm the UI discloses that the voice is AI-generated.

Stop the server with `Ctrl+C` when finished.

## 5. Troubleshoot by symptom

| Symptom | Check |
| --- | --- |
| `configured: false` | `.env.local`, `OPENAI_API_KEY`, and server restart |
| `401 unauthorized` | shared token entered in the UI when configured |
| `403 cross_origin_request` | `APP_ORIGIN` and browser domain |
| `413 request_too_large` | actual text/instruction and JSON body size |
| `429 rate_limit_exceeded` | wait for `Retry-After`; keep the limiter |
| `503 security_configuration_incomplete` | mandatory production variables |
| audio downloads but does not play | format, `Content-Type`, and browser support |
| TypeScript cannot resolve `@/` | `baseUrl`, `paths`, and current directory |

Inspect the final checkpoint without replacing files:

```bash
git fetch origin
git diff --stat HEAD..origin/workshop/lab-01-v1-step-03-interface
```

## 6. Commit your solution

```bash
cd ../..
git status -sb
git add labs/lab-01-text-to-speech
git commit -m "feat: complete text to speech workshop"
```

Review status before staging. `.env.local`, `.next`, `node_modules`, and `*.tsbuildinfo` must stay out of the commit.

## 7. Deploy the application to Vercel

GitHub Pages will host the workshop documentation, not this application: `/api/speech` requires server runtime and a secret. Use Vercel or another host that supports Next.js Route Handlers.

1. Push your branch to your own GitHub repository.
2. In Vercel, choose **Add New → Project**.
3. Import the repository.
4. Set **Root Directory** to `labs/lab-01-text-to-speech`.
5. Add protected production variables:

```dotenv
OPENAI_API_KEY=protected_value
PLAYGROUND_ACCESS_TOKEN=a_long_random_phrase
APP_ORIGIN=https://your-domain.example
UPSTASH_REDIS_REST_URL=protected_value
UPSTASH_REDIS_REST_TOKEN=protected_value
```

On Vercel, leave `CLIENT_IP_HEADER` absent to use the platform-protected header. On another provider, name the header overwritten by your trusted proxy.

6. Deploy.
7. Open `/api/health` before generating audio.
8. Confirm readiness without secrets.
9. Run one short test with the access token.

## 8. Final checklist

- [ ] `npm run check` passes;
- [ ] health contains no secret;
- [ ] generation, cancellation, playback, and download work;
- [ ] AI disclosure is visible;
- [ ] `.env.local` is untracked;
- [ ] production has access, origin, and distributed quota controls;
- [ ] budget, alerts, and key ownership are defined.

You completed the hands-on path. Use the [architecture article](../article-en.md) to review streaming, privacy, security, and production limits in greater depth.
