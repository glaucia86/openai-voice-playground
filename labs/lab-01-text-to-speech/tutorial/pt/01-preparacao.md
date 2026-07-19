---
layout: default
title: "Lab 01 · Capítulo 1 — Preparação"
description: "Prepare conta, terminal, API key e a base do laboratório de Text to Speech."
---

# Lab 01 · Capítulo 1 — Prepare conta, terminal e projeto

[← Visão geral](../tutorial.md) · [English](../en/01-preparation.md) · [Próximo: construção arquivo por arquivo →](02-construcao-arquivo-por-arquivo.md)

Neste capítulo você vai preparar tudo que o código precisa. Ao final, terá uma base compilável, uma branch própria e uma API key protegida fora do Git.

## 1. Abra o terminal e confira as ferramentas

Abra um terminal novo. No Windows, use PowerShell, Git Bash ou WSL. Execute:

```bash
node --version
npm --version
git --version
```

Continue somente se:

- Node.js mostrar `v20` ou superior;
- npm responder com uma versão;
- Git responder com uma versão.

Se um comando não for reconhecido, instale a ferramenta, feche o terminal e abra outro. Não tente compensar uma instalação incompleta alterando o código.

## 2. Crie ou selecione um projeto da API OpenAI

Este laboratório usa a API Platform. A assinatura do ChatGPT e o consumo da API possuem cobrança separada.

1. Abra <https://platform.openai.com/>.
2. Entre com a conta responsável pelo laboratório.
3. No seletor de projetos, crie ou selecione um projeto de estudo, como `openai-voice-labs`.
4. Confira cobrança ou créditos da API.
5. Configure alertas de orçamento e acompanhe o uso durante os testes.
6. Abra **API Keys** e crie uma chave chamada `voice-labs-local`.

Copie a chave uma única vez. Não cole em chat, screenshot, issue, código-fonte ou `.env.example`. Se ela aparecer em um desses locais, revogue-a e gere outra.

## 3. Escolha o ponto de partida

### Opção recomendada: branch starter

Vá até a pasta onde guarda projetos. Por exemplo:

```bash
cd ~/projects
```

Clone o starter:

```bash
git clone --branch workshop/lab-01-v1-starter \
  https://github.com/glaucia86/openai-voice-playground.git
cd openai-voice-playground
git switch -c minha-solucao-lab-01
```

Agora instale exatamente as dependências registradas no lockfile:

```bash
npm ci --prefix labs/lab-01-text-to-speech
```

Execute o primeiro checkpoint:

```bash
npm run check:lab01
```

O comando deve terminar sem erro. Ainda não haverá geração de voz; o objetivo é provar o ambiente antes de adicionar a integração.

### Alternativa: pasta absolutamente vazia

Se você quer praticar também o scaffolding, execute:

```bash
mkdir -p openai-voice-labs/labs/lab-01-text-to-speech
cd openai-voice-labs/labs/lab-01-text-to-speech
npm init -y
```

Instale as dependências de runtime:

```bash
npm install next@15.5.20 react@19.2.7 react-dom@19.2.7 \
  openai@^6.48.0 zod@^4.4.3 lucide-react@^1.25.0 \
  @fontsource-variable/manrope@^5.2.8 \
  @fontsource-variable/jetbrains-mono@^5.2.8 \
  @upstash/ratelimit@2.0.8 @upstash/redis@1.38.0
```

Instale as ferramentas de desenvolvimento:

```bash
npm install --save-dev @types/node@^26.1.1 @types/react@^19.2.17 \
  @types/react-dom@^19.2.3 oxlint@^1.74.0 vitest@^4.1.10 \
  @vitest/coverage-v8@^4.1.10 typescript@5.8.2 \
  typescript7@npm:typescript@7.0.2
```

O `npm install` cria `package-lock.json`. Não escreva esse arquivo manualmente.

## 4. Entre no diretório correto

Se escolheu o starter, execute:

```bash
cd labs/lab-01-text-to-speech
pwd
```

O caminho deve terminar em:

```text
openai-voice-playground/labs/lab-01-text-to-speech
```

Todos os comandos de criação de arquivos do próximo capítulo partem desse diretório.

## 5. Crie o arquivo local de ambiente

No macOS, Linux ou Git Bash:

```bash
cp .env.example .env.local
```

No PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Abra `.env.local` no editor e preencha somente a chave local:

```dotenv
OPENAI_API_KEY=cole_sua_chave_de_projeto_aqui
PLAYGROUND_ACCESS_TOKEN=
APP_ORIGIN=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
CLIENT_IP_HEADER=
```

Não use aspas e não acrescente `NEXT_PUBLIC_` ao nome. O navegador nunca deve receber essa chave.

## 6. Prove que o segredo está ignorado

Ainda dentro do diretório do Lab 01, execute:

```bash
git check-ignore -v .env.local
```

O Git deve mostrar a regra que ignora `.env*`. Se não houver saída, pare e corrija `.gitignore` antes de continuar.

Depois confirme que o arquivo não entrou no status:

```bash
git status -sb
```

`.env.local` não pode aparecer.

## Checkpoint do capítulo

Antes de avançar, confirme:

- [ ] Node.js, npm e Git respondem;
- [ ] você está numa branch própria;
- [ ] as dependências foram instaladas;
- [ ] `.env.local` contém a chave somente na máquina local;
- [ ] `git check-ignore -v .env.local` mostra uma regra;
- [ ] nenhuma chamada paga foi necessária.

[Próximo: construa a aplicação arquivo por arquivo →](02-construcao-arquivo-por-arquivo.md)
