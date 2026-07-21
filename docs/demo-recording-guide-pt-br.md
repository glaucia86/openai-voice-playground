---
layout: default
title: "Como gravar demonstrações reais dos laboratórios"
description: "Roteiro seguro para capturar GIFs e vídeos reais dos OpenAI Voice Labs."
lang: pt-BR
alternate_url: "/docs/demo-recording-guide.html"
alternate_lang: en
alternate_label: "Read in English"
---

# Como gravar demonstrações reais dos laboratórios

[Read in English](demo-recording-guide.md) · [Voltar aos workshops](../index.md#workshops)

Este roteiro existe para completar a mídia sem inventar um resultado, revelar credenciais ou gravar dados pessoais. O GIF atual do Lab 01 é uma demonstração real e comprimida. A mídia do Lab 02 permanece marcada como pendente até que uma sessão controlada possa ser gravada.

## Antes de gravar

1. Use um projeto OpenAI separado, com orçamento e alertas pequenos.
2. Feche DevTools, gerenciadores de senha, notificações e abas pessoais.
3. Confirme que `.env.local` não aparece na tela e está ignorado: `git check-ignore -v .env.local`.
4. Use texto e fala fictícios, curtos e sem nomes, e-mail, empresa, telefone ou localização.
5. Grave somente a janela da aplicação; nunca o terminal que contém variáveis.
6. Use fones no Lab 02 para evitar realimentação.

## Lab 01 — sequência de 15 a 25 segundos

Mostre: texto curto → escolha de voz/formato → gerar → estado de processamento → player → reprodução → download. Use áudio mudo no GIF; a legenda textual já explica o resultado. Termine antes de qualquer painel ou log aparecer.

## Lab 02 — sequência de 25 a 40 segundos

Mostre: aviso e consentimento → iniciar → permissão do microfone → estado conectado → uma fala curta → uma resposta → interrupção → mute → uma mensagem de texto → **End** → indicador de microfone desligado. Não mostre Network, client secret, API key, transcript pessoal ou Usage.

## Exportação e acessibilidade

- Preferência: WebM ou MP4 sem autoplay com áudio; fallback GIF sem áudio.
- Meta inicial: largura máxima de 960 px, 10–15 fps para GIF e arquivo abaixo de 2 MB.
- Remova pausas e quadros redundantes antes de reduzir qualidade.
- Adicione `loading="lazy"`, dimensões, texto alternativo e descrição logo abaixo.
- Não use autoplay com som. Respeite `prefers-reduced-motion` oferecendo descrição estática equivalente.

## Revisão antes do commit

Assista quadro a quadro e confirme: nenhum segredo, token, request header, dado pessoal ou notificação aparece. Depois rode `npm run docs:links` e abra a página em 360 px e 1440 px. Se não houver uma gravação real e segura, mantenha o placeholder honesto.

