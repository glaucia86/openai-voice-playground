---
layout: default
title: "UX, DevEx, and learning audit"
description: "Evidence-based before-and-after evaluation of OpenAI Voice Labs."
lang: en
alternate_url: "/docs/ux-audit-pt-br.html"
alternate_lang: pt-BR
alternate_label: "Português"
---

# UX, DevEx, and learning audit

[Português](ux-audit-pt-br.md) · [Workshop index](README-en.md)

## Method

The baseline is commit `e05ca3e`, inspected as both an instructor and a beginner participant. Scores do not reward word count: they use versioned evidence, steps required to start, recovery options, keyboard/mobile navigation, and reproducible checks. The after score counts only repository features that are implemented and validated from the root.

## Instructor perspective

**Before:** three paths, versioned checkpoints, network-free tests, and bilingual chapters already provided a strong foundation. The instructor still had to explain duration, level, cost, condensed architecture, first route, and several common failures verbally. Recovery was possible, but checkpoint shortcuts did not follow learners across every page.

**After:** each lab opens with metadata and a quick start; diagrams make the two credential boundaries comparable; navigation exposes the step, named previous/next destinations, and checkpoints; generated guides insert objective, validation, likely error, reflection, and conclusion into each slice. Troubleshooting moves from a two-column hint to diagnosis plus proof of repair.

## Beginner perspective

**Before:** instructions were correct, but the learner had to read introductions and large tables before finding the first command. Lab 02 had no honest outcome media, and the difference between tutorial, article, starter, and `main` required context. The mobile table of contents existed, but the drawer did not preserve focus.

**After:** “Start in 5 minutes” separates running, starter-assisted building, and empty-directory reconstruction; cards expose prerequisites, time, level, and cost; Lab 01 shows a real result while Lab 02 clearly marks the pending recording and links a safe plan; breadcrumbs, language, and named destinations reduce disorientation. Common failures end with objective proof that the fix worked.

## Evidence-based scores

| Criterion | Before | After | Evidence |
| --- | ---: | ---: | --- |
| Documentation | 8.5 | 9.5 | before: complete PT/EN tutorials and generator; after: quick start, SVG+Mermaid architecture, honest media, troubleshooting, and equivalent next steps |
| Navigation | 6.5 | 9.3 | before: inline links and generic footer; after: journey front matter, lab/step breadcrumbs, named destinations, language, index, and checkpoints on desktop/mobile |
| Visual design | 8.3 | 9.1 | before: consistent responsive theme and copy control; after: compact cards, media, diagrams, CTAs, and filenames without another visual framework |
| Developer Experience | 8.4 | 9.3 | before: starters, lockfiles, and `npm run check`; after: teaching metadata in the generator, `docs:check`, shared diagnostics, and reproducible media plan |
| Accessibility | 7.8 | 9.2 | before: skip link, visible focus, reduced motion; after: trapped/restored drawer focus, synchronized ARIA, titled/described SVGs, text alternatives, and mobile targets |
| Learning experience | 8.2 | 9.5 | before: solid sequence and checkpoints; after: outcome before implementation, explicit expectations, short reflections, before-you-continue proof, and graduated CTAs |

## Deliberate limits

- A real Realtime demonstration requires a controlled credentialed microphone session and API cost; the placeholder does not fake an outcome.
- Scoring does not replace participant research. The recommended next step is watching at least three beginners complete each path and measuring duration, blockers, and recovery.
- GitHub Pages hosts documentation only; the applications still require a server-side Next.js host.
