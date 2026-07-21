---
layout: default
title: "Lab 01 · Capítulo 3 — Execução, testes e deploy"
description: "Valide, execute, diagnostique e publique a aplicação Text to Speech."
lang: pt-BR
lab_label: "Lab 01 · Text to Speech"
lab_index: "/labs/lab-01-text-to-speech/tutorial/tutorial.html"
lab_index_label: "Índice do Lab 01"
step_label: "Execução, testes e deploy"
step_position: "Etapa 3 de 3"
alternate_url: "/labs/lab-01-text-to-speech/tutorial/en/03-run-test-deploy.html"
alternate_lang: en
alternate_label: "Read in English"
checkpoint_url: "/labs/lab-01-text-to-speech/tutorial/tutorial.html#checkpoints-de-recuperação"
checkpoint_label: "Checkpoints do Lab 01"
previous_url: "/labs/lab-01-text-to-speech/tutorial/pt/02-construcao-arquivo-por-arquivo.html"
previous_label: "Construir a aplicação arquivo por arquivo"
previous_kicker: "← Capítulo anterior"
next_url: "/labs/lab-02-realtime-voice-agent/tutorial/tutorial.html"
next_label: "Avançar para o Lab 02 · Agente Realtime"
next_kicker: "Próximo laboratório →"
chapter_nav_label: "Navegação do workshop Lab 01"
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

Comece pelo sintoma, execute o diagnóstico e só então aplique a correção. A última coluna evita “corrigir” o erro sem provar o fluxo.

| Sintoma | Causa provável | Como diagnosticar | Como corrigir | Como confirmar |
| --- | --- | --- | --- | --- |
| `npm` não encontra pacotes | dependências ausentes ou diretório errado | `pwd`, `node --version`, `npm ls --depth=0` | entre em `labs/lab-01-text-to-speech` e rode `npm ci` com Node.js 22+ | `npm run typecheck` termina com código zero |
| servidor não abre ou porta ocupada | outro processo usa 3000 | observe `EADDRINUSE`; tente `lsof -i :3000` ou `Get-NetTCPConnection -LocalPort 3000` | encerre o processo conhecido ou rode `npm run dev -- --port 3001` | a URL informada pelo Next.js responde |
| `configured: false` | `.env.local` ausente, nome errado ou servidor não reiniciado | `git check-ignore -v .env.local` e `curl localhost:3000/api/health` | use exatamente `OPENAI_API_KEY=...`, salve e reinicie `npm run dev` | health mostra `configured: true` sem revelar a chave |
| `401 unauthorized` | token do workshop ausente ou API key inválida | confira o código seguro e o `X-Request-Id`; não imprima a chave | informe `PLAYGROUND_ACCESS_TOKEN` na UI quando exigido ou rotacione uma chave inválida | uma frase curta gera áudio |
| quota/créditos indisponíveis ou `429` | limite de projeto, saldo ou rate limit | confira `Retry-After` e os painéis de Usage/Billing | aguarde o limite, habilite cobrança ou ajuste orçamento; não remova o limitador | health continua seguro e um teste curto funciona dentro do orçamento |
| modelo sem acesso | projeto não pode usar o modelo configurado | confira o modelo no health e a mensagem sanitizada associada ao request ID | valide acesso ao `gpt-4o-mini-tts` no projeto ou use um modelo permitido de forma consistente no código e docs | build passa e a chamada curta retorna áudio |
| `403 cross_origin_request` ou CORS | `APP_ORIGIN` não corresponde à origem real | compare a URL do navegador com `APP_ORIGIN` | defina a origem canônica completa e reinicie/republique | a mesma origem recebe resposta; outra origem continua bloqueada |
| `413 request_too_large` | texto, instruções ou JSON excedem limites | reduza a entrada e observe o status | mantenha o limite e use conteúdo curto | pedido permitido funciona e pedido excessivo continua rejeitado |
| áudio baixa mas não toca | formato ou `Content-Type` não suportado | inspecione Network e teste `mp3` | use formato suportado e preserve o header devolvido pela API | player reproduz e download tem extensão correta |
| build ou import falha só no CI | diferença de maiúsculas/minúsculas ou arquivo gerado desatualizado | `git ls-files | sort`, `npm run docs:check`, `npm run check` | faça o import casar exatamente com o nome e rode `npm run docs:generate` quando o código exibido mudou | checks locais e CI passam |

Problemas específicos da documentação, cache e workflow do Pages estão no [guia compartilhado de troubleshooting](../../../../docs/troubleshooting-pt-br.md).

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

<div class="next-steps-cta" markdown="1">

## Próximos passos

Você aprendeu a proteger a chave no servidor, validar entrada, encaminhar áudio em streaming, administrar estados de UI e provar responsabilidades com testes offline. Agora escolha uma evolução pequena: adicionar uma voz permitida com teste, incluir autenticação real, medir latência sem registrar texto, ampliar testes de interface ou preparar um deploy seguro com orçamento e rate limit distribuído.

O próximo salto natural é o [Lab 02 — Agente Realtime](../../../lab-02-realtime-voice-agent/tutorial/tutorial.md), onde a requisição delimitada vira uma sessão WebRTC com microfone, turnos e interrupção.

<div class="next-steps-cta__links">
  <a href="https://developers.openai.com/api/docs/guides/text-to-speech">Documentação oficial de Text to Speech ↗</a>
  <a href="https://nextjs.org/docs/app/getting-started/route-handlers">Next.js Route Handlers ↗</a>
  <a href="https://www.typescriptlang.org/docs/">TypeScript ↗</a>
  <a href="https://github.com/glaucia86/openai-voice-playground/issues/new">Enviar feedback / abrir issue ↗</a>
  <a href="../../../../CONTRIBUTING.md">Como contribuir</a>
  <a href="https://github.com/glaucia86/openai-voice-playground">Repositório · estrela opcional ↗</a>
</div>

</div>
