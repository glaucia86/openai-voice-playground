---
layout: default
title: "Lab 02 · Capítulo 3 — Execução, testes e deploy"
description: "Valide, execute, diagnostique e publique o agente de voz Realtime."
lang: pt-BR
lab_label: "Lab 02 · Agente Realtime"
lab_index: "/labs/lab-02-realtime-voice-agent/tutorial/tutorial.html"
lab_index_label: "Índice do Lab 02"
step_label: "Execução, testes e deploy"
step_position: "Etapa 3 de 3"
alternate_url: "/labs/lab-02-realtime-voice-agent/tutorial/en/03-run-test-deploy.html"
alternate_lang: en
alternate_label: "Read in English"
checkpoint_url: "/labs/lab-02-realtime-voice-agent/tutorial/tutorial.html#checkpoints-de-recuperação"
checkpoint_label: "Checkpoints do Lab 02"
previous_url: "/labs/lab-02-realtime-voice-agent/tutorial/pt/02-construcao-arquivo-por-arquivo.html"
previous_label: "Construir autorização, WebRTC e interface"
previous_kicker: "← Capítulo anterior"
next_url: "/docs/README.html"
next_label: "Revisar a trilha e escolher próximos passos"
next_kicker: "Concluir workshop →"
chapter_nav_label: "Navegação do workshop Lab 02"
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

| Sintoma | Causa provável | Como diagnosticar | Como corrigir | Como confirmar |
| --- | --- | --- | --- | --- |
| pacotes ausentes ou Node incompatível | instalação não executada, diretório errado ou Node < 22 | `pwd`, `node --version`, `npm ls --depth=0` | entre no Lab 02 e rode `npm ci` com Node.js 22+ | `npm run typecheck` termina com código zero |
| porta 3000 ocupada | outro servidor local em execução | observe `EADDRINUSE`; use `lsof -i :3000` ou `Get-NetTCPConnection -LocalPort 3000` | encerre o processo conhecido ou use `npm run dev -- --port 3001` | a URL impressa pelo Next.js abre |
| `configured: false` | `.env.local` ausente, chave inválida ou reinício pendente | `git check-ignore -v .env.local` e `curl localhost:3000/api/health` | use `OPENAI_API_KEY=...`, salve e reinicie | health mostra `configured: true` sem credencial |
| quota/créditos indisponíveis ou modelo sem acesso | cobrança, limite do projeto ou acesso a `gpt-realtime-2.1` | confira o request ID, Usage/Billing e o modelo no health | habilite cobrança/limite ou use um modelo permitido de modo consistente | um smoke test curto conecta dentro do orçamento |
| navegador não pede microfone | permissão negada, contexto inseguro ou ausência de gesto | confira cadeado/permissões, `navigator.mediaDevices` e console | use HTTPS ou localhost, libere a permissão e clique no botão novamente | indicador do microfone aparece somente durante a sessão |
| navegador sem suporte | WebRTC/media APIs indisponíveis ou restritas | teste versão atual de Chrome, Edge, Firefox ou Safari e confira console | atualize/troque o navegador e evite webviews restritas | sessão chega ao estado conectado |
| client secret expira antes de conectar | emissão antecipada ou atraso maior que o TTL | inspecione horário de emissão sem registrar o valor | emita imediatamente antes de `connect`; nunca reutilize | nova tentativa conecta e a resposta permanece `no-store` |
| WebRTC falha | firewall, VPN, rede corporativa, HTTPS ou negociação | abra `chrome://webrtc-internals`, console e Network sem copiar tokens | teste outra rede, remova VPN conhecida, confirme HTTPS e refaça uma sessão curta | áudio entra e sai; `End` libera a conexão |
| `403 cross_origin_request` ou CORS | `APP_ORIGIN` não corresponde ao domínio | compare a origem do navegador e a variável protegida | corrija a origem completa e republique | origem certa emite segredo; origem diferente continua bloqueada |
| agente escuta a própria voz | alto-falante realimenta o microfone | use fones e observe turnos inesperados | mantenha fones e selecione o perfil correto de redução de ruído | agente responde apenas à pessoa |
| transcript duplica | histórico tratado como append em vez de snapshot | observe repetição após eventos de histórico | reconcilie snapshots e mantenha estado em memória | cada turno aparece uma vez e desaparece no refresh |
| microfone continua ativo | cleanup não fechou sessão/tracks | clique **End** e observe o indicador do sistema | execute `session.close()` e pare todas as tracks em cleanup/unmount | indicador some e uma nova sessão inicia limpa |
| build/import falha no CI | letras maiúsculas/minúsculas ou guia gerado desatualizado | `git ls-files | sort`, `npm run docs:check`, `npm run check` | faça import e filename coincidirem; regenere docs quando o código exibido mudar | checks locais e CI passam |

Para cache antigo, workflow do Pages ou documentação desatualizada, use o [guia compartilhado de troubleshooting](../../../../docs/troubleshooting-pt-br.md).

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

<div class="next-steps-cta" markdown="1">

## Próximos passos

Você aprendeu a separar autorização e mídia, emitir credencial efêmera, negociar WebRTC, modelar turnos/interrupção e liberar microfone e sessão. Evolua uma coisa por vez: function calling com schemas e aprovação humana, autenticação real, observabilidade sem conteúdo, reconexão limitada, histórico com política de retenção explícita ou testes automatizados dos estados de sessão.

Antes de persistir transcript ou adicionar ferramentas, defina finalidade, consentimento, autorização e exclusão. Um client secret curto não resolve identidade nem abuso sozinho.

<div class="next-steps-cta__links">
  <a href="https://developers.openai.com/api/docs/guides/voice-agents">Guia oficial de voice agents ↗</a>
  <a href="https://developers.openai.com/api/docs/guides/realtime-webrtc">Realtime com WebRTC ↗</a>
  <a href="https://developers.openai.com/api/docs/guides/realtime-costs">Custos Realtime ↗</a>
  <a href="https://github.com/glaucia86/openai-voice-playground/issues/new">Enviar feedback / abrir issue ↗</a>
  <a href="../../../../CONTRIBUTING.md">Como contribuir</a>
  <a href="https://github.com/glaucia86/openai-voice-playground">Repositório · estrela opcional ↗</a>
</div>

</div>
