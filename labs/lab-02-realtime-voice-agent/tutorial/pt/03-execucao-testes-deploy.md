---
layout: default
title: "Lab 02 · Capítulo 3 — Execução, testes e deploy"
description: "Valide, execute, diagnostique e publique o agente de voz Realtime."
---

# Lab 02 · Capítulo 3 — Execute, teste, diagnostique e publique

[← Construção arquivo por arquivo](02-construcao-arquivo-por-arquivo.md) · [English](../en/03-run-test-deploy.md) · [Visão geral](../tutorial.md)

Primeiro prove tudo que independe de rede. Só depois abra uma sessão curta com microfone e acompanhe o consumo da API.

## 1. Confirme diretório e segredo

```bash
pwd
git check-ignore -v .env.local
```

O diretório deve terminar em `labs/lab-02-realtime-voice-agent`, e Git precisa mostrar a regra que ignora `.env.local`.

## 2. Execute os gates offline

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run check
```

Esses comandos não pedem microfone nem emitem client secret. Corrija a primeira falha antes de continuar.

## 3. Inicie a aplicação sem ligar o microfone

```bash
npm run dev
```

Abra <http://localhost:3000>, mas ainda não clique em **Start live conversation**.

Em outro terminal:

```bash
cd openai-voice-playground/labs/lab-02-realtime-voice-agent
curl http://localhost:3000/api/health
```

No PowerShell:

```powershell
Invoke-RestMethod http://localhost:3000/api/health
```

A resposta deve informar `ok: true`, `configured: true`, modelo `gpt-realtime-2.1`, transporte `webrtc` e TTL de emissão igual a 60 segundos. Ela não pode conter a API key ou um client secret.

## 4. Faça um smoke test Realtime curto

Use fones de ouvido e conteúdo sem dado pessoal.

1. Leia o aviso de IA e privacidade.
2. Marque o consentimento exigido pela interface.
3. Escolha idioma e voz.
4. Clique em **Start live conversation**.
5. Autorize microfone quando o navegador pedir.
6. Diga uma frase curta.
7. Aguarde uma resposta.
8. Interrompa o agente uma vez falando durante a resposta.
9. Use mute e confirme que a UI muda de estado.
10. Envie uma mensagem pelo campo de texto.
11. Clique em **End**.
12. Confirme que o indicador de microfone do navegador desaparece.

Não deixe a aba conectada. Uma sessão de workshop possui limite visual, mas encerramento explícito continua sendo parte do teste.

## 5. Diagnóstico orientado a sintomas

| Sintoma | O que verificar |
| --- | --- |
| navegador não pede microfone | permissão do sistema, permissão do site e gesto do usuário |
| `configured: false` | `.env.local`, chave e reinício do servidor |
| client secret expira antes de conectar | crie-o somente imediatamente antes de `connect` |
| WebRTC falha | HTTPS/localhost, firewall, rede corporativa e console do navegador |
| agente escuta a própria voz | use fones e escolha perfil de microfone apropriado |
| transcript duplica | reconcilie snapshot do histórico, não append cego |
| microfone continua ativo | execute `session.close()` e pare tracks no cleanup |
| `429 rate_limit_exceeded` | aguarde `Retry-After`; não remova a proteção |
| `503 security_configuration_incomplete` | variáveis obrigatórias de produção |

Compare sua árvore sem substituir arquivos:

```bash
git fetch origin
git diff --stat HEAD..origin/workshop/lab-02-v1-step-03-conversation
```

## 6. Faça commit

```bash
cd ../..
git status -sb
git add labs/lab-02-realtime-voice-agent
git commit -m "feat: complete realtime voice workshop"
```

`.env.local`, `.next`, `node_modules` e `*.tsbuildinfo` não podem entrar.

## 7. Publique a aplicação na Vercel

GitHub Pages hospedará os tutoriais. Ele não executa `/api/realtime/token` nem protege `OPENAI_API_KEY`; a aplicação precisa de um host server-side como Vercel.

1. Importe o repositório na Vercel.
2. Defina **Root Directory** como `labs/lab-02-realtime-voice-agent`.
3. Cadastre:

```dotenv
OPENAI_API_KEY=valor_protegido
PLAYGROUND_ACCESS_TOKEN=frase_longa_e_aleatoria
APP_ORIGIN=https://seu-dominio.example
UPSTASH_REDIS_REST_URL=valor_protegido
UPSTASH_REDIS_REST_TOKEN=valor_protegido
```

Na Vercel, deixe `CLIENT_IP_HEADER` ausente. Fora dela, informe o header sobrescrito pelo proxy confiável.

4. Faça o deploy.
5. Abra `/api/health` e valide configuração sem segredo.
6. Confirme HTTPS e permissão de microfone.
7. Execute uma única conversa curta.
8. Termine explicitamente e acompanhe uso/orçamento.

## 8. Checklist final

- [ ] `npm run check` passa;
- [ ] health não contém credencial;
- [ ] client secret é curto e `no-store`;
- [ ] conexão, interrupção, mute, texto e End funcionam;
- [ ] microfone é liberado;
- [ ] transcript não persiste após refresh;
- [ ] produção possui acesso, origem e quota distribuída;
- [ ] orçamento e alertas estão ativos.

Concluído. Leia o [artigo arquitetural](../article.md) para aprofundar WebRTC, máquina de estados, retenção, abuso e controle server-side.
