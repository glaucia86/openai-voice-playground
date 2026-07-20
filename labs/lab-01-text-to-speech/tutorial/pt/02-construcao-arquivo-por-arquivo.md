---
layout: default
title: "Lab 01 · Capítulo 2 — Construção arquivo por arquivo"
description: "Crie a aplicação Text to Speech com o conteúdo completo de cada arquivo."
---

# Lab 01 · Capítulo 2 — Construa arquivo por arquivo

[← Preparação](01-preparacao.md) · [English](../en/02-file-by-file-build.md) · [Próximo: execução, testes e deploy →](03-execucao-testes-deploy.md)

Este capítulo é deliberadamente operacional. Trabalhe dentro do diretório do laboratório, crie os arquivos na ordem mostrada e execute o checkpoint de cada fatia antes de continuar.

> Este arquivo é gerado por `npm run docs:generate` a partir do código validado. Não edite os blocos de código manualmente; atualize a implementação e regenere a documentação.

## Confirme o terminal

Antes do primeiro arquivo, execute `pwd`. O resultado precisa terminar no diretório abaixo:

```text
labs/lab-01-text-to-speech
```

## Passo 1 — Configure uma base reproduzível

Agora crie a configuração que faz Next.js, TypeScript, Vitest e Oxlint concordarem. Se você veio do starter, abra cada arquivo e compare; se veio de uma pasta vazia, crie-o.

No terminal do laboratório, garanta que as pastas e os arquivos existam:

```bash
mkdir -p scripts src/types
touch .env.example .gitignore package.json next.config.mjs tsconfig.json vitest.config.ts scripts/typecheck.mjs src/types/assets.d.ts
```

### 1.1 Crie `.env.example`

Liste somente nomes de variáveis com valores vazios. A chave real ficará em `.env.local`.

Abra `.env.example`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>.env.example</strong></summary>

```dotenv
# Server-only. Never prefix this variable with NEXT_PUBLIC_.
OPENAI_API_KEY=

# Required in production; optional only for local development and tests.
# The UI keeps this shared bearer token in memory, never browser storage.
PLAYGROUND_ACCESS_TOKEN=

# Required in production. Example: https://voice.example.com
APP_ORIGIN=

# Required in production for a quota shared by every serverless instance.
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Required outside Vercel. Name a client-IP header that your trusted proxy
# overwrites (for example x-forwarded-for). Vercel defaults to
# x-vercel-forwarded-for, which Vercel overwrites at its edge.
CLIENT_IP_HEADER=
```

</details>

### 1.2 Crie `.gitignore`

Proteja segredos, dependências e artefatos gerados antes do primeiro commit.

Abra `.gitignore`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>.gitignore</strong></summary>

```text
.env*
!.env.example
.next/
node_modules/
coverage/
playwright-report/
test-results/
.vercel/
*.tsbuildinfo
.DS_Store
```

</details>

### 1.3 Crie `package.json`

Defina scripts, versões e dependências reproduzíveis. Não edite `package-lock.json` manualmente.

Abra `package.json`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>package.json</strong></summary>

```json
{
  "name": "openai-voice-lab-01-text-to-speech",
  "version": "1.0.0",
  "private": true,
  "description": "A production-minded OpenAI text-to-speech workshop built with Next.js.",
  "license": "MIT",
  "author": "Glaucia Lemos",
  "repository": {
    "type": "git",
    "url": "https://github.com/glaucia86/openai-voice-playground.git"
  },
  "bugs": {
    "url": "https://github.com/glaucia86/openai-voice-playground/issues"
  },
  "homepage": "https://github.com/glaucia86/openai-voice-playground/tree/main/labs/lab-01-text-to-speech#readme",
  "engines": {
    "node": ">=20.0.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "oxlint --deny-warnings src tests",
    "typecheck": "node scripts/typecheck.mjs --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "check": "npm run lint && npm run typecheck && npm run test && npm run build"
  },
  "dependencies": {
    "@fontsource-variable/jetbrains-mono": "^5.2.8",
    "@fontsource-variable/manrope": "^5.2.8",
    "@upstash/ratelimit": "2.0.8",
    "@upstash/redis": "1.38.0",
    "lucide-react": "^1.25.0",
    "next": "15.5.20",
    "openai": "^6.48.0",
    "react": "19.2.7",
    "react-dom": "19.2.7",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@types/node": "^26.1.1",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitest/coverage-v8": "^4.1.10",
    "oxlint": "^1.74.0",
    "typescript": "5.8.2",
    "typescript7": "npm:typescript@7.0.2",
    "vitest": "^4.1.10"
  },
  "overrides": {
    "postcss": "8.5.20"
  }
}
```

</details>

### 1.4 Crie `next.config.mjs`

Configure headers, limites e comportamento de produção do Next.js.

Abra `next.config.mjs`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>next.config.mjs</strong></summary>

```js
import { fileURLToPath } from "node:url";

const isProduction = process.env.NODE_ENV === "production";
const sourceDirectory = fileURLToPath(new URL("./src", import.meta.url));

const securityHeaders = [
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  ...(isProduction
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000" }]
    : []),
];

/** @type {import("next").NextConfig} */
const nextConfig = {
  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
  poweredByHeader: false,
  reactStrictMode: true,
  // Next 15's embedded checker cannot load TypeScript 7. `npm run typecheck`
  // remains a required, separate gate before every build in `npm run check` and CI.
  typescript: {
    ignoreBuildErrors: true,
  },
  // Oxlint runs as a separate required gate. Next 15's embedded lint path also
  // attempts to replace TypeScript 7 with 5.8, so the duplicate pass is skipped.
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    // Next 15 does not read TS 7's path mapping correctly during bundling.
    config.resolve.alias["@"] = sourceDirectory;
    return config;
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
```

</details>

### 1.5 Crie `tsconfig.json`

Ative tipagem estrita e o alias `@/` usado pelos imports.

Abra `tsconfig.json`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>tsconfig.json</strong></summary>

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

</details>

### 1.6 Crie `vitest.config.ts`

Ensine o Vitest a resolver o mesmo alias e medir os arquivos relevantes.

Abra `vitest.config.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>vitest.config.ts</strong></summary>

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["src/lib/**/*.ts"],
      exclude: ["src/lib/openai.ts"],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 75,
      },
    },
  },
});
```

</details>

### 1.7 Crie `scripts/typecheck.mjs`

Execute o compilador TypeScript 7 separado do compilador usado pelo Next.js.

Abra `scripts/typecheck.mjs`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>scripts/typecheck.mjs</strong></summary>

```js
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const compilerPath = join(
  process.cwd(),
  "node_modules",
  "typescript7",
  "bin",
  "tsc",
);

if (!existsSync(compilerPath)) {
  console.error(
    "TypeScript 7 não foi encontrado. Execute `npm install` antes do typecheck.",
  );
  process.exit(1);
}

const result = spawnSync(process.execPath, [compilerPath, ...process.argv.slice(2)], {
  stdio: "inherit",
});

if (result.error) {
  console.error(`Não foi possível executar o TypeScript 7: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
```

</details>

### 1.8 Crie `src/types/assets.d.ts`

Declare imports de assets que participam da interface.

Abra `src/types/assets.d.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>src/types/assets.d.ts</strong></summary>

```ts
declare module "*.css";
declare module "@fontsource-variable/jetbrains-mono";
declare module "@fontsource-variable/manrope";
```

</details>

### Checkpoint do passo 1

Salve todos os arquivos e execute:

```bash
npm run typecheck
```

Não avance enquanto o comando retornar erro. Leia a primeira mensagem, confira o caminho do arquivo e compare com o checkpoint antes de reinstalar dependências.

## Passo 2 — Crie o contrato antes da chamada de voz

A primeira fatia funcional não chama a OpenAI. Ela define exatamente o que o navegador pode pedir e prova as regras com testes rápidos.

No terminal do laboratório, garanta que as pastas e os arquivos existam:

```bash
mkdir -p src/lib tests
touch src/lib/constants.ts src/lib/schemas.ts tests/schemas.test.ts
```

### 2.1 Crie `src/lib/constants.ts`

Centralize allowlists e limites que não podem ser escolhidos livremente pelo cliente.

Abra `src/lib/constants.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>src/lib/constants.ts</strong></summary>

```ts
export const VOICES = [
  { id: "alloy", label: "Alloy", character: "Balanced and versatile" },
  { id: "ash", label: "Ash", character: "Clear and conversational" },
  { id: "ballad", label: "Ballad", character: "Warm and expressive" },
  { id: "coral", label: "Coral", character: "Bright and engaging" },
  { id: "echo", label: "Echo", character: "Calm and measured" },
  { id: "fable", label: "Fable", character: "Narrative and textured" },
  { id: "nova", label: "Nova", character: "Energetic and polished" },
  { id: "onyx", label: "Onyx", character: "Grounded and resonant" },
  { id: "sage", label: "Sage", character: "Composed and thoughtful" },
  { id: "shimmer", label: "Shimmer", character: "Light and articulate" },
  { id: "verse", label: "Verse", character: "Natural and dynamic" },
  { id: "marin", label: "Marin", character: "Natural, high-quality voice" },
  { id: "cedar", label: "Cedar", character: "Natural, high-quality voice" },
] as const;

export const VOICE_IDS = VOICES.map((voice) => voice.id) as [
  (typeof VOICES)[number]["id"],
  ...(typeof VOICES)[number]["id"][],
];

export const AUDIO_FORMATS = ["mp3", "wav", "opus"] as const;

export const MAX_SPEECH_CHARACTERS = 4_096;
export const MAX_INSTRUCTIONS_CHARACTERS = 4_096;

export type VoiceId = (typeof VOICE_IDS)[number];
export type AudioFormat = (typeof AUDIO_FORMATS)[number];
```

</details>

### 2.2 Crie `src/lib/schemas.ts`

Transforme a entrada não confiável num contrato estrito e tipado.

Abra `src/lib/schemas.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>src/lib/schemas.ts</strong></summary>

```ts
import { z } from "zod";

import {
  AUDIO_FORMATS,
  MAX_INSTRUCTIONS_CHARACTERS,
  MAX_SPEECH_CHARACTERS,
  VOICE_IDS,
} from "@/lib/constants";

export const speechRequestSchema = z
  .object({
    text: z.string().trim().min(1).max(MAX_SPEECH_CHARACTERS),
    voice: z.enum(VOICE_IDS),
    format: z.enum(AUDIO_FORMATS).default("mp3"),
    instructions: z
      .string()
      .trim()
      .max(MAX_INSTRUCTIONS_CHARACTERS)
      .optional()
      .default(""),
    speed: z.coerce.number().min(0.25).max(4).default(1),
  })
  .strict();

export type SpeechRequest = z.infer<typeof speechRequestSchema>;
```

</details>

### 2.3 Crie `tests/schemas.test.ts`

Crie o teste que prova esta responsabilidade sem chamar a OpenAI.

Abra `tests/schemas.test.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>tests/schemas.test.ts</strong></summary>

```ts
import { describe, expect, it } from "vitest";

import { speechRequestSchema } from "../src/lib/schemas";

describe("speechRequestSchema", () => {
  it("applies safe defaults to a minimal request", () => {
    const result = speechRequestSchema.parse({ text: "Hello", voice: "marin" });

    expect(result).toEqual({
      text: "Hello",
      voice: "marin",
      format: "mp3",
      instructions: "",
      speed: 1,
    });
  });

  it("trims text and accepts supported controls", () => {
    const result = speechRequestSchema.parse({
      text: "  A clear explanation.  ",
      voice: "cedar",
      format: "wav",
      instructions: "  Speak calmly.  ",
      speed: "1.25",
    });

    expect(result.text).toBe("A clear explanation.");
    expect(result.instructions).toBe("Speak calmly.");
    expect(result.speed).toBe(1.25);
  });

  it("rejects unsupported voices and extra fields", () => {
    expect(() => speechRequestSchema.parse({ text: "Hello", voice: "celebrity" })).toThrow();
    expect(() =>
      speechRequestSchema.parse({ text: "Hello", voice: "marin", apiKey: "never" }),
    ).toThrow();
  });

  it("enforces the upstream text and speed limits", () => {
    expect(() => speechRequestSchema.parse({ text: "x".repeat(4_097), voice: "marin" })).toThrow();
    expect(() => speechRequestSchema.parse({ text: "Hello", voice: "marin", speed: 4.1 })).toThrow();
  });
});
```

</details>

### Checkpoint do passo 2

Salve todos os arquivos e execute:

```bash
npm test -- schemas.test.ts
```

Não avance enquanto o comando retornar erro. Leia a primeira mensagem, confira o caminho do arquivo e compare com o checkpoint antes de reinstalar dependências.

## Passo 3 — Construa o backend seguro e o streaming

Nesta fatia você cria erros sanitizados, limites, observabilidade sem conteúdo, cliente OpenAI, health check e a rota que encaminha o áudio. Crie os arquivos na ordem apresentada.

No terminal do laboratório, garanta que as pastas e os arquivos existam:

```bash
mkdir -p src/lib src/app/api/health src/app/api/speech src tests
touch src/lib/errors.ts src/lib/observability.ts src/lib/openai.ts src/lib/rate-limit.ts src/lib/request-body.ts src/lib/security-config.ts src/lib/request-guard.ts src/app/api/health/route.ts src/app/api/speech/route.ts src/middleware.ts tests/errors.test.ts tests/observability.test.ts tests/rate-limit.test.ts tests/request-body.test.ts tests/request-guard.test.ts tests/security-config.test.ts tests/middleware.test.ts
```

### 3.1 Crie `src/lib/errors.ts`

Normalize falhas numa resposta estável sem devolver detalhes crus do provedor.

Abra `src/lib/errors.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>src/lib/errors.ts</strong></summary>

