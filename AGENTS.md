# AGENTS.md

## Repository purpose

OpenAI Voice Labs is an educational collection of independent Next.js workshops. Changes must preserve three goals: a polished voice experience, honest production trade-offs, and a path that a learner can reproduce from an empty folder.

## Lab map

- `labs/lab-01-text-to-speech`: bounded text-to-speech request with streamed audio.
- `labs/lab-02-realtime-voice-agent`: stateful speech-to-speech Realtime session over WebRTC.
- Each lab owns its `package.json`, lockfile, app, tests, READMEs, `.env.example`, and `tutorial/tutorial.md`.
- Root documentation is the catalog. Do not move lab implementations to separate branches.

## Commands

From the repository root:

- Install both: `npm run install:labs`
- Develop Lab 01: `npm run dev:lab01`
- Develop Lab 02: `npm run dev:lab02`
- Check Lab 01: `npm run check:lab01`
- Check Lab 02: `npm run check:lab02`
- Check both: `npm run check`

Within either lab, use `npm ci`, `npm run dev`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:coverage`, and `npm run build`.

Run the narrowest relevant check while iterating and the complete check for every changed lab before declaring work complete.

## Security non-negotiables

- `OPENAI_API_KEY` is server-only. Never add `NEXT_PUBLIC_`, render it, log it, return it, or commit any `.env` or `.env.local` file.
- Only `.env.example` templates with empty values may be versioned.
- Do not log or persist speech text, voice instructions, transcripts, filenames, access tokens, client secrets, or audio bytes.
- Realtime client secrets must be short-lived, returned with `no-store`, and never logged. They are still bearer credentials.
- Validate all client-controlled values before any billable call or credential issuance.
- Return stable sanitized errors and request IDs without forwarding raw provider errors.
- Treat same-origin checks, a shared token, and process-local rate limiting as defense in depth, not a complete public perimeter.
- Clearly disclose that synthesized voices are AI-generated.

## Engineering conventions

- TypeScript 7 in strict mode; avoid `any`, unchecked casts, and non-null assertions.
- Prefer small named functions, explicit domain types, and Zod at network boundaries.
- Preserve labels, keyboard semantics, live regions, reduced-motion behavior, focus visibility, and sufficient contrast.
- Lab 01 keeps the OpenAI SDK and standard key in the server route and forwards the audio stream.
- Lab 02 keeps client-secret creation on the server and WebRTC media in the browser. Keep `historyStoreAudio` and tracing disabled unless a documented data review justifies changing them.
- Do not add agent tools without schemas, authorization, auditability, and human approval for consequential actions.
- Use Lucide icons and each lab's existing CSS tokens. Do not add another component or styling system without an architectural reason.
- Unit tests must not make live OpenAI calls.

## Documentation convention

Every lab tutorial must include exact prerequisites, terminal location, commands, folders, files, checkpoints, expected output, common failures, cleanup, tests, deploy, and production limitations. Update the lab README and tutorial whenever behavior or architecture changes.

## Definition of done

1. User behavior and failure states are implemented.
2. The security and privacy constraints still hold.
3. Relevant tests exist and make no paid API calls.
4. The complete check passes for every affected lab.
5. Root catalog, lab README, and workshop agree with the code.
6. `git status` contains no environment file or generated artifact.
