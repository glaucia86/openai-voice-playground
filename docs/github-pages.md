---
layout: default
title: "Publish the workshops with GitHub Pages"
description: "Enable and validate the bilingual OpenAI Voice Labs static site."
---

# Publish the workshops with GitHub Pages

[Leia em português](github-pages-pt-br.md) · [Open the site index](../index.md) · [Workshop index](README.md)

The [`.github/workflows/pages.yml`](../.github/workflows/pages.yml) workflow builds Markdown with Jekyll and publishes an artifact through the official GitHub Pages deployment mechanism.

## One-time GitHub setup

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Open the **Actions** tab.
5. Select the **GitHub Pages** workflow.
6. Choose **Run workflow** or push a documentation change to `main`.

After deployment, the `github-pages` environment shows the published URL. The expected project URL is:

```text
https://glaucia86.github.io/openai-voice-playground/
```

## What triggers the site

The workflow runs when `main` changes Pages configuration, `index.md`, `docs/**`, or any `labs/*/tutorial/**` directory. Application-only changes do not deploy documentation unless the tutorial changes too.

## Validate before pushing

```bash
npm run docs:generate
npm run docs:check
git diff --check
```

`docs:generate` synchronizes file-by-file chapters with real source. `docs:check` fails when implementation changes without regenerated workshops.

## Important boundary

GitHub Pages publishes static files. It cannot run `/api/speech` or `/api/realtime/token`, must never receive `OPENAI_API_KEY`, and does not replace application deployment. Host the apps on Vercel or another Next.js runtime; use Pages for learning material.

Pages sites are public. Never publish `.env.local`, credentials, private transcripts, audio, or personal data.