```ts
import OpenAI from "openai";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly headers: Record<string, string> = {},
  ) {
    super(message);
    this.name = "AppError";
  }
}

type ErrorBody = {
  error: {
    code: string;
    message: string;
    requestId: string;
  };
};

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  if (error instanceof ZodError) {
    return new AppError(
      400,
      "invalid_request",
      error.issues[0]?.message ?? "The request is invalid.",
    );
  }

  if (error instanceof SyntaxError) {
    return new AppError(400, "invalid_json", "The request body is not valid JSON.");
  }

  if (error instanceof OpenAI.APIError) {
    if (error.status === 429) {
      return new AppError(
        429,
        "upstream_rate_limit",
        "The voice service is busy. Please try again shortly.",
      );
    }

    if (error.status === 401 || error.status === 403) {
      return new AppError(
        503,
        "upstream_authentication_error",
        "The voice service is temporarily unavailable.",
      );
    }

    return new AppError(
      502,
      "upstream_error",
      "OpenAI could not complete the request. Please try again.",
    );
  }

  if (error instanceof Error && error.name === "AbortError") {
    return new AppError(499, "request_cancelled", "The request was cancelled.");
  }

  return new AppError(500, "internal_error", "Something went wrong. Please try again.");
}

export function errorResponse(
  error: unknown,
  requestId: string,
  headers?: HeadersInit,
): Response {
  const normalized = normalizeError(error);
  const responseHeaders = new Headers(headers);
  for (const [name, value] of Object.entries(normalized.headers)) {
    responseHeaders.set(name, value);
  }
  responseHeaders.set("Cache-Control", "no-store");
  responseHeaders.set("X-Request-Id", requestId);
  const body: ErrorBody = {
    error: {
      code: normalized.code,
      message: normalized.message,
      requestId,
    },
  };

  return Response.json(body, {
    status: normalized.status,
    headers: responseHeaders,
  });
}
```

</details>

### 3.2 Crie `src/lib/observability.ts`

Registre somente metadados operacionais; texto, áudio e credenciais ficam fora dos logs.

Abra `src/lib/observability.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>src/lib/observability.ts</strong></summary>

```ts
type LogLevel = "info" | "error";

type VoiceLog = {
  event: string;
  requestId: string;
  route: "speech";
  durationMs: number;
  status: number;
  model?: string;
  inputSize?: number;
  outputSize?: number;
};

export function logVoiceRequest(level: LogLevel, log: VoiceLog): void {
  const serialized = JSON.stringify({
    timestamp: new Date().toISOString(),
    ...log,
  });

  if (level === "error") {
    console.error(serialized);
  } else {
    console.info(serialized);
  }
}
```

</details>

### 3.3 Crie `src/lib/openai.ts`

Crie o cliente OpenAI de forma preguiçosa e somente no servidor.

Abra `src/lib/openai.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>src/lib/openai.ts</strong></summary>

```ts
import OpenAI from "openai";

import { AppError } from "@/lib/errors";

const globalForOpenAI = globalThis as unknown as { openai?: OpenAI };

export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new AppError(
      503,
      "configuration_error",
      "The voice service is not configured.",
    );
  }

  globalForOpenAI.openai ??= new OpenAI({
    apiKey,
    maxRetries: 2,
    timeout: 45_000,
  });

  return globalForOpenAI.openai;
}
```

</details>

### 3.4 Crie `src/lib/rate-limit.ts`

Implemente quota local no desenvolvimento e distribuída no ambiente de produção.

Abra `src/lib/rate-limit.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>src/lib/rate-limit.ts</strong></summary>

```ts
import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

type RateLimitOptions = {
  limit: number;
  windowMs: number;
  now?: number;
};

const globalForRateLimit = globalThis as unknown as {
  voicePlaygroundRateLimits?: Map<string, RateLimitEntry>;
  voicePlaygroundDistributedLimiters?: Map<string, Ratelimit>;
};

const entries =
  globalForRateLimit.voicePlaygroundRateLimits ?? new Map<string, RateLimitEntry>();
const distributedLimiters =
  globalForRateLimit.voicePlaygroundDistributedLimiters ?? new Map<string, Ratelimit>();

globalForRateLimit.voicePlaygroundRateLimits = entries;
globalForRateLimit.voicePlaygroundDistributedLimiters = distributedLimiters;

export async function checkRateLimit(
  key: string,
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (redisUrl && redisToken) {
    const limiter = getDistributedLimiter(redisUrl, redisToken, options);
    const result = await limiter.limit(key);
    return {
      allowed: result.success,
      limit: result.limit,
      remaining: result.remaining,
      resetAt: result.reset,
    };
  }

  return checkLocalRateLimit(key, options);
}

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "RateLimit-Limit": String(result.limit),
    "RateLimit-Remaining": String(result.remaining),
    "RateLimit-Reset": String(Math.ceil(result.resetAt / 1_000)),
    ...(!result.allowed
      ? { "Retry-After": String(Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1_000))) }
      : {}),
  };
}

export function resetRateLimitsForTests(): void {
  entries.clear();
  distributedLimiters.clear();
}

function checkLocalRateLimit(
  key: string,
  { limit, windowMs, now = Date.now() }: RateLimitOptions,
): RateLimitResult {
  const current = entries.get(key);

  if (!current || current.resetAt <= now) {
    const resetAt = now + windowMs;
    entries.set(key, { count: 1, resetAt });
    cleanExpiredEntries(now);
    return { allowed: true, limit, remaining: limit - 1, resetAt };
  }

  if (current.count >= limit) {
    return { allowed: false, limit, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - current.count),
    resetAt: current.resetAt,
  };
}

function getDistributedLimiter(
  url: string,
  token: string,
  { limit, windowMs }: RateLimitOptions,
): Ratelimit {
  const cacheKey = `${limit}:${windowMs}`;
  const existing = distributedLimiters.get(cacheKey);
  if (existing) return existing;

  const limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.fixedWindow(limit, `${windowMs} ms` as Duration),
    analytics: false,
    prefix: "openai-voice-playground:lab-01",
  });
  distributedLimiters.set(cacheKey, limiter);
  return limiter;
}

function cleanExpiredEntries(now: number): void {
  if (entries.size < 1_000) return;

  for (const [key, entry] of entries) {
    if (entry.resetAt <= now) entries.delete(key);
  }
}
```

</details>

### 3.5 Crie `src/lib/request-body.ts`

Limite os bytes realmente lidos antes de interpretar JSON.

Abra `src/lib/request-body.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>src/lib/request-body.ts</strong></summary>

```ts
import { AppError } from "@/lib/errors";

export async function readJsonBody(
  request: Request,
  maxBytes: number,
  tooLargeMessage: string,
): Promise<unknown> {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("application/json")) {
    throw new AppError(
      415,
      "unsupported_media_type",
      "The request Content-Type must be application/json.",
    );
  }

  const advertisedLength = readContentLength(request);
  if (advertisedLength !== undefined && advertisedLength > maxBytes) {
    throw new AppError(413, "request_too_large", tooLargeMessage);
  }

  if (!request.body) {
    throw new AppError(400, "invalid_json", "The request body is not valid JSON.");
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    totalBytes += value.byteLength;
    if (totalBytes > maxBytes) {
      await reader.cancel();
      throw new AppError(413, "request_too_large", tooLargeMessage);
    }
    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(body);
    return JSON.parse(text) as unknown;
  } catch {
    throw new AppError(400, "invalid_json", "The request body is not valid JSON.");
  }
}

function readContentLength(request: Request): number | undefined {
  const value = request.headers.get("content-length");
  if (!value || !/^\d+$/.test(value)) return undefined;
  return Number(value);
}
```

</details>

### 3.6 Crie `src/lib/security-config.ts`

Faça produção falhar fechada quando proteções obrigatórias estiverem ausentes.

Abra `src/lib/security-config.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>src/lib/security-config.ts</strong></summary>

```ts
export type SecurityConfiguration = {
  isProduction: boolean;
  ready: boolean;
  missingVariables: string[];
  clientIpHeader: string;
  distributedRateLimit: boolean;
  requiresAccessToken: boolean;
};

type RuntimeEnvironment = Record<string, string | undefined>;

const HEADER_NAME_PATTERN = /^[a-z0-9-]+$/;
const FORBIDDEN_IDENTITY_HEADERS = new Set([
  "authorization",
  "cookie",
  "proxy-authorization",
]);

export function getSecurityConfiguration(
  environment: RuntimeEnvironment = process.env,
): SecurityConfiguration {
  const isProduction = environment.NODE_ENV === "production";
  const accessToken = environment.PLAYGROUND_ACCESS_TOKEN?.trim();
  const redisUrl = environment.UPSTASH_REDIS_REST_URL?.trim();
  const redisToken = environment.UPSTASH_REDIS_REST_TOKEN?.trim();
  const configuredHeader = environment.CLIENT_IP_HEADER?.trim().toLowerCase();
  const clientIpHeader = configuredHeader || (environment.VERCEL ? "x-vercel-forwarded-for" : "");
  const validClientIpHeader = Boolean(
    clientIpHeader &&
      HEADER_NAME_PATTERN.test(clientIpHeader) &&
      !FORBIDDEN_IDENTITY_HEADERS.has(clientIpHeader),
  );

  const missingVariables: string[] = [];
  if (isProduction) {
    if (!accessToken) missingVariables.push("PLAYGROUND_ACCESS_TOKEN");
    if (!environment.APP_ORIGIN?.trim()) missingVariables.push("APP_ORIGIN");
    if (!redisUrl) missingVariables.push("UPSTASH_REDIS_REST_URL");
    if (!redisToken) missingVariables.push("UPSTASH_REDIS_REST_TOKEN");
    if (!validClientIpHeader) missingVariables.push("CLIENT_IP_HEADER");
  }

  return {
    isProduction,
    ready: missingVariables.length === 0,
    missingVariables,
    clientIpHeader: validClientIpHeader ? clientIpHeader : "x-forwarded-for",
    distributedRateLimit: Boolean(redisUrl && redisToken),
    requiresAccessToken: Boolean(accessToken) || isProduction,
  };
}
```

</details>

### 3.7 Crie `src/lib/request-guard.ts`

Aplique origem, acesso e quota antes de qualquer operação faturável.

Abra `src/lib/request-guard.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>src/lib/request-guard.ts</strong></summary>

```ts
import { createHash, timingSafeEqual } from "node:crypto";

import { AppError } from "@/lib/errors";
import {
  checkRateLimit,
  rateLimitHeaders,
  type RateLimitResult,
} from "@/lib/rate-limit";
import { getSecurityConfiguration } from "@/lib/security-config";

const AUTH_ATTEMPTS_PER_MINUTE = 30;
const REQUESTS_PER_MINUTE = 10;
const WINDOW_MS = 60_000;

export async function guardApiRequest(
  request: Request,
  scope: string,
): Promise<RateLimitResult> {
  const security = getSecurityConfiguration();
  if (!security.ready) {
    throw new AppError(
      503,
      "security_configuration_incomplete",
      "The service security configuration is incomplete.",
    );
  }

  assertSameOrigin(request);
  const clientKey = hashIdentifier(getClientAddress(request, security.clientIpHeader));
  const authenticationLimit = await applyRateLimit(
    `authentication:${clientKey}`,
    AUTH_ATTEMPTS_PER_MINUTE,
  );
  assertAccessToken(request, rateLimitHeaders(authenticationLimit));

  return applyRateLimit(`${scope}:${clientKey}`, REQUESTS_PER_MINUTE);
}

export { rateLimitHeaders };

async function applyRateLimit(key: string, limit: number): Promise<RateLimitResult> {
  let result: RateLimitResult;
  try {
    result = await checkRateLimit(key, { limit, windowMs: WINDOW_MS });
  } catch {
    throw new AppError(
      503,
      "rate_limiter_unavailable",
      "The service cannot safely verify request quota right now. Please try again.",
    );
  }

  if (!result.allowed) {
    throw new AppError(
      429,
      "rate_limit_exceeded",
      "Too many requests. Please wait a moment and try again.",
      rateLimitHeaders(result),
    );
  }
  return result;
}

function assertSameOrigin(request: Request): void {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") {
    throw new AppError(403, "cross_origin_request", "Cross-origin requests are blocked.");
  }

  const origin = request.headers.get("origin");
  if (!origin) return;

  const expectedOrigin = process.env.APP_ORIGIN || new URL(request.url).origin;

  try {
    if (new URL(origin).origin !== new URL(expectedOrigin).origin) {
      throw new AppError(
        403,
        "cross_origin_request",
        "Cross-origin requests are blocked.",
      );
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(403, "invalid_origin", "The request origin is invalid.");
  }
}

function assertAccessToken(request: Request, headers: Record<string, string>): void {
  const expected = process.env.PLAYGROUND_ACCESS_TOKEN?.trim();
  if (!expected) return;

  const authorization = request.headers.get("authorization");
  const received = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";

  if (!safeEqual(received, expected)) {
    throw new AppError(
      401,
      "unauthorized",
      "A valid playground access token is required.",
      headers,
    );
  }
}

function safeEqual(received: string, expected: string): boolean {
  const receivedDigest = createHash("sha256").update(received).digest();
  const expectedDigest = createHash("sha256").update(expected).digest();
  return timingSafeEqual(receivedDigest, expectedDigest);
}

function getClientAddress(request: Request, headerName: string): string {
  const address = request.headers.get(headerName)?.split(",")[0]?.trim();
  return address?.slice(0, 256) || "unidentified-client";
}

function hashIdentifier(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}
```

