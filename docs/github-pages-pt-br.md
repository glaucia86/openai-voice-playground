---
layout: default
title: "Publicar os workshops no GitHub Pages"
description: "Ative e valide o site estático bilíngue dos OpenAI Voice Labs."
---

# Publicar os workshops no GitHub Pages

[Read in English](github-pages.md) · [Abrir a página inicial](../index.md) · [Índice do workshop](README.md)

O workflow [`.github/workflows/pages.yml`](../.github/workflows/pages.yml) compila o conteúdo Markdown com Jekyll e publica um artefato pelo mecanismo oficial do GitHub Pages.

## Ativação única no GitHub

1. Abra o repositório no GitHub.
2. Entre em **Settings → Pages**.
3. Em **Build and deployment → Source**, escolha **GitHub Actions**.
4. Abra a aba **Actions**.
5. Selecione o workflow **GitHub Pages**.
6. Execute **Run workflow** ou envie uma alteração de documentação para `main`.

Depois do deploy, o ambiente `github-pages` mostra a URL publicada. Para este repositório, a URL padrão esperada é:

```text
https://glaucia86.github.io/openai-voice-playground/
```

## O que dispara o site

O workflow executa quando `main` recebe alterações em:

- configuração ou workflow do Pages;
- `index.md`;
- `docs/**`;
- qualquer diretório `labs/*/tutorial/**`.

Mudanças apenas no código do app não disparam um deploy de documentação, a menos que também atualizem o tutorial.

## Validação local antes do push

```bash
npm run docs:generate
npm run docs:check
git diff --check
```

`docs:generate` sincroniza os capítulos arquivo por arquivo com o código real. `docs:check` falha se alguém alterar a implementação e esquecer de regenerar os workshops.

## Limite importante

GitHub Pages publica arquivos estáticos. Ele não executa as rotas `/api/speech` ou `/api/realtime/token`, não deve receber `OPENAI_API_KEY` e não substitui o deploy das aplicações. Publique os apps em Vercel ou outro runtime Next.js; use Pages para o material didático.

Sites Pages são públicos. Nunca adicione `.env.local`, credenciais, transcripts, áudio privado ou dados pessoais ao conteúdo publicado.
