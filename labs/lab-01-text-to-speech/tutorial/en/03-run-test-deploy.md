---
layout: default
title: "Lab 01 · Chapter 3 — Run, test, and deploy"
description: "Validate, run, diagnose, and deploy the Text to Speech application."
lang: en
lab_label: "Lab 01 · Text to Speech"
lab_index: "/labs/lab-01-text-to-speech/tutorial/tutorial-en.html"
lab_index_label: "Lab 01 index"
step_label: "Run, test, and deploy"
step_position: "Step 3 of 3"
alternate_url: "/labs/lab-01-text-to-speech/tutorial/pt/03-execucao-testes-deploy.html"
alternate_lang: pt-BR
alternate_label: "Português"
checkpoint_url: "/labs/lab-01-text-to-speech/tutorial/tutorial-en.html#recovery-checkpoints"
checkpoint_label: "Lab 01 checkpoints"
previous_url: "/labs/lab-01-text-to-speech/tutorial/en/02-file-by-file-build.html"
previous_label: "Build the application file by file"
previous_kicker: "← Previous chapter"
next_url: "/labs/lab-02-realtime-voice-agent/tutorial/tutorial-en.html"
next_label: "Continue to Lab 02 · Realtime Agent"
next_kicker: "Next lab →"
chapter_nav_label: "Lab 01 workshop navigation"
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

Start with the symptom, run the diagnostic, and only then apply a fix. The final column prevents a plausible change from being mistaken for a proven repair.

| Symptom | Likely cause | Diagnose | Fix | Confirm |
| --- | --- | --- | --- | --- |
| `npm` cannot find packages | missing dependencies or wrong directory | `pwd`, `node --version`, `npm ls --depth=0` | enter `labs/lab-01-text-to-speech` and run `npm ci` with Node.js 22+ | `npm run typecheck` exits zero |
| server does not open or port is busy | another process uses 3000 | inspect `EADDRINUSE`; try `lsof -i :3000` or `Get-NetTCPConnection -LocalPort 3000` | stop the known process or run `npm run dev -- --port 3001` | the URL printed by Next.js responds |
| `configured: false` | missing/misnamed `.env.local` or no restart | `git check-ignore -v .env.local` and `curl localhost:3000/api/health` | use exactly `OPENAI_API_KEY=...`, save, restart `npm run dev` | health reports `configured: true` without revealing the key |
| `401 unauthorized` | workshop token missing or provider key invalid | inspect the safe code and `X-Request-Id`; never print the key | enter `PLAYGROUND_ACCESS_TOKEN` when required or rotate an invalid key | one short sentence produces audio |
| unavailable quota/credits or `429` | project limit, billing, or rate limit | inspect `Retry-After` and Usage/Billing | wait, enable billing, or adjust the budget; keep the limiter | one short planned test works within budget |
| model unavailable | project lacks access to the configured model | compare the health model with the safe error tied to the request ID | confirm `gpt-4o-mini-tts` access or consistently choose an allowed model in code and docs | build passes and the short call returns audio |
| `403 cross_origin_request` or CORS | `APP_ORIGIN` differs from the real origin | compare the browser URL with `APP_ORIGIN` | set the full canonical origin and restart/redeploy | that origin works while another remains blocked |
| `413 request_too_large` | text, instructions, or JSON exceeds limits | reduce input and inspect the status | keep the safeguard and use short content | allowed request works; excessive request remains rejected |
| audio downloads but does not play | unsupported format or `Content-Type` | inspect Network and retry with `mp3` | use a supported format and preserve the API response header | player works and download extension is correct |
| build/import fails only in CI | filename casing or stale generated guide | `git ls-files | sort`, `npm run docs:check`, `npm run check` | match import casing exactly and run `npm run docs:generate` when displayed code changed | local and remote checks pass |

Documentation, cache, and Pages workflow problems are covered in the [shared troubleshooting guide](../../../../docs/troubleshooting.md).

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

<div class="next-steps-cta" markdown="1">

## Next steps

You learned to keep the key on the server, validate input, forward an audio stream, model explicit UI states, and prove responsibilities with offline tests. Choose one small extension: add an allowed voice with a test, introduce real authentication, measure latency without logging text, expand UI tests, or prepare a safe deployment with a budget and distributed rate limiting.

The natural next step is [Lab 02 — Realtime Agent](../../../lab-02-realtime-voice-agent/tutorial/tutorial-en.md), where a bounded request becomes a WebRTC session with microphone, turns, and interruption.

<div class="next-steps-cta__links">
  <a href="https://developers.openai.com/api/docs/guides/text-to-speech">Official Text to Speech docs ↗</a>
  <a href="https://nextjs.org/docs/app/getting-started/route-handlers">Next.js Route Handlers ↗</a>
  <a href="https://www.typescriptlang.org/docs/">TypeScript ↗</a>
  <a href="https://github.com/glaucia86/openai-voice-playground/issues/new">Share feedback / open an issue ↗</a>
  <a href="../../../../CONTRIBUTING.md">Contributing guide</a>
  <a href="https://github.com/glaucia86/openai-voice-playground">Repository · optional star ↗</a>
</div>

</div>
