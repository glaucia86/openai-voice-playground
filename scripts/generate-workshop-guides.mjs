import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const checkOnly = process.argv.includes("--check");

const sharedConfigurationFiles = [
  ".env.example",
  ".gitignore",
  "package.json",
  "next.config.mjs",
  "tsconfig.json",
  "vitest.config.ts",
  "scripts/typecheck.mjs",
  "src/types/assets.d.ts",
];

const labs = [
  {
    id: "lab-01-text-to-speech",
    number: "01",
    ptTitle: "Text to Speech",
    enTitle: "Text to Speech",
    ptOutput: "pt/02-construcao-arquivo-por-arquivo.md",
    enOutput: "en/02-file-by-file-build.md",
    ptPrevious: "01-preparacao.md",
    enPrevious: "01-preparation.md",
    ptNext: "03-execucao-testes-deploy.md",
    enNext: "03-run-test-deploy.md",
    groups: [
      {
        id: "base",
        ptTitle: "Configure uma base reproduzível",
        enTitle: "Configure a reproducible base",
        ptIntro:
          "Agora crie a configuração que faz Next.js, TypeScript, Vitest e Oxlint concordarem. Se você veio do starter, abra cada arquivo e compare; se veio de uma pasta vazia, crie-o.",
        enIntro:
          "Now create the configuration that makes Next.js, TypeScript, Vitest, and Oxlint agree. If you started from the scaffold, open and compare each file; from an empty directory, create it.",
        files: sharedConfigurationFiles,
        check: "npm run typecheck",
      },
      {
        id: "contract",
        ptTitle: "Crie o contrato antes da chamada de voz",
        enTitle: "Create the contract before the voice call",
        ptIntro:
          "A primeira fatia funcional não chama a OpenAI. Ela define exatamente o que o navegador pode pedir e prova as regras com testes rápidos.",
        enIntro:
          "The first functional slice does not call OpenAI. It defines exactly what the browser may request and proves the rules with fast tests.",
        files: [
          "src/lib/constants.ts",
          "src/lib/schemas.ts",
          "tests/schemas.test.ts",
        ],
        check: "npm test -- schemas.test.ts",
      },
      {
        id: "server",
        ptTitle: "Construa o backend seguro e o streaming",
        enTitle: "Build the secure backend and streaming path",
        ptIntro:
          "Nesta fatia você cria erros sanitizados, limites, observabilidade sem conteúdo, cliente OpenAI, health check e a rota que encaminha o áudio. Crie os arquivos na ordem apresentada.",
        enIntro:
          "This slice adds sanitized errors, limits, content-free observability, the OpenAI client, health route, and the route that forwards audio. Create the files in the shown order.",
        files: [
          "src/lib/errors.ts",
          "src/lib/observability.ts",
          "src/lib/openai.ts",
          "src/lib/rate-limit.ts",
          "src/lib/request-body.ts",
          "src/lib/security-config.ts",
          "src/lib/request-guard.ts",
          "src/app/api/health/route.ts",
          "src/app/api/speech/route.ts",
          "src/middleware.ts",
          "tests/errors.test.ts",
          "tests/observability.test.ts",
          "tests/rate-limit.test.ts",
          "tests/request-body.test.ts",
          "tests/request-guard.test.ts",
          "tests/security-config.test.ts",
          "tests/middleware.test.ts",
        ],
        check: "npm run typecheck && npm test",
      },
      {
        id: "interface",
        ptTitle: "Crie a interface, o player e o download",
        enTitle: "Create the interface, player, and download flow",
        ptIntro:
          "Agora o navegador ganha estados explícitos, cancelamento, player, download e disclosure de voz sintética. Substitua a página starter pelos arquivos finais abaixo.",
        enIntro:
          "The browser now gains explicit states, cancellation, playback, download, and synthetic-voice disclosure. Replace the starter page with the final files below.",
        files: [
          "src/lib/client-api.ts",
          "src/components/status-message.tsx",
          "src/components/waveform.tsx",
          "src/components/speech-studio.tsx",
          "src/components/voice-playground.tsx",
          "src/app/layout.tsx",
          "src/app/page.tsx",
          "src/app/globals.css",
          "src/app/manifest.ts",
          "src/app/icon.svg",
          "tests/client-api.test.ts",
        ],
        check: "npm run check",
      },
    ],
  },
  {
    id: "lab-02-realtime-voice-agent",
    number: "02",
    ptTitle: "Agente de Voz Realtime",
    enTitle: "Realtime Voice Agent",
    ptOutput: "pt/02-construcao-arquivo-por-arquivo.md",
    enOutput: "en/02-file-by-file-build.md",
    ptPrevious: "01-preparacao.md",
    enPrevious: "01-preparation.md",
    ptNext: "03-execucao-testes-deploy.md",
    enNext: "03-run-test-deploy.md",
    groups: [
      {
        id: "base",
        ptTitle: "Configure uma base reproduzível",
        enTitle: "Configure a reproducible base",
        ptIntro:
          "Comece alinhando Next.js, TypeScript, Vitest e o build. Quem usa o starter deve abrir e conferir; quem começou vazio deve criar cada arquivo.",
        enIntro:
          "Start by aligning Next.js, TypeScript, Vitest, and the build. Starter users should open and verify each file; empty-directory users should create every file.",
        files: sharedConfigurationFiles,
        check: "npm run typecheck",
      },
      {
        id: "contract",
        ptTitle: "Modele o contrato da sessão",
        enTitle: "Model the session contract",
        ptIntro:
          "Antes de pedir microfone ou credencial, fixe modelos, vozes, idiomas, perfis, limites, instruções e duração. Os testes desta fatia não usam rede.",
        enIntro:
          "Before requesting a microphone or credential, fix the models, voices, languages, profiles, limits, instructions, and lifetime. These tests use no network.",
        files: [
          "src/lib/constants.ts",
          "src/lib/schemas.ts",
          "src/lib/realtime-config.ts",
          "src/lib/session-lifetime.ts",
          "tests/schemas.test.ts",
          "tests/realtime-config.test.ts",
          "tests/session-lifetime.test.ts",
        ],
        check: "npm test -- schemas.test.ts realtime-config.test.ts session-lifetime.test.ts",
      },
      {
        id: "server",
        ptTitle: "Crie autorização e emissão do client secret",
        enTitle: "Create authorization and client-secret issuance",
        ptIntro:
          "Agora construa a fronteira server-side. A API key padrão termina aqui; a resposta ao navegador contém apenas dados mínimos e o client secret curto.",
        enIntro:
          "Now build the server-side boundary. The standard API key stops here; the browser response contains only minimal data and the short-lived client secret.",
        files: [
          "src/lib/errors.ts",
          "src/lib/observability.ts",
          "src/lib/openai.ts",
          "src/lib/rate-limit.ts",
          "src/lib/request-body.ts",
          "src/lib/security-config.ts",
          "src/lib/request-guard.ts",
          "src/app/api/health/route.ts",
          "src/app/api/realtime/token/route.ts",
          "src/middleware.ts",
          "tests/errors.test.ts",
          "tests/observability.test.ts",
          "tests/rate-limit.test.ts",
          "tests/request-body.test.ts",
          "tests/request-guard.test.ts",
          "tests/security-config.test.ts",
          "tests/middleware.test.ts",
        ],
        check: "npm run typecheck && npm test",
      },
      {
        id: "interface",
        ptTitle: "Crie agente, WebRTC, estados e interface",
        enTitle: "Create the agent, WebRTC flow, states, and interface",
        ptIntro:
          "Nesta fatia você substitui a página starter por uma conversa real. O gesto do usuário inicia a sessão; eventos atualizam estados; End libera recursos e o transcript permanece apenas em memória.",
        enIntro:
          "This slice replaces the starter page with a real conversation. A user gesture starts the session; events update state; End releases resources; the transcript remains in memory.",
        files: [
          "src/lib/client-api.ts",
          "src/components/status-message.tsx",
          "src/components/waveform.tsx",
          "src/components/realtime-voice-agent.tsx",
          "src/components/voice-playground.tsx",
          "src/app/layout.tsx",
          "src/app/page.tsx",
          "src/app/globals.css",
          "src/app/manifest.ts",
          "src/app/icon.svg",
          "tests/client-api.test.ts",
        ],
        check: "npm run check",
      },
    ],
  },
];

