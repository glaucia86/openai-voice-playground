# OpenAI Voice Labs

Uma coleção open source de laboratórios com padrão de produção para aprender a construir experiências de voz com a OpenAI. Cada laboratório é uma aplicação Next.js completa, com dependências, testes, instruções de deploy e um workshop detalhado em português.

> Projeto educacional mantido por [Glaucia Lemos](https://github.com/glaucia86). Não é um produto oficial da OpenAI.

[Read in English](README.md) · [Como contribuir](CONTRIBUTING.md) · [Segurança](SECURITY.md)

## Laboratórios

| Lab | O que você constrói | Arquitetura | Guia |
| --- | --- | --- | --- |
| [01 — Text to speech](labs/lab-01-text-to-speech) | Uma interface acessível que transforma texto em áudio expressivo e permite o download | Requisição HTTP delimitada com resposta de áudio em streaming | [Workshop passo a passo](labs/lab-01-text-to-speech/tutorial/tutorial.md) |
| [02 — Agente de voz Realtime](labs/lab-02-realtime-voice-agent) | Um agente conversacional speech-to-speech fluido e interrompível | Sessão Realtime com estado por WebRTC e client secret efêmero | [Workshop passo a passo](labs/lab-02-realtime-voice-agent/tutorial/tutorial.md) |

Os projetos não compartilham um pacote de runtime de propósito. Lockfiles independentes tornam cada workshop mais simples de ensinar, instalar, testar e publicar isoladamente.

## Início rápido

Pré-requisitos: Node.js 20 ou superior, npm, uma API key de projeto da OpenAI e, no Lab 02, navegador com suporte a microfone.

```bash
git clone https://github.com/glaucia86/openai-voice-playground.git
cd openai-voice-playground
npm run install:labs
```

Escolha um laboratório, crie o arquivo local de ambiente e inicie a aplicação:

```bash
cd labs/lab-01-text-to-speech
cp .env.example .env.local
npm run dev
```

Preencha `OPENAI_API_KEY` somente nesse `.env.local`, que não é rastreado. Nunca faça commit de um arquivo de ambiente. Para o Lab 02, troque o nome da pasta por `lab-02-realtime-voice-agent`.

## Comandos do repositório

Execute na raiz:

```bash
npm run dev:lab01
npm run dev:lab02
npm run check:lab01
npm run check:lab02
npm run check
```

Execute apenas um servidor de desenvolvimento por vez, a menos que configure portas diferentes explicitamente.

## Deploy na Vercel

Importe este repositório como um projeto Vercel separado para cada laboratório. Em **Root Directory**, informe a pasta escolhida:

- `labs/lab-01-text-to-speech`
- `labs/lab-02-realtime-voice-agent`

Cadastre `OPENAI_API_KEY` nas variáveis criptografadas da Vercel, adicione `PLAYGROUND_ACCESS_TOKEN` se desejar restringir o playground e publique a partir da `main`. Não envie `.env.local`.

## Fronteira de segurança

- A API key padrão da OpenAI existe somente no servidor.
- O Lab 01 recebe uma requisição TTS delimitada e encaminha o stream de áudio por uma Route Handler.
- O Lab 02 cria um client secret Realtime curto; a chave padrão nunca chega ao JavaScript do navegador.
- Os logs da aplicação contêm metadados, não prompts, transcripts, credenciais ou áudio.
- O rate limit local é defesa didática em profundidade, não um perímetro completo para SaaS público.

Leia o workshop antes de reutilizar os padrões em produção. Os guias registram premissas, decisões, trade-offs e controles operacionais ainda necessários.

## Licença

[MIT](LICENSE)
