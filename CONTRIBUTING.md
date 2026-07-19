# Contributing

Obrigado por ajudar a tornar o OpenAI Voice Labs mais claro, seguro e útil.

## Antes de começar

1. Leia [AGENTS.md](AGENTS.md).
2. Escolha um laboratório e leia seu `README` e `tutorial/tutorial.md`.
3. Abra uma issue antes de uma mudança arquitetural ou de um novo laboratório.
4. Nunca anexe API keys, client secrets, tokens, áudio privado ou transcripts reais.

## Fluxo local

Instale apenas o laboratório que será alterado:

```bash
cd labs/lab-01-text-to-speech
npm ci
cp .env.example .env.local
npm run dev
```

Troque a pasta por `lab-02-realtime-voice-agent` quando necessário. O `.env.local` é exclusivamente local e nunca deve entrar num commit.

Antes do pull request, execute dentro de cada lab alterado:

```bash
npm run check
```

Os testes unitários não podem chamar a API real. Faça mock somente na fronteira estreita do SDK.

## Pull requests

Mantenha o PR focado e explique:

- o problema do usuário ou do aprendizado;
- a decisão principal e seu trade-off;
- os caminhos de sucesso e falha validados;
- os labs afetados;
- impactos em segurança, privacidade, custo, deploy e acessibilidade;
- documentos atualizados.

Use um resumo no estilo Conventional Commits quando fizer sentido, por exemplo `feat(lab-02): expose reconnect state`.

## Novo laboratório

Um novo diretório em `labs/` precisa ser executável isoladamente e incluir:

- `package.json` e `package-lock.json` próprios;
- `.env.example` sem valores secretos;
- README em inglês e `README-PT-BR.md`;
- `tutorial/tutorial.md` realmente passo a passo;
- testes sem cobrança de API;
- suporte na matriz do CI;
- entrada no catálogo raiz.
