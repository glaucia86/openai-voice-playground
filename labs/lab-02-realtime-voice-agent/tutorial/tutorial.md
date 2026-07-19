---
layout: default
title: "Lab 02 — Agente Realtime: workshop passo a passo"
description: "Construa um agente de voz OpenAI Realtime arquivo por arquivo, do terminal ao deploy."
---

# Lab 02 — Agente Realtime: workshop passo a passo

[Read in English](tutorial-en.md) · [Índice dos workshops](../../../docs/README.md) · [← Lab 01](../../lab-01-text-to-speech/tutorial/tutorial.md)

Neste workshop você cria uma aplicação speech-to-speech real seguindo ações concretas: abra o terminal, crie o arquivo indicado, coloque o conteúdo completo, execute o checkpoint e só então avance.

Ao terminar, você terá uma aplicação Next.js que:

- cria um client secret Realtime curto no servidor;
- mantém `OPENAI_API_KEY` fora do navegador;
- conecta áudio e eventos por WebRTC;
- trata conexão, escuta, raciocínio, fala, mute e interrupção;
- oferece alternativa por texto e transcript em memória;
- encerra e limpa a sessão explicitamente;
- possui testes sem abrir uma sessão faturável;
- pode ser publicada com HTTPS.

## Escolha como acompanhar

| Caminho | O que você faz | Recomendação |
| --- | --- | --- |
| **A — executar e investigar** | clona a `main` e abre a solução final | bom para conhecer Realtime primeiro |
| **B — construir pelo starter** | parte de uma base compilável e implementa cada fatia | **recomendado para acompanhar o workshop** |
| **C — criar do zero** | cria também pastas, configuração e dependências | bom para estudo aprofundado ou aula longa |

O [guia de acompanhamento](../../../docs/workshop-guide-pt-br.md) explica como preservar seu trabalho e consultar checkpoints sem usar comandos destrutivos.

## Comece agora

1. **[Prepare conta, terminal, microfone e projeto](pt/01-preparacao.md)** — Escolha o caminho, proteja a API key e prove que a base executa sem abrir uma sessão.
2. **[Construa a aplicação arquivo por arquivo](pt/02-construcao-arquivo-por-arquivo.md)** — Crie contrato, autorização, client secret, agente, WebRTC, estados, interface e testes com arquivos completos.
3. **[Execute, diagnostique e publique](pt/03-execucao-testes-deploy.md)** — Rode os gates, faça um smoke test curto, diagnostique microfone/WebRTC e publique com HTTPS.

> Para compreender as decisões antes ou depois da implementação, leia o **[artigo arquitetural do Lab 02](article.md)**. O artigo explica os porquês; os capítulos acima conduzem suas ações.

## Starter recomendado

```bash
git clone --branch workshop/lab-02-v1-starter \
  https://github.com/glaucia86/openai-voice-playground.git
cd openai-voice-playground
git switch -c minha-solucao-lab-02
npm ci --prefix labs/lab-02-realtime-voice-agent
npm run check:lab02
```

O primeiro gate deve passar sem API key, permissão de microfone ou sessão OpenAI. Depois, abra o [Capítulo 1](pt/01-preparacao.md).

## Checkpoints de recuperação

| Depois de concluir | Referência | Comparação |
| --- | --- | --- |
| base inicial | `workshop/lab-02-v1-starter` | ponto de partida |
| contrato da sessão | `workshop/lab-02-v1-step-01-session-contract` | [ver diff](https://github.com/glaucia86/openai-voice-playground/compare/workshop/lab-02-v1-starter...workshop/lab-02-v1-step-01-session-contract) |
| autorização e client secret | `workshop/lab-02-v1-step-02-authorization` | [ver diff](https://github.com/glaucia86/openai-voice-playground/compare/workshop/lab-02-v1-step-01-session-contract...workshop/lab-02-v1-step-02-authorization) |
| conversa e interface | `workshop/lab-02-v1-step-03-conversation` | [ver diff](https://github.com/glaucia86/openai-voice-playground/compare/workshop/lab-02-v1-step-02-authorization...workshop/lab-02-v1-step-03-conversation) |

Faça commit na sua branch antes de comparar. Checkpoints são referências de leitura, não atalhos para apagar sua implementação.

## Evidência final

```bash
npm run check:lab02
git status -sb
```

O primeiro comando executa lint, TypeScript, testes e build sem ligar microfone ou abrir conexão paga. O segundo deve confirmar que nenhum segredo ou artefato foi adicionado ao Git.

[Começar o Capítulo 1 →](pt/01-preparacao.md)
