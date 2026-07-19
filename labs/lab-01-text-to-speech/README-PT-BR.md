# Laboratório 01 — OpenAI Text to Speech

Construa uma interface acessível de texto para voz com Next.js 15, TypeScript 7, SDK da OpenAI, fronteira de servidor validada, áudio em streaming e estados de carregamento e erro bem desenhados.

[Read in English](README.md) · [Índice do workshop](../../docs/README.md) · [Tutorial completo em português](tutorial/tutorial.md) · [Standalone English tutorial](tutorial/tutorial-en.md) · [Voltar para todos os labs](../../README-PT-BR.md)

## O que você aprende

- por que TTS delimitado é request/response, não uma sessão Realtime;
- como manter `OPENAI_API_KEY` somente numa Route Handler do servidor;
- como validar um contrato pequeno de produto com Zod;
- como encaminhar o stream da OpenAI sem acumular o arquivo no servidor;
- como implementar cancelamento, progresso, player, download e erros acessíveis;
- como produção falha de modo seguro atrás de proteção obrigatória e quota distribuída.

## Escolha seu caminho no workshop

1. **Executar e estudar:** use a `main` e investigue a aplicação completa.
2. **Construir pelo starter (recomendado):** comece em [`workshop/lab-01-v1-starter`](https://github.com/glaucia86/openai-voice-playground/tree/workshop/lab-01-v1-starter), implemente uma fatia por vez e compare com checkpoints somente de leitura.
3. **Reconstruir do zero:** siga os comandos de pasta vazia do tutorial, incluindo o scaffolding do projeto.

O **[guia de acompanhamento](../../docs/workshop-guide-pt-br.md)** explica clone, comparação e recuperação sem descartar sua branch. O [English workshop guide](../../docs/workshop-guide.md) descreve o mesmo fluxo.

## Execute localmente

Dentro desta pasta:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Adicione sua chave de projeto somente ao `.env.local`:

```dotenv
OPENAI_API_KEY=your_project_key
```

Abra <http://localhost:3000>. O arquivo de ambiente é ignorado pelo Git. Nunca faça commit dele, cole a chave numa issue ou use o prefixo `NEXT_PUBLIC_`.

## Gate de qualidade

```bash
npm run lint
npm run typecheck
npm test
npm run build
# ou execute os quatro:
npm run check
```

Os testes não fazem requisições pagas para a OpenAI.

## Superfície da API

- `GET /api/health` informa configuração não sensível e limites.
- `POST /api/speech` recebe texto, voz, instruções, formato e velocidade validados e devolve áudio em streaming.

## Deploy na Vercel

Importe o repositório e defina **Root Directory** como `labs/lab-01-text-to-speech`. Nas Environment Variables da Vercel, cadastre `OPENAI_API_KEY`, `PLAYGROUND_ACCESS_TOKEN`, `APP_ORIGIN`, `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`; depois publique a partir da `main`. A Vercel fornece o header confiável `x-vercel-forwarded-for`. O [capítulo prático de execução e deploy](tutorial/pt/03-execucao-testes-deploy.md) inclui validação e ressalvas de produção.

## Uso responsável

A interface avisa que a voz é gerada por IA. Não use a aplicação para imitar pessoas reais ou enganar ouvintes. O token do workshop e a quota por IP protegem uma demo, não contas de usuário; um produto público ainda precisa de identidade, autorização por usuário, orçamento, monitoramento e resposta a abuso.
