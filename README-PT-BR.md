<a id="readme-top"></a>

<div align="center">

<h1>🎙️ OpenAI Voice Labs</h1>

<h3>Workshops open source para construir experiências de voz com padrão de produção</h3>

<p>Aprenda OpenAI Voice, TTS, Realtime, WebRTC e Agents SDK construindo aplicações completas — com segurança, acessibilidade, testes e decisões de arquitetura explicadas.</p>

<p>
  <a href="README.md">English</a>
  ·
  <a href="docs/README.md">Trilha de workshop</a>
  ·
  <a href="#-laboratórios">Laboratórios</a>
  ·
  <a href="#-início-rápido">Executar</a>
  ·
  <a href="#-deploy-na-vercel">Deploy</a>
  ·
  <a href="#-sobre-a-autora">Sobre</a>
</p>

<p>
  <a href="https://github.com/glaucia86/openai-voice-playground/actions/workflows/ci.yml">
    <img alt="CI" src="https://github.com/glaucia86/openai-voice-playground/actions/workflows/ci.yml/badge.svg?branch=main">
  </a>
  <a href="https://github.com/glaucia86/openai-voice-playground/actions/workflows/codeql.yml">
    <img alt="CodeQL" src="https://github.com/glaucia86/openai-voice-playground/actions/workflows/codeql.yml/badge.svg?branch=main">
  </a>
  <a href="LICENSE">
    <img alt="Licença MIT" src="https://img.shields.io/badge/licença-MIT-8BFFCC.svg">
  </a>
  <a href="https://github.com/glaucia86/openai-voice-playground/stargazers">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/glaucia86/openai-voice-playground?style=flat&logo=github&color=8BFFCC">
  </a>
  <a href="https://github.com/glaucia86/openai-voice-playground/network/members">
    <img alt="GitHub forks" src="https://img.shields.io/github/forks/glaucia86/openai-voice-playground?style=flat&logo=github&color=8DA7FF">
  </a>
</p>

<p>
  <img alt="Next.js 15" src="https://img.shields.io/badge/Next.js-15.5.20-000000?logo=nextdotjs&logoColor=white">
  <img alt="React 19" src="https://img.shields.io/badge/React-19.2-20232A?logo=react&logoColor=61DAFB">
  <img alt="TypeScript 7" src="https://img.shields.io/badge/TypeScript-7.0-3178C6?logo=typescript&logoColor=white">
  <img alt="Node.js 20+" src="https://img.shields.io/badge/Node.js-%E2%89%A520-339933?logo=nodedotjs&logoColor=white">
  <img alt="OpenAI SDK" src="https://img.shields.io/badge/OpenAI-SDK-412991?logo=openai&logoColor=white">
  <img alt="Agents SDK" src="https://img.shields.io/badge/OpenAI-Agents_SDK-412991?logo=openai&logoColor=white">
  <img alt="WebRTC" src="https://img.shields.io/badge/WebRTC-Realtime-333333?logo=webrtc&logoColor=white">
  <img alt="Upstash Redis" src="https://img.shields.io/badge/Upstash-Redis-00E9A3?logo=redis&logoColor=white">
  <img alt="Vercel" src="https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white">
</p>

<p><em>Projeto educacional independente. Não é um produto oficial da OpenAI.</em></p>

</div>

---

## ✨ Veja os laboratórios em ação

<div align="center">
  <img src="docs/assets/openai-voice-labs-demo.gif" width="960" alt="Demonstração animada dos laboratórios de Text to Speech e agente de voz Realtime">
  <br>
  <sub>Captura real dos front-ends dos Labs 01 e 02. Nenhuma chamada à API foi realizada durante a gravação.</sub>
</div>

---

## 🧭 Sumário

