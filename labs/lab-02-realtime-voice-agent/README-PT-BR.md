# Laboratório 02 — Agente de Voz OpenAI Realtime

Construa um agente conversacional speech-to-speech fluido e interrompível com Next.js 15, TypeScript 7, OpenAI Realtime, WebRTC e OpenAI Agents SDK.

[Read in English](README.md) · [Workshop completo e passo a passo](tutorial/tutorial.md) · [Voltar para todos os labs](../../README-PT-BR.md)

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

O app usa `gpt-realtime-2.1`, VAD semântico, `gpt-4o-mini-transcribe` para transcript visual da entrada e client secret efêmero com TTL de emissão de 60 segundos. O laboratório não persiste áudio nem transcripts na aplicação.

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

Importe o repositório e defina **Root Directory** como `labs/lab-02-realtime-voice-agent`. Cadastre `OPENAI_API_KEY` nas Environment Variables da Vercel e publique a partir da `main`. Fora de `localhost`, o microfone exige HTTPS. Consulte o [capítulo de deploy do workshop](tutorial/tutorial.md#13-faça-deploy-na-vercel-e-valide-a-sessão-real).

## Fronteira de produção

O exemplo inclui verificação de origem, schemas estritos, erros sanitizados, limitador local, proteção compartilhada opcional, credenciais curtas, encerramento explícito e logs sem conteúdo. Um produto público ainda precisa de identidade de usuário, quotas distribuídas, orçamento, consentimento e retenção, telemetria, resposta a abuso, reconexão e autorização para toda ferramenta de agente com efeito relevante.
