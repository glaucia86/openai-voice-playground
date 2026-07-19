# Série OpenAI Voice Playground

Esta pasta reúne os guias didáticos do projeto. Cada tutorial parte de um problema de produto, implementa uma fatia vertical e registra arquitetura, segurança, acessibilidade, testes, operação e trade-offs.

| Tutorial | Arquitetura estudada | Código de referência | Estado |
| --- | --- | --- | --- |
| [01 — Text to speech com padrão de produção](tutorial-01.md) | Requisição HTTP delimitada para a Speech API, com chave protegida no servidor e áudio encaminhado em streaming | [`main`](https://github.com/glaucia86/openai-voice-playground/tree/main) | Disponível |
| 02 — Agente de voz conversacional ao vivo | Sessão Realtime speech-to-speech por WebRTC, com credencial efêmera, detecção de turnos e interrupção | [`feat/realtime-voice-agent`](https://github.com/glaucia86/openai-voice-playground/tree/feat/realtime-voice-agent) | Em desenvolvimento |

## Como estudar a série

1. Leia o tutorial junto da branch indicada, porque o código muda conforme a arquitetura ensinada.
2. Execute os gates locais antes de alterar o projeto: `npm run lint`, `npm run typecheck`, `npm test` e `npm run build`.
3. Use somente `.env.local` para credenciais locais. O arquivo é ignorado pelo Git e jamais deve ser commitado.
4. Consulte a documentação oficial atual antes de trocar modelos, vozes ou versões do SDK.
5. Trate os exemplos como uma base de engenharia, não como substitutos para autenticação, governança de dados, proteção contra abuso e observabilidade do seu contexto.

O objetivo da série não é eleger uma única “API de voz”. É mostrar como requisitos diferentes conduzem a transportes, estados, riscos e experiências diferentes.
