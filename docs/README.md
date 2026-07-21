---
layout: default
title: "OpenAI Voice Labs — trilha de aprendizagem"
description: "Índice em português dos laboratórios passo a passo de voz com OpenAI."
lang: pt-BR
alternate_url: "/docs/README-en.html"
alternate_lang: en
alternate_label: "English"
---

# OpenAI Voice Labs — trilha de aprendizagem

Este é o índice didático em português. Ele organiza o conteúdo em módulos numerados, no estilo de workshops práticos: cada módulo declara pré-requisitos, resultado esperado, passos executáveis, checkpoints e a próxima etapa.

> Se você quer apenas conhecer o projeto, volte ao [README principal](../README-PT-BR.md). Se quer construir, escolha o Módulo 00 compartilhado ou entre diretamente em um dos tutoriais autossuficientes.

## Como usar esta trilha

Você pode seguir por três caminhos:

- **Executar e investigar:** prepare o ambiente, execute a solução pronta e estude as decisões no código.
- **Construir com apoio — recomendado:** parta de uma branch inicial compilável, implemente uma etapa por vez e use checkpoints versionados para comparar ou se recuperar.
- **Reconstruir do zero:** use o Caminho C de cada laboratório, criando pastas e arquivos na ordem indicada.

Se esta é sua primeira aplicação com a API da OpenAI, comece pelo Módulo 00 ou diretamente por um dos tutoriais autossuficientes. Ambos repetem o contexto indispensável: projeto da API, cobrança, credencial, instalação e proteção do segredo.

Consulte o **[guia de acompanhamento](workshop-guide-pt-br.md)** para escolher um caminho, clonar uma branch inicial e usar checkpoints sem perder seu trabalho.

## Módulos

| Módulo | Tutorial | Ponto de partida | Tempo | Resultado verificável |
| --- | --- | --- | ---: | --- |
| **00 — Configuração do ambiente** | **[Abrir guia compartilhado](00-configuracao-do-ambiente.md)** | não se aplica | 30–45 min | Um laboratório abre localmente sem expor segredo |
| **01 — Text to Speech** | **[Abrir tutorial completo](../labs/lab-01-text-to-speech/tutorial/tutorial.md)** | **[Branch inicial](https://github.com/glaucia86/openai-voice-playground/tree/workshop/lab-01-v1-starter)** | 2–3 h | Texto validado retorna áudio reproduzível e baixável |
| **02 — Agente de voz em tempo real** | **[Abrir tutorial completo](../labs/lab-02-realtime-voice-agent/tutorial/tutorial.md)** | **[Branch inicial](https://github.com/glaucia86/openai-voice-playground/tree/workshop/lab-02-v1-starter)** | 3–4 h | Conversa ao vivo permite turnos, mudo e interrupção |

O Módulo 02 pode ser feito sem concluir o 01, mas comparar os dois ajuda a entender por que uma chamada TTS delimitada e uma sessão em tempo real exigem arquiteturas diferentes.

## Contrato de cada módulo

Durante o workshop, só avance quando conseguir responder “sim” às quatro perguntas:

1. **Resultado:** o comportamento descrito funciona?
2. **Explicação:** consigo dizer por que essa arquitetura foi escolhida?
3. **Proteção:** a chave continua somente no servidor e fora do Git?
4. **Evidência:** o comando de checkpoint terminou sem erro?

Os testes automatizados não fazem chamadas pagas à OpenAI. Os testes manuais de voz são sempre explícitos e devem usar conteúdo curto, ambiente controlado e orçamento acompanhado.

## Checkpoints e solução final

Cada laboratório contém sua solução final executável na `main`. A jornada usa:

- checkpoints por comportamento dentro do tutorial;
- comandos de validação depois de cada etapa;
- testes como evidência repetível;
- uma branch inicial compilável por laboratório;
- branches `workshop/*-v1-step-*` somente para consulta e recuperação;
- o Caminho C para reconstrução desde uma pasta vazia.

Nenhuma referência de workshop contém credenciais, `.env.local`, `node_modules` ou builds. Mudanças incompatíveis devem criar uma família `v2`, preservando a edição `v1` usada em links e aulas anteriores.

## Convenções visuais

- **Terminal:** diretório exato e comando a executar;
- **Resultado esperado:** o que deve aparecer antes de continuar;
- **Checkpoint:** condição objetiva de conclusão;
- **Por que:** decisão de engenharia, não apenas sintaxe;
- **Armadilha:** erro comum e como reconhecê-lo;
- **Produção:** limite que o laboratório não deve esconder.

## Comece agora

- **[Módulo 00 — ambiente, API e execução local](00-configuracao-do-ambiente.md)**.
- **[Lab 01 — Text to Speech do zero ao deploy](../labs/lab-01-text-to-speech/tutorial/tutorial.md)**.
- **[Lab 02 — agente de voz do zero ao deploy](../labs/lab-02-realtime-voice-agent/tutorial/tutorial.md)**.

## Apoio durante o workshop

- **[Solução de problemas](troubleshooting-pt-br.md)** para ambiente, cache, imports ou Pages.
- **[Roteiro de gravação](demo-recording-guide-pt-br.md)** para preparar demonstrações sem expor credenciais.
- **[Auditoria de UX e DevEx](ux-audit-pt-br.md)** com as evidências antes e depois.
