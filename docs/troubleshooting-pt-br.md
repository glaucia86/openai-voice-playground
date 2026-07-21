---
layout: default
title: "Troubleshooting compartilhado — workshops e GitHub Pages"
description: "Diagnóstico reproduzível para documentação gerada, GitHub Pages, cache, CI e imports."
lang: pt-BR
alternate_url: "/docs/troubleshooting.html"
alternate_lang: en
alternate_label: "Read in English"
---

# Troubleshooting compartilhado — workshops e GitHub Pages

[Read in English](troubleshooting.md) · [Índice dos workshops](README.md)

Use os capítulos finais de cada laboratório para problemas de API, áudio, microfone e WebRTC. Esta página trata a camada compartilhada do repositório.

| Sintoma | Causa provável | Como diagnosticar | Como corrigir | Como confirmar |
| --- | --- | --- | --- | --- |
| guia arquivo por arquivo “desatualizado” | código mudou sem regenerar Markdown | `npm run docs:check` | altere o código ou metadado em `scripts/generate-workshop-guides.mjs`; rode `npm run docs:generate` | `npm run docs:check` passa e `git diff` mostra a atualização esperada |
| link ou âncora quebrada | arquivo movido, heading renomeado ou caminho relativo errado | `npm run docs:links` | corrija o destino preservando PT/EN | o verificador reporta todos os Markdown resolvidos |
| código perde indentação no Pages | fence dentro de HTML sem `markdown="1"` ou guia editado à mão | procure o bloco no Markdown gerado e confira o gerador | mantenha fences no gerador e use containers compatíveis com Kramdown | build do Pages mostra rolagem horizontal e botão copiar |
| `ENOENT` ou import funciona no Windows e falha no CI | nome real e import diferem em maiúsculas/minúsculas | `git ls-files | sort` e `rg -n "from .*errors" labs` | faça caminho e nome coincidirem exatamente; confirme que o arquivo está versionado | `npm run check` passa em ambiente case-sensitive |
| Pages mostra versão antiga | deployment ainda não terminou ou asset ficou em cache | compare o SHA da `main`, o run Pages e `github-pages`; inspecione `workshop.css?v=SHA` | aguarde o run correto; mantenha cache bust por `site.github.build_revision`; faça refresh completo uma vez | HTML publicado referencia o SHA novo e comportamento muda sem limpar dados do site |
| menu móvel não abre após deploy | JavaScript antigo, erro de sintaxe ou seletor divergente | console do navegador, `node --check assets/js/workshop.js`, URL do asset com `?v=` | corrija o primeiro erro; não remova o versionamento dos assets | abre/fecha por botão, link, toque fora e `Esc`; rolagem volta ao fechar |
| workflow Pages falha | link inválido, YAML/build Jekyll ou permissão do Pages | abra **Actions → Deploy GitHub Pages**, localize o primeiro passo vermelho | corrija a primeira causa; evite reexecutar sem mudança quando o erro é determinístico | run verde aponta para o commit desejado |
| aplicação não funciona no GitHub Pages | Pages é estático e não executa Route Handlers | confira se a URL tentada contém `/api/` | publique somente docs no Pages e cada Next.js app num host server-side com secrets | tutorial abre no Pages; `/api/health` funciona no host da aplicação |

## Pacote mínimo de diagnóstico

Na raiz do repositório:

```bash
git status -sb
node --version
npm run docs:check
npm run docs:links
node --check assets/js/workshop.js
npm run check
```

Não cole `.env.local`, headers, client secrets ou logs de conteúdo numa issue. Informe apenas sistema, navegador, comando, primeira mensagem sanitizada, `X-Request-Id` e commit usado.

