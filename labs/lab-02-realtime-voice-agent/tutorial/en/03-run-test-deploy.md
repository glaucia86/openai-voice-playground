---
layout: default
title: "Lab 02 · Chapter 3 — Run, test, and deploy"
description: "Validate, run, diagnose, and deploy the Realtime voice agent."
---

# Lab 02 · Chapter 3 — Run, test, diagnose, and deploy

[← File-by-file build](02-file-by-file-build.md) · [Português](../pt/03-execucao-testes-deploy.md) · [Overview](../tutorial-en.md)

First prove everything that needs no network. Only then open one short microphone session while monitoring API usage.

## 1. Confirm the directory and secret

```bash
pwd
git check-ignore -v .env.local
```

The directory must end in `labs/lab-02-realtime-voice-agent`, and Git must print the rule that ignores `.env.local`.

## 2. Run offline gates

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run check
```

These commands request no microphone and issue no client secret. Fix the first failure before continuing.

## 3. Start without enabling the microphone

```bash
npm run dev
```

Open <http://localhost:3000>, but do not click **Start live conversation** yet. In another terminal:

```bash
cd openai-voice-playground/labs/lab-02-realtime-voice-agent
curl http://localhost:3000/api/health
```

PowerShell:

```powershell
Invoke-RestMethod http://localhost:3000/api/health
```

The response must report `ok: true`, `configured: true`, model `gpt-realtime-2.1`, transport `webrtc`, and a 60-second issuance TTL. It must contain neither the API key nor a client secret.

## 4. Run one short Realtime smoke test

Use headphones and content with no personal data.

1. Read the AI and privacy notice.
2. Select the required consent.
3. Choose language and voice.
4. Click **Start live conversation**.
5. Allow microphone access.
6. Say one short sentence.
7. Wait for a response.
8. Interrupt once by speaking during the response.
9. Toggle mute and verify the UI state.
10. Send one text fallback message.
11. Click **End**.
12. Confirm the browser microphone indicator disappears.

Do not leave the tab connected. Explicit ending remains part of the test.

## 5. Troubleshoot by symptom

| Symptom | Check |
| --- | --- |
| browser never requests microphone | OS permission, site permission, and user gesture |
| `configured: false` | `.env.local`, key, and server restart |
| client secret expires before connect | create it immediately before `connect` |
| WebRTC fails | HTTPS/localhost, firewall, corporate network, browser console |
| agent hears itself | use headphones and the correct microphone profile |
| transcript duplicates | reconcile history snapshots instead of blind append |
| microphone stays active | call `session.close()` and stop tracks during cleanup |
| `429 rate_limit_exceeded` | wait for `Retry-After`; keep the safeguard |
| `503 security_configuration_incomplete` | mandatory production variables |

Compare without replacing files:

```bash
git fetch origin
git diff --stat HEAD..origin/workshop/lab-02-v1-step-03-conversation
```

## 6. Commit

```bash
cd ../..
git status -sb
git add labs/lab-02-realtime-voice-agent
git commit -m "feat: complete realtime voice workshop"
```

`.env.local`, `.next`, `node_modules`, and `*.tsbuildinfo` must stay out.

## 7. Deploy the application to Vercel

GitHub Pages will host the tutorials. It cannot run `/api/realtime/token` or protect `OPENAI_API_KEY`; the application needs a server-side host such as Vercel.

1. Import the repository into Vercel.
2. Set **Root Directory** to `labs/lab-02-realtime-voice-agent`.
3. Add:

```dotenv
OPENAI_API_KEY=protected_value
PLAYGROUND_ACCESS_TOKEN=a_long_random_phrase
APP_ORIGIN=https://your-domain.example
UPSTASH_REDIS_REST_URL=protected_value
UPSTASH_REDIS_REST_TOKEN=protected_value
```

Leave `CLIENT_IP_HEADER` absent on Vercel. Elsewhere, name the header overwritten by the trusted proxy.

4. Deploy.
5. Validate `/api/health` without secrets.
6. Confirm HTTPS and microphone permission.
7. Run one short conversation.
8. End explicitly and monitor usage/budget.

## 8. Final checklist

- [ ] `npm run check` passes;
- [ ] health contains no credential;
- [ ] the client secret is short-lived and `no-store`;
- [ ] connection, interruption, mute, text, and End work;
- [ ] the microphone is released;
- [ ] transcript does not persist after refresh;
- [ ] production has access, origin, and distributed quota controls;
- [ ] budget and alerts are active.

Done. Read the [architecture article](../article-en.md) for deeper WebRTC, state-machine, retention, abuse, and server-side-control reasoning.
