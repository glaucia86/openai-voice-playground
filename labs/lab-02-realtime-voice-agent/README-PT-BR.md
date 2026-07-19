# Laboratório 02 — Agente de Voz OpenAI Realtime

Construa um agente conversacional speech-to-speech fluido e interrompível com Next.js 15, TypeScript 7, OpenAI Realtime, WebRTC e OpenAI Agents SDK.

[Read in English](README.md) · [Índice do workshop](../../docs/README.md) · [Tutorial completo em português](tutorial/tutorial.md) · [Standalone English tutorial](tutorial/tutorial-en.md) · [Voltar para todos os labs](../../README-PT-BR.md)

## O que você aprende

- por que uma conversa ao vivo é uma sessão com estado, não uma sequência de uploads de áudio;
- como uma Route Handler cria um client secret Realtime de curta duração;
- como o browser usa WebRTC sem receber a chave padrão do projeto OpenAI;
- como modelar autorização, conexão, escuta, raciocínio, fala, interrupção e falha;
- como semantic turn detection, mute, barge-in, alternativa por texto e limpeza explícita interagem;
- quais controles de privacidade, abuso, custo e observabilidade ainda pertencem ao seu sistema de produção.

## Execute localmente

Pré-requisitos: Node.js 20+, npm, uma API key de projeto da OpenAI e navegador com suporte a WebRTC e microfone.

Dentro desta pasta:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Adicione sua chave somente ao `.env.local`:

```dotenv
OPENAI_API_KEY=your_project_key
```

Abra <http://localhost:3000>, leia o aviso de consentimento e inicie a sessão pelo botão explícito. Prefira fones de ouvido para reduzir eco acústico.

`.env.local` é ignorado pelo Git. Nunca faça commit dele, exponha a chave com `NEXT_PUBLIC_`, registre-a em logs ou substitua a credencial efêmera por uma rota que devolve a chave padrão.

## Arquitetura

```text
Browser ── POST /api/realtime/token ──> servidor Next.js ──> OpenAI
Browser <────────── ek_… curto ──────── servidor Next.js <── OpenAI
Browser <══════════ áudio e eventos WebRTC ════════════════> OpenAI
```

O app usa `gpt-realtime-2.1`, VAD semântico, `gpt-4o-mini-transcribe` para transcript visual da entrada e client secret efêmero com TTL de emissão de 60 segundos. A interface encerra a sessão didática após 15 minutos. O laboratório não persiste áudio nem transcripts na aplicação; a retenção padrão de monitoramento de abuso do provedor é uma fronteira separada.

## Gate de qualidade

```bash
npm run lint
npm run typecheck
npm test
npm run build
# ou execute os quatro:
npm run check
```

Os testes validam os contratos locais sem abrir uma sessão Realtime paga.

## Deploy na Vercel

Importe o repositório e defina **Root Directory** como `labs/lab-02-realtime-voice-agent`. Cadastre `OPENAI_API_KEY`, `PLAYGROUND_ACCESS_TOKEN`, `APP_ORIGIN`, `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` nas Environment Variables da Vercel; depois publique a partir da `main`. Fora de `localhost`, o microfone exige HTTPS. Consulte o [capítulo de deploy do workshop](tutorial/tutorial.md#13-faça-deploy-na-vercel-e-valide-a-sessão-real).

## Fronteira de produção

Produção falha de modo seguro sem acesso compartilhado obrigatório, origem canônica, identidade de cliente confiável e quota distribuída no Upstash Redis. O timer de 15 minutos da UI é cooperativo, não autoritativo contra um cliente WebRTC modificado. Um produto público ainda precisa de identidade, quotas por usuário e sessão concorrente, orçamentos/alertas do projeto OpenAI, consentimento e retenção revisados, controle server-side da sessão, telemetria, resposta a abuso, reconexão e autorização para ferramentas com efeito relevante.
