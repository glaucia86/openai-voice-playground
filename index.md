---
layout: default
title: OpenAI Voice Labs
description: Workshops práticos para criar aplicações de voz com OpenAI, Next.js e TypeScript.
lang: pt-BR
alternate_url: "/en/"
alternate_lang: en
alternate_label: "English"
---

<section class="workshop-hero">
  <div>
    <span class="hero-badge">Workshops práticos em português</span>
    <h1>Crie aplicações de voz que você consegue <em>explicar.</em></h1>
    <p class="hero-lede">Aprenda passo a passo — do terminal ao deploy. Cada arquivo está completo, cada checkpoint pode ser validado e cada decisão de arquitetura tem um motivo.</p>
    <div class="hero-actions">
      <a class="button button--primary" href="#workshops">Escolher um workshop</a>
      <a class="button" href="{{ '/docs/workshop-guide-pt-br.html' | relative_url }}">Como acompanhar</a>
    </div>
    <ul class="hero-facts" aria-label="Informações dos workshops">
      <li><strong>02</strong> laboratórios completos</li>
      <li><strong>08</strong> checkpoints executáveis</li>
      <li><strong>PT</strong> todos os capítulos</li>
    </ul>
  </div>

  <div class="voice-visual" role="img" aria-label="Sinal de voz abstrato animado">
    <span class="visual-chip visual-chip--one">texto → servidor seguro</span>
    <div class="voice-orb" aria-hidden="true"></div>
    <div class="voice-bars" aria-hidden="true">
      <span style="--height:28%;--delay:-.1s"></span><span style="--height:54%;--delay:-.6s"></span><span style="--height:76%;--delay:-.3s"></span><span style="--height:42%;--delay:-.8s"></span><span style="--height:88%;--delay:-.2s"></span><span style="--height:62%;--delay:-.7s"></span><span style="--height:96%;--delay:-.4s"></span><span style="--height:50%;--delay:-.9s"></span><span style="--height:78%;--delay:-.5s"></span><span style="--height:36%;--delay:-.15s"></span><span style="--height:68%;--delay:-.65s"></span><span style="--height:91%;--delay:-.35s"></span><span style="--height:48%;--delay:-.85s"></span><span style="--height:72%;--delay:-.25s"></span><span style="--height:32%;--delay:-.75s"></span>
    </div>
    <span class="visual-chip visual-chip--two">áudio · WebRTC · confiança</span>
  </div>
</section>

<section class="home-section quick-start" id="comece-em-5-minutos" aria-labelledby="quick-start-title">
  <div class="home-section__heading">
    <div>
      <span class="section-label">Comece em 5 minutos</span>
      <h2 id="quick-start-title">Veja o resultado. Depois escolha como construir.</h2>
    </div>
    <p>O início rápido pressupõe Node.js 22+, Git, uma conta da API OpenAI com cobrança ativa e uma API key criada. As chamadas de voz podem gerar custo.</p>
  </div>
  <div class="quick-start-grid">
    <article class="quick-card">
      <span>01 · Recomendado primeiro</span>
      <h3>Text to Speech</h3>
      <dl><div><dt>Tempo</dt><dd>2–3 h</dd></div><div><dt>Nível</dt><dd>Iniciante</dd></div><div><dt>Teste rápido</dt><dd>~5 min</dd></div></dl>
      <p>Gere, reproduza e baixe áudio sem enviar a chave ao navegador.</p>
      <a class="button button--primary" href="{{ '/labs/lab-01-text-to-speech/tutorial/tutorial.html#comece-em-5-minutos' | relative_url }}">Executar ou construir</a>
    </article>
    <article class="quick-card quick-card--realtime">
      <span>02 · Depois ou independente</span>
      <h3>Agente de voz em tempo real</h3>
      <dl><div><dt>Tempo</dt><dd>3–4 h</dd></div><div><dt>Nível</dt><dd>Intermediário</dd></div><div><dt>Teste rápido</dt><dd>~5 min</dd></div></dl>
      <p>Converse por WebRTC usando um segredo temporário e controles explícitos de microfone.</p>
      <a class="button button--primary" href="{{ '/labs/lab-02-realtime-voice-agent/tutorial/tutorial.html#comece-em-5-minutos' | relative_url }}">Executar ou construir</a>
    </article>
    <aside class="quick-route" aria-label="Escolha de rota de aprendizagem">
      <span class="section-label">Escolha sua rota</span>
      <ol>
        <li><strong>Quero testar:</strong> clone a <code>main</code> e execute a solução final.</li>
        <li><strong>Quero aprender:</strong> use a branch inicial e avance pelos checkpoints.</li>
        <li><strong>Quero dominar:</strong> crie a aplicação desde uma pasta vazia.</li>
      </ol>
      <a href="{{ '/docs/workshop-guide-pt-br.html' | relative_url }}">Comparar as três rotas →</a>
    </aside>
  </div>
</section>

