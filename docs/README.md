# OpenAI Voice Labs — trilha de workshop

Este é o índice didático do repositório. Ele organiza o conteúdo em módulos numerados, no estilo de workshops práticos: cada módulo declara pré-requisitos, resultado esperado, passos executáveis, checkpoints e a próxima etapa.

> Se você quer apenas conhecer o projeto, volte ao [README principal](../README-PT-BR.md). Se quer construir, comece pelo Módulo 00 abaixo.

## Como usar esta trilha

Você pode seguir por dois caminhos:

- **Participante — executar e investigar:** prepara o ambiente uma vez, executa a solução pronta e estuda as decisões no código.
- **Instrutor ou estudo aprofundado — reconstruir do zero:** usa o Caminho B de cada laboratório, criando pastas e arquivos na ordem indicada.

Não pule o Módulo 00 se esta é a sua primeira aplicação com a API da OpenAI. Ele separa claramente conta do ChatGPT, projeto da API, credencial, API da aplicação e comandos do repositório.

## Módulos

| Módulo | O que você fará | Tempo estimado | Resultado verificável |
| --- | --- | ---: | --- |
| **[00 — Configuração do ambiente](00-configuracao-do-ambiente.md)** | Preparar Node.js, projeto da API OpenAI, chave local, dependências e health check | 30–45 min | Um laboratório abre localmente sem expor segredo |
| **[01 — Text to Speech](../labs/lab-01-text-to-speech/tutorial/tutorial.md)** | Construir uma API de TTS protegida e uma interface acessível com áudio em streaming | 2–3 h | Texto validado retorna áudio reproduzível e baixável |
| **[02 — Agente de voz Realtime](../labs/lab-02-realtime-voice-agent/tutorial/tutorial.md)** | Construir autorização efêmera e uma conversa speech-to-speech por WebRTC | 3–4 h | Conversa ao vivo permite turnos, mute e interrupção |

O Módulo 02 pode ser feito sem concluir o 01, mas comparar os dois ajuda a entender por que uma chamada TTS delimitada e uma sessão Realtime exigem arquiteturas diferentes.

## Contrato de cada módulo

Durante o workshop, só avance quando conseguir responder “sim” às quatro perguntas:

1. **Resultado:** o comportamento descrito funciona?
2. **Explicação:** consigo dizer por que essa arquitetura foi escolhida?
3. **Proteção:** a chave continua somente no servidor e fora do Git?
4. **Evidência:** o comando de checkpoint terminou sem erro?

Os testes automatizados não fazem chamadas pagas à OpenAI. Os testes manuais de voz são sempre explícitos e devem usar conteúdo curto, ambiente controlado e orçamento acompanhado.

## Checkpoints e solução final

O workshop de Blazor usa cópias completas em `save-points/`. Aqui cada laboratório já é uma aplicação Next.js independente e contém sua **solução final executável**. Para evitar duplicar dois grafos npm inteiros a cada checkpoint, usamos:

- checkpoints por comportamento dentro do tutorial;
- comandos de validação depois de cada fatia;
- testes como evidência repetível;
- o Caminho B para reconstrução desde uma pasta vazia.

Se o workshop crescer e precisar de recuperação rápida em sala, o próximo passo recomendado é publicar tags ou artefatos de starter por módulo — não copiar credenciais, `.env.local`, `node_modules` ou builds para pastas de save-point.

## Convenções visuais dos tutoriais

Você encontrará estes blocos ao longo da trilha:

- **Terminal:** diretório exato e comando a executar;
- **Resultado esperado:** o que deve aparecer antes de continuar;
- **Checkpoint:** condição objetiva de conclusão;
- **Por que:** decisão de engenharia, não apenas sintaxe;
- **Armadilha:** erro comum e como reconhecê-lo;
- **Produção:** limite que o laboratório não deve esconder.

## Comece agora

Siga para **[Módulo 00 — Configuração do ambiente, da API e execução local](00-configuracao-do-ambiente.md)**.
