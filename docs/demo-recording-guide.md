---
layout: default
title: "How to record real lab demonstrations"
description: "A safe plan for capturing real OpenAI Voice Labs GIFs and videos."
lang: en
alternate_url: "/docs/demo-recording-guide-pt-br.html"
alternate_lang: pt-BR
alternate_label: "Português"
---

# How to record real lab demonstrations

[Português](demo-recording-guide-pt-br.md) · [Back to workshops](../en/index.md#workshops)

This plan completes media without fabricating an outcome, exposing credentials, or recording personal data. The current Lab 01 GIF is a real, compressed demonstration. Lab 02 media remains explicitly pending until a controlled session can be recorded.

## Before recording

1. Use a separate OpenAI project with a small budget and alerts.
2. Close DevTools, password managers, notifications, and personal tabs.
3. Confirm `.env.local` is off-screen and ignored: `git check-ignore -v .env.local`.
4. Use short fictional text and speech with no names, email, company, phone, or location.
5. Record the application window only; never a terminal containing variables.
6. Use headphones for Lab 02 to prevent feedback.

## Lab 01 — 15-to-25-second sequence

Show: short text → voice/format choice → generate → processing state → player → playback → download. Keep GIF audio muted; the text description explains the outcome. End before any dashboard or log becomes visible.

## Lab 02 — 25-to-40-second sequence

Show: notice and consent → start → microphone permission → connected state → one short utterance → one response → interruption → mute → one text message → **End** → microphone indicator off. Never show Network, client secrets, API keys, personal transcripts, or Usage.

## Export and accessibility

- Prefer WebM or MP4 without audio autoplay; use a silent GIF fallback.
- Initial target: maximum 960 px width, 10–15 fps for GIF, under 2 MB.
- Remove pauses and redundant frames before lowering quality.
- Add `loading="lazy"`, dimensions, alt text, and a nearby text description.
- Never autoplay sound. Respect `prefers-reduced-motion` with an equivalent static description.

## Review before committing

Inspect frame by frame: no secret, token, request header, personal data, or notification may appear. Then run `npm run docs:links` and view the page at 360 px and 1440 px. If a real safe recording is unavailable, keep the honest placeholder.
