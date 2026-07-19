---
layout: default
title: "OpenAI Voice Labs — trilha de workshop"
description: "Índice bilíngue dos laboratórios passo a passo de voz com OpenAI."
---

# OpenAI Voice Labs — trilha de workshop

Este é o índice didático do repositório. Ele organiza o conteúdo em módulos numerados, no estilo de workshops práticos: cada módulo declara pré-requisitos, resultado esperado, passos executáveis, checkpoints e a próxima etapa.

Os laboratórios 01 e 02 são autossuficientes e estão disponíveis integralmente em português e inglês.

> Se você quer apenas conhecer o projeto, volte ao [README principal](../README-PT-BR.md). Se quer construir, escolha o Módulo 00 compartilhado ou entre diretamente em um dos tutoriais autossuficientes.

## Como usar esta trilha

Você pode seguir por três caminhos:

- **Participante — executar e investigar:** prepara o ambiente uma vez, executa a solução pronta e estuda as decisões no código.
- **Participante — construir com apoio (recomendado):** parte de um starter compilável, implementa uma fatia por vez e usa checkpoints versionados para comparar ou se recuperar.
- **Instrutor ou estudo aprofundado — reconstruir do zero:** usa o Caminho C de cada laboratório, criando pastas e arquivos na ordem indicada.

Se esta é sua primeira aplicação com a API da OpenAI, você pode começar pelo Módulo 00 ou diretamente por um dos tutoriais autossuficientes. Ambos repetem o contexto indispensável: conta do ChatGPT, projeto da API, cobrança, credencial, instalação e proteção do segredo.

Consulte o **[guia de acompanhamento em português](workshop-guide-pt-br.md)** ou o **[workshop guide in English](workshop-guide.md)** para escolher um caminho, clonar um starter e usar checkpoints sem perder seu trabalho.

## Módulos

| Módulo | Português | English | Starter | Tempo | Resultado verificável |
| --- | --- | --- | --- | ---: | --- |
| **00 — Configuração do ambiente** | **[Guia compartilhado](00-configuracao-do-ambiente.md)** | Incluído nos labs autossuficientes | não se aplica | 30–45 min | Um laboratório abre localmente sem expor segredo |
| **01 — Text to Speech** | **[Tutorial completo](../labs/lab-01-text-to-speech/tutorial/tutorial.md)** | **[Standalone tutorial](../labs/lab-01-text-to-speech/tutorial/tutorial-en.md)** | **[Abrir branch](https://github.com/glaucia86/openai-voice-playground/tree/workshop/lab-01-v1-starter)** | 2–3 h | Texto validado retorna áudio reproduzível e baixável |
| **02 — Agente de voz Realtime** | **[Tutorial completo](../labs/lab-02-realtime-voice-agent/tutorial/tutorial.md)** | **[Standalone tutorial](../labs/lab-02-realtime-voice-agent/tutorial/tutorial-en.md)** | **[Abrir branch](https://github.com/glaucia86/openai-voice-playground/tree/workshop/lab-02-v1-starter)** | 3–4 h | Conversa ao vivo permite turnos, mute e interrupção |

O Módulo 02 pode ser feito sem concluir o 01, mas comparar os dois ajuda a entender por que uma chamada TTS delimitada e uma sessão Realtime exigem arquiteturas diferentes.

## Contrato de cada módulo

Durante o workshop, só avance quando conseguir responder “sim” às quatro perguntas:

1. **Resultado:** o comportamento descrito funciona?
2. **Explicação:** consigo dizer por que essa arquitetura foi escolhida?
3. **Proteção:** a chave continua somente no servidor e fora do Git?
4. **Evidência:** o comando de checkpoint terminou sem erro?

Os testes automatizados não fazem chamadas pagas à OpenAI. Os testes manuais de voz são sempre explícitos e devem usar conteúdo curto, ambiente controlado e orçamento acompanhado.

## Checkpoints e solução final

Cada laboratório contém sua **solução final executável** na `main`. Para evitar duplicar dois grafos npm inteiros em pastas de `save-points/`, usamos:

- checkpoints por comportamento dentro do tutorial;
- comandos de validação depois de cada fatia;
- testes como evidência repetível;
- uma branch starter compilável por laboratório;
- branches `workshop/*-v1-step-*` somente de leitura para recuperação e comparação;
- o Caminho C para reconstrução desde uma pasta vazia.

Os starters não contêm a integração de voz pronta; os checkpoints acrescentam contrato, servidor e interface em fatias. Nenhuma referência de workshop contém credenciais, `.env.local`, `node_modules` ou builds. Mudanças incompatíveis devem criar uma família `v2`, preservando a edição `v1` usada em links e aulas anteriores.

## Convenções visuais dos tutoriais

Você encontrará estes blocos ao longo da trilha:

- **Terminal:** diretório exato e comando a executar;
- **Resultado esperado:** o que deve aparecer antes de continuar;
- **Checkpoint:** condição objetiva de conclusão;
- **Por que:** decisão de engenharia, não apenas sintaxe;
- **Armadilha:** erro comum e como reconhecê-lo;
- **Produção:** limite que o laboratório não deve esconder.

## Comece agora

- Primeira configuração compartilhada: **[Módulo 00 — ambiente, API e execução local](00-configuracao-do-ambiente.md)**.
- Lab 01 em português: **[Text to Speech do zero ao deploy](../labs/lab-01-text-to-speech/tutorial/tutorial.md)**.
- Lab 01 em inglês: **[Standalone Text to Speech tutorial](../labs/lab-01-text-to-speech/tutorial/tutorial-en.md)**.
- Lab 02 em português: **[Agente Realtime do zero ao deploy](../labs/lab-02-realtime-voice-agent/tutorial/tutorial.md)**.
- Lab 02 em inglês: **[Standalone Realtime Voice Agent tutorial](../labs/lab-02-realtime-voice-agent/tutorial/tutorial-en.md)**.