- [Por que este repositório existe](#-por-que-este-repositório-existe)
- [Trilha de workshop](#-trilha-de-workshop)
- [Laboratórios](#-laboratórios)
- [Arquitetura do repositório](#%EF%B8%8F-arquitetura-do-repositório)
- [Pré-requisitos](#-pré-requisitos)
- [Início rápido](#-início-rápido)
- [Resumo de execução](#%EF%B8%8F-resumo-de-execução)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Qualidade e CI/CD](#-qualidade-e-cicd)
- [Deploy na Vercel](#-deploy-na-vercel)
- [Uso responsável](#%EF%B8%8F-uso-responsável)
- [Como contribuir](#-como-contribuir)
- [Sobre a autora](#-sobre-a-autora)

## 💡 Por que este repositório existe

Uma chamada de voz pode caber em poucas linhas. Uma aplicação confiável exige muito mais.

O **OpenAI Voice Labs** é uma coleção incremental de workshops para engenheiros que desejam entender não apenas _qual endpoint chamar_, mas como estruturar uma solução que possa ser explicada, testada, publicada e evoluída por um time real.

Cada laboratório inclui:

- aplicação Next.js completa e independente;
- API Routes para proteger a chave padrão da OpenAI;
- contratos estritos, validação com Zod e erros sanitizados;
- interface responsiva, acessível e com estados de operação explícitos;
- testes sem chamadas pagas à OpenAI;
- CI/CD, instruções de deploy e fronteiras de produção documentadas;
- workshops autossuficientes em português e inglês, começando numa pasta vazia;
- decisões, trade-offs, armadilhas e exercícios de evolução.

## 🧭 Trilha de workshop

Se esta é sua primeira experiência com a API da OpenAI ou com o repositório, comece pelo **[índice do workshop](docs/README.md)**. A trilha segue a mesma ideia incremental de workshops práticos de engenharia: preparar o ambiente uma única vez, concluir um módulo delimitado, comprovar o checkpoint e só então avançar.

| Módulo | Comece aqui | Resultado |
| --- | --- | --- |
| **00 — Ambiente e API** | **[Guia de configuração](docs/00-configuracao-do-ambiente.md)** | Ferramentas, projeto da API OpenAI, segredo local, health check e gate de qualidade validados |
| **01 — Text to Speech** | **[Workshop de TTS](labs/lab-01-text-to-speech/tutorial/tutorial.md)** | Aplicação de geração de fala delimitada, com streaming e proteções |
| **02 — Agente de voz Realtime** | **[Workshop Realtime](labs/lab-02-realtime-voice-agent/tutorial/tutorial.md)** | Conversa ao vivo por WebRTC, com estados de sessão e segurança explícitos |

Você pode seguir pelo caminho “executar e estudar” ou reconstruir cada aplicação a partir de uma pasta vazia. O restante deste README continua sendo a referência operacional resumida.

## 🧪 Laboratórios

| Laboratório | O que você constrói | Modelo e transporte | Tutorial | Estado |
| --- | --- | --- | --- | :---: |
| **[Lab 01 — Text to Speech](labs/lab-01-text-to-speech)** | Interface acessível que transforma texto em áudio expressivo, com player e download | `gpt-4o-mini-tts` · HTTP · áudio em streaming | **[Português](labs/lab-01-text-to-speech/tutorial/tutorial.md)** · [English](labs/lab-01-text-to-speech/tutorial/tutorial-en.md) | ✅ |
| **[Lab 02 — Agente de Voz Realtime](labs/lab-02-realtime-voice-agent)** | Agente speech-to-speech fluido, com turnos semânticos, mute, interrupção e alternativa por texto | `gpt-realtime-2.1` · WebRTC · Agents SDK | **[Português](labs/lab-02-realtime-voice-agent/tutorial/tutorial.md)** · [English](labs/lab-02-realtime-voice-agent/tutorial/tutorial-en.md) | ✅ |

### Lab 01 — Text to Speech

Você aprende a tratar TTS como uma requisição delimitada, manter a credencial no servidor, validar um contrato pequeno e encaminhar o stream de áudio sem acumular o arquivo inteiro na Route Handler.

**Principais tópicos:** streaming, cancelamento, vozes, instruções de entrega, formatos, velocidade, player, download, disclosure de IA, quotas e erros acessíveis.

### Lab 02 — Agente de Voz Realtime

Você aprende por que uma conversa ao vivo é uma sessão com estado e como separar o caminho de autorização do caminho de mídia. O servidor cria um client secret curto; o navegador negocia WebRTC com a OpenAI sem receber a chave padrão.

**Principais tópicos:** Realtime, Agents SDK, WebRTC, client secret efêmero, semantic VAD, barge-in, mute, transcripts em memória, consentimento e cleanup.

## 🏗️ Arquitetura do repositório

```text
openai-voice-playground/
├── labs/
│   ├── lab-01-text-to-speech/
│   │   ├── src/                  # aplicação TTS
│   │   ├── tests/                # contratos e proteções
│   │   └── tutorial/
│   │       ├── tutorial.md       # português: do zero ao deploy
│   │       └── tutorial-en.md    # inglês: versão autossuficiente
│   └── lab-02-realtime-voice-agent/
│       ├── src/                  # agente Realtime
│       ├── tests/                # sessão, schemas e proteções
│       └── tutorial/
│           ├── tutorial.md       # português: do zero ao deploy
│           └── tutorial-en.md    # inglês: versão autossuficiente
├── docs/
│   ├── README.md                 # índice e trilhas do workshop
│   ├── 00-configuracao-do-ambiente.md
│   └── assets/                   # mídia da documentação
├── .github/workflows/ci.yml      # matriz de CI dos laboratórios
├── AGENTS.md                     # regras duráveis para humanos e Codex
└── package.json                  # comandos de orquestração
```

Os laboratórios possuem `package.json` e `package-lock.json` próprios. Essa independência é intencional: cada workshop pode ser instalado, ensinado, testado e publicado sem depender do runtime do outro.

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou superior;
- npm;
- Git;
- uma API key de projeto da OpenAI;
- navegador moderno;
- microfone e suporte a WebRTC para o Lab 02;
- fones de ouvido recomendados para reduzir eco no agente Realtime.

Confirme as ferramentas:

```bash
node --version
npm --version
git --version
```

## 🚀 Início rápido

Na primeira execução, siga o **[Módulo 00 — configuração do ambiente, da API e execução local](docs/00-configuracao-do-ambiente.md)**. Ele explica como criar ou selecionar o projeto da API OpenAI, proteger a chave, validar `/api/health` e resolver erros comuns. A versão resumida está abaixo.

### 1. Clone o repositório

```bash
git clone https://github.com/glaucia86/openai-voice-playground.git
cd openai-voice-playground
```

### 2. Instale os dois laboratórios

```bash
npm run install:labs
```

Para instalar somente um:

```bash
npm ci --prefix labs/lab-01-text-to-speech
# ou
npm ci --prefix labs/lab-02-realtime-voice-agent
```

### 3. Configure o laboratório escolhido

macOS, Linux ou Git Bash:

```bash
cp labs/lab-01-text-to-speech/.env.example \
   labs/lab-01-text-to-speech/.env.local
```

PowerShell:

```powershell
Copy-Item labs/lab-01-text-to-speech/.env.example `
  labs/lab-01-text-to-speech/.env.local
```

Abra o `.env.local` criado e adicione sua chave:

```dotenv
OPENAI_API_KEY=your_project_key
```

### 4. Inicie o laboratório

```bash
npm run dev:lab01
```

Abra <http://localhost:3000>. Para o agente Realtime, repita a configuração dentro de `lab-02-realtime-voice-agent` e execute:

```bash
npm run dev:lab02
```

## ▶️ Resumo de execução

Execute os comandos abaixo na raiz do repositório:

| Objetivo | Comando |
| --- | --- |
| Instalar todos os labs | `npm run install:labs` |
| Executar Lab 01 | `npm run dev:lab01` |
| Executar Lab 02 | `npm run dev:lab02` |
| Validar Lab 01 | `npm run check:lab01` |
| Validar Lab 02 | `npm run check:lab02` |
| Validar todo o repositório | `npm run check` |

> Execute apenas um servidor por vez, a menos que defina portas diferentes explicitamente.

## 🔐 Variáveis de ambiente

Cada laboratório possui seu próprio `.env.example`:

```dotenv
# Obrigatória e somente no servidor
OPENAI_API_KEY=

# Obrigatória em produção; opcional somente no desenvolvimento local
PLAYGROUND_ACCESS_TOKEN=

# Obrigatória em produção
APP_ORIGIN=

# Obrigatórias em produção: quota compartilhada entre instâncias serverless
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Obrigatória fora da Vercel; use um header sobrescrito pelo proxy confiável
CLIENT_IP_HEADER=
```

Regras inegociáveis:

- nunca faça commit de `.env`, `.env.local` ou arquivos baixados da Vercel;
- nunca use `NEXT_PUBLIC_OPENAI_API_KEY`;
- nunca coloque uma chave real em `.env.example`;
- confirme a proteção com `git check-ignore -v caminho/.env.local`;
- use projetos, chaves, quotas e orçamentos separados por ambiente quando possível.

## ✅ Qualidade e CI/CD

O workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) executa uma matriz independente para os dois laboratórios em todo push para `main` e em pull requests:

```text
npm ci
  ├── auditoria de dependências high/critical
  ├── lint com Oxlint
  ├── type-check com TypeScript 7
  ├── testes com cobertura
  └── build de produção com Next.js 15
```

O [Dependabot](.github/dependabot.yml) mantém as dependências visíveis para revisão e o workflow [CodeQL](.github/workflows/codeql.yml), com Actions fixadas por SHA, executa análise estática também de forma agendada.

Execute localmente antes de abrir um pull request:

```bash
npm run check
```

[![CI](https://github.com/glaucia86/openai-voice-playground/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/glaucia86/openai-voice-playground/actions/workflows/ci.yml)

## ▲ Deploy na Vercel

Crie um projeto Vercel separado para cada laboratório e configure **Root Directory**:

| Projeto | Root Directory |
| --- | --- |
| Lab 01 — TTS | `labs/lab-01-text-to-speech` |
| Lab 02 — Realtime | `labs/lab-02-realtime-voice-agent` |

Depois:

1. mantenha `main` como Production Branch;
2. cadastre `OPENAI_API_KEY` nas Environment Variables criptografadas;
3. adicione `PLAYGROUND_ACCESS_TOKEN` — ele é obrigatório em produção;
4. configure `APP_ORIGIN` com o domínio final;
5. conecte Upstash Redis com `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`;
6. na Vercel, deixe `CLIENT_IP_HEADER` vazio para usar `x-vercel-forwarded-for`; fora dela, informe um header sobrescrito pelo seu proxy confiável;
7. valide `/api/health` sem expor credenciais;
8. no Lab 02, confirme HTTPS e permissão de microfone.

Se a configuração de segurança ou o limitador distribuído falhar em produção, a API retorna `503` e não inicia uma chamada faturável.

Os capítulos de deploy dos workshops documentam smoke tests e controles operacionais ainda necessários.

## 🛡️ Uso responsável

- Vozes sintéticas são identificadas como geradas por IA.
- Não use o projeto para imitar pessoas reais ou enganar ouvintes.
- Texto, instruções, áudio, transcripts e credenciais não pertencem aos logs.
- O Lab 02 mantém transcripts apenas na memória da página e não copia áudio para o histórico local.
- Client secrets efêmeros reduzem exposição, mas continuam sendo credenciais bearer.
- Em produção a quota é distribuída com Upstash Redis; apenas o desenvolvimento local usa fallback em memória.
- O Lab 02 encerra a sessão do workshop após 15 minutos no cliente. Como o WebRTC segue direto para a OpenAI, esse timer não é um limite autoritativo contra um cliente modificado.
- A aplicação não persiste conteúdo, mas logs de monitoramento de abuso do provedor podem ser retidos por até 30 dias nos controles padrão da API.

Antes de lançar um SaaS público, substitua o token compartilhado por identidade e autorização reais, adicione quota por usuário e sessões concorrentes, orçamentos e alertas do projeto OpenAI, consentimento, política de retenção revisada, observabilidade, resposta a abuso e aprovação humana para ferramentas com efeitos relevantes.

Leia [SECURITY.md](SECURITY.md) para conhecer a política de segurança.

## 🤝 Como contribuir

Contribuições que melhorem clareza, segurança, acessibilidade, testes ou valor educacional são bem-vindas.

1. leia [CONTRIBUTING.md](CONTRIBUTING.md) e [AGENTS.md](AGENTS.md);
2. crie um fork e uma branch focada;
3. atualize código e workshop juntos;
4. execute `npm run check`;
5. abra um pull request explicando decisão, trade-off e validação.

Se este projeto ajudou você, considere deixar uma ⭐. Isso ajuda outras pessoas a encontrar os laboratórios.

---

## 👩🏽‍💻 Sobre a autora

<div align="center">

<a href="https://github.com/glaucia86">
  <img src="https://avatars.githubusercontent.com/u/1631477?v=4" width="170" alt="Foto de Glaucia Lemos">
</a>

<h3>Glaucia Lemos</h3>

<p><strong>Principal Software Engineer · Forward Deployed Engineering Manager</strong></p>

<p>Engenheira de software, educadora e criadora de conteúdo apaixonada por JavaScript, TypeScript, Node.js, Cloud, Inteligência Artificial e comunidades open source.</p>

<p>
  <a href="https://github.com/glaucia86">
    <img alt="GitHub" src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white">
  </a>
  <a href="https://www.linkedin.com/in/glaucialemos/">
    <img alt="LinkedIn" src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white">
  </a>
  <a href="https://twitter.com/glaucia_lemos86">
    <img alt="X / Twitter" src="https://img.shields.io/badge/X_/_Twitter-000000?style=for-the-badge&logo=x&logoColor=white">
  </a>
  <a href="https://www.youtube.com/user/l32759">
    <img alt="YouTube" src="https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white">
  </a>
  <a href="https://www.twitch.tv/glaucia_lemos86">
    <img alt="Twitch" src="https://img.shields.io/badge/Twitch-9146FF?style=for-the-badge&logo=twitch&logoColor=white">
  </a>
  <a href="https://dev.to/glaucia86">
    <img alt="DEV Community" src="https://img.shields.io/badge/DEV_Community-0A0A0A?style=for-the-badge&logo=devdotto&logoColor=white">
  </a>
</p>

<p><em>“Compartilhar conhecimento é multiplicar possibilidades.”</em></p>

</div>

---

<div align="center">

<p>Feito com 💚, TypeScript e muita curiosidade por <a href="https://github.com/glaucia86">Glaucia Lemos</a>.</p>

<p><a href="LICENSE">Licença MIT</a> · <a href="SECURITY.md">Reportar vulnerabilidade</a> · <a href="#readme-top">Voltar ao topo</a></p>

</div>