const descriptions = {
  ".env.example": {
    pt: "Liste somente nomes de variáveis com valores vazios. A chave real ficará em `.env.local`.",
    en: "List variable names with empty values only. The real key belongs in `.env.local`.",
  },
  ".gitignore": {
    pt: "Proteja segredos, dependências e artefatos gerados antes do primeiro commit.",
    en: "Protect secrets, dependencies, and generated artifacts before the first commit.",
  },
  "package.json": {
    pt: "Defina scripts, versões e dependências reproduzíveis. Não edite `package-lock.json` manualmente.",
    en: "Define reproducible scripts, versions, and dependencies. Never edit `package-lock.json` manually.",
  },
  "next.config.mjs": {
    pt: "Configure headers, limites e comportamento de produção do Next.js.",
    en: "Configure Next.js headers, limits, and production behavior.",
  },
  "tsconfig.json": {
    pt: "Ative tipagem estrita e o alias `@/` usado pelos imports.",
    en: "Enable strict typing and the `@/` alias used by imports.",
  },
  "vitest.config.ts": {
    pt: "Ensine o Vitest a resolver o mesmo alias e medir os arquivos relevantes.",
    en: "Teach Vitest to resolve the same alias and measure the relevant files.",
  },
  "scripts/typecheck.mjs": {
    pt: "Execute o compilador TypeScript 7 separado do compilador usado pelo Next.js.",
    en: "Run the TypeScript 7 compiler separately from the compiler used by Next.js.",
  },
  "src/types/assets.d.ts": {
    pt: "Declare imports de assets que participam da interface.",
    en: "Declare asset imports used by the interface.",
  },
  "src/lib/constants.ts": {
    pt: "Centralize allowlists e limites que não podem ser escolhidos livremente pelo cliente.",
    en: "Centralize allowlists and limits the client may not choose freely.",
  },
  "src/lib/schemas.ts": {
    pt: "Transforme a entrada não confiável num contrato estrito e tipado.",
    en: "Turn untrusted input into a strict, typed contract.",
  },
  "src/lib/errors.ts": {
    pt: "Normalize falhas numa resposta estável sem devolver detalhes crus do provedor.",
    en: "Normalize failures into stable responses without forwarding raw provider details.",
  },
  "src/lib/observability.ts": {
    pt: "Registre somente metadados operacionais; texto, áudio e credenciais ficam fora dos logs.",
    en: "Record operational metadata only; text, audio, and credentials stay out of logs.",
  },
  "src/lib/openai.ts": {
    pt: "Crie o cliente OpenAI de forma preguiçosa e somente no servidor.",
    en: "Create the OpenAI client lazily and on the server only.",
  },
  "src/lib/rate-limit.ts": {
    pt: "Implemente quota local no desenvolvimento e distribuída no ambiente de produção.",
    en: "Implement local development quota and distributed production quota.",
  },
  "src/lib/request-body.ts": {
    pt: "Limite os bytes realmente lidos antes de interpretar JSON.",
    en: "Bound the bytes actually read before parsing JSON.",
  },
  "src/lib/security-config.ts": {
    pt: "Faça produção falhar fechada quando proteções obrigatórias estiverem ausentes.",
    en: "Make production fail closed when mandatory safeguards are absent.",
  },
  "src/lib/request-guard.ts": {
    pt: "Aplique origem, acesso e quota antes de qualquer operação faturável.",
    en: "Apply origin, access, and quota checks before any billable operation.",
  },
  "src/lib/realtime-config.ts": {
    pt: "Monte instruções do agente sem permitir que o objetivo do usuário substitua regras do sistema.",
    en: "Build agent instructions without letting the user goal replace system rules.",
  },
  "src/lib/session-lifetime.ts": {
    pt: "Calcule duração e limite da sessão com funções pequenas e testáveis.",
    en: "Calculate session duration and limits with small, testable functions.",
  },
  "src/lib/client-api.ts": {
    pt: "Converta erros da API em mensagens seguras e reutilizáveis no navegador.",
    en: "Convert API errors into safe, reusable browser messages.",
  },
  "src/app/api/health/route.ts": {
    pt: "Exponha somente diagnóstico não sensível para provar configuração.",
    en: "Expose non-sensitive diagnostics only to prove configuration.",
  },
  "src/app/api/speech/route.ts": {
    pt: "Valide, chame a Speech API e encaminhe o stream sem montar o áudio inteiro no servidor.",
    en: "Validate, call the Speech API, and forward the stream without buffering all audio on the server.",
  },
  "src/app/api/realtime/token/route.ts": {
    pt: "Crie um client secret curto e devolva somente o contrato mínimo com `no-store`.",
    en: "Create a short-lived client secret and return only the minimal `no-store` contract.",
  },
  "src/middleware.ts": {
    pt: "Adicione headers de segurança e nonce por resposta sem expor segredos.",
    en: "Add security headers and a per-response nonce without exposing secrets.",
  },
  "src/components/status-message.tsx": {
    pt: "Apresente progresso e erro numa live region acessível.",
    en: "Present progress and errors in an accessible live region.",
  },
  "src/components/waveform.tsx": {
    pt: "Crie feedback visual respeitando preferências de movimento reduzido.",
    en: "Create visual feedback that respects reduced-motion preferences.",
  },
  "src/components/speech-studio.tsx": {
    pt: "Implemente formulário, requisição, cancelamento, player, download e cleanup do áudio.",
    en: "Implement the form, request, cancellation, playback, download, and audio cleanup.",
  },
  "src/components/realtime-voice-agent.tsx": {
    pt: "Implemente autorização, agente, sessão WebRTC, eventos, mute, texto, transcript e cleanup.",
    en: "Implement authorization, agent, WebRTC session, events, mute, text, transcript, and cleanup.",
  },
  "src/components/voice-playground.tsx": {
    pt: "Monte a composição principal que conecta apresentação e experiência de voz.",
    en: "Compose the main presentation and voice experience.",
  },
  "src/app/layout.tsx": {
    pt: "Defina metadados, fontes, idioma e estrutura raiz da página.",
    en: "Define metadata, fonts, language, and the root page structure.",
  },
  "src/app/page.tsx": {
    pt: "Renderize a experiência principal pelo App Router.",
    en: "Render the main experience through the App Router.",
  },
  "src/app/globals.css": {
    pt: "Aplique o sistema visual responsivo, foco visível, contraste e reduced motion.",
    en: "Apply the responsive visual system, visible focus, contrast, and reduced motion.",
  },
  "src/app/manifest.ts": {
    pt: "Descreva o app para instalação e metadados de navegador.",
    en: "Describe the app for installation and browser metadata.",
  },
  "src/app/icon.svg": {
    pt: "Adicione o ícone vetorial usado pela aplicação.",
    en: "Add the vector icon used by the application.",
  },
};

