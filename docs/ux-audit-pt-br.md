---
layout: default
title: "Auditoria de UX, DevEx e aprendizagem"
description: "Avaliação baseada em evidências dos OpenAI Voice Labs antes e depois das melhorias."
lang: pt-BR
alternate_url: "/docs/ux-audit.html"
alternate_lang: en
alternate_label: "English"
---

# Auditoria de UX, DevEx e aprendizagem

[English](ux-audit.md) · [Índice dos workshops](README.md)

## Método

A linha de base é o commit `e05ca3e`, inspecionado como instrutor e como participante iniciante. As notas não medem quantidade de texto: usam evidências versionadas, ações necessárias para começar, possibilidade de recuperação, navegação por teclado/celular e checks reproduzíveis. A avaliação posterior considera somente recursos implementados no repositório e validados pelos comandos da raiz.

## Perspectiva do instrutor

**Antes:** os três caminhos, checkpoints versionados, testes sem rede e capítulos bilíngues já davam uma base forte. Porém, o instrutor precisava explicar oralmente tempo, nível, custo, arquitetura resumida, primeira rota e vários erros comuns. Recuperar alguém atrasado era possível, mas os atalhos para checkpoints não acompanhavam a pessoa em todas as páginas.

**Depois:** cada lab abre com metadados e início rápido; diagramas tornam as duas fronteiras de credencial comparáveis; a navegação mostra etapa, destino anterior/próximo e checkpoints; os guias gerados inserem objetivo, validação, erro provável, reflexão e conclusão em cada fatia. Troubleshooting passa de uma dica de duas colunas para diagnóstico e confirmação.

## Perspectiva da pessoa iniciante

**Antes:** a pessoa encontrava instruções corretas, mas precisava ler a introdução e tabelas extensas para descobrir o primeiro comando. O resultado final do Lab 02 não tinha mídia honesta, e a diferença entre tutorial, artigo, starter e `main` exigia contexto. No celular, o sumário existia, mas o drawer não preservava foco.

**Depois:** “Comece em 5 minutos” diferencia executar, construir com starter e criar do zero; cards expõem pré-requisitos, tempo, nível e custo; o Lab 01 mostra resultado real e o Lab 02 declara a gravação pendente com roteiro seguro; breadcrumbs, idioma e títulos dos destinos reduzem desorientação. Erros comuns agora terminam com uma forma objetiva de confirmar a correção.

## Notas baseadas em evidências

| Critério | Antes | Depois | Evidências |
| --- | ---: | ---: | --- |
| Documentação | 8,5 | 9,5 | antes: tutoriais completos PT/EN e gerador; depois: quick start, arquitetura SVG+Mermaid, mídia honesta, troubleshooting e próximos passos equivalentes |
| Navegação | 6,5 | 9,3 | antes: links inline e footer genérico; depois: front matter de jornada, breadcrumbs de lab/etapa, destinos nomeados, idioma, índice e checkpoints no desktop/celular |
| Design visual | 8,3 | 9,1 | antes: tema consistente, responsivo e copy; depois: cards compactos, mídia, diagramas, CTAs e nome de arquivo sem novo framework visual |
| Developer Experience | 8,4 | 9,3 | antes: starters, locks e `npm run check`; depois: metadados pedagógicos no gerador, `docs:check`, diagnóstico compartilhado e mídia com roteiro reproduzível |
| Acessibilidade | 7,8 | 9,2 | antes: skip link, foco visível e reduced motion; depois: foco preso/restaurado nos drawers, ARIA sincronizado, SVGs com título/descrição, alternativas textuais e alvos móveis |
| Experiência de aprendizado | 8,2 | 9,5 | antes: sequência e checkpoints sólidos; depois: resultado antes da implementação, expectativas explícitas, reflexões curtas, confirmação antes de avançar e CTA graduado |

## Limites conscientes

- A demonstração Realtime real depende de uma sessão controlada com credencial, microfone e custo; o placeholder não finge resultado.
- A pontuação não substitui teste com participantes reais. O próximo passo recomendado é observar pelo menos três iniciantes concluindo cada caminho e medir tempo, bloqueios e recuperação.
- GitHub Pages hospeda apenas documentação; as aplicações continuam exigindo host Next.js server-side.
