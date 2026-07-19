# AGENTS.md

## Repository purpose

OpenAI Voice Playground is an educational Next.js application. Changes must preserve both goals: a polished voice experience and code that teaches production trade-offs honestly.

## Commands

- Install: `npm install`
- Develop: `npm run dev`
- Lint: `npm run lint`
- Type-check: `npm run typecheck`
- Test: `npm test`
- Coverage: `npm run test:coverage`
- Production build: `npm run build`
- Full gate: `npm run check`

Run the narrowest relevant check while iterating and `npm run check` before declaring a change complete.

## Architecture

- `src/app`: Next.js App Router UI and server Route Handlers.
- `src/components`: interactive client components. Do not import the OpenAI SDK here.
- `src/lib`: shared contracts and server safeguards.
- `tests`: focused unit tests. Do not make live OpenAI calls.
- `tutorial/tutorial.md`: canonical Portuguese teaching article. Update it when a behavior or architectural decision changes.

## Security non-negotiables

- `OPENAI_API_KEY` is server-only. Never add `NEXT_PUBLIC_`, render it, log it, return it, or commit an env file.
- Do not log or persist speech text, voice instructions, transcripts, filenames, access tokens, or audio bytes.
- Validate all client-controlled model, voice, format, language, file-size, and file-type values on the server.
- Keep stable, sanitized API errors. Attach request IDs without forwarding raw provider errors to the browser.
- Treat process-local rate limiting and same-origin checks as defense in depth, not full abuse protection.
- Clearly disclose that synthesized voices are AI-generated.

## Engineering conventions

- TypeScript 7 in strict mode; avoid `any`, unchecked casts, and non-null assertions.
- Prefer small named functions, explicit domain types, and Zod at network boundaries.
- Preserve accessibility: labels, keyboard semantics, live regions, reduced-motion behavior, and sufficient contrast.
- Preserve response streaming for `/api/speech`; do not buffer the upstream response in the server route.
- Keep transcription request-based unless a feature explicitly requires ongoing microphone deltas. Realtime is a separate architecture.
- Use Lucide icons and existing CSS tokens. Do not add a second component or styling system without an ADR-level reason.
- Use `apply_patch`-style focused edits and do not reformat unrelated files.

## Definition of done

1. User behavior and failure states are implemented.
2. Security and privacy constraints above still hold.
3. Relevant tests exist and do not require a paid API call.
4. `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` pass.
5. README/tutorial documentation matches the code and names the remaining trade-offs.
