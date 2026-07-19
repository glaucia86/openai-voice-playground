# OpenAI Voice Labs

Production-minded, open-source workshops for learning how to build voice experiences with OpenAI. Each lab is a complete Next.js application with its own dependencies, tests, deployment instructions, and detailed Portuguese workshop guide.

> Educational project maintained by [Glaucia Lemos](https://github.com/glaucia86). It is not an official OpenAI product.

[Leia em português](README-PT-BR.md) · [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md)

## Labs

| Lab | What you build | Architecture | Guide |
| --- | --- | --- | --- |
| [01 — Text to speech](labs/lab-01-text-to-speech) | An accessible interface that turns text into expressive, downloadable audio | Bounded HTTP request with a streamed audio response | [Portuguese workshop](labs/lab-01-text-to-speech/tutorial/tutorial.md) |
| [02 — Realtime voice agent](labs/lab-02-realtime-voice-agent) | A fluid, interruptible speech-to-speech conversational agent | Stateful Realtime session over WebRTC with an ephemeral client secret | [Portuguese workshop](labs/lab-02-realtime-voice-agent/tutorial/tutorial.md) |

The projects intentionally do not share a runtime package. Independent lockfiles make each workshop easier to teach, clone, test, and deploy in isolation.

## Quick start

Requirements: Node.js 20 or newer, npm, an OpenAI project API key, and a browser with microphone support for Lab 02.

```bash
git clone https://github.com/glaucia86/openai-voice-playground.git
cd openai-voice-playground
npm run install:labs
```

Choose one lab, create its local environment file, and start it:

```bash
cd labs/lab-01-text-to-speech
cp .env.example .env.local
npm run dev
```

Add `OPENAI_API_KEY` only to that untracked `.env.local`. Never commit an environment file. For Lab 02, replace the directory name with `lab-02-realtime-voice-agent`.

## Repository commands

From the root:

```bash
npm run dev:lab01
npm run dev:lab02
npm run check:lab01
npm run check:lab02
npm run check
```

Run only one development server at a time unless you explicitly assign different ports.

## Deploy to Vercel

Import this repository as a separate Vercel project for each lab. Set the project’s **Root Directory** to the selected directory:

- `labs/lab-01-text-to-speech`
- `labs/lab-02-realtime-voice-agent`

Add `OPENAI_API_KEY` in Vercel’s encrypted environment settings, optionally add `PLAYGROUND_ACCESS_TOKEN`, and deploy from `main`. Do not upload `.env.local`.

## Security boundary

- The standard OpenAI API key is server-only.
- Lab 01 proxies a bounded TTS request and streams audio through a Route Handler.
- Lab 02 mints a short-lived Realtime client secret; the standard key never reaches browser code.
- Application logs contain request metadata, not prompts, transcripts, credentials, or audio.
- Local rate limits are teaching-oriented defense in depth, not a complete public SaaS perimeter.

Read each workshop before reusing these patterns in production. The guides document the assumptions and missing operational controls rather than hiding them behind a “production-ready” label.

## License

[MIT](LICENSE)