</details>

### 3.8 Crie `src/app/api/health/route.ts`

Exponha somente diagnóstico não sensível para provar configuração.

Abra `src/app/api/health/route.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>src/app/api/health/route.ts</strong></summary>

```ts
import { MAX_SPEECH_CHARACTERS } from "@/lib/constants";
import { getSecurityConfiguration } from "@/lib/security-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(): Response {
  const security = getSecurityConfiguration();
  const configurationIssues = [
    ...(!process.env.OPENAI_API_KEY ? ["OPENAI_API_KEY"] : []),
    ...security.missingVariables,
  ];

  return Response.json(
    {
      ok: true,
      service: "openai-voice-lab-01-text-to-speech",
      configured: configurationIssues.length === 0,
      configurationIssues,
      requiresAccessToken: security.requiresAccessToken,
      distributedRateLimit: security.distributedRateLimit,
      capabilities: {
        speechModel: "gpt-4o-mini-tts",
        streamedSpeech: true,
      },
      limits: {
        speechCharacters: MAX_SPEECH_CHARACTERS,
        requestsPerMinute: 10,
      },
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
```

</details>

### 3.9 Crie `src/app/api/speech/route.ts`

Valide, chame a Speech API e encaminhe o stream sem montar o áudio inteiro no servidor.

Abra `src/app/api/speech/route.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>src/app/api/speech/route.ts</strong></summary>

```ts
import { randomUUID } from "node:crypto";

import { AppError, errorResponse, normalizeError } from "@/lib/errors";
import { logVoiceRequest } from "@/lib/observability";
import { getOpenAIClient } from "@/lib/openai";
import { readJsonBody } from "@/lib/request-body";
import { guardApiRequest, rateLimitHeaders } from "@/lib/request-guard";
import { speechRequestSchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_JSON_BYTES = 16 * 1024;
const CONTENT_TYPES = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  opus: "audio/ogg; codecs=opus",
} as const;

export async function POST(request: Request): Promise<Response> {
  const requestId = randomUUID();
  const startedAt = performance.now();
  let responseHeaders: Record<string, string> = {};

  try {
    const rateLimit = await guardApiRequest(request, "speech");
    responseHeaders = rateLimitHeaders(rateLimit);

    const payload = speechRequestSchema.parse(
      await readJsonBody(request, MAX_JSON_BYTES, "The speech request is too large."),
    );
    const openai = getOpenAIClient();
    const speech = await openai.audio.speech.create(
      {
        model: "gpt-4o-mini-tts",
        input: payload.text,
        voice: payload.voice,
        ...(payload.instructions ? { instructions: payload.instructions } : {}),
        response_format: payload.format,
        speed: payload.speed,
        stream_format: "audio",
      },
      { signal: request.signal },
    );

    if (!speech.body) {
      throw new AppError(502, "empty_audio_stream", "OpenAI returned an empty audio stream.");
    }

    const upstreamHeadersMs = Math.round(performance.now() - startedAt);
    logVoiceRequest("info", {
      event: "speech.stream_started",
      requestId,
      route: "speech",
      durationMs: upstreamHeadersMs,
      status: 200,
      model: "gpt-4o-mini-tts",
      inputSize: payload.text.length,
    });

    return new Response(speech.body, {
      status: 200,
      headers: {
        ...responseHeaders,
        "Cache-Control": "no-store",
        "Content-Disposition": `inline; filename="voice-${requestId}.${payload.format}"`,
        "Content-Type": CONTENT_TYPES[payload.format],
        "Server-Timing": `openai;dur=${upstreamHeadersMs}`,
        "X-Model": "gpt-4o-mini-tts",
        "X-Request-Id": requestId,
      },
    });
  } catch (error) {
    const normalized = normalizeError(error);
    logVoiceRequest("error", {
      event: "speech.failed",
      requestId,
      route: "speech",
      durationMs: Math.round(performance.now() - startedAt),
      status: normalized.status,
    });
    return errorResponse(normalized, requestId, responseHeaders);
  }
}
```

</details>

### 3.10 Crie `src/middleware.ts`

Adicione headers de segurança e nonce por resposta sem expor segredos.

Abra `src/middleware.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>src/middleware.ts</strong></summary>

```ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const isDevelopment = process.env.NODE_ENV !== "production";
  const contentSecurityPolicy = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDevelopment ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'nonce-${nonce}'${isDevelopment ? " 'unsafe-inline'" : ""}`,
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "media-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(!isDevelopment ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", contentSecurityPolicy);
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
```

</details>

### 3.11 Crie `tests/errors.test.ts`

Crie o teste que prova esta responsabilidade sem chamar a OpenAI.

Abra `tests/errors.test.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>tests/errors.test.ts</strong></summary>

```ts
import OpenAI from "openai";
import { describe, expect, it } from "vitest";

import {
  AppError,
  errorResponse,
  normalizeError,
} from "../src/lib/errors";
import { speechRequestSchema } from "../src/lib/schemas";

describe("normalizeError", () => {
  it("preserves an application error", () => {
    const error = new AppError(418, "teapot", "Short and stout");
    expect(normalizeError(error)).toBe(error);
  });

  it("turns a Zod error into a safe bad request", () => {
    const parsed = speechRequestSchema.safeParse({ text: "", voice: "marin" });
    expect(parsed.success).toBe(false);
    if (parsed.success) return;

    expect(normalizeError(parsed.error)).toMatchObject({
      status: 400,
      code: "invalid_request",
    });
  });

  it("maps malformed JSON", () => {
    expect(normalizeError(new SyntaxError("private parser detail"))).toMatchObject({
      status: 400,
      code: "invalid_json",
      message: "The request body is not valid JSON.",
    });
  });

  it.each([
    [429, 429, "upstream_rate_limit"],
    [401, 503, "upstream_authentication_error"],
    [403, 503, "upstream_authentication_error"],
    [500, 502, "upstream_error"],
  ])("maps OpenAI status %i without exposing the provider message", (upstream, status, code) => {
    const providerError = new OpenAI.APIError(
      upstream,
      { error: { message: "sensitive provider detail" } },
      "sensitive provider detail",
      new Headers(),
    );

    expect(normalizeError(providerError)).toMatchObject({ status, code });
    expect(normalizeError(providerError).message).not.toContain("sensitive");
  });

  it("maps a cancelled request", () => {
    const error = new Error("cancelled");
    error.name = "AbortError";
    expect(normalizeError(error)).toMatchObject({ status: 499, code: "request_cancelled" });
  });

  it("uses a generic fallback for unknown failures", () => {
    expect(normalizeError({ unexpected: true })).toMatchObject({
      status: 500,
      code: "internal_error",
    });
  });
});

describe("errorResponse", () => {
  it("returns the stable no-store envelope and custom headers", async () => {
    const response = errorResponse(
      new AppError(400, "invalid", "Invalid input"),
      "request-123",
      { "RateLimit-Remaining": "9" },
    );

    expect(response.status).toBe(400);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("x-request-id")).toBe("request-123");
    expect(response.headers.get("ratelimit-remaining")).toBe("9");
    await expect(response.json()).resolves.toEqual({
      error: { code: "invalid", message: "Invalid input", requestId: "request-123" },
    });
  });
});
```

</details>

### 3.12 Crie `tests/observability.test.ts`

Crie o teste que prova esta responsabilidade sem chamar a OpenAI.

Abra `tests/observability.test.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>tests/observability.test.ts</strong></summary>

```ts
import { afterEach, describe, expect, it, vi } from "vitest";

import { logVoiceRequest } from "../src/lib/observability";

afterEach(() => vi.restoreAllMocks());

describe("logVoiceRequest", () => {
  const event = {
    event: "speech.stream_started",
    requestId: "request-1",
    route: "speech" as const,
    durationMs: 42,
    status: 200,
    model: "gpt-4o-mini-tts",
    inputSize: 24,
  };

  it("writes structured informational metadata", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
    logVoiceRequest("info", event);

    expect(info).toHaveBeenCalledOnce();
    const parsed = JSON.parse(String(info.mock.calls[0]?.[0])) as Record<string, unknown>;
    expect(parsed).toMatchObject(event);
    expect(parsed.timestamp).toEqual(expect.any(String));
  });

  it("writes failures to stderr", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    logVoiceRequest("error", { ...event, event: "speech.failed", status: 500 });
    expect(error).toHaveBeenCalledOnce();
  });
});
```

</details>

### 3.13 Crie `tests/rate-limit.test.ts`

Crie o teste que prova esta responsabilidade sem chamar a OpenAI.

Abra `tests/rate-limit.test.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>tests/rate-limit.test.ts</strong></summary>

```ts
import { afterEach, describe, expect, it } from "vitest";

import {
  checkRateLimit,
  rateLimitHeaders,
  resetRateLimitsForTests,
} from "../src/lib/rate-limit";

afterEach(() => {
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  resetRateLimitsForTests();
});

describe("checkRateLimit", () => {
  it("allows requests inside the fixed window", async () => {
    const first = await checkRateLimit("speech:client", { limit: 2, windowMs: 1_000, now: 100 });
    const second = await checkRateLimit("speech:client", { limit: 2, windowMs: 1_000, now: 200 });

    expect(first).toMatchObject({ allowed: true, remaining: 1, resetAt: 1_100 });
    expect(second).toMatchObject({ allowed: true, remaining: 0, resetAt: 1_100 });
  });

  it("blocks a request after the limit", async () => {
    await checkRateLimit("speech:client", { limit: 1, windowMs: 1_000, now: 100 });
    const blocked = await checkRateLimit("speech:client", { limit: 1, windowMs: 1_000, now: 200 });

    expect(blocked).toEqual({ allowed: false, limit: 1, remaining: 0, resetAt: 1_100 });
    expect(rateLimitHeaders(blocked)).toMatchObject({ "Retry-After": "1" });
  });

  it("opens a fresh window after reset", async () => {
    await checkRateLimit("speech:client", { limit: 1, windowMs: 1_000, now: 100 });
    const nextWindow = await checkRateLimit("speech:client", {
      limit: 1,
      windowMs: 1_000,
      now: 1_101,
    });

    expect(nextWindow).toMatchObject({ allowed: true, remaining: 0, resetAt: 2_101 });
  });

  it("serializes standard rate-limit headers", () => {
    expect(
      rateLimitHeaders({ allowed: true, limit: 10, remaining: 9, resetAt: 12_345 }),
    ).toEqual({
      "RateLimit-Limit": "10",
      "RateLimit-Remaining": "9",
      "RateLimit-Reset": "13",
    });
  });

  it("periodically removes expired keys", async () => {
    for (let index = 0; index < 1_000; index += 1) {
      await checkRateLimit(`expired:${index}`, { limit: 1, windowMs: 1, now: 0 });
    }

    const result = await checkRateLimit("fresh", { limit: 1, windowMs: 1_000, now: 2 });
    expect(result.allowed).toBe(true);
  });
});
```

</details>

### 3.14 Crie `tests/request-body.test.ts`

Crie o teste que prova esta responsabilidade sem chamar a OpenAI.

Abra `tests/request-body.test.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>tests/request-body.test.ts</strong></summary>

```ts
import { describe, expect, it } from "vitest";

import { readJsonBody } from "../src/lib/request-body";

describe("readJsonBody", () => {
  it("parses a bounded JSON request", async () => {
    const request = new Request("https://voice.example.com/api/speech", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ text: "hello" }),
    });

    await expect(readJsonBody(request, 1_024, "Too large")).resolves.toEqual({ text: "hello" });
  });

  it("rejects an unsupported content type", async () => {
    const request = new Request("https://voice.example.com/api/speech", {
      method: "POST",
      body: "hello",
    });

    await expect(readJsonBody(request, 1_024, "Too large")).rejects.toMatchObject({
      status: 415,
      code: "unsupported_media_type",
    });
  });

  it("rejects an advertised body that is too large", async () => {
    const request = new Request("https://voice.example.com/api/speech", {
      method: "POST",
      headers: { "content-type": "application/json", "content-length": "2048" },
      body: "{}",
    });

    await expect(readJsonBody(request, 10, "Too large")).rejects.toMatchObject({
      status: 413,
      code: "request_too_large",
    });
  });

  it("counts streamed bytes even without Content-Length", async () => {
    const request = new Request("https://voice.example.com/api/speech", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('{"text":"'));
          controller.enqueue(new TextEncoder().encode('payload"}'));
          controller.close();
        },
      }),
      duplex: "half",
    } as RequestInit & { duplex: "half" });

    await expect(readJsonBody(request, 12, "Too large")).rejects.toMatchObject({ status: 413 });
  });

  it("maps malformed or empty JSON to a safe error", async () => {
    const malformed = new Request("https://voice.example.com/api/speech", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "not-json",
    });
    const empty = new Request("https://voice.example.com/api/speech", {
      method: "POST",
      headers: { "content-type": "application/json" },
    });

    await expect(readJsonBody(malformed, 1_024, "Too large")).rejects.toMatchObject({
      status: 400,
      code: "invalid_json",
    });
    await expect(readJsonBody(empty, 1_024, "Too large")).rejects.toMatchObject({
      status: 400,
      code: "invalid_json",
    });
  });
});
```

</details>

### 3.15 Crie `tests/request-guard.test.ts`

Crie o teste que prova esta responsabilidade sem chamar a OpenAI.

Abra `tests/request-guard.test.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>tests/request-guard.test.ts</strong></summary>

```ts
import { afterEach, describe, expect, it, vi } from "vitest";

import { resetRateLimitsForTests } from "../src/lib/rate-limit";
import { guardApiRequest } from "../src/lib/request-guard";

afterEach(() => {
  vi.unstubAllEnvs();
  delete process.env.PLAYGROUND_ACCESS_TOKEN;
  delete process.env.APP_ORIGIN;
  delete process.env.CLIENT_IP_HEADER;
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  resetRateLimitsForTests();
});

describe("guardApiRequest", () => {
  it("accepts a same-origin request and returns a quota", async () => {
    const request = new Request("https://voice.example.com/api/speech", {
      headers: { origin: "https://voice.example.com", "x-forwarded-for": "203.0.113.10" },
    });

    await expect(guardApiRequest(request, "speech")).resolves.toMatchObject({
      allowed: true,
      remaining: 9,
    });
  });

  it("fails closed when production safeguards are missing", async () => {
    vi.stubEnv("NODE_ENV", "production");

    await expect(
      guardApiRequest(new Request("https://voice.example.com/api/speech"), "speech"),
    ).rejects.toMatchObject({
      status: 503,
      code: "security_configuration_incomplete",
    });
  });

  it("blocks explicit cross-site browser requests", async () => {
    const request = new Request("https://voice.example.com/api/speech", {
      headers: { origin: "https://attacker.example", "sec-fetch-site": "cross-site" },
    });

    await expect(guardApiRequest(request, "speech")).rejects.toMatchObject({
      status: 403,
      code: "cross_origin_request",
    });
  });

  it("requires the configured deployment access token", async () => {
    process.env.PLAYGROUND_ACCESS_TOKEN = "a-long-shared-token";

    const unauthorized = new Request("https://voice.example.com/api/speech");
    await expect(guardApiRequest(unauthorized, "speech")).rejects.toMatchObject({
      status: 401,
      code: "unauthorized",
    });

    const authorized = new Request("https://voice.example.com/api/speech", {
      headers: { authorization: "Bearer a-long-shared-token" },
    });
    await expect(guardApiRequest(authorized, "speech")).resolves.toMatchObject({ allowed: true });
  });

  it("rate-limits invalid token attempts before authentication", async () => {
    process.env.PLAYGROUND_ACCESS_TOKEN = "a-long-shared-token";
    const request = () =>
      new Request("https://voice.example.com/api/speech", {
        headers: { authorization: "Bearer wrong", "x-forwarded-for": "203.0.113.20" },
      });

    for (let index = 0; index < 30; index += 1) {
      await expect(guardApiRequest(request(), "speech")).rejects.toMatchObject({ status: 401 });
    }
    await expect(guardApiRequest(request(), "speech")).rejects.toMatchObject({
      status: 429,
      code: "rate_limit_exceeded",
      headers: expect.objectContaining({ "Retry-After": expect.any(String) }),
    });
  });

  it("honors a configured canonical origin", async () => {
    process.env.APP_ORIGIN = "https://voice.example.com";
    const request = new Request("https://preview.example.com/api/speech", {
      headers: { origin: "https://preview.example.com" },
    });

    await expect(guardApiRequest(request, "speech")).rejects.toMatchObject({ status: 403 });
  });

  it("rejects an invalid origin header", async () => {
    const request = new Request("https://voice.example.com/api/speech", {
      headers: { origin: "not a URL" },
    });
    await expect(guardApiRequest(request, "speech")).rejects.toMatchObject({
      status: 403,
      code: "invalid_origin",
    });
  });

  it("enforces the local operation quota", async () => {
    for (let index = 0; index < 10; index += 1) {
      await guardApiRequest(new Request("https://voice.example.com/api/speech"), "speech");
    }

    await expect(
      guardApiRequest(new Request("https://voice.example.com/api/speech"), "speech"),
    ).rejects.toMatchObject({ status: 429, code: "rate_limit_exceeded" });
  });
});
```

</details>

### 3.16 Crie `tests/security-config.test.ts`

Crie o teste que prova esta responsabilidade sem chamar a OpenAI.

Abra `tests/security-config.test.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>tests/security-config.test.ts</strong></summary>

```ts
import { describe, expect, it } from "vitest";

import { getSecurityConfiguration } from "../src/lib/security-config";

describe("getSecurityConfiguration", () => {
  it("keeps the workshop usable without infrastructure in development", () => {
    expect(getSecurityConfiguration({ NODE_ENV: "development" })).toMatchObject({
      ready: true,
      requiresAccessToken: false,
      distributedRateLimit: false,
      clientIpHeader: "x-forwarded-for",
    });
  });

  it("fails closed when production safeguards are absent", () => {
    expect(getSecurityConfiguration({ NODE_ENV: "production" })).toMatchObject({
      ready: false,
      requiresAccessToken: true,
      missingVariables: [
        "PLAYGROUND_ACCESS_TOKEN",
        "APP_ORIGIN",
        "UPSTASH_REDIS_REST_URL",
        "UPSTASH_REDIS_REST_TOKEN",
        "CLIENT_IP_HEADER",
      ],
    });
  });

  it("accepts a complete Vercel production configuration", () => {
    expect(
      getSecurityConfiguration({
        NODE_ENV: "production",
        VERCEL: "1",
        PLAYGROUND_ACCESS_TOKEN: "secret",
        APP_ORIGIN: "https://voice.example.com",
        UPSTASH_REDIS_REST_URL: "https://redis.example.com",
        UPSTASH_REDIS_REST_TOKEN: "redis-secret",
      }),
    ).toMatchObject({
      ready: true,
      distributedRateLimit: true,
      clientIpHeader: "x-vercel-forwarded-for",
    });
  });

  it("rejects a sensitive header as the client identity source", () => {
    const configuration = getSecurityConfiguration({
      NODE_ENV: "production",
      PLAYGROUND_ACCESS_TOKEN: "secret",
      APP_ORIGIN: "https://voice.example.com",
      UPSTASH_REDIS_REST_URL: "https://redis.example.com",
      UPSTASH_REDIS_REST_TOKEN: "redis-secret",
      CLIENT_IP_HEADER: "authorization",
    });

    expect(configuration.ready).toBe(false);
    expect(configuration.missingVariables).toContain("CLIENT_IP_HEADER");
  });
});
```

</details>

### 3.17 Crie `tests/middleware.test.ts`

Crie o teste que prova esta responsabilidade sem chamar a OpenAI.

Abra `tests/middleware.test.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>tests/middleware.test.ts</strong></summary>

```ts
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { middleware } from "../src/middleware";

afterEach(() => vi.unstubAllEnvs());

describe("security middleware", () => {
  it("creates a strict nonce-based production CSP", () => {
    vi.stubEnv("NODE_ENV", "production");
    const response = middleware(new NextRequest("https://voice.example.com/"));
    const policy = response.headers.get("content-security-policy") ?? "";

    expect(policy).toMatch(/script-src 'self' 'nonce-[^']+' 'strict-dynamic'/);
    expect(policy).not.toContain("'unsafe-inline'");
    expect(policy).toContain("upgrade-insecure-requests");
  });
});
```

</details>

### Checkpoint do passo 3

Salve todos os arquivos e execute:

```bash
npm run typecheck && npm test
```

Não avance enquanto o comando retornar erro. Leia a primeira mensagem, confira o caminho do arquivo e compare com o checkpoint antes de reinstalar dependências.

## Passo 4 — Crie a interface, o player e o download

Agora o navegador ganha estados explícitos, cancelamento, player, download e disclosure de voz sintética. Substitua a página starter pelos arquivos finais abaixo.

No terminal do laboratório, garanta que as pastas e os arquivos existam:

```bash
mkdir -p src/lib src/components src/app tests
touch src/lib/client-api.ts src/components/status-message.tsx src/components/waveform.tsx src/components/speech-studio.tsx src/components/voice-playground.tsx src/app/layout.tsx src/app/page.tsx src/app/globals.css src/app/manifest.ts src/app/icon.svg tests/client-api.test.ts
```

### 4.1 Crie `src/lib/client-api.ts`

Converta erros da API em mensagens seguras e reutilizáveis no navegador.

Abra `src/lib/client-api.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>src/lib/client-api.ts</strong></summary>

```ts
export type ClientApiError = {
  message: string;
  code?: string;
  requestId?: string;
};

export function authorizationHeaders(accessToken: string): HeadersInit {
  return accessToken.trim()
    ? { Authorization: `Bearer ${accessToken.trim()}` }
    : {};
}

export async function readApiError(response: Response): Promise<ClientApiError> {
  try {
    const body = (await response.json()) as {
      error?: { message?: string; code?: string; requestId?: string };
    };

    return {
      message: body.error?.message || "The request could not be completed.",
      ...(body.error?.code ? { code: body.error.code } : {}),
      ...(body.error?.requestId ? { requestId: body.error.requestId } : {}),
    };
  } catch {
    return { message: "The request could not be completed." };
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
```

</details>

### 4.2 Crie `src/components/status-message.tsx`

Apresente progresso e erro numa live region acessível.

Abra `src/components/status-message.tsx`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>src/components/status-message.tsx</strong></summary>

```tsx
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

type StatusMessageProps = {
  tone: "error" | "success" | "info";
  children: React.ReactNode;
  requestId?: string | undefined;
};

const ICONS = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
};

export function StatusMessage({ tone, children, requestId }: StatusMessageProps) {
  const Icon = ICONS[tone];

  return (
    <div className={`status-message status-message--${tone}`} role={tone === "error" ? "alert" : "status"}>
      <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
      <div>
        <p>{children}</p>
        {requestId ? <small>Request ID: {requestId}</small> : null}
      </div>
    </div>
  );
}
```

</details>

### 4.3 Crie `src/components/waveform.tsx`

Crie feedback visual respeitando preferências de movimento reduzido.

Abra `src/components/waveform.tsx`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>src/components/waveform.tsx</strong></summary>

```tsx
import type { CSSProperties } from "react";

const BAR_HEIGHTS = [34, 58, 42, 76, 48, 88, 64, 38, 72, 54, 92, 60, 44, 80, 50, 68];

type WaveformProps = {
  active?: boolean;
  compact?: boolean;
  label?: string;
};

export function Waveform({
  active = false,
  compact = false,
  label = "Audio waveform",
}: WaveformProps) {
  return (
    <div
      className={`waveform${active ? " waveform--active" : ""}${compact ? " waveform--compact" : ""}`}
      role="img"
      aria-label={label}
    >
      {BAR_HEIGHTS.map((height, index) => (
        <span
          className="waveform__bar"
          key={`${height}-${index}`}
          style={
            {
              "--bar-height": `${height}%`,
              "--bar-delay": `${index * -70}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
```

</details>

### 4.4 Crie `src/components/speech-studio.tsx`

Implemente formulário, requisição, cancelamento, player, download e cleanup do áudio.

Abra `src/components/speech-studio.tsx`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>src/components/speech-studio.tsx</strong></summary>

```tsx
"use client";

import {
  CircleStop,
  Download,
  Gauge,
  LoaderCircle,
  Play,
  Radio,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { StatusMessage } from "@/components/status-message";
import { Waveform } from "@/components/waveform";
import {
  AUDIO_FORMATS,
  MAX_INSTRUCTIONS_CHARACTERS,
  MAX_SPEECH_CHARACTERS,
  VOICES,
  type AudioFormat,
  type VoiceId,
} from "@/lib/constants";
import {
  authorizationHeaders,
  formatBytes,
  readApiError,
  type ClientApiError,
} from "@/lib/client-api";

type SpeechStudioProps = {
  accessToken: string;
  disabled: boolean;
};

const DEFAULT_TEXT =
  "Software de qualidade não nasce apenas do código. Ele nasce das decisões que conseguimos explicar, testar e evoluir em equipe.";

export function SpeechStudio({ accessToken, disabled }: SpeechStudioProps) {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [instructions, setInstructions] = useState(
    "Fale em português do Brasil, com um tom confiante, acolhedor e didático.",
  );
  const [voice, setVoice] = useState<VoiceId>("marin");
  const [format, setFormat] = useState<AudioFormat>("mp3");
  const [speed, setSpeed] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [receivedBytes, setReceivedBytes] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string>();
  const [error, setError] = useState<ClientApiError>();
  const [requestId, setRequestId] = useState<string>();
  const abortControllerRef = useRef<AbortController | undefined>(undefined);
  const currentObjectUrlRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (currentObjectUrlRef.current) URL.revokeObjectURL(currentObjectUrlRef.current);
    };
  }, []);

  async function generateSpeech() {
    if (!text.trim() || isGenerating || disabled) return;

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsGenerating(true);
    setReceivedBytes(0);
    setError(undefined);
    setRequestId(undefined);

    try {
      const response = await fetch("/api/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authorizationHeaders(accessToken),
        },
        body: JSON.stringify({ text, instructions, voice, format, speed }),
        signal: controller.signal,
      });

      if (!response.ok) throw await readApiError(response);
      if (!response.body) throw { message: "The browser did not receive an audio stream." };

      setRequestId(response.headers.get("x-request-id") || undefined);
      const reader = response.body.getReader();
      const chunks: ArrayBuffer[] = [];
      let totalBytes = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const copy = new Uint8Array(value.byteLength);
        copy.set(value);
        chunks.push(copy.buffer);
        totalBytes += value.byteLength;
        setReceivedBytes(totalBytes);
      }

      const blob = new Blob(chunks, {
        type: response.headers.get("content-type") || "audio/mpeg",
      });
      const nextUrl = URL.createObjectURL(blob);

      if (currentObjectUrlRef.current) URL.revokeObjectURL(currentObjectUrlRef.current);
      currentObjectUrlRef.current = nextUrl;
      setAudioUrl(nextUrl);
    } catch (caught) {
      if (controller.signal.aborted) return;
      const apiError = caught as ClientApiError;
      setError({
        message: apiError.message || "The audio could not be generated.",
        ...(apiError.code ? { code: apiError.code } : {}),
        ...(apiError.requestId ? { requestId: apiError.requestId } : {}),
      });
    } finally {
      if (abortControllerRef.current === controller) {
        setIsGenerating(false);
        abortControllerRef.current = undefined;
      }
    }
  }

  function cancelGeneration() {
    abortControllerRef.current?.abort();
    setIsGenerating(false);
    setReceivedBytes(0);
  }

  const selectedVoice = VOICES.find((option) => option.id === voice) ?? VOICES[0];

  return (
    <div className="studio-layout">
      <section className="studio-main" aria-labelledby="speech-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow"><Sparkles size={14} /> Speech generation</span>
            <h2 id="speech-title">Give your words a voice</h2>
          </div>
          <span className="model-chip"><span /> gpt-4o-mini-tts</span>
        </div>

        <div className="field-group">
          <div className="field-label-row">
            <label htmlFor="speech-text">Text to speak</label>
            <span className={text.length > MAX_SPEECH_CHARACTERS * 0.9 ? "counter counter--warning" : "counter"}>
              {text.length.toLocaleString()} / {MAX_SPEECH_CHARACTERS.toLocaleString()}
            </span>
          </div>
          <textarea
            id="speech-text"
            className="text-area text-area--hero"
            value={text}
            onChange={(event) => setText(event.target.value)}
            maxLength={MAX_SPEECH_CHARACTERS}
            rows={7}
            placeholder="Write something worth hearing…"
            disabled={disabled || isGenerating}
          />
        </div>

        <div className="field-group">
          <div className="field-label-row">
            <label htmlFor="voice-instructions">Voice direction</label>
            <span className="field-hint">Optional prompt</span>
          </div>
          <textarea
            id="voice-instructions"
            className="text-area"
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            maxLength={MAX_INSTRUCTIONS_CHARACTERS}
            rows={3}
            placeholder="Describe tone, rhythm, accent, emotion, or delivery…"
            disabled={disabled || isGenerating}
          />
          <p className="helper-text">Describe delivery, not identity. Avoid asking the model to impersonate a real person.</p>
        </div>

        {error ? (
          <StatusMessage tone="error" requestId={error.requestId}>{error.message}</StatusMessage>
        ) : null}

        <div className="action-row">
          <button
            className="button button--primary"
            type="button"
            onClick={generateSpeech}
            disabled={disabled || isGenerating || !text.trim()}
          >
            {isGenerating ? <LoaderCircle className="spin" aria-hidden="true" /> : <Play aria-hidden="true" />}
            {isGenerating ? "Streaming audio…" : "Generate voice"}
          </button>
          {isGenerating ? (
            <button className="button button--ghost" type="button" onClick={cancelGeneration}>
              <CircleStop aria-hidden="true" /> Cancel
            </button>
          ) : null}
          <span className="stream-status" aria-live="polite">
            {isGenerating && receivedBytes > 0 ? `${formatBytes(receivedBytes)} received` : "Audio streams through your server"}
          </span>
        </div>
      </section>

      <aside className="studio-sidebar" aria-label="Speech controls and output">
        <div className="control-card">
          <div className="control-card__heading"><Radio size={17} /><span>Voice controls</span></div>
          <label className="select-label" htmlFor="voice-select">Voice</label>
          <div className="select-wrap">
            <select
              id="voice-select"
              value={voice}
              onChange={(event) => setVoice(event.target.value as VoiceId)}
              disabled={disabled || isGenerating}
            >
              {VOICES.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}
            </select>
          </div>
          <p className="selection-note"><strong>{selectedVoice.label}</strong> · {selectedVoice.character}</p>

          <div className="control-grid">
            <div>
              <label className="select-label" htmlFor="format-select">Format</label>
              <div className="select-wrap">
                <select
                  id="format-select"
                  value={format}
                  onChange={(event) => setFormat(event.target.value as AudioFormat)}
                  disabled={disabled || isGenerating}
                >
                  {AUDIO_FORMATS.map((option) => <option value={option} key={option}>{option.toUpperCase()}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="select-label" htmlFor="speed-select">Speed</label>
              <div className="select-wrap select-wrap--icon">
                <Gauge size={15} aria-hidden="true" />
                <select
                  id="speed-select"
                  value={speed}
                  onChange={(event) => setSpeed(Number(event.target.value))}
                  disabled={disabled || isGenerating}
                >
                  <option value={0.75}>0.75×</option>
                  <option value={1}>1.0×</option>
                  <option value={1.25}>1.25×</option>
                  <option value={1.5}>1.5×</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className={`output-card${audioUrl ? " output-card--ready" : ""}`}>
          <div className="output-card__topline">
            <span>Output</span>
            <span className="ai-disclosure"><span /> AI-generated voice</span>
          </div>
          <Waveform active={isGenerating} label={isGenerating ? "Audio is streaming" : "Generated audio waveform"} />
          {audioUrl ? (
            <div className="audio-result">
              <audio controls src={audioUrl} preload="metadata">Your browser does not support audio playback.</audio>
              <a className="button button--secondary button--full" href={audioUrl} download={`openai-voice-${voice}.${format}`}>
                <Download aria-hidden="true" /> Download {format.toUpperCase()}
              </a>
              {requestId ? <small className="request-meta">Request {requestId.slice(0, 8)}…</small> : null}
            </div>
          ) : (
            <p className="empty-state">Your generated voice will appear here. Nothing is stored by this app.</p>
          )}
        </div>
      </aside>
    </div>
  );
}
```

</details>

### 4.5 Crie `src/components/voice-playground.tsx`

Monte a composição principal que conecta apresentação e experiência de voz.

Abra `src/components/voice-playground.tsx`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>src/components/voice-playground.tsx</strong></summary>

```tsx
"use client";

import {
  BookOpen,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Server,
  ShieldCheck,
  Volume2,
} from "lucide-react";
import { useEffect, useState } from "react";

import { SpeechStudio } from "@/components/speech-studio";
import { StatusMessage } from "@/components/status-message";

type HealthState = {
  configured: boolean;
  configurationIssues: string[];
  distributedRateLimit: boolean;
  requiresAccessToken: boolean;
};

export function VoicePlayground() {
  const [health, setHealth] = useState<HealthState>();
  const [healthError, setHealthError] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    void fetch("/api/health", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Health check failed");
        return (await response.json()) as HealthState;
      })
      .then(setHealth)
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) setHealthError(true);
      });

    return () => controller.abort();
  }, []);

  const isLoading = !health && !healthError;
  const needsToken = Boolean(health?.requiresAccessToken);
  const isDisabled =
    isLoading || healthError || !health?.configured || (needsToken && !accessToken.trim());

  return (
    <section className="playground-shell" id="playground" aria-labelledby="playground-heading">
      <div className="playground-intro">
        <div>
          <span className="section-kicker">Interactive lab</span>
          <h2 id="playground-heading">Turn text into expressive speech</h2>
          <p>Control voice, delivery, speed, and format while every request crosses a typed, validated server boundary.</p>
        </div>
        <div className="architecture-strip" aria-label="Request architecture">
          <span><Volume2 aria-hidden="true" /> Browser</span>
          <i aria-hidden="true">→</i>
          <span><Server aria-hidden="true" /> Next route</span>
          <i aria-hidden="true">→</i>
          <span><ShieldCheck aria-hidden="true" /> OpenAI</span>
        </div>
      </div>

      {isLoading ? (
        <div className="configuration-banner configuration-banner--loading" role="status">
          <LoaderCircle className="spin" aria-hidden="true" /> Checking server configuration…
        </div>
      ) : null}
      {healthError ? (
        <StatusMessage tone="error">The app could not verify its server configuration. Refresh the page or inspect the health route.</StatusMessage>
      ) : null}
      {health && !health.configured ? (
        <StatusMessage tone="error">Server configuration is incomplete. Add these environment variables: {health.configurationIssues.join(", ")}.</StatusMessage>
      ) : null}
      {health?.configured ? (
        <div className="configuration-banner">
          <span><LockKeyhole aria-hidden="true" /> Server key isolated</span>
          <span><ShieldCheck aria-hidden="true" /> Inputs validated</span>
          <span><ShieldCheck aria-hidden="true" /> {health.distributedRateLimit ? "Distributed quota" : "Local development quota"}</span>
          <span><Volume2 aria-hidden="true" /> Voice disclosed as AI</span>
        </div>
      ) : null}

      {needsToken ? (
        <div className="access-gate">
          <div className="access-gate__icon"><KeyRound aria-hidden="true" /></div>
          <div>
            <strong>This deployment is access-protected</strong>
            <p>Enter the shared playground token. It stays in memory and is never written to browser storage.</p>
          </div>
          <label>
            <span className="visually-hidden">Playground access token</span>
            <input
              type="password"
              value={accessToken}
              onChange={(event) => setAccessToken(event.target.value)}
              placeholder="Access token"
              autoComplete="off"
            />
          </label>
        </div>
      ) : null}

      <div className="playground-card">
        <div className="tab-list">
          <div className="tab tab--active">
            <Volume2 aria-hidden="true" />
            <span><strong>Text to speech</strong><small>Make text sound alive</small></span>
          </div>
          <a className="tutorial-link" href="https://github.com/glaucia86/openai-voice-playground/blob/main/labs/lab-01-text-to-speech/tutorial/tutorial.md" target="_blank" rel="noreferrer">
            <BookOpen aria-hidden="true" /> Follow Lab 01
          </a>
        </div>

        <SpeechStudio accessToken={accessToken} disabled={isDisabled} />
      </div>
    </section>
  );
}
```

</details>

### 4.6 Crie `src/app/layout.tsx`

Defina metadados, fontes, idioma e estrutura raiz da página.

Abra `src/app/layout.tsx`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>src/app/layout.tsx</strong></summary>

```tsx
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/manrope";
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://openai-voice-playground.vercel.app"),
  title: {
    default: "Lab 01 · OpenAI Text to Speech",
    template: "%s · OpenAI Voice Labs",
  },
  description:
    "A production-minded workshop for building OpenAI text-to-speech applications with Next.js.",
  applicationName: "OpenAI Voice Labs · Lab 01",
  authors: [{ name: "Glaucia Lemos", url: "https://github.com/glaucia86" }],
  keywords: ["OpenAI", "voice", "text to speech", "TTS", "Next.js", "TypeScript"],
  openGraph: {
    title: "Lab 01 · OpenAI Text to Speech",
    description: "Build a responsible, production-minded text-to-speech experience with OpenAI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lab 01 · OpenAI Text to Speech",
    description: "Build a responsible, production-minded text-to-speech experience with OpenAI.",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#070b12",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await headers();
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

</details>

### 4.7 Crie `src/app/page.tsx`

Renderize a experiência principal pelo App Router.

Abra `src/app/page.tsx`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>src/app/page.tsx</strong></summary>

```tsx
import {
  ArrowDown,
  ArrowUpRight,
  BookOpenText,
  Braces,
  Code2,
  LockKeyhole,
  RadioTower,
  ShieldCheck,
  Sparkles,
  TestTube2,
  Waves,
} from "lucide-react";

import { VoicePlayground } from "@/components/voice-playground";
import { Waveform } from "@/components/waveform";

const REPOSITORY_URL = "https://github.com/glaucia86/openai-voice-playground";
const LAB_URL = `${REPOSITORY_URL}/tree/main/labs/lab-01-text-to-speech`;
const GUIDE_URL = `${REPOSITORY_URL}/blob/main/labs/lab-01-text-to-speech/tutorial/tutorial.md`;

export default function HomePage() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="OpenAI Voice Playground home">
          <span className="brand__mark" aria-hidden="true"><Waves /></span>
          <span className="brand__copy"><strong>Voice Playground</strong><small>OpenAI · educational OSS</small></span>
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#playground">Playground</a>
          <a href="#principles">Principles</a>
          <a href={GUIDE_URL} target="_blank" rel="noreferrer">Lab 01 guide</a>
        </nav>
        <a className="github-button" href={LAB_URL} target="_blank" rel="noreferrer">
          <Code2 aria-hidden="true" /> <span>View source</span> <ArrowUpRight aria-hidden="true" />
        </a>
      </header>

      <div id="top" className="hero-wrap">
        <section className="hero">
          <div className="hero__copy">
            <div className="hero-badge"><span className="hero-badge__pulse" /> Production patterns, explained</div>
            <h1>Turn text into speech people can <em>trust.</em></h1>
            <p className="hero__lede">
              A hands-on text-to-speech lab designed to teach the server boundaries, streaming, safeguards, and trade-offs behind the demo.
            </p>
            <div className="hero__actions">
              <a className="button button--primary button--large" href="#playground"><Sparkles aria-hidden="true" /> Open the playground</a>
              <a className="button button--ghost button--large" href={GUIDE_URL} target="_blank" rel="noreferrer"><BookOpenText aria-hidden="true" /> Follow Lab 01</a>
            </div>
            <dl className="hero__facts">
              <div><dt>13</dt><dd>built-in voices</dd></div>
              <div><dt>3</dt><dd>audio formats</dd></div>
              <div><dt>0</dt><dd>keys in the browser</dd></div>
            </dl>
          </div>

          <div className="hero-visual" aria-label="Abstract voice pipeline visualization">
            <div className="hero-visual__glow" />
            <div className="signal-card signal-card--input">
              <span className="signal-card__icon"><Braces /></span>
              <span><small>Input</small><strong>Typed request</strong></span>
              <i>01</i>
            </div>
            <div className="sound-orb">
              <span className="sound-orb__ring sound-orb__ring--one" />
              <span className="sound-orb__ring sound-orb__ring--two" />
              <span className="sound-orb__core"><Waves /></span>
            </div>
            <div className="visual-wave"><Waveform active label="Animated generated voice signal" /></div>
            <div className="signal-card signal-card--output">
              <span className="signal-card__icon signal-card__icon--green"><RadioTower /></span>
              <span><small>Output</small><strong>Streamed audio</strong></span>
              <i>02</i>
            </div>
            <div className="visual-note"><LockKeyhole /> OPENAI_API_KEY stays server-side</div>
          </div>
        </section>
        <a className="scroll-cue" href="#playground"><span>Explore the lab</span><ArrowDown aria-hidden="true" /></a>
      </div>

      <VoicePlayground />

      <section className="principles" id="principles" aria-labelledby="principles-title">
        <div className="principles__heading">
          <span className="section-kicker">Beyond the happy path</span>
          <h2 id="principles-title">The demo is small. The engineering lessons are not.</h2>
          <p>Each layer exists because a production team eventually pays for shortcuts—in security, cost, usability, or maintainability.</p>
        </div>
        <div className="principles-grid">
          <article className="principle-card principle-card--featured">
            <span className="principle-card__number">01</span>
            <div className="principle-card__icon"><LockKeyhole /></div>
            <h3>A deliberate server boundary</h3>
            <p>The browser knows your product contract, never your provider credential. Route Handlers validate and translate the request.</p>
            <code>browser → /api/* → OpenAI</code>
          </article>
          <article className="principle-card">
            <span className="principle-card__number">02</span>
            <div className="principle-card__icon"><ShieldCheck /></div>
            <h3>Guardrails that users can see</h3>
            <p>Size limits, allowlists, AI-voice disclosure, same-origin checks, and actionable errors are part of the experience.</p>
          </article>
          <article className="principle-card">
            <span className="principle-card__number">03</span>
            <div className="principle-card__icon"><RadioTower /></div>
            <h3>Streaming with a reason</h3>
            <p>The Route Handler forwards the upstream audio stream instead of buffering the entire file in server memory.</p>
          </article>
          <article className="principle-card">
            <span className="principle-card__number">04</span>
            <div className="principle-card__icon"><TestTube2 /></div>
            <h3>A repeatable delivery loop</h3>
            <p>Strict TypeScript, focused unit tests, CI gates, request IDs, and an AGENTS.md make change safer for humans and Codex.</p>
          </article>
        </div>
      </section>

      <section className="learn-cta">
        <div>
          <span className="section-kicker">Build it, don’t just clone it</span>
          <h2>Follow every decision from empty folder to deployment.</h2>
          <p>The tutorial documents the incremental slices, validation gates, trade-offs, and the prompts used to collaborate with Codex.</p>
        </div>
        <a className="button button--primary button--large" href={GUIDE_URL} target="_blank" rel="noreferrer">
          <BookOpenText aria-hidden="true" /> Read the Lab 01 workshop
        </a>
      </section>

      <footer className="site-footer">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true"><Waves /></span>
          <span className="brand__copy"><strong>Voice Playground</strong><small>Built to be read, run, and questioned.</small></span>
        </div>
        <p>Created by <a href="https://github.com/glaucia86" target="_blank" rel="noreferrer">Glaucia Lemos</a> · MIT licensed · Not an official OpenAI product.</p>
        <div className="footer-links">
          <a href={REPOSITORY_URL} target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://developers.openai.com/api/docs/guides/audio" target="_blank" rel="noreferrer">OpenAI audio docs</a>
        </div>
      </footer>
    </main>
  );
}
```

</details>

### 4.8 Crie `src/app/globals.css`

Aplique o sistema visual responsivo, foco visível, contraste e reduced motion.

Abra `src/app/globals.css`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>src/app/globals.css</strong></summary>

```css
:root {
  --bg: #070b12;
  --bg-raised: #0a1019;
  --surface: #0e1622;
  --surface-2: #111c2a;
  --surface-3: #162333;
  --border: rgba(181, 199, 224, 0.13);
  --border-strong: rgba(181, 199, 224, 0.22);
  --text: #f4f7fb;
  --muted: #94a2b8;
  --muted-strong: #bac4d4;
  --accent: #8bffcc;
  --accent-strong: #5beab0;
  --accent-ink: #042318;
  --blue: #8da7ff;
  --coral: #ff8a72;
  --danger: #ff8e96;
  --success: #8bffcc;
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 32px;
  --shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; scroll-padding-top: 96px; }

body {
  margin: 0;
  background:
    radial-gradient(circle at 72% 4%, rgba(93, 124, 255, 0.10), transparent 27rem),
    radial-gradient(circle at 15% 31%, rgba(64, 222, 164, 0.055), transparent 24rem),
    var(--bg);
  color: var(--text);
  font-family: "Manrope Variable", "Segoe UI", sans-serif;
  font-size: 16px;
  line-height: 1.6;
  min-width: 320px;
}

body::before {
  position: fixed;
  inset: 0;
  pointer-events: none;
  content: "";
  opacity: 0.13;
  background-image: linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(to bottom, black, transparent 72%);
}

::selection { color: var(--accent-ink); background: var(--accent); }

a { color: inherit; text-decoration: none; }
button, input, textarea, select { font: inherit; }
button, a { -webkit-tap-highlight-color: transparent; }
button { color: inherit; }

:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

.visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

.site-header {
  position: sticky;
  z-index: 40;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(100% - 40px, 1240px);
  min-height: 76px;
  margin: 0 auto;
  border-bottom: 1px solid var(--border);
  background: rgba(7, 11, 18, 0.72);
  backdrop-filter: blur(18px);
}

.brand { display: inline-flex; align-items: center; gap: 12px; }
.brand__mark { display: grid; width: 42px; height: 42px; place-items: center; border: 1px solid rgba(139, 255, 204, 0.28); border-radius: 13px; color: var(--accent); background: linear-gradient(145deg, rgba(139, 255, 204, 0.12), rgba(141, 167, 255, 0.05)); box-shadow: inset 0 0 24px rgba(139, 255, 204, 0.05); }
.brand__mark svg { width: 22px; }
.brand__copy { display: flex; flex-direction: column; line-height: 1.25; }
.brand__copy strong { font-size: 14px; letter-spacing: -0.01em; }
.brand__copy small { margin-top: 3px; color: var(--muted); font-family: "JetBrains Mono Variable", monospace; font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; }

.site-nav { display: flex; gap: 32px; color: var(--muted-strong); font-size: 13px; font-weight: 650; }
.site-nav a { transition: color 160ms ease; }
.site-nav a:hover { color: var(--text); }

.github-button { display: inline-flex; align-items: center; gap: 8px; padding: 9px 12px; border: 1px solid var(--border-strong); border-radius: 999px; color: var(--muted-strong); background: rgba(255,255,255,.025); font-size: 12px; font-weight: 700; transition: border-color 160ms ease, color 160ms ease, transform 160ms ease; }
.github-button svg { width: 16px; }
.github-button svg:last-child { width: 13px; color: var(--muted); }
.github-button:hover { transform: translateY(-1px); border-color: rgba(139,255,204,.35); color: var(--text); }

.hero-wrap { position: relative; width: min(100% - 40px, 1240px); margin: 0 auto; padding: 100px 0 130px; }
.hero { display: grid; grid-template-columns: minmax(0, 1.02fr) minmax(420px, .98fr); align-items: center; gap: clamp(48px, 8vw, 110px); min-height: 590px; }
.hero__copy { position: relative; z-index: 2; }
.hero-badge { display: inline-flex; align-items: center; gap: 9px; margin-bottom: 24px; padding: 7px 11px; border: 1px solid var(--border); border-radius: 999px; color: var(--muted-strong); background: rgba(14,22,34,.7); font-family: "JetBrains Mono Variable", monospace; font-size: 10px; letter-spacing: .07em; text-transform: uppercase; }
.hero-badge__pulse { position: relative; width: 7px; height: 7px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 14px var(--accent); }
.hero-badge__pulse::after { position: absolute; inset: -4px; border: 1px solid var(--accent); border-radius: inherit; content: ""; animation: pulse 2s ease-out infinite; }
.hero h1 { max-width: 730px; margin: 0; font-size: clamp(48px, 6.2vw, 82px); font-weight: 650; letter-spacing: -.065em; line-height: .99; }
.hero h1 em { color: var(--accent); font-family: Georgia, serif; font-weight: 400; }
.hero__lede { max-width: 640px; margin: 28px 0 0; color: var(--muted-strong); font-size: clamp(17px, 2vw, 20px); line-height: 1.65; }
.hero__actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 36px; }
.button { display: inline-flex; min-height: 44px; align-items: center; justify-content: center; gap: 9px; padding: 10px 16px; border: 1px solid transparent; border-radius: 11px; cursor: pointer; font-size: 13px; font-weight: 750; line-height: 1; transition: transform 160ms ease, border-color 160ms ease, background 160ms ease, opacity 160ms ease; }
.button svg { width: 17px; height: 17px; stroke-width: 1.9; }
.button:hover:not(:disabled) { transform: translateY(-1px); }
.button:active:not(:disabled) { transform: translateY(0); }
.button:disabled { cursor: not-allowed; opacity: .45; }
.button--large { min-height: 50px; padding: 13px 19px; border-radius: 13px; }
.button--primary { color: var(--accent-ink); background: var(--accent); box-shadow: 0 10px 35px rgba(83, 233, 173, .12); }
.button--primary:hover:not(:disabled) { background: #a0ffd8; }
.button--secondary { border-color: var(--border-strong); background: rgba(255,255,255,.045); }
.button--secondary:hover:not(:disabled) { border-color: rgba(139,255,204,.36); background: rgba(139,255,204,.07); }
.button--ghost { border-color: var(--border); color: var(--muted-strong); background: transparent; }
.button--ghost:hover:not(:disabled) { border-color: var(--border-strong); color: var(--text); background: rgba(255,255,255,.035); }
.button--full { width: 100%; }

.hero__facts { display: flex; gap: 30px; margin: 45px 0 0; }
.hero__facts div { display: grid; grid-template-columns: auto 1fr; align-items: baseline; gap: 7px; }
.hero__facts dt { color: var(--text); font-family: "JetBrains Mono Variable", monospace; font-size: 18px; font-weight: 700; }
.hero__facts dd { margin: 0; color: var(--muted); font-size: 11px; }

.hero-visual { position: relative; min-height: 530px; border: 1px solid var(--border); border-radius: 34px; background: linear-gradient(155deg, rgba(20,32,48,.75), rgba(8,13,21,.78)); box-shadow: var(--shadow), inset 0 1px 0 rgba(255,255,255,.04); overflow: hidden; isolation: isolate; }
.hero-visual::before { position: absolute; inset: 0; content: ""; background-image: radial-gradient(circle, rgba(181,199,224,.23) 1px, transparent 1px); background-size: 28px 28px; mask-image: radial-gradient(circle at center, black, transparent 73%); opacity: .32; }
.hero-visual__glow { position: absolute; z-index: -1; top: 21%; left: 50%; width: 310px; height: 310px; border-radius: 50%; background: radial-gradient(circle, rgba(94,225,175,.22), rgba(92,119,255,.1) 38%, transparent 69%); filter: blur(8px); transform: translateX(-50%); }
.sound-orb { position: absolute; top: 95px; left: 50%; width: 225px; height: 225px; transform: translateX(-50%); }
.sound-orb__ring { position: absolute; border: 1px solid rgba(139,255,204,.22); border-radius: 50%; inset: 0; animation: orbit 12s linear infinite; }
.sound-orb__ring::after { position: absolute; top: 22px; right: 22px; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 15px var(--accent); content: ""; }
.sound-orb__ring--two { inset: 24px; border-color: rgba(141,167,255,.25); animation-direction: reverse; animation-duration: 8s; }
.sound-orb__ring--two::after { top: auto; right: auto; bottom: 8px; left: 40px; width: 6px; height: 6px; background: var(--blue); box-shadow: 0 0 14px var(--blue); }
.sound-orb__core { position: absolute; inset: 56px; display: grid; place-items: center; border: 1px solid rgba(139,255,204,.36); border-radius: 50%; color: var(--accent); background: radial-gradient(circle at 35% 30%, rgba(139,255,204,.28), rgba(15,27,38,.92) 58%); box-shadow: 0 0 55px rgba(139,255,204,.14), inset 0 0 30px rgba(139,255,204,.08); }
.sound-orb__core svg { width: 37px; height: 37px; }
.visual-wave { position: absolute; top: 335px; right: 12%; left: 12%; }
.signal-card { position: absolute; z-index: 2; display: flex; min-width: 180px; align-items: center; gap: 10px; padding: 11px 12px; border: 1px solid var(--border-strong); border-radius: 14px; background: rgba(11,18,29,.82); box-shadow: 0 16px 35px rgba(0,0,0,.2); backdrop-filter: blur(10px); }
.signal-card--input { top: 34px; left: 25px; }
.signal-card--output { right: 25px; bottom: 31px; }
.signal-card__icon { display: grid; width: 34px; height: 34px; flex: 0 0 auto; place-items: center; border-radius: 9px; color: var(--blue); background: rgba(141,167,255,.1); }
.signal-card__icon--green { color: var(--accent); background: rgba(139,255,204,.1); }
.signal-card__icon svg { width: 17px; }
.signal-card span:nth-child(2) { display: flex; flex-direction: column; line-height: 1.3; }
.signal-card small { color: var(--muted); font-family: "JetBrains Mono Variable", monospace; font-size: 8px; letter-spacing: .08em; text-transform: uppercase; }
.signal-card strong { margin-top: 3px; font-size: 11px; }
.signal-card i { margin-left: auto; color: rgba(181,199,224,.28); font-family: "JetBrains Mono Variable", monospace; font-size: 9px; font-style: normal; }
.visual-note { position: absolute; bottom: 37px; left: 28px; display: flex; align-items: center; gap: 7px; color: var(--muted); font-family: "JetBrains Mono Variable", monospace; font-size: 8px; letter-spacing: .04em; }
.visual-note svg { width: 12px; color: var(--accent); }
.scroll-cue { position: absolute; bottom: 48px; left: 0; display: inline-flex; align-items: center; gap: 10px; color: var(--muted); font-family: "JetBrains Mono Variable", monospace; font-size: 9px; letter-spacing: .08em; text-transform: uppercase; }
.scroll-cue svg { width: 14px; animation: nudge 1.8s ease-in-out infinite; }

.waveform { display: flex; height: 92px; align-items: center; justify-content: center; gap: 5px; padding: 12px 0; }
.waveform__bar { width: 3px; height: var(--bar-height); min-height: 5px; border-radius: 999px; background: linear-gradient(to top, rgba(141,167,255,.42), var(--accent)); opacity: .58; transform-origin: center; }
.waveform--active .waveform__bar { animation: wave 1.1s ease-in-out var(--bar-delay) infinite alternate; opacity: .95; }
.waveform--compact { width: 105px; height: 35px; gap: 3px; padding: 2px 0; }
.waveform--compact .waveform__bar { width: 2px; }

.playground-shell { width: min(100% - 40px, 1240px); margin: 0 auto; padding: 95px 0 120px; }
.playground-intro { display: flex; align-items: flex-end; justify-content: space-between; gap: 40px; margin-bottom: 35px; }
.playground-intro > div:first-child { max-width: 650px; }
.section-kicker { display: block; margin-bottom: 10px; color: var(--accent); font-family: "JetBrains Mono Variable", monospace; font-size: 10px; font-weight: 650; letter-spacing: .12em; text-transform: uppercase; }
.playground-intro h2, .principles__heading h2, .learn-cta h2 { margin: 0; font-size: clamp(34px, 4.5vw, 54px); font-weight: 620; letter-spacing: -.045em; line-height: 1.08; }
.playground-intro p, .principles__heading p, .learn-cta p { margin: 15px 0 0; color: var(--muted); }
.architecture-strip { display: flex; align-items: center; gap: 10px; padding: 10px; border: 1px solid var(--border); border-radius: 13px; background: rgba(14,22,34,.54); }
.architecture-strip span { display: inline-flex; align-items: center; gap: 6px; padding: 6px 8px; color: var(--muted-strong); font-family: "JetBrains Mono Variable", monospace; font-size: 8px; letter-spacing: .04em; text-transform: uppercase; }
.architecture-strip svg { width: 13px; color: var(--accent); }
.architecture-strip i { color: rgba(181,199,224,.3); font-size: 11px; font-style: normal; }

.configuration-banner { display: flex; flex-wrap: wrap; align-items: center; gap: 20px; margin-bottom: 14px; padding: 11px 15px; border: 1px solid rgba(139,255,204,.14); border-radius: 12px; color: var(--muted-strong); background: rgba(139,255,204,.035); font-size: 11px; }
.configuration-banner > span { display: inline-flex; align-items: center; gap: 7px; }
.configuration-banner svg { width: 14px; color: var(--accent); }
.configuration-banner--loading { color: var(--muted); border-color: var(--border); background: rgba(255,255,255,.02); }
.access-gate { display: grid; grid-template-columns: auto 1fr minmax(180px, 280px); align-items: center; gap: 16px; margin-bottom: 14px; padding: 16px; border: 1px solid rgba(141,167,255,.24); border-radius: 15px; background: rgba(141,167,255,.055); }
.access-gate__icon { display: grid; width: 38px; height: 38px; place-items: center; border-radius: 11px; color: var(--blue); background: rgba(141,167,255,.1); }
.access-gate__icon svg { width: 18px; }
.access-gate strong { font-size: 12px; }
.access-gate p { margin: 2px 0 0; color: var(--muted); font-size: 10px; }
.access-gate input { width: 100%; padding: 10px 12px; border: 1px solid var(--border-strong); border-radius: 9px; outline: none; color: var(--text); background: rgba(3,8,14,.38); font-size: 12px; }
.access-gate input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(141,167,255,.1); }

.playground-card { border: 1px solid var(--border-strong); border-radius: 24px; background: rgba(10,16,25,.88); box-shadow: var(--shadow), inset 0 1px 0 rgba(255,255,255,.025); overflow: hidden; }
.tab-list { display: grid; grid-template-columns: 230px 1fr; gap: 5px; padding: 10px; border-bottom: 1px solid var(--border); background: rgba(255,255,255,.012); }
.tab { display: flex; align-items: center; gap: 11px; min-height: 60px; padding: 9px 12px; border: 1px solid transparent; border-radius: 12px; color: var(--muted); background: transparent; text-align: left; }
.tab > svg { width: 20px; }
.tab span { display: flex; flex-direction: column; line-height: 1.25; }
.tab strong { font-size: 11px; }
.tab small { margin-top: 4px; font-size: 9px; }
.tab--active { border-color: var(--border); color: var(--text); background: var(--surface-2); box-shadow: 0 7px 22px rgba(0,0,0,.18); }
.tab--active > svg { color: var(--accent); }
.tutorial-link { align-self: center; justify-self: end; display: inline-flex; align-items: center; gap: 7px; margin-right: 9px; color: var(--muted); font-size: 10px; font-weight: 700; transition: color 160ms ease; }
.tutorial-link svg { width: 14px; }
.tutorial-link:hover { color: var(--accent); }
.studio-layout { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(330px, .82fr); }
.studio-main { padding: clamp(24px, 4vw, 46px); border-right: 1px solid var(--border); }
.studio-sidebar { display: flex; flex-direction: column; gap: 14px; padding: 22px; background: rgba(255,255,255,.012); }
.section-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 34px; }
.section-heading h2 { margin: 5px 0 0; font-size: clamp(27px, 3vw, 38px); font-weight: 620; letter-spacing: -.04em; line-height: 1.13; }
.eyebrow { display: inline-flex; align-items: center; gap: 6px; color: var(--accent); font-family: "JetBrains Mono Variable", monospace; font-size: 9px; letter-spacing: .08em; text-transform: uppercase; }
.model-chip { display: inline-flex; flex: 0 0 auto; align-items: center; gap: 7px; padding: 6px 9px; border: 1px solid var(--border); border-radius: 999px; color: var(--muted); font-family: "JetBrains Mono Variable", monospace; font-size: 8px; }
.model-chip > span { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px rgba(139,255,204,.6); }
.field-group { margin-bottom: 24px; }
.field-label-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.field-label-row label, .select-label { color: var(--muted-strong); font-size: 10px; font-weight: 750; letter-spacing: .02em; }
.counter, .field-hint { color: var(--muted); font-family: "JetBrains Mono Variable", monospace; font-size: 8px; }
.counter--warning { color: var(--coral); }
.text-area { width: 100%; resize: vertical; padding: 13px 14px; border: 1px solid var(--border); border-radius: 12px; outline: none; color: var(--text); background: rgba(5,10,17,.5); caret-color: var(--accent); font-size: 12px; line-height: 1.65; transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease; }
.text-area--hero { min-height: 160px; padding: 18px; font-size: 16px; line-height: 1.7; }
.text-area--small { min-height: 85px; margin-top: 7px; resize: vertical; font-size: 10px; }
.text-area:hover:not(:disabled) { border-color: var(--border-strong); }
.text-area:focus { border-color: rgba(139,255,204,.45); background: rgba(8,15,23,.75); box-shadow: 0 0 0 3px rgba(139,255,204,.06); }
.text-area::placeholder { color: #59667a; }
.text-area:disabled { cursor: not-allowed; opacity: .55; }
.helper-text { margin: 7px 0 0; color: var(--muted); font-size: 9px; line-height: 1.55; }
.action-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: 26px; }
.stream-status { margin-left: auto; color: var(--muted); font-family: "JetBrains Mono Variable", monospace; font-size: 8px; }
.control-card, .output-card, .transcript-card { padding: 17px; border: 1px solid var(--border); border-radius: 16px; background: rgba(13,21,32,.72); }
.control-card__heading { display: flex; align-items: center; gap: 8px; margin-bottom: 18px; color: var(--text); font-size: 11px; font-weight: 750; }
.control-card__heading svg { color: var(--accent); }
.select-label { display: block; margin: 13px 0 6px; }
.select-wrap { position: relative; border: 1px solid var(--border); border-radius: 10px; background: rgba(5,10,17,.47); transition: border-color 160ms ease; }
.select-wrap:hover { border-color: var(--border-strong); }
.select-wrap:focus-within { border-color: rgba(139,255,204,.4); box-shadow: 0 0 0 3px rgba(139,255,204,.05); }
.select-wrap select { width: 100%; padding: 9px 29px 9px 10px; border: 0; outline: 0; appearance: none; color: var(--muted-strong); background: transparent; cursor: pointer; font-size: 10px; }
.select-wrap::after { position: absolute; top: 50%; right: 10px; width: 6px; height: 6px; border-right: 1px solid var(--muted); border-bottom: 1px solid var(--muted); pointer-events: none; content: ""; transform: translateY(-70%) rotate(45deg); }
.select-wrap--icon { display: flex; align-items: center; padding-left: 8px; }
.select-wrap--icon > svg { width: 14px; flex: 0 0 auto; color: var(--muted); }
.select-wrap--icon select { padding-left: 5px; }
.selection-note { min-height: 28px; margin: 7px 0 0; color: var(--muted); font-size: 8px; line-height: 1.45; }
.selection-note strong { color: var(--muted-strong); }
.control-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
.output-card { flex: 1; min-height: 270px; background: linear-gradient(145deg, rgba(20,33,48,.7), rgba(9,15,24,.84)); overflow: hidden; }
.output-card--ready { border-color: rgba(139,255,204,.2); }
.output-card__topline { display: flex; align-items: center; justify-content: space-between; color: var(--muted-strong); font-size: 9px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
.ai-disclosure { display: inline-flex; align-items: center; gap: 5px; color: var(--muted); font-family: "JetBrains Mono Variable", monospace; font-size: 7px; font-weight: 500; }
.ai-disclosure > span { width: 5px; height: 5px; border-radius: 50%; background: var(--coral); box-shadow: 0 0 8px rgba(255,138,114,.5); }
.empty-state { max-width: 230px; margin: 12px auto 0; color: var(--muted); font-size: 9px; text-align: center; }
.audio-result audio { width: 100%; height: 36px; margin: 8px 0 12px; color-scheme: dark; }
.request-meta { display: block; margin-top: 9px; color: var(--muted); font-family: "JetBrains Mono Variable", monospace; font-size: 7px; text-align: center; }
.status-message { display: flex; align-items: flex-start; gap: 10px; margin: 14px 0; padding: 12px 13px; border: 1px solid var(--border); border-radius: 11px; font-size: 10px; line-height: 1.5; }
.status-message > svg { flex: 0 0 auto; margin-top: 1px; }
.status-message p { margin: 0; }
.status-message small { display: block; margin-top: 4px; font-family: "JetBrains Mono Variable", monospace; font-size: 7px; opacity: .7; }
.status-message--error { border-color: rgba(255,142,150,.22); color: #ffc2c7; background: rgba(255,77,90,.055); }
.status-message--success { border-color: rgba(139,255,204,.2); color: var(--success); background: rgba(139,255,204,.05); }
.status-message--info { border-color: rgba(141,167,255,.2); color: #bac8ff; background: rgba(141,167,255,.05); }

.principles { width: min(100% - 40px, 1240px); margin: 0 auto; padding: 110px 0 130px; border-top: 1px solid var(--border); }
.principles__heading { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(260px, .8fr); align-items: end; gap: 60px; margin-bottom: 46px; }
.principles__heading .section-kicker { grid-column: 1 / -1; margin-bottom: -45px; }
.principles__heading p { max-width: 400px; }
.principles-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.principle-card { position: relative; min-height: 285px; padding: 23px; border: 1px solid var(--border); border-radius: 19px; background: linear-gradient(155deg, rgba(17,28,42,.67), rgba(9,15,23,.72)); overflow: hidden; transition: transform 180ms ease, border-color 180ms ease; }
.principle-card:hover { transform: translateY(-3px); border-color: var(--border-strong); }
.principle-card--featured { background: linear-gradient(155deg, rgba(33,65,59,.67), rgba(9,20,21,.8)); }
.principle-card__number { position: absolute; top: 19px; right: 21px; color: rgba(181,199,224,.3); font-family: "JetBrains Mono Variable", monospace; font-size: 9px; }
.principle-card__icon { display: grid; width: 42px; height: 42px; place-items: center; border-radius: 12px; color: var(--accent); background: rgba(139,255,204,.08); }
.principle-card__icon svg { width: 19px; }
.principle-card h3 { margin: 28px 0 10px; font-size: 16px; font-weight: 650; letter-spacing: -.02em; line-height: 1.3; }
.principle-card p { margin: 0; color: var(--muted); font-size: 10px; line-height: 1.7; }
.principle-card code { position: absolute; right: 20px; bottom: 20px; left: 20px; padding: 8px; border: 1px solid rgba(139,255,204,.11); border-radius: 8px; color: var(--accent); background: rgba(3,11,10,.35); font-family: "JetBrains Mono Variable", monospace; font-size: 8px; text-align: center; }
.learn-cta { display: flex; width: min(100% - 40px, 1240px); align-items: center; justify-content: space-between; gap: 50px; margin: 0 auto 120px; padding: clamp(32px, 6vw, 70px); border: 1px solid rgba(139,255,204,.18); border-radius: 28px; background: radial-gradient(circle at 85% 10%, rgba(141,167,255,.12), transparent 19rem), linear-gradient(135deg, rgba(23,49,44,.88), rgba(10,20,26,.91)); box-shadow: var(--shadow); }
.learn-cta > div { max-width: 720px; }
.learn-cta h2 { font-size: clamp(32px, 4vw, 49px); }
.learn-cta .button { flex: 0 0 auto; }
.site-footer { display: grid; width: min(100% - 40px, 1240px); grid-template-columns: auto 1fr auto; align-items: center; gap: 35px; margin: 0 auto; padding: 34px 0 46px; border-top: 1px solid var(--border); }
.site-footer p { margin: 0; color: var(--muted); font-size: 9px; text-align: center; }
.site-footer p a, .footer-links a { color: var(--muted-strong); }
.site-footer p a:hover, .footer-links a:hover { color: var(--accent); }
.footer-links { display: flex; gap: 17px; color: var(--muted); font-size: 9px; }
.spin { animation: spin .8s linear infinite; }

@keyframes pulse { 0% { opacity: .8; transform: scale(.7); } 70%, 100% { opacity: 0; transform: scale(1.8); } }
@keyframes orbit { to { transform: rotate(360deg); } }
@keyframes wave { from { transform: scaleY(.34); } to { transform: scaleY(1); } }
@keyframes nudge { 0%, 100% { transform: translateY(-2px); } 50% { transform: translateY(3px); } }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 1020px) {
  .hero { grid-template-columns: 1fr; }
  .hero__copy { max-width: 760px; }
  .hero-visual { width: min(100%, 620px); min-height: 500px; justify-self: center; }
  .scroll-cue { display: none; }
  .site-nav { display: none; }
  .playground-intro { align-items: start; flex-direction: column; }
  .studio-layout { grid-template-columns: 1fr; }
  .studio-main { border-right: 0; border-bottom: 1px solid var(--border); }
  .studio-sidebar { display: grid; grid-template-columns: 1fr 1fr; }
  .principles-grid { grid-template-columns: repeat(2, 1fr); }
  .learn-cta { align-items: flex-start; flex-direction: column; }
}

@media (max-width: 720px) {
  .site-header, .hero-wrap, .playground-shell, .principles, .learn-cta, .site-footer { width: min(100% - 24px, 1240px); }
  .site-header { min-height: 68px; }
  .github-button span { display: none; }
  .brand__mark { width: 38px; height: 38px; }
  .hero-wrap { padding: 70px 0 95px; }
  .hero { min-height: auto; gap: 58px; }
  .hero h1 { font-size: clamp(43px, 14vw, 66px); }
  .hero__lede { font-size: 16px; }
  .hero__facts { gap: 15px; }
  .hero__facts div { display: flex; align-items: flex-start; flex-direction: column; gap: 1px; }
  .hero-visual { min-height: 430px; border-radius: 24px; }
  .sound-orb { top: 75px; width: 190px; height: 190px; }
  .sound-orb__core { inset: 48px; }
  .visual-wave { top: 278px; }
  .signal-card { min-width: 150px; }
  .signal-card--input { top: 18px; left: 15px; }
  .signal-card--output { right: 15px; bottom: 17px; }
  .visual-note { display: none; }
  .playground-shell { padding: 70px 0 90px; }
  .architecture-strip { width: 100%; overflow-x: auto; }
  .architecture-strip span { white-space: nowrap; }
  .access-gate { grid-template-columns: auto 1fr; }
  .access-gate label { grid-column: 1 / -1; }
  .playground-card { border-radius: 18px; }
  .tab-list { grid-template-columns: 1fr; }
  .tutorial-link { display: none; }
  .tab { min-height: 56px; }
  .tab small { display: none; }
  .studio-main { padding: 25px 18px; }
  .studio-sidebar { display: flex; padding: 16px; }
  .section-heading { align-items: flex-start; flex-direction: column; margin-bottom: 25px; }
  .section-heading h2 { font-size: 29px; }
  .text-area--hero { min-height: 150px; font-size: 14px; }
  .stream-status { width: 100%; margin-left: 0; }
  .principles { padding: 85px 0 100px; }
  .principles__heading { display: block; }
  .principles__heading .section-kicker { margin-bottom: 10px; }
  .principles-grid { grid-template-columns: 1fr; }
  .principle-card { min-height: 245px; }
  .learn-cta { margin-bottom: 80px; padding: 28px 22px; }
  .learn-cta .button { width: 100%; }
  .site-footer { display: flex; align-items: flex-start; flex-direction: column; gap: 22px; }
  .site-footer p { text-align: left; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
```

</details>

### 4.9 Crie `src/app/manifest.ts`

Descreva o app para instalação e metadados de navegador.

Abra `src/app/manifest.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>src/app/manifest.ts</strong></summary>

```ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OpenAI Voice Labs · Lab 01 Text to Speech",
    short_name: "Voice Lab 01",
    description: "Learn production-minded OpenAI text-to-speech engineering.",
    start_url: "/",
    display: "standalone",
    background_color: "#070b12",
    theme_color: "#070b12",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
```

</details>

### 4.10 Crie `src/app/icon.svg`

Adicione o ícone vetorial usado pela aplicação.

Abra `src/app/icon.svg`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>src/app/icon.svg</strong></summary>

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#0b111b"/>
  <path d="M13 32h5m4-11v22m7-30v38m7-31v24m7-18v12m5-6h4" fill="none" stroke="#8bffcc" stroke-width="4" stroke-linecap="round"/>
</svg>
```

</details>

### 4.11 Crie `tests/client-api.test.ts`

Crie o teste que prova esta responsabilidade sem chamar a OpenAI.

Abra `tests/client-api.test.ts`, apague qualquer placeholder e coloque exatamente:

<details class="code-disclosure" markdown="1"><summary><strong>tests/client-api.test.ts</strong></summary>

```ts
import { describe, expect, it } from "vitest";

import {
  authorizationHeaders,
  formatBytes,
  readApiError,
} from "../src/lib/client-api";

describe("client API helpers", () => {
  it("only adds authorization when a token exists", () => {
    expect(authorizationHeaders("  ")).toEqual({});
    expect(authorizationHeaders(" token ")).toEqual({ Authorization: "Bearer token" });
  });

  it("formats byte counts for the UI", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(2_048)).toBe("2.0 KB");
    expect(formatBytes(2 * 1024 * 1024)).toBe("2.0 MB");
  });

  it("parses the stable API error envelope", async () => {
    const response = Response.json(
      { error: { message: "Try again", code: "busy", requestId: "request-1" } },
      { status: 429 },
    );

    await expect(readApiError(response)).resolves.toEqual({
      message: "Try again",
      code: "busy",
      requestId: "request-1",
    });
  });

  it("falls back when an upstream body is not JSON", async () => {
    const response = new Response("gateway error", { status: 502 });
    await expect(readApiError(response)).resolves.toEqual({
      message: "The request could not be completed.",
    });
  });

  it("uses a stable message when a JSON error omits optional fields", async () => {
    const response = Response.json({ error: {} }, { status: 500 });
    await expect(readApiError(response)).resolves.toEqual({
      message: "The request could not be completed.",
    });
  });
});
```

</details>

### Checkpoint do passo 4

Salve todos os arquivos e execute:

```bash
npm run check
```

Não avance enquanto o comando retornar erro. Leia a primeira mensagem, confira o caminho do arquivo e compare com o checkpoint antes de reinstalar dependências.

## Checkpoint do capítulo

A aplicação completa agora deve passar pelo gate local:

```bash
npm run check
```

Esse comando ainda não faz uma chamada paga. O teste real de voz acontece no próximo capítulo, de forma curta e explícita.

[Próximo: execute, teste e publique →](03-execucao-testes-deploy.md)
