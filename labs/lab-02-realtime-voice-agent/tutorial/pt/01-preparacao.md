---
layout: default
title: "Lab 02 · Capítulo 1 — Preparação"
description: "Prepare conta, terminal, microfone, API key e a base do agente Realtime."
lang: pt-BR
lab_label: "Lab 02 · Agente Realtime"
lab_index: "/labs/lab-02-realtime-voice-agent/tutorial/tutorial.html"
lab_index_label: "Índice do Lab 02"
step_label: "Preparação"
step_position: "Etapa 1 de 3"
alternate_url: "/labs/lab-02-realtime-voice-agent/tutorial/en/01-preparation.html"
alternate_lang: en
alternate_label: "English"
checkpoint_url: "/labs/lab-02-realtime-voice-agent/tutorial/tutorial.html#checkpoints-de-recuperação"
checkpoint_label: "Checkpoints do Lab 02"
previous_url: "/labs/lab-02-realtime-voice-agent/tutorial/tutorial.html"
previous_label: "Visão geral e Comece em 5 minutos"
previous_kicker: "← Anterior"
next_url: "/labs/lab-02-realtime-voice-agent/tutorial/pt/02-construcao-arquivo-por-arquivo.html"
next_label: "Construir autorização, WebRTC e interface"
next_kicker: "Próximo capítulo →"
chapter_nav_label: "Navegação do workshop Lab 02"
---

# Lab 02 · Capítulo 1 — Prepare conta, terminal, microfone e projeto

[← Visão geral](../tutorial.md) · [English](../en/01-preparation.md) · [Próximo: construção arquivo por arquivo →](02-construcao-arquivo-por-arquivo.md)

Neste capítulo você prepara uma base que compila sem pedir microfone ou abrir uma sessão paga. Só testaremos áudio depois que contratos, segurança e cleanup estiverem implementados.

## 1. Abra o terminal e verifique as ferramentas

```bash
node --version
npm --version
git --version
```

Use Node.js `v20` ou superior. Confirme também:

- navegador atual com WebRTC;
- microfone permitido no sistema operacional;
- fones de ouvido disponíveis, se possível;
- editor de código.

`localhost` pode pedir microfone durante desenvolvimento. Um deploy precisa de HTTPS.

## 2. Prepare o projeto da API OpenAI

1. Entre em <https://platform.openai.com/>.
2. Crie ou selecione um projeto de estudo como `openai-voice-labs`.
3. Confirme cobrança ou créditos da API.
4. Verifique acesso ao modelo Realtime usado pelo laboratório.
5. Configure alertas de orçamento.
6. Crie uma API key de projeto chamada `voice-labs-local`.

A chave padrão ficará somente no servidor. O navegador receberá mais tarde um client secret curto, criado especificamente para iniciar uma sessão. Não confunda as duas credenciais.

## 3. Clone o starter recomendado

```bash
cd ~/projects
git clone --branch workshop/lab-02-v1-starter \
  https://github.com/glaucia86/openai-voice-playground.git
cd openai-voice-playground
git switch -c minha-solucao-lab-02
npm ci --prefix labs/lab-02-realtime-voice-agent
npm run check:lab02
```

Esse gate deve passar sem chave, microfone ou chamada externa. Ele comprova apenas configuração, página starter, health check e teste inicial.

## 4. Alternativa: crie tudo numa pasta vazia

```bash
mkdir -p openai-voice-labs/labs/lab-02-realtime-voice-agent
cd openai-voice-labs/labs/lab-02-realtime-voice-agent
npm init -y
```

Dependências de runtime:

```bash
npm install next@15.5.20 react@19.2.7 react-dom@19.2.7 \
  openai@^6.48.0 @openai/agents@^0.13.5 zod@^4.4.3 \
  lucide-react@^1.25.0 @fontsource-variable/manrope@^5.2.8 \
  @fontsource-variable/jetbrains-mono@^5.2.8 \
  @upstash/ratelimit@2.0.8 @upstash/redis@1.38.0
```

Ferramentas de desenvolvimento:

```bash
npm install --save-dev @types/node@^26.1.1 @types/react@^19.2.17 \
  @types/react-dom@^19.2.3 oxlint@^1.74.0 vitest@^4.1.10 \
  @vitest/coverage-v8@^4.1.10 typescript@5.8.2 \
  typescript7@npm:typescript@7.0.2
```

## 5. Entre no diretório do laboratório

No clone starter:

```bash
cd labs/lab-02-realtime-voice-agent
pwd
```

O caminho deve terminar em `labs/lab-02-realtime-voice-agent`.

## 6. Crie e proteja `.env.local`

macOS, Linux ou Git Bash:

```bash
cp .env.example .env.local
```

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Preencha:

```dotenv
OPENAI_API_KEY=cole_sua_chave_de_projeto_aqui
PLAYGROUND_ACCESS_TOKEN=
APP_ORIGIN=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
CLIENT_IP_HEADER=
```

As variáveis vazias serão necessárias no deploy, mas o desenvolvimento local possui um modo didático seguro. Nunca prefixe a chave com `NEXT_PUBLIC_`.

Confirme a proteção:

```bash
git check-ignore -v .env.local
git status -sb
```

`.env.local` não pode aparecer no status.

## 7. Não abra o microfone ainda

Antes do teste real, construiremos:

1. schema estrito da solicitação;
2. rota server-side que emite o client secret;
3. resposta `no-store`;
4. agente e sessão com cleanup;
5. estados e mensagens acessíveis;
6. testes locais.

Essa ordem evita usar uma chamada faturável para descobrir erros que TypeScript ou Vitest poderiam encontrar sem rede.

## Checkpoint do capítulo

- [ ] ferramentas respondem;
- [ ] projeto da API e orçamento foram conferidos;
- [ ] você trabalha numa branch própria;
- [ ] `npm run check:lab02` passa no starter;
- [ ] `.env.local` está ignorado;
- [ ] microfone e sessão Realtime ainda não foram iniciados.

> **Pergunta de compreensão:** por que a sessão deve ser aberta somente depois que schema, autorização e cleanup passam nos gates offline?

**Conclusão:** ambiente, orçamento, branch e segredo estão prontos sem ativar mídia. O próximo capítulo constrói a sessão em fatias verificáveis.

[Próximo: construa a aplicação arquivo por arquivo →](02-construcao-arquivo-por-arquivo.md)
