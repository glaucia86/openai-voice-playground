---
layout: default
title: "Módulo 00 — Configuração do ambiente e da API"
description: "Prepare ferramentas, projeto da API OpenAI, segredo local e primeira execução."
---

# Módulo 00 — Configuração do ambiente, da API e execução local

Neste módulo você prepara o computador, cria ou seleciona um projeto na plataforma da API OpenAI, configura uma chave sem colocá-la no Git, instala um laboratório e valida o servidor local sem fazer uma chamada paga de voz.

**Tempo estimado:** 30–45 minutos
**Pré-requisito:** conta na OpenAI Platform com permissão para usar um projeto da API
**Resultado:** Lab 01 ou Lab 02 aberto em `http://localhost:3000`, com `/api/health` indicando configuração válida

[← Índice do workshop](README.md) · [Próximo: Módulo 01 — Text to Speech →](../labs/lab-01-text-to-speech/tutorial/tutorial.md)

---

## 1. Entenda quais “APIs” existem neste workshop

A palavra API aparece em duas fronteiras diferentes:

```text
Interface no navegador
        │
        │ chama a API da nossa aplicação
        ▼
Next.js Route Handler
  /api/speech ou /api/realtime/token
        │
        │ usa OPENAI_API_KEY somente no servidor
        ▼
API da OpenAI
```

- **API da OpenAI:** serviço externo que oferece os modelos de voz. Você cria uma chave de projeto para autenticar o servidor.
- **API da aplicação:** Route Handlers que nós construiremos com Next.js. Elas validam um contrato menor, protegem custo e impedem que a chave padrão seja entregue ao navegador.

Você não “cria a API da OpenAI” neste repositório. Você cria um **projeto e uma chave na OpenAI Platform** e constrói uma **API intermediária da aplicação** nos laboratórios.

> **Regra de segurança:** `OPENAI_API_KEY` nunca recebe o prefixo `NEXT_PUBLIC_`. Variáveis com esse prefixo podem ser incluídas no JavaScript enviado ao navegador.

## 2. Prepare as ferramentas

Você precisa de:

- Node.js 20 ou superior;
- npm, instalado junto com Node.js;
- Git;
- editor de código;
- navegador moderno;
- microfone e WebRTC para o Lab 02;
- uma conta na API Platform da OpenAI.

Abra um terminal e execute:

```bash
node --version
npm --version
git --version
```

### Resultado esperado

- `node --version` começa com `v20`, `v22`, `v24` ou uma versão posterior compatível;
- `npm --version` imprime um número;
- `git --version` imprime a versão instalada.

Se algum comando não existir, instale a ferramenta e **feche e abra o terminal novamente**. Não continue com uma instalação parcialmente reconhecida.

## 3. Prepare um projeto na API OpenAI

### 3.1 Não confunda ChatGPT com API