<section class="home-section" id="workshops">
  <div class="home-section__heading">
    <div>
      <span class="section-label">Aprenda construindo</span>
      <h2>Escolha sua jornada de voz.</h2>
    </div>
    <p>Comece com uma requisição delimitada de áudio e avance para uma conversa de voz em tempo real.</p>
  </div>

  <div class="labs-grid">
    <article class="lab-card">
      <span class="lab-number">Lab 01 · Requisição e resposta</span>
      <h3>Text to Speech</h3>
      <p>Transforme texto validado em áudio expressivo com streaming, player, download, limites e uma fronteira segura no servidor.</p>
      <dl class="lab-card__facts"><div><dt>Tempo</dt><dd>2–3 h</dd></div><div><dt>Nível</dt><dd>Iniciante</dd></div><div><dt>Custo</dt><dd>API por uso</dd></div></dl>
      <ul class="tag-list"><li>Next.js</li><li>Speech API</li><li>Streaming</li><li>TypeScript</li></ul>
      <div class="lab-links">
        <a href="{{ '/labs/lab-01-text-to-speech/tutorial/tutorial.html' | relative_url }}">Abrir tutorial →</a>
        <a href="{{ '/labs/lab-01-text-to-speech/tutorial/article.html' | relative_url }}">Artigo de arquitetura</a>
        <a href="https://github.com/glaucia86/openai-voice-playground/tree/main/labs/lab-01-text-to-speech">Código final ↗</a>
        <a href="https://github.com/glaucia86/openai-voice-playground/tree/workshop/lab-01-v1-starter">Branch inicial ↗</a>
        <a href="https://github.com/glaucia86/openai-voice-playground/tree/workshop/lab-01-v1-step-01-contract">Primeiro checkpoint ↗</a>
      </div>
    </article>

    <article class="lab-card lab-card--realtime">
      <span class="lab-number">Lab 02 · Conversa ao vivo</span>
      <h3>Agente de voz em tempo real</h3>
      <p>Construa um agente de voz com autorização curta, WebRTC, turnos, mudo, interrupção, transcrição e encerramento seguro.</p>
      <dl class="lab-card__facts"><div><dt>Tempo</dt><dd>3–4 h</dd></div><div><dt>Nível</dt><dd>Intermediário</dd></div><div><dt>Custo</dt><dd>API por uso</dd></div></dl>
      <ul class="tag-list"><li>Realtime API</li><li>WebRTC</li><li>Agents SDK</li><li>Segredo temporário</li></ul>
      <div class="lab-links">
        <a href="{{ '/labs/lab-02-realtime-voice-agent/tutorial/tutorial.html' | relative_url }}">Abrir tutorial →</a>
        <a href="{{ '/labs/lab-02-realtime-voice-agent/tutorial/article.html' | relative_url }}">Artigo de arquitetura</a>
        <a href="https://github.com/glaucia86/openai-voice-playground/tree/main/labs/lab-02-realtime-voice-agent">Código final ↗</a>
        <a href="https://github.com/glaucia86/openai-voice-playground/tree/workshop/lab-02-v1-starter">Branch inicial ↗</a>
        <a href="https://github.com/glaucia86/openai-voice-playground/tree/workshop/lab-02-v1-step-01-session-contract">Primeiro checkpoint ↗</a>
      </div>
    </article>
  </div>
</section>

<section class="home-section" aria-labelledby="results-title">
  <div class="home-section__heading">
    <div><span class="section-label">Resultado antes do código</span><h2 id="results-title">Veja o que você vai construir.</h2></div>
    <p>A demonstração do Lab 01 é real e está comprimida. A gravação do Lab 02 está explicitamente pendente; nenhum resultado foi fabricado.</p>
  </div>
  <div class="demo-grid">
    <figure class="demo-card">
      <img src="{{ '/docs/assets/openai-voice-labs-demo.gif' | relative_url }}" loading="lazy" width="960" height="540" alt="Demonstração real da interface do Lab 01 Text to Speech, da tela inicial até a área de geração de áudio.">
      <figcaption><strong>Lab 01 · Demonstração real</strong><span>A interface recebe texto, gera áudio e apresenta os controles de reprodução e download. A gravação não contém credenciais nem dados pessoais.</span></figcaption>
    </figure>
    <div class="demo-card demo-card--pending" role="img" aria-label="Demonstração do Lab 02 pendente de gravação com credencial controlada">
      <div><span>REC</span><strong>Lab 02 · Gravação pendente</strong><p>O espaço está pronto, mas uma conversa em tempo real exige credencial, microfone e consumo da API. Veja o roteiro seguro para gravar sem expor tokens.</p><a href="{{ '/docs/demo-recording-guide-pt-br.html' | relative_url }}">Abrir roteiro de gravação →</a></div>
    </div>
  </div>
</section>

<section class="home-section">
  <div class="home-section__heading">
    <div>
      <span class="section-label">Seu ritmo, seu ponto de partida</span>
      <h2>Três formas de aprender.</h2>
    </div>
    <p>O resultado é o mesmo. O nível de apoio mecânico muda conforme sua experiência e o tempo disponível.</p>
  </div>
  <div class="learning-path">
    <article class="path-card"><h3>Execute a solução final</h3><p>Execute a <code>main</code>, veja a experiência completa e use o código para investigação.</p></article>
    <article class="path-card"><h3>Construa a partir da branch inicial</h3><p>Caminho recomendado: base compilável, implementação por etapas e checkpoints somente para consulta.</p></article>
    <article class="path-card"><h3>Crie do zero</h3><p>Crie configuração, pastas e cada arquivo manualmente para uma aula longa ou estudo aprofundado.</p></article>
  </div>
</section>

<section class="home-section">
  <div class="deploy-note">
    <div>
      <span class="section-label">Um projeto, dois destinos</span>
      <h2>Documentação aqui. Aplicações de voz em um servidor.</h2>
      <p>O GitHub Pages hospeda este material estático. As aplicações usam rotas no servidor e variáveis protegidas; publique cada laboratório na Vercel ou em outro host compatível com Next.js.</p>
      <a class="button" href="{{ '/docs/github-pages-pt-br.html' | relative_url }}">Ver guia de publicação</a>
    </div>
    <div class="deploy-diagram" aria-label="Arquitetura de publicação">
      <span>Markdown + Jekyll</span><i>↓</i><span>GitHub Pages · workshops</span><i>+</i><span>Host Next.js · aplicações</span>
    </div>
  </div>
</section>
