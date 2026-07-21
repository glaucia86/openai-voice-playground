---
layout: default
title: "Lab 02 · Chapter 3 — Run, test, and deploy"
description: "Validate, run, diagnose, and deploy the Realtime voice agent."
lang: en
lab_label: "Lab 02 · Realtime Agent"
lab_index: "/labs/lab-02-realtime-voice-agent/tutorial/tutorial-en.html"
lab_index_label: "Lab 02 index"
step_label: "Run, test, and deploy"
step_position: "Step 3 of 3"
alternate_url: "/labs/lab-02-realtime-voice-agent/tutorial/pt/03-execucao-testes-deploy.html"
alternate_lang: pt-BR
alternate_label: "Português"
checkpoint_url: "/labs/lab-02-realtime-voice-agent/tutorial/tutorial-en.html#recovery-checkpoints"
checkpoint_label: "Lab 02 checkpoints"
previous_url: "/labs/lab-02-realtime-voice-agent/tutorial/en/02-file-by-file-build.html"
previous_label: "Build authorization, WebRTC, and the interface"
previous_kicker: "← Previous chapter"
next_url: "/docs/README.html"
next_label: "Review the learning path and choose next steps"
next_kicker: "Complete workshop →"
chapter_nav_label: "Lab 02 workshop navigation"
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

| Symptom | Likely cause | Diagnose | Fix | Confirm |
| --- | --- | --- | --- | --- |
| packages missing or Node incompatible | no install, wrong directory, or Node < 22 | `pwd`, `node --version`, `npm ls --depth=0` | enter Lab 02 and run `npm ci` with Node.js 22+ | `npm run typecheck` exits zero |
| port 3000 busy | another local server is running | inspect `EADDRINUSE`; use `lsof -i :3000` or `Get-NetTCPConnection -LocalPort 3000` | stop the known process or use `npm run dev -- --port 3001` | the Next.js URL opens |
| `configured: false` | missing `.env.local`, invalid key, or no restart | `git check-ignore -v .env.local` and `curl localhost:3000/api/health` | use `OPENAI_API_KEY=...`, save, restart | health reports `configured: true` without a credential |
| unavailable quota/credits or model | project billing, limit, or no `gpt-realtime-2.1` access | inspect request ID, Usage/Billing, and health model | enable billing/limit or consistently use an allowed model | one short planned smoke test connects within budget |
| browser never requests microphone | denied permission, insecure context, or no user gesture | inspect site permissions, `navigator.mediaDevices`, and console | use HTTPS/localhost, allow permission, click again | microphone indicator appears only during the session |
| unsupported browser | WebRTC/media APIs unavailable or restricted | try current Chrome, Edge, Firefox, or Safari and inspect console | update/switch browser; avoid restricted webviews | session reaches connected state |
| client secret expires before connect | issued too early or delayed beyond TTL | inspect issuance time without logging the value | issue immediately before `connect`; never reuse it | retry connects and response remains `no-store` |
| WebRTC fails | firewall, VPN, corporate network, HTTPS, or negotiation | inspect `chrome://webrtc-internals`, console, and Network without copying tokens | try another network, remove a known VPN, confirm HTTPS, retry briefly | audio flows; **End** releases the connection |
| `403 cross_origin_request` or CORS | `APP_ORIGIN` differs from the domain | compare browser origin with the protected variable | correct the full origin and redeploy | right origin gets a secret; another remains blocked |
| agent hears itself | speaker feedback reaches microphone | use headphones and observe unexpected turns | keep headphones and choose the right noise-reduction profile | agent responds only to the learner |
| transcript duplicates | history handled as append rather than snapshot | observe repeated items after history events | reconcile snapshots and keep state in memory | each turn appears once and disappears on refresh |
| microphone stays active | cleanup did not close session/tracks | click **End** and inspect the system indicator | call `session.close()` and stop every track on cleanup/unmount | indicator disappears and a new session starts cleanly |
| build/import fails in CI | filename casing or stale generated guide | `git ls-files | sort`, `npm run docs:check`, `npm run check` | match import and filename exactly; regenerate docs after displayed-code changes | local and remote checks pass |

For stale cache, Pages workflow, or generated documentation issues, use the [shared troubleshooting guide](../../../../docs/troubleshooting.md).

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

<div class="next-steps-cta" markdown="1">

## Next steps

You learned to separate authorization from media, issue an ephemeral credential, negotiate WebRTC, model turns/interruption, and release microphone and session resources. Evolve one thing at a time: function calling with schemas and human approval, real authentication, content-free observability, bounded reconnection, history with an explicit retention policy, or automated session-state tests.

Before persisting transcripts or adding tools, define purpose, consent, authorization, and deletion. A short-lived client secret does not solve identity or abuse by itself.

<div class="next-steps-cta__links">
  <a href="https://developers.openai.com/api/docs/guides/voice-agents">Official voice agents guide ↗</a>
  <a href="https://developers.openai.com/api/docs/guides/realtime-webrtc">Realtime with WebRTC ↗</a>
  <a href="https://developers.openai.com/api/docs/guides/realtime-costs">Realtime costs ↗</a>
  <a href="https://github.com/glaucia86/openai-voice-playground/issues/new">Share feedback / open an issue ↗</a>
  <a href="../../../../CONTRIBUTING.md">Contributing guide</a>
  <a href="https://github.com/glaucia86/openai-voice-playground">Repository · optional star ↗</a>
</div>

</div>
