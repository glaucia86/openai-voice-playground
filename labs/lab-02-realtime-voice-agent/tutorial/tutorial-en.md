---
layout: default
title: "Lab 02 — Realtime agent: step-by-step workshop"
description: "Build an OpenAI Realtime voice agent file by file, from the terminal to deployment."
---

# Lab 02 — Realtime agent: step-by-step workshop

[Leia em português](tutorial.md) · [Workshop index](../../../docs/README.md) · [← Lab 01](../../lab-01-text-to-speech/tutorial/tutorial-en.md)

This workshop builds a real speech-to-speech application through concrete actions: open the terminal, create the named file, add its complete content, run the checkpoint, and only then continue.

When you finish, you will have a Next.js application that:

- creates a short-lived Realtime client secret on the server;
- keeps `OPENAI_API_KEY` away from the browser;
- connects audio and events over WebRTC;
- handles connection, listening, thinking, speaking, mute, and interruption;
- provides text fallback and an in-memory transcript;
- explicitly ends and cleans up the session;
- has tests that open no billable session;
- can be deployed with HTTPS.

## Choose a learning path

| Path | What you do | Recommendation |
| --- | --- | --- |
| **A — run and investigate** | clone `main` and inspect the finished solution | useful for meeting Realtime first |
| **B — build from the starter** | begin with a compilable scaffold and implement each slice | **recommended for this workshop** |
| **C — create from zero** | create directories, configuration, and dependencies too | useful for deep study or a longer class |

The [workshop guide](../../../docs/workshop-guide.md) explains how to preserve your work and inspect checkpoints without destructive commands.

## Start here

1. **[Prepare the account, terminal, microphone, and project](en/01-preparation.md)** — Choose a path, protect the API key, and prove the base runs without starting a session.
2. **[Build the application file by file](en/02-file-by-file-build.md)** — Create the contract, authorization, client secret, agent, WebRTC flow, state model, interface, and tests with complete files.
3. **[Run, diagnose, and deploy](en/03-run-test-deploy.md)** — Run the gates, perform a short smoke test, troubleshoot microphone/WebRTC, and publish over HTTPS.

> Read the **[Lab 02 architecture article](article-en.md)** before or after implementation for deeper reasoning. The article explains why; the chapters above direct your actions.

## Recommended starter

```bash
git clone --branch workshop/lab-02-v1-starter \
  https://github.com/glaucia86/openai-voice-playground.git
cd openai-voice-playground
git switch -c my-lab-02-solution
npm ci --prefix labs/lab-02-realtime-voice-agent
npm run check:lab02
```

The first gate must pass without an API key, microphone permission, or OpenAI session. Then open [Chapter 1](en/01-preparation.md).

## Recovery checkpoints

| After completing | Reference | Compare |
| --- | --- | --- |
| initial base | `workshop/lab-02-v1-starter` | starting point |
| session contract | `workshop/lab-02-v1-step-01-session-contract` | [view diff](https://github.com/glaucia86/openai-voice-playground/compare/workshop/lab-02-v1-starter...workshop/lab-02-v1-step-01-session-contract) |
| authorization and client secret | `workshop/lab-02-v1-step-02-authorization` | [view diff](https://github.com/glaucia86/openai-voice-playground/compare/workshop/lab-02-v1-step-01-session-contract...workshop/lab-02-v1-step-02-authorization) |
| conversation and interface | `workshop/lab-02-v1-step-03-conversation` | [view diff](https://github.com/glaucia86/openai-voice-playground/compare/workshop/lab-02-v1-step-02-authorization...workshop/lab-02-v1-step-03-conversation) |

Commit your branch before comparing. Checkpoints are reading references, not shortcuts for erasing your implementation.

## Final evidence

```bash
npm run check:lab02
git status -sb
```

The first command runs lint, TypeScript, tests, and a production build without enabling the microphone or opening a paid connection. The second must confirm that no secret or generated artifact entered Git.

[Start Chapter 1 →](en/01-preparation.md)
