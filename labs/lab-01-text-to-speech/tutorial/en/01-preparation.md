---
layout: default
title: "Lab 01 · Chapter 1 — Preparation"
description: "Prepare the account, terminal, API key, and Text to Speech lab base."
lang: en
lab_label: "Lab 01 · Text to Speech"
lab_index: "/labs/lab-01-text-to-speech/tutorial/tutorial-en.html"
lab_index_label: "Lab 01 index"
step_label: "Preparation"
step_position: "Step 1 of 3"
alternate_url: "/labs/lab-01-text-to-speech/tutorial/pt/01-preparacao.html"
alternate_lang: pt-BR
alternate_label: "Leia em português"
checkpoint_url: "/labs/lab-01-text-to-speech/tutorial/tutorial-en.html#recovery-checkpoints"
checkpoint_label: "Lab 01 checkpoints"
previous_url: "/labs/lab-01-text-to-speech/tutorial/tutorial-en.html"
previous_label: "Overview and Start in 5 minutes"
previous_kicker: "← Previous"
next_url: "/labs/lab-01-text-to-speech/tutorial/en/02-file-by-file-build.html"
next_label: "Build the application file by file"
next_kicker: "Next chapter →"
chapter_nav_label: "Lab 01 workshop navigation"
---

# Lab 01 · Chapter 1 — Prepare the account, terminal, and project

[← Overview](../tutorial-en.md) · [Português](../pt/01-preparacao.md) · [Next: file-by-file build →](02-file-by-file-build.md)

This chapter prepares everything the code needs. You will finish with a compilable base, your own branch, and an API key protected outside Git.

## 1. Open a terminal and verify the tools

Open a new terminal. On Windows, use PowerShell, Git Bash, or WSL. Run:

```bash
node --version
npm --version
git --version
```

Continue only when Node.js reports `v20` or newer and both npm and Git print a version. If a command is missing, install the tool and reopen the terminal. Do not compensate for an incomplete environment by changing application code.

## 2. Create or select an OpenAI API project

This lab uses the API Platform. ChatGPT subscriptions and API usage are billed separately.

1. Open <https://platform.openai.com/>.
2. Sign in with the account responsible for this lab.
3. Create or select a learning project such as `openai-voice-labs`.
4. Confirm API billing or credits.
5. Configure budget alerts and monitor usage during tests.
6. Open **API Keys** and create a key named `voice-labs-local`.

Copy the key once. Never paste it into chat, screenshots, issues, source code, or `.env.example`. If it appears in one of those places, revoke it and create a replacement.

## 3. Choose the starting point

### Recommended: starter branch

Move to your projects directory:

```bash
cd ~/projects
```

Clone the starter and create your own branch:

```bash
git clone --branch workshop/lab-01-v1-starter \
  https://github.com/glaucia86/openai-voice-playground.git
cd openai-voice-playground
git switch -c my-lab-01-solution
```

Install the exact locked dependencies and run the first checkpoint:

```bash
npm ci --prefix labs/lab-01-text-to-speech
npm run check:lab01
```

The command must finish cleanly. Speech generation does not exist yet; this proves the environment before adding the integration.

### Alternative: absolutely empty directory

To practice scaffolding too, run:

```bash
mkdir -p openai-voice-labs/labs/lab-01-text-to-speech
cd openai-voice-labs/labs/lab-01-text-to-speech
npm init -y
```

Install runtime dependencies:

```bash
npm install next@15.5.20 react@19.2.7 react-dom@19.2.7 \
  openai@^6.48.0 zod@^4.4.3 lucide-react@^1.25.0 \
  @fontsource-variable/manrope@^5.2.8 \
  @fontsource-variable/jetbrains-mono@^5.2.8 \
  @upstash/ratelimit@2.0.8 @upstash/redis@1.38.0
```

Install development tools:

```bash
npm install --save-dev @types/node@^26.1.1 @types/react@^19.2.17 \
  @types/react-dom@^19.2.3 oxlint@^1.74.0 vitest@^4.1.10 \
  @vitest/coverage-v8@^4.1.10 typescript@5.8.2 \
  typescript7@npm:typescript@7.0.2
```

`npm install` creates `package-lock.json`. Never write that file manually.

## 4. Enter the correct directory

If you chose the starter, run:

```bash
cd labs/lab-01-text-to-speech
pwd
```

The path must end in `openai-voice-playground/labs/lab-01-text-to-speech`. Every file command in the next chapter starts there.

## 5. Create the local environment file

macOS, Linux, or Git Bash:

```bash
cp .env.example .env.local
```

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Open `.env.local` and set only the local key:

```dotenv
OPENAI_API_KEY=replace_with_your_project_key
PLAYGROUND_ACCESS_TOKEN=
APP_ORIGIN=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
CLIENT_IP_HEADER=
```

Do not add quotes or a `NEXT_PUBLIC_` prefix. The browser must never receive this key.

## 6. Prove the secret is ignored

Run inside Lab 01:

```bash
git check-ignore -v .env.local
git status -sb
```

Git must print the ignore rule, and `.env.local` must not appear in status. Stop and fix `.gitignore` if either condition fails.

## Chapter checkpoint

- [ ] Node.js, npm, and Git respond;
- [ ] you are on your own branch;
- [ ] dependencies are installed;
- [ ] `.env.local` contains the key only on your machine;
- [ ] Git proves that `.env.local` is ignored;
- [ ] no paid request was required.

> **Comprehension prompt:** why should you prove that `.env.local` is ignored before creating the first route?

**Conclusion:** environment, branch, and secret are ready. The next chapter builds the contract, server, streaming path, interface, and tests in verifiable slices.

[Next: build the application file by file →](02-file-by-file-build.md)
