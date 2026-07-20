---
layout: default
title: "Como acompanhar os workshops"
description: "Escolha entre solução final, starter ou pasta vazia e use checkpoints sem perder trabalho."
---

# Como acompanhar os workshops

[Read in English](workshop-guide.md) · [Índice do workshop](README.md) · [README principal](../README-PT-BR.md)

Os dois laboratórios oferecem três experiências. Escolha uma antes de começar:

| Caminho | Para quem | Ponto de partida |
| --- | --- | --- |
| **A — executar e estudar** | quer ver a solução funcionando e investigar o código final | branch `main` |
| **B — construir com apoio (recomendado)** | quer implementar as fatias sem gastar tempo com scaffolding mecânico | branch starter do laboratório |
| **C — reconstruir absolutamente do zero** | quer praticar também a criação de pastas, configuração e instalação | pasta vazia |

## Caminho B: comece pelo starter

### Lab 01 — Text to Speech

```bash
git clone --branch workshop/lab-01-v1-starter \
  https://github.com/glaucia86/openai-voice-playground.git
cd openai-voice-playground
git switch -c minha-solucao-lab-01
npm ci --prefix labs/lab-01-text-to-speech
npm run check:lab01
```

### Lab 02 — agente Realtime

```bash
git clone --branch workshop/lab-02-v1-starter \
  https://github.com/glaucia86/openai-voice-playground.git
cd openai-voice-playground
git switch -c minha-solucao-lab-02
npm ci --prefix labs/lab-02-realtime-voice-agent
npm run check:lab02
```

Criar sua própria branch imediatamente mantém a referência starter intacta e deixa seus commits fáceis de revisar. O starter já contém dependências fixadas, configuração, uma página compilável, health check didático e um primeiro teste. Ele não contém a integração funcional de voz.

### Sobre os cartões amarelos do GitHub

Depois que os branches `workshop/*` recebem commits, o GitHub pode mostrar cartões amarelos com o botão **Compare & pull request** na página inicial do repositório. Eles são apenas sugestões automáticas da interface — não fazem parte do exercício.

- não crie um Pull Request do checkpoint para a `main`;
- não faça merge de um checkpoint;
- não apague o branch;
- ignore ou dispense o cartão e use `git diff` ou `git show` como explicado abaixo.

Um checkpoint intermediário remove intencionalmente tudo que ainda não foi ensinado. Fazer merge dele na `main` faria a solução final regredir.

## Como usar um checkpoint sem perder seu trabalho

Os checkpoints são branches versionadas e somente de leitura. O sufixo `v1` mantém esta edição reproduzível mesmo quando o workshop evoluir.

Primeiro confira seu estado:

```bash
git status -sb
```

Se houver alterações importantes, faça um commit na sua branch antes de comparar. Depois atualize as referências do workshop:

```bash
git fetch origin
```

Veja apenas o resumo do que falta entre sua implementação e um checkpoint:

```bash
git diff --stat HEAD..origin/workshop/lab-01-v1-step-01-contract
```

Inspecione um arquivo sem substituir sua cópia:

```bash
git show origin/workshop/lab-01-v1-step-01-contract:labs/lab-01-text-to-speech/src/lib/schemas.ts
```

Compare um único arquivo:

```bash
git diff HEAD..origin/workshop/lab-01-v1-step-01-contract -- \
  labs/lab-01-text-to-speech/src/lib/schemas.ts
```

Evite `git reset --hard` e não troque para um checkpoint com trabalho não salvo. O objetivo da referência é explicar e diagnosticar, não apagar sua tentativa.

## Contrato dos checkpoints

Cada checkpoint:

- compila e executa seu próprio gate;
- contém somente a capacidade introduzida até aquela etapa;
- não contém `.env.local`, credenciais, `node_modules` ou builds;
- aponta para uma comparação navegável no GitHub;
- possui uma evidência objetiva antes de avançar.

O último checkpoint reconstrói a mesma árvore da solução publicada na `main`. O histórico é diferente porque os commits didáticos mostram as fatias separadamente.

## Dicas para instrutores

- Peça que cada participante use a própria API key e um projeto de estudo com orçamento acompanhado.
- Faça os checkpoints automatizados antes de qualquer teste manual faturável.
- Reserve o teste de voz para uma frase curta ou uma sessão controlada.
- Em caso de atraso, use a próxima branch de checkpoint como referência; não compartilhe uma pasta contendo segredos.
- Demonstre `git diff` e `git show` antes do primeiro exercício. Isso torna recuperação parte do aprendizado.
- Use o Caminho C apenas quando criação de projeto e configuração de tooling também forem objetivos da aula.

## Regra de atualização

Quando dependências, arquitetura ou tutorial mudarem de forma incompatível, publique uma nova família `v2`. Não mova silenciosamente os checkpoints `v1`: links, aulas gravadas e comparações antigas devem continuar reproduzíveis.
