---
layout: default
title: "OpenAI Voice Labs — learning path"
description: "English index for the step-by-step OpenAI voice labs."
lang: en
alternate_url: "/docs/README.html"
alternate_lang: pt-BR
alternate_label: "Português"
---

# OpenAI Voice Labs — learning path

This is the English learning index. It organizes the material into numbered modules in a hands-on workshop format: each module states its prerequisites, expected outcome, executable steps, checkpoints, and next destination.

> If you only want an overview, return to the [main README](../README.md). If you want to build, start directly with either standalone tutorial.

## How to use this path

Choose one of three approaches:

- **Run and investigate:** prepare the environment, run the finished solution, and study its engineering decisions.
- **Build with guidance—recommended:** start from a compiling starter branch, implement one slice at a time, and use versioned checkpoints to compare or recover.
- **Rebuild from zero:** use Path C in each lab and create directories and files in the documented order.

Each standalone tutorial includes the essential setup context: API project, billing, credentials, installation, and secret protection.

Read the **[workshop guide](workshop-guide.md)** to choose a path, clone a starter, and inspect checkpoints without losing your work.

## Modules

| Module | Tutorial | Starting point | Time | Verifiable outcome |
| --- | --- | --- | ---: | --- |
| **01 — Text to Speech** | **[Open the complete tutorial](../labs/lab-01-text-to-speech/tutorial/tutorial-en.md)** | **[Starter branch](https://github.com/glaucia86/openai-voice-playground/tree/workshop/lab-01-v1-starter)** | 2–3 h | Validated text returns playable, downloadable audio |
| **02 — Realtime Voice Agent** | **[Open the complete tutorial](../labs/lab-02-realtime-voice-agent/tutorial/tutorial-en.md)** | **[Starter branch](https://github.com/glaucia86/openai-voice-playground/tree/workshop/lab-02-v1-starter)** | 3–4 h | A live conversation supports turns, mute, and interruption |

You can complete Module 02 without Module 01. Comparing them helps explain why a bounded TTS request and a live Realtime session need different architectures.

## Module completion contract

Continue only when you can answer “yes” to all four questions:

1. **Outcome:** does the described behavior work?
2. **Explanation:** can I explain why this architecture was selected?
3. **Protection:** is the API key still server-only and outside Git?
4. **Evidence:** did the checkpoint command finish successfully?

Automated tests make no paid OpenAI calls. Manual voice tests are always explicit and should use short content, a controlled environment, and a monitored budget.

## Checkpoints and finished solutions

Each lab keeps its finished implementation on `main`. The learning journey uses:

- behavioral checkpoints inside the tutorial;
- validation commands after each slice;
- tests as repeatable evidence;
- one compiling starter branch per lab;
- read-only `workshop/*-v1-step-*` references for comparison and recovery;
- Path C for rebuilding from an empty directory.

No workshop reference contains credentials, `.env.local`, `node_modules`, or build output. Breaking changes should create a `v2` family while preserving the `v1` edition used by existing classes and links.

## Visual conventions

- **Terminal:** the exact directory and command to run;
- **Expected outcome:** what must appear before continuing;
- **Checkpoint:** an objective completion condition;
- **Why:** the engineering decision, not only syntax;
- **Pitfall:** a common error and how to recognize it;
- **Production:** a limitation the lab must not hide.

## Start now

- **[Lab 01 — Text to Speech from zero to deployment](../labs/lab-01-text-to-speech/tutorial/tutorial-en.md)**.
- **[Lab 02 — Realtime Voice Agent from zero to deployment](../labs/lab-02-realtime-voice-agent/tutorial/tutorial-en.md)**.

## Workshop support

- **[Troubleshooting](troubleshooting.md)** for environment, cache, imports, or Pages.
- **[Recording plan](demo-recording-guide.md)** for real demonstrations without exposed credentials.
- **[UX and DevEx audit](ux-audit.md)** for the before-and-after evidence.
