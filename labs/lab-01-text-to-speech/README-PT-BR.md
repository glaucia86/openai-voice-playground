# Laboratório 01 — OpenAI Text to Speech

Construa uma interface acessível de texto para voz com Next.js 15, TypeScript 7, SDK da OpenAI, fronteira de servidor validada, áudio em streaming e estados de carregamento e erro bem desenhados.

[Read in English](README.md) · [Workshop completo e passo a passo](tutorial/tutorial.md) · [Voltar para todos os labs](../../README-PT-BR.md)

## O que você aprende

- por que TTS delimitado é request/response, não uma sessão Realtime;
- como manter `OPENAI_API_KEY` somente numa Route Handler do servidor;
- como validar um contrato pequeno de produto com Zod;
- como encaminhar o stream da OpenAI sem acumular o arquivo no servidor;
- como implementar cancelamento, progresso, player, download e erros acessíveis;
- por que rate limit local e token compartilhado não bastam para um SaaS público.

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

Importe o repositório e defina **Root Directory** como `labs/lab-01-text-to-speech`. Cadastre `OPENAI_API_KEY` nas Environment Variables da Vercel e publique a partir da `main`. O [capítulo de deploy do workshop](tutorial/tutorial.md#11-faça-deploy-na-vercel) inclui validação e ressalvas de produção.

## Uso responsável

A interface avisa que a voz é gerada por IA. Não use a aplicação para imitar pessoas reais ou enganar ouvintes. Um deploy público precisa de identidade real, quotas distribuídas, orçamento, monitoramento e processo de resposta a abuso.
