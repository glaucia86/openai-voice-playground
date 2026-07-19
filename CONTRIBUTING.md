# Contributing

Thanks for helping make OpenAI Voice Playground clearer, safer, or more useful.

## Before you start

1. Read [AGENTS.md](AGENTS.md) for repository constraints and validation commands.
2. Open an issue for a significant feature or architectural change.
3. Never attach real API keys, customer audio, private recordings, or transcripts.

## Local workflow

```bash
npm install
cp .env.example .env.local
npm run dev
```

Unit tests must not call the live OpenAI API. Mock the narrow SDK boundary when route behavior needs coverage.

Before opening a pull request:

```bash
npm run check
```

## Pull requests

Keep pull requests focused. Explain:

- the user or educational problem being solved;
- the important decision and its trade-off;
- how you validated success and failure paths;
- whether README, tutorial, deployment, privacy, cost, or accessibility behavior changed.

Use a Conventional Commit-style summary when practical, for example `feat: add transcription vocabulary hints`.

## Design principles

- A polished screen does not excuse a weak server boundary.
- A clever abstraction is not automatically easier to teach.
- Streaming is an architectural choice, not a visual loading effect.
- “Production-ready” claims must name the deployment assumptions that make them true.