function languageFor(file) {
  if (file.endsWith(".tsx")) return "tsx";
  if (file.endsWith(".ts")) return "ts";
  if (file.endsWith(".mjs")) return "js";
  if (file.endsWith(".json")) return "json";
  if (file.endsWith(".css")) return "css";
  if (file.endsWith(".svg")) return "xml";
  if (file.endsWith(".env.example")) return "dotenv";
  return "text";
}

function descriptionFor(file, locale) {
  if (descriptions[file]) return descriptions[file][locale];
  if (file.startsWith("tests/")) {
    return locale === "pt"
      ? "Crie o teste que prova esta responsabilidade sem chamar a OpenAI."
      : "Create the test that proves this responsibility without calling OpenAI.";
  }
  return locale === "pt"
    ? "Crie o arquivo com a implementação validada abaixo."
    : "Create the file with the validated implementation below.";
}

function terminalPreparation(files) {
  const directories = [...new Set(files.map((file) => path.posix.dirname(file)).filter((dir) => dir !== "."))];
  return [
    directories.length ? `mkdir -p ${directories.join(" ")}` : "",
    `touch ${files.join(" ")}`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function renderGuide(lab, locale) {
  const isPt = locale === "pt";
  const labRoot = path.join(root, "labs", lab.id);
  const title = isPt ? lab.ptTitle : lab.enTitle;
  const previous = isPt ? lab.ptPrevious : lab.enPrevious;
  const next = isPt ? lab.ptNext : lab.enNext;
  const opposite = isPt ? "../en/02-file-by-file-build.md" : "../pt/02-construcao-arquivo-por-arquivo.md";
  const lines = [
    "---",
    "layout: default",
    `title: "Lab ${lab.number} · ${isPt ? "Capítulo 2 — Construção arquivo por arquivo" : "Chapter 2 — File-by-file build"}"`,
    `description: "${isPt ? `Crie a aplicação ${title} com o conteúdo completo de cada arquivo.` : `Create the ${title} application with the complete content of every file.`}"`,
    "---",
    "",
    `# Lab ${lab.number} · ${isPt ? "Capítulo 2 — Construa arquivo por arquivo" : "Chapter 2 — Build file by file"}`,
    "",
    `[← ${isPt ? "Preparação" : "Preparation"}](${previous}) · [${isPt ? "English" : "Português"}](${opposite}) · [${isPt ? "Próximo: execução, testes e deploy" : "Next: run, test, and deploy"} →](${next})`,
    "",
    isPt
      ? "Este capítulo é deliberadamente operacional. Trabalhe dentro do diretório do laboratório, crie os arquivos na ordem mostrada e execute o checkpoint de cada fatia antes de continuar."
      : "This chapter is deliberately operational. Work inside the lab directory, create files in the shown order, and run each slice checkpoint before continuing.",
    "",
    `> ${isPt ? "Este arquivo é gerado por `npm run docs:generate` a partir do código validado. Não edite os blocos de código manualmente; atualize a implementação e regenere a documentação." : "This file is generated by `npm run docs:generate` from validated source. Do not edit code blocks manually; update the implementation and regenerate the documentation."}`,
    "",
    `## ${isPt ? "Confirme o terminal" : "Confirm the terminal"}`,
    "",
    isPt
      ? "Antes do primeiro arquivo, execute `pwd`. O resultado precisa terminar no diretório abaixo:"
      : "Before the first file, run `pwd`. The result must end in:",
    "",
    "```text",
    `labs/${lab.id}`,
    "```",
    "",
  ];

  for (let groupIndex = 0; groupIndex < lab.groups.length; groupIndex += 1) {
    const group = lab.groups[groupIndex];
    const step = groupIndex + 1;
    lines.push(
      `## Passo ${step} — ${isPt ? group.ptTitle : group.enTitle}`,
      "",
      isPt ? group.ptIntro : group.enIntro,
      "",
      isPt
        ? "No terminal do laboratório, garanta que as pastas e os arquivos existam:"
        : "In the lab terminal, make sure the directories and files exist:",
      "",
      "```bash",
      terminalPreparation(group.files),
      "```",
      "",
    );

    for (let fileIndex = 0; fileIndex < group.files.length; fileIndex += 1) {
      const file = group.files[fileIndex];
      const content = await readFile(path.join(labRoot, file), "utf8");
      lines.push(
        `### ${step}.${fileIndex + 1} ${isPt ? "Crie" : "Create"} \`${file}\``,
        "",
        descriptionFor(file, locale),
        "",
        isPt
          ? `Abra \`${file}\`, apague qualquer placeholder e coloque exatamente:`
          : `Open \`${file}\`, remove any placeholder, and add exactly:`,
        "",
        `<details><summary><strong>${file}</strong></summary>`,
        "",
        `\`\`\`${languageFor(file)}`,
        content.trimEnd(),
        "```",
        "",
        "</details>",
        "",
      );
    }

    lines.push(
      `### ${isPt ? `Checkpoint do passo ${step}` : `Step ${step} checkpoint`}`,
      "",
      isPt
        ? "Salve todos os arquivos e execute:"
        : "Save every file and run:",
      "",
      "```bash",
      group.check,
      "```",
      "",
      isPt
        ? "Não avance enquanto o comando retornar erro. Leia a primeira mensagem, confira o caminho do arquivo e compare com o checkpoint antes de reinstalar dependências."
        : "Do not continue while the command fails. Read the first message, verify the file path, and compare with the checkpoint before reinstalling dependencies.",
      "",
    );
  }

  lines.push(
    `## ${isPt ? "Checkpoint do capítulo" : "Chapter checkpoint"}`,
    "",
    isPt
      ? "A aplicação completa agora deve passar pelo gate local:"
      : "The complete application must now pass the local gate:",
    "",
    "```bash",
    "npm run check",
    "```",
    "",
    isPt
      ? "Esse comando ainda não faz uma chamada paga. O teste real de voz acontece no próximo capítulo, de forma curta e explícita."
      : "This command still makes no paid request. The real voice test happens in the next chapter, briefly and explicitly.",
    "",
    `[${isPt ? "Próximo: execute, teste e publique" : "Next: run, test, and deploy"} →](${next})`,
    "",
  );

  return lines.join("\n");
}

let stale = false;

for (const lab of labs) {
  for (const locale of ["pt", "en"]) {
    const relativeOutput = locale === "pt" ? lab.ptOutput : lab.enOutput;
    const output = path.join(root, "labs", lab.id, "tutorial", relativeOutput);
    const rendered = await renderGuide(lab, locale);

    if (checkOnly) {
      let current = "";
      try {
        current = await readFile(output, "utf8");
      } catch {
        // Missing output is stale.
      }
      if (current !== rendered) {
        console.error(`Generated workshop guide is stale: ${path.relative(root, output)}`);
        stale = true;
      }
      continue;
    }

    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, rendered, "utf8");
    console.log(`Generated ${path.relative(root, output)}`);
  }
}

if (stale) process.exitCode = 1;
