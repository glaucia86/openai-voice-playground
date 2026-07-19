---
layout: default
title: "Lab 02 · Chapter 1 — Preparation"
description: "Prepare the account, terminal, microphone, API key, and Realtime agent base."
---

# Lab 02 · Chapter 1 — Prepare the account, terminal, microphone, and project

[← Overview](../tutorial-en.md) · [Português](../pt/01-preparacao.md) · [Next: file-by-file build →](02-file-by-file-build.md)

This chapter prepares a base that compiles without requesting microphone permission or opening a paid session. Audio comes only after contracts, security, and cleanup exist.

## 1. Open a terminal and verify the tools

```bash
node --version
npm --version
git --version
```

Use Node.js `v20` or newer. Also confirm a current WebRTC browser, operating-system microphone permission, an editor, and headphones when available. `localhost` can request microphone access in development; a deployment needs HTTPS.

## 2. Prepare the OpenAI API project

1. Sign in at <https://platform.openai.com/>.
2. Create or select a learning project such as `openai-voice-labs`.
3. Confirm API billing or credits.
4. Verify access to the Realtime model used by the lab.
5. Configure budget alerts.
6. Create a project API key named `voice-labs-local`.

The standard key stays on the server. The browser will later receive a short-lived client secret created specifically to start one session. Do not confuse the two credentials.

## 3. Clone the recommended starter

```bash
cd ~/projects
git clone --branch workshop/lab-02-v1-starter \
  https://github.com/glaucia86/openai-voice-playground.git
cd openai-voice-playground
git switch -c my-lab-02-solution
npm ci --prefix labs/lab-02-realtime-voice-agent
npm run check:lab02
```

This gate must pass without a key, microphone, or external request. It proves only configuration, the starter page, health route, and first test.

## 4. Alternative: create everything from an empty directory

```bash
mkdir -p openai-voice-labs/labs/lab-02-realtime-voice-agent
cd openai-voice-labs/labs/lab-02-realtime-voice-agent
npm init -y
```

Runtime dependencies:

```bash
npm install next@15.5.20 react@19.2.7 react-dom@19.2.7 \
  openai@^6.48.0 @openai/agents@^0.13.5 zod@^4.4.3 \
  lucide-react@^1.25.0 @fontsource-variable/manrope@^5.2.8 \
  @fontsource-variable/jetbrains-mono@^5.2.8 \
  @upstash/ratelimit@2.0.8 @upstash/redis@1.38.0
```

Development tools:

```bash
npm install --save-dev @types/node@^26.1.1 @types/react@^19.2.17 \
  @types/react-dom@^19.2.3 oxlint@^1.74.0 vitest@^4.1.10 \
  @vitest/coverage-v8@^4.1.10 typescript@5.8.2 \
  typescript7@npm:typescript@7.0.2
```

## 5. Enter the lab directory

In the starter clone:

```bash
cd labs/lab-02-realtime-voice-agent
pwd
```

The path must end in `labs/lab-02-realtime-voice-agent`.

## 6. Create and protect `.env.local`

macOS, Linux, or Git Bash:

```bash
cp .env.example .env.local
```

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Set:

```dotenv
OPENAI_API_KEY=replace_with_your_project_key
PLAYGROUND_ACCESS_TOKEN=
APP_ORIGIN=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
CLIENT_IP_HEADER=
```

The empty variables become required during deployment, while local development has an educational safe mode. Never prefix the key with `NEXT_PUBLIC_`.

Prove the file is protected:

```bash
git check-ignore -v .env.local
git status -sb
```

`.env.local` must not appear in status.

## 7. Do not enable the microphone yet

Before the live test, you will build the strict request schema, server-side client-secret route, `no-store` response, agent/session cleanup, accessible states, and local tests. This order avoids using a billable session to discover failures that TypeScript or Vitest can catch offline.

## Chapter checkpoint

- [ ] tools respond;
- [ ] API project and budget were reviewed;
- [ ] you are on your own branch;
- [ ] `npm run check:lab02` passes on the starter;
- [ ] `.env.local` is ignored;
- [ ] no microphone or Realtime session has started.

[Next: build the application file by file →](02-file-by-file-build.md)
