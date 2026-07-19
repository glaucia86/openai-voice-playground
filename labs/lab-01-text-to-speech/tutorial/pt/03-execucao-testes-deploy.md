---
layout: default
title: "Lab 01 · Capítulo 3 — Execução, testes e deploy"
description: "Valide, execute, diagnostique e publique a aplicação Text to Speech."
---

# Lab 01 · Capítulo 3 — Execute, teste, diagnostique e publique

[← Construção arquivo por arquivo](02-construcao-arquivo-por-arquivo.md) · [English](../en/03-run-test-deploy.md) · [Visão geral](../tutorial.md)

O código está escrito. Agora vamos provar responsabilidades locais antes de gastar uma chamada de voz, executar um smoke test curto e preparar o deploy.

## 1. Confirme o diretório e o segredo

```bash
pwd
git check-ignore -v .env.local
```

O primeiro comando deve terminar em `labs/lab-01-text-to-speech`. O segundo deve mostrar uma regra de `.gitignore`. Pare se a chave não estiver protegida.

## 2. Execute os gates sem chamar a OpenAI

Rode um comando por vez para localizar falhas com clareza:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Depois prove o fluxo agregado:

```bash
npm run check
```

Resultado esperado:

- Oxlint termina sem warning;
- TypeScript termina sem emitir JavaScript;
- todos os testes passam;
- Next.js cria o build de produção;
- nenhuma requisição de voz é feita.

Se um gate falhar, corrija a primeira mensagem antes de executar os seguintes. Não apague o lockfile como tentativa genérica de solução.

## 3. Inicie o servidor local

```bash
npm run dev
```

Espere o terminal informar que o servidor está pronto e abra <http://localhost:3000>.

Em outro terminal, entre novamente no laboratório:

```bash
cd openai-voice-playground/labs/lab-01-text-to-speech
curl http://localhost:3000/api/health
```

No PowerShell:

```powershell
Invoke-RestMethod http://localhost:3000/api/health
```

A resposta deve indicar `ok: true`, `configured: true`, modelo `gpt-4o-mini-tts` e streaming habilitado. Ela nunca deve devolver a API key.

Se `configured` for `false`, confirme o nome `.env.local`, salve o arquivo e reinicie `npm run dev`.

## 4. Faça um único teste de voz controlado

1. Abra a interface.
2. Digite uma frase curta e sem dado pessoal, como `Este é um teste do laboratório de voz.`
3. Escolha uma voz.
4. Mantenha velocidade `1` e formato `mp3`.
5. Clique para gerar.
6. Aguarde o player aparecer.
7. Reproduza o áudio.
8. Faça download e confirme a extensão.
9. Gere novamente e pressione cancelar para validar o estado.

O player deve substituir o áudio anterior e liberar o object URL antigo. A tela deve informar claramente que a voz é gerada por IA.

Pare o servidor com `Ctrl+C` quando terminar.

## 5. Diagnóstico orientado a sintomas

| Sintoma | O que verificar |
| --- | --- |
| `configured: false` | `.env.local`, nome `OPENAI_API_KEY` e reinício do servidor |
| `401 unauthorized` | token compartilhado digitado na interface quando configurado |
| `403 cross_origin_request` | `APP_ORIGIN` e domínio usados no navegador |
| `413 request_too_large` | tamanho real do texto/instruções e corpo JSON |
| `429 rate_limit_exceeded` | aguarde `Retry-After`; não remova o limitador |
| `503 security_configuration_incomplete` | variáveis obrigatórias do ambiente de produção |
| áudio baixa mas não toca | formato, `Content-Type` e suporte do navegador |
| TypeScript não resolve `@/` | `baseUrl`, `paths` e diretório atual |

Para comparar sua implementação com um checkpoint sem substituir arquivos:

```bash
git fetch origin
git diff --stat HEAD..origin/workshop/lab-01-v1-step-03-interface
```

## 6. Faça commit da sua solução

Volte à raiz do clone:

```bash
cd ../..
git status -sb
git add labs/lab-01-text-to-speech
git commit -m "feat: complete text to speech workshop"
```

Revise o status antes de `git add`. `.env.local`, `.next`, `node_modules` e `*.tsbuildinfo` não podem entrar no commit.

## 7. Publique a aplicação na Vercel

GitHub Pages hospedará a documentação, não esta aplicação: `/api/speech` precisa de runtime server-side e segredo. Para a aplicação, use Vercel ou outro host compatível com Next.js Route Handlers.

1. Envie sua branch para um repositório GitHub seu.
2. Na Vercel, escolha **Add New → Project**.
3. Importe o repositório.
4. Em **Root Directory**, selecione `labs/lab-01-text-to-speech`.
5. Mantenha o framework Next.js detectado.
6. Cadastre as variáveis de produção abaixo.

```dotenv
OPENAI_API_KEY=valor_protegido
PLAYGROUND_ACCESS_TOKEN=frase_longa_e_aleatoria
APP_ORIGIN=https://seu-dominio.example
UPSTASH_REDIS_REST_URL=valor_protegido
UPSTASH_REDIS_REST_TOKEN=valor_protegido
```

Na Vercel, deixe `CLIENT_IP_HEADER` ausente para usar o header protegido da plataforma. Em outro provedor, configure o nome do header sobrescrito pelo proxy confiável.

7. Faça o deploy.
8. Abra `https://seu-dominio.example/api/health` antes de gerar áudio.
9. Confirme configuração pronta sem segredo na resposta.
10. Faça um único teste curto com o token de acesso.

## 8. Checklist final

- [ ] `npm run check` passa;
- [ ] o health check não contém segredo;
- [ ] geração, cancelamento, player e download funcionam;
- [ ] disclosure de IA está visível;
- [ ] `.env.local` não foi versionado;
- [ ] produção possui token, origem e quota distribuída;
- [ ] orçamento, alertas e owner da chave estão definidos.

Você concluiu o fluxo prático. Agora use o [artigo arquitetural](../article.md) para revisar streaming, privacidade, segurança e limites de produção com mais profundidade.
