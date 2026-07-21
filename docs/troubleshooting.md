---
layout: default
title: "Shared troubleshooting — workshops and GitHub Pages"
description: "Reproducible diagnostics for generated docs, GitHub Pages, cache, CI, and imports."
lang: en
alternate_url: "/docs/troubleshooting-pt-br.html"
alternate_lang: pt-BR
alternate_label: "Leia em português"
---

# Shared troubleshooting — workshops and GitHub Pages

[Leia em português](troubleshooting-pt-br.md) · [Workshop index](README.md)

Use each lab's final chapter for API, audio, microphone, and WebRTC problems. This page covers the repository's shared layer.

| Symptom | Likely cause | Diagnose | Fix | Confirm |
| --- | --- | --- | --- | --- |
| file-by-file guide is stale | code changed without regenerated Markdown | `npm run docs:check` | update code or metadata in `scripts/generate-workshop-guides.mjs`; run `npm run docs:generate` | `npm run docs:check` passes and `git diff` shows the intended update |
| broken link or anchor | moved file, renamed heading, or wrong relative path | `npm run docs:links` | fix the target while preserving PT/EN parity | verifier reports that every Markdown target resolves |
| code loses formatting on Pages | fence inside HTML lacks `markdown="1"` or generated guide was hand-edited | inspect generated Markdown and its generator | keep fences in the generator and use Kramdown-compatible containers | Pages shows horizontal scroll and a copy button |
| `ENOENT` or import works on Windows but fails in CI | real filename and import casing differ | `git ls-files | sort` and `rg -n "from .*errors" labs` | make path and filename match exactly; ensure the file is tracked | `npm run check` passes on a case-sensitive system |
| Pages shows an old version | deployment is pending or asset cache is stale | compare `main`, Pages run, and `github-pages` SHAs; inspect `workshop.css?v=SHA` | wait for the right run; keep `site.github.build_revision` cache busting; hard-refresh once | published HTML references the new SHA and behavior changes without clearing site data |
| mobile menu fails after deployment | old JavaScript, syntax error, or selector mismatch | browser console, `node --check assets/js/workshop.js`, asset URL with `?v=` | fix the first error; retain asset versioning | button, link, outside tap, and `Esc` close correctly; scrolling returns |
| Pages workflow fails | invalid link, YAML/Jekyll build, or Pages permission | open **Actions → Deploy GitHub Pages** and find the first red step | fix the first cause; do not rerun unchanged deterministic failures | green run points to the intended commit |
| application does not work on GitHub Pages | Pages is static and cannot execute Route Handlers | check whether the attempted URL contains `/api/` | host docs on Pages and each Next.js app on a server-side host with secrets | tutorial opens on Pages; `/api/health` works on the app host |

## Minimum diagnostic bundle

From the repository root:

```bash
git status -sb
node --version
npm run docs:check
npm run docs:links
node --check assets/js/workshop.js
npm run check
```

Never paste `.env.local`, headers, client secrets, or content logs into an issue. Share only the OS, browser, command, first sanitized message, `X-Request-Id`, and commit used.

