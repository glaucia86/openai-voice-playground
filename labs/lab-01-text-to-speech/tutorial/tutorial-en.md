---
layout: default
title: "Lab 01 — Text to Speech: step-by-step workshop"
description: "Build an OpenAI Text to Speech application file by file, from the terminal to deployment."
---

# Lab 01 — Text to Speech: step-by-step workshop

[Leia em português](tutorial.md) · [Workshop index](../../../docs/README.md) · [Lab 02 →](../../lab-02-realtime-voice-agent/tutorial/tutorial-en.md)

This workshop does more than explain the architecture. You open a terminal, create the project, create every file, paste a complete implementation, run a checkpoint, and only then continue.

When you finish, you will have a Next.js application that:

- turns text into audio with `gpt-4o-mini-tts`;
- keeps `OPENAI_API_KEY` on the server;
- validates text, voice, format, instructions, and speed;
- forwards the audio stream;
- provides playback, cancellation, and download;
- handles errors without leaking internal details;
- has tests that make no paid requests;
- can be deployed to Vercel.

## Choose a learning path

| Path | What you do | Recommendation |
| --- | --- | --- |
| **A — run and study** | clone `main` and inspect the finished solution | useful for seeing the result first |
| **B — build from the starter** | begin with a compilable scaffold and implement each slice | **recommended for this workshop** |
| **C — create from zero** | create directories, configuration, and dependencies too | useful for deep study or a longer class |

The [workshop guide](../../../docs/workshop-guide.md) explains how to preserve your work and inspect checkpoints with `git diff` and `git show`.

## Start here

Follow these chapters in order. Each one ends with objective completion evidence.

1. **[Prepare the account, terminal, and project](en/01-preparation.md)** — Choose a path, verify tools, protect the API key, and prove the base runs.
2. **[Build the application file by file](en/02-file-by-file-build.md)** — Create configuration, contract, backend, streaming, interface, and tests with the complete content of every file.
3. **[Run, diagnose, and deploy](en/03-run-test-deploy.md)** — Run every gate, perform a controlled smoke test, troubleshoot common failures, and publish.

> Want deeper reasoning? Read the **[Lab 01 architecture article](article-en.md)** after or alongside the hands-on chapters. The article explains why; the chapters above tell you exactly what to do.

## Recommended starter

Open a terminal in your projects directory and run:

```bash
git clone --branch workshop/lab-01-v1-starter \
  https://github.com/glaucia86/openai-voice-playground.git
cd openai-voice-playground
git switch -c my-lab-01-solution
npm ci --prefix labs/lab-01-text-to-speech
npm run check:lab01
```

The first gate must pass without an API key or OpenAI request. Then open [Chapter 1](en/01-preparation.md).

## Recovery checkpoints

| After completing | Reference | Compare |
| --- | --- | --- |
| initial base | `workshop/lab-01-v1-starter` | starting point |
| contract and schemas | `workshop/lab-01-v1-step-01-contract` | [view diff](https://github.com/glaucia86/openai-voice-playground/compare/workshop/lab-01-v1-starter...workshop/lab-01-v1-step-01-contract) |
| backend and streaming | `workshop/lab-01-v1-step-02-server` | [view diff](https://github.com/glaucia86/openai-voice-playground/compare/workshop/lab-01-v1-step-01-contract...workshop/lab-01-v1-step-02-server) |
| interface and tests | `workshop/lab-01-v1-step-03-interface` | [view diff](https://github.com/glaucia86/openai-voice-playground/compare/workshop/lab-01-v1-step-02-server...workshop/lab-01-v1-step-03-interface) |

Do not check out a checkpoint with unsaved changes. Commit your work on your own branch first, then use the reference for comparison.

## Final evidence

The lab is complete when both commands finish cleanly:

```bash
npm run check:lab01
git status -sb
```

The first command runs lint, TypeScript, tests, and a production build. The second should show only your branch, with no `.env.local`, `.next`, `node_modules`, or unexpected tracked files.

[Start Chapter 1 →](en/01-preparation.md)
