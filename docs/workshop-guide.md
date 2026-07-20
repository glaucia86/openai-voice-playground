---
layout: default
title: "How to follow the workshops"
description: "Choose the final solution, a starter, or an empty directory and use checkpoints safely."
---

# How to follow the workshops

[Leia em português](workshop-guide-pt-br.md) · [Workshop index](README.md) · [Main README](../README.md)

Both labs offer three learning experiences. Choose one before you start:

| Path | Best for | Starting point |
| --- | --- | --- |
| **A — run and study** | see the complete solution working and investigate final code | `main` branch |
| **B — build from a starter (recommended)** | implement the slices without spending workshop time on mechanical scaffolding | the lab's starter branch |
| **C — rebuild absolutely from zero** | practice directory creation, configuration, and installation too | an empty directory |

## Path B: start from the scaffold

### Lab 01 — Text to Speech

```bash
git clone --branch workshop/lab-01-v1-starter \
  https://github.com/glaucia86/openai-voice-playground.git
cd openai-voice-playground
git switch -c my-lab-01-solution
npm ci --prefix labs/lab-01-text-to-speech
npm run check:lab01
```

### Lab 02 — Realtime agent

```bash
git clone --branch workshop/lab-02-v1-starter \
  https://github.com/glaucia86/openai-voice-playground.git
cd openai-voice-playground
git switch -c my-lab-02-solution
npm ci --prefix labs/lab-02-realtime-voice-agent
npm run check:lab02
```

Creating your own branch immediately keeps the starter reference untouched and makes your commits easy to review. The starter already contains pinned dependencies, configuration, a compilable page, an educational health check, and a first test. It does not contain the working voice integration.

### About GitHub's yellow cards

After `workshop/*` branches receive commits, GitHub may show yellow **Compare & pull request** cards on the repository home page. They are automatic interface suggestions, not a workshop action.

- do not open a checkpoint Pull Request against `main`;
- do not merge a checkpoint;
- do not delete the branch;
- dismiss or ignore the card and use `git diff` or `git show` as shown below.

An intermediate checkpoint intentionally removes everything that has not been taught yet. Merging it into `main` would regress the final solution.

## Use a checkpoint without losing your work

Checkpoints are versioned, read-only branches. The `v1` suffix keeps this edition reproducible when the workshop evolves.

Inspect your state first:

```bash
git status -sb
```

Commit important work on your branch before comparing, then refresh workshop references:

```bash
git fetch origin
```

See only the summary between your implementation and a checkpoint:

```bash
git diff --stat HEAD..origin/workshop/lab-01-v1-step-01-contract
```

Inspect a file without replacing your copy:

```bash
git show origin/workshop/lab-01-v1-step-01-contract:labs/lab-01-text-to-speech/src/lib/schemas.ts
```

Compare one file:

```bash
git diff HEAD..origin/workshop/lab-01-v1-step-01-contract -- \
  labs/lab-01-text-to-speech/src/lib/schemas.ts
```

Avoid `git reset --hard`, and do not switch to a checkpoint with uncommitted work. A checkpoint exists to explain and diagnose, not to erase your attempt.

## Checkpoint contract

Every checkpoint:

- compiles and passes its own gate;
- contains only the capability introduced up to that stage;
- contains no `.env.local`, credentials, `node_modules`, or builds;
- links to a browsable GitHub comparison;
- defines objective evidence before you continue.

The last checkpoint rebuilds the same tree published on `main`. Its history differs because the teaching commits expose the slices separately.

## Instructor tips

- Give every participant a separate API key and a learning project with monitored budget.
- Run automated checkpoints before any billable manual test.
- Keep the voice smoke test to a short sentence or controlled session.
- If someone falls behind, use the next checkpoint branch as a reference; never share a folder containing secrets.
- Demonstrate `git diff` and `git show` before the first exercise so recovery becomes part of the learning model.
- Use Path C only when project creation and tooling configuration are also learning objectives.

## Update rule

When dependencies, architecture, or tutorial steps change incompatibly, publish a new `v2` family. Do not silently move `v1` checkpoints: old links, recordings, and comparisons must remain reproducible.