ChatGPT e API são produtos com faturamento separado. Ter ChatGPT Plus, Pro, Business ou Enterprise não adiciona automaticamente créditos à API. Confira o billing da API na [OpenAI Platform](https://platform.openai.com/), não apenas as configurações do ChatGPT.

### 3.2 Crie ou selecione um projeto

1. Entre em [platform.openai.com](https://platform.openai.com/).
2. Abra as configurações da organização.
3. Selecione um projeto existente destinado ao workshop ou crie um projeto, se sua função permitir.
4. Dê um nome que identifique finalidade e ambiente, por exemplo `voice-labs-development`.
5. Não use a mesma chave para desenvolvimento pessoal, staging e produção.

Projetos ajudam a separar membros, chaves, uso, modelos e alertas. Em organizações gerenciadas, talvez somente um Owner possa criar o projeto; nesse caso, peça acesso a um projeto específico em vez de pedir a chave de outra pessoa.

### 3.3 Configure cobrança, orçamento e alertas

Antes do primeiro áudio:

1. confira se o billing da API está ativo;
2. abra os limites do projeto;
3. defina um orçamento mensal pequeno para o laboratório;
4. crie alertas antes de 100%, por exemplo em 50%, 80% e 90%;
5. acompanhe a página de Usage durante o workshop.

> **Importante:** o orçamento do projeto funciona como alerta de gasto, não necessariamente como hard cap. A aplicação também precisa de autenticação, quota e limites próprios.

### 3.4 Crie uma chave de projeto

1. Abra a [página de API keys](https://platform.openai.com/api-keys) dentro do projeto correto.
2. Escolha **Create new secret key**.
3. Use um nome identificável, como `openai-voice-labs-local`.
4. Se a interface oferecer permissões restritas, conceda somente o necessário ao laboratório.
5. Copie a chave no momento da criação e guarde-a em um gerenciador de segredos.

A chave completa só é mostrada quando criada. Se perdê-la, gere outra e revogue a anterior. Não envie a chave por chat, e-mail, issue, screenshot ou mensagem para outro participante.

## 4. Clone o repositório

No diretório em que você guarda projetos:

```bash
git clone https://github.com/glaucia86/openai-voice-playground.git
cd openai-voice-playground
```

Confirme o diretório:

```bash
git status --short --branch
```

### Resultado esperado

Você deve estar na branch principal e sem alterações locais. Se o comando disser que não é um repositório Git, volte ao diretório correto antes de instalar dependências.

## 5. Escolha um laboratório

| Objetivo | Pasta | Comando na raiz |
| --- | --- | --- |
| Gerar áudio a partir de texto | `labs/lab-01-text-to-speech` | `npm run dev:lab01` |
| Conversar ao vivo por voz | `labs/lab-02-realtime-voice-agent` | `npm run dev:lab02` |

Para a primeira execução, recomendo o Lab 01: ele valida chave, servidor e áudio com uma requisição curta. O Lab 02 acrescenta microfone, WebRTC, estado de sessão e custo acumulado durante a conversa.

## 6. Instale as dependências

Para instalar os dois laboratórios a partir dos lockfiles:

```bash
npm run install:labs
```

Para instalar somente o Lab 01:

```bash
npm ci --prefix labs/lab-01-text-to-speech
```

Para instalar somente o Lab 02:

```bash
npm ci --prefix labs/lab-02-realtime-voice-agent
```

Usamos `npm ci`, e não um upgrade genérico, porque o `package-lock.json` registra o grafo validado pelo projeto. Se manifesto e lockfile divergirem, `npm ci` falha em vez de atualizar dependências silenciosamente.

### Checkpoint 1 — instalação

O checkpoint passa quando o comando termina com código zero. Avisos de versão do npm não são, por si só, falhas. Leia qualquer linha marcada como `ERR!` antes de continuar.

## 7. Crie a configuração local sem versionar segredo

Escolha **um** laboratório. Os exemplos seguintes usam o Lab 01.

### macOS, Linux ou Git Bash

```bash
cp labs/lab-01-text-to-speech/.env.example \
  labs/lab-01-text-to-speech/.env.local
```

### Windows PowerShell

```powershell
Copy-Item labs/lab-01-text-to-speech/.env.example `
  labs/lab-01-text-to-speech/.env.local
```

Abra somente o `.env.local` e preencha:

```dotenv
OPENAI_API_KEY=cole_a_chave_somente_no_seu_arquivo_local
```

Para a primeira execução local, mantenha as demais variáveis vazias. Upstash Redis, origem canônica e token compartilhado tornam-se obrigatórios em produção, mas não são necessários para aprender o fluxo em `localhost`.

### Prove que o Git ignora o arquivo

Execute:

```bash
git check-ignore -v labs/lab-01-text-to-speech/.env.local
git status --short
```

### Resultado esperado

- o primeiro comando mostra a regra `.env*` do `.gitignore`;
- o segundo **não** lista `.env.local`.

Se `.env.local` aparecer no `git status`, pare. Não faça commit, não use `git add -f` e corrija o `.gitignore` antes de continuar.

> `.env.example` pode ser versionado porque contém somente nomes e valores vazios. `.env`, `.env.local` e arquivos baixados da Vercel nunca entram no commit.

## 8. Entenda onde a chave será usada

No Lab 01, o fluxo é:

```text
src/components/speech-studio.tsx
  → POST /api/speech
  → src/app/api/speech/route.ts
  → src/lib/openai.ts
  → OpenAI Speech API
```

No Lab 02:

```text
src/components/realtime-voice-agent.tsx
  → POST /api/realtime/token
  → src/app/api/realtime/token/route.ts
  → OpenAI cria um client secret curto
  → navegador conecta por WebRTC usando esse secret
```

O navegador nunca recebe `OPENAI_API_KEY`. No Lab 02 ele recebe uma concessão curta e específica, que ainda é uma credencial bearer e não deve ser registrada ou persistida.

### Onde você construirá cada API

Este módulo prepara e executa a base; ele não pede que você copie uma API pronta sem entendê-la. A implementação acontece incrementalmente nos módulos seguintes:

- no Lab 01, [estabeleça primeiro a fronteira servidor–OpenAI](../labs/lab-01-text-to-speech/tutorial/article.md#4-estabeleça-a-fronteira-servidoropenai) e depois [implemente a Route Handler de TTS com streaming](../labs/lab-01-text-to-speech/tutorial/article.md#5-implemente-texto-para-voz-com-streaming);
- no Lab 02, [modele separadamente autorização e mídia](../labs/lab-02-realtime-voice-agent/tutorial/article.md#3-modele-dois-caminhos-autorização-e-mídia) e então [crie o client secret efêmero no servidor](../labs/lab-02-realtime-voice-agent/tutorial/article.md#5-proteja-a-chave-com-um-client-secret-efêmero).

Essa separação é intencional: primeiro provamos que ferramentas, projeto, segredo local e servidor estão corretos; depois adicionamos uma capacidade faturável e suas proteções.

## 9. Inicie o laboratório

Na raiz do repositório, para o Lab 01:

```bash
npm run dev:lab01
```

Ou, para o Lab 02:

```bash
npm run dev:lab02
```

Execute um servidor por vez, pois ambos usam a porta `3000` por padrão.

### Resultado esperado

O terminal informa que o Next.js está pronto. Abra:

```text
http://localhost:3000
```

Não feche o terminal enquanto estiver usando a aplicação. Para encerrar, volte ao terminal e pressione `Ctrl+C`.

## 10. Valide a configuração sem gerar áudio

Com o servidor ativo, abra no navegador:

```text
http://localhost:3000/api/health
```

Uma resposta local configurada inclui campos semelhantes a:

```json
{
  "ok": true,
  "configured": true,
  "requiresAccessToken": false,
  "distributedRateLimit": false
}
```

`distributedRateLimit: false` é esperado no desenvolvimento local: o laboratório usa uma quota em memória. Em produção, a aplicação falha de modo seguro se Upstash Redis e as demais proteções obrigatórias não estiverem configuradas.

O health check informa presença e capacidades, nunca o valor da chave.

### Checkpoint 2 — servidor protegido

Marque somente depois de verificar:

- [ ] a página abre em `localhost:3000`;
- [ ] `/api/health` retorna `configured: true`;
- [ ] DevTools não mostra `OPENAI_API_KEY` em código, resposta ou storage;
- [ ] `.env.local` não aparece em `git status --short`;
- [ ] nenhum áudio pago foi necessário para concluir este módulo.

## 11. Execute o gate local

Pare o servidor com `Ctrl+C`. Se você instalou **os dois laboratórios**, rode:

```bash
npm run check
```

Esse comando valida os dois laboratórios:

```text
lint → TypeScript 7 → testes sem OpenAI → build Next.js
```

Se instalou somente um laboratório, valide apenas esse projeto:

```bash
npm run check:lab01
# ou
npm run check:lab02
```

Os testes usam contratos locais e não consomem sua chave. O build também não deve iniciar chamadas à OpenAI.

## 12. Erros comuns

### `configured: false`

Confirme que o `.env.local` está dentro da pasta do laboratório executado, que o nome é exatamente `OPENAI_API_KEY` e que você reiniciou o servidor depois de alterar o arquivo. Não imprima a chave para “testar”.

### `401 unauthorized`

Você configurou `PLAYGROUND_ACCESS_TOKEN`. Digite o mesmo token no gate da interface ou deixe a variável vazia no exercício local e reinicie o servidor.

### `429 rate_limit_exceeded`

Muitas tentativas ocorreram na mesma janela. Aguarde o `Retry-After`. Não desative o limite para esconder o problema.

### Erro de quota, billing ou autenticação upstream

Confira o projeto selecionado, billing da API, Usage e permissões da chave. ChatGPT pago não substitui billing da API. Nunca publique a mensagem bruta do provedor com dados internos.

### Porta 3000 já está em uso

Encerre o outro laboratório com `Ctrl+C`. Para usar outra porta dentro de um lab:

```bash
npm --prefix labs/lab-01-text-to-speech run dev -- --port 3001
```

### Microfone não aparece no Lab 02

Em desenvolvimento, use `localhost`; em deploy, use HTTPS. Confira permissão do navegador e do sistema operacional. Fones reduzem eco e melhoram a detecção de turno.

## 13. Limpeza segura

Ao terminar:

1. encerre o servidor com `Ctrl+C`;
2. no Lab 02, pressione **End** antes de fechar a aba;
3. confira Usage na OpenAI Platform;
4. remova ou rotacione a chave se suspeitar de exposição;
5. nunca copie `.env.local` para uma pasta de checkpoint ou arquivo compactado.

## Checkpoint final do Módulo 00

- [ ] ferramentas instaladas e versões confirmadas;
- [ ] projeto da API selecionado com billing e alertas revisados;
- [ ] chave individual guardada somente no ambiente local;
- [ ] dependências instaladas via lockfile;
- [ ] health check configurado;
- [ ] `npm run check` aprovado, ou o gate específico do único laboratório instalado;
- [ ] nenhum arquivo de ambiente pronto para commit.

---

## Próximo módulo

Siga para **[Módulo 01 — Text to Speech com OpenAI, Next.js e TypeScript](../labs/lab-01-text-to-speech/tutorial/tutorial.md)**.

Se seu objetivo imediato é conversa ao vivo e você já entende a diferença entre chave padrão e client secret efêmero, pode seguir para o **[Módulo 02 — Agente de voz Realtime](../labs/lab-02-realtime-voice-agent/tutorial/tutorial.md)**.

## Referências oficiais

- OpenAI — [onde criar e gerenciar API keys](https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key)
- OpenAI — [boas práticas de segurança para API keys](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety)
- OpenAI — [projetos, limites e budgets na API Platform](https://help.openai.com/en/articles/9186755-managing-projects-in-the-api-platform)
- OpenAI — [billing do ChatGPT e da API são separados](https://help.openai.com/en/articles/8156019-how-can-i-move-my-chatgpt-subscription-to-the-api)
