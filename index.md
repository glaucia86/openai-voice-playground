---
layout: default
title: OpenAI Voice Labs
description: Hands-on, bilingual workshops for OpenAI Text to Speech and Realtime voice agents.
---

<section class="workshop-hero">
  <div>
    <span class="hero-badge">Bilingual hands-on workshops</span>
    <h1>Build voice apps you can <em>explain.</em></h1>
    <p class="hero-lede">Aprenda aplicações de voz passo a passo — do terminal ao deploy. Every file is complete, every checkpoint is testable, and every architectural decision has a reason.</p>
    <div class="hero-actions">
      <a class="button button--primary" href="#workshops">Choose a workshop · Escolher</a>
      <a class="button" href="{{ '/docs/workshop-guide-pt-br.html' | relative_url }}">Como acompanhar</a>
    </div>
    <ul class="hero-facts" aria-label="Workshop facts">
      <li><strong>02</strong> complete labs</li>
      <li><strong>08</strong> executable checkpoints</li>
      <li><strong>PT/EN</strong> every chapter</li>
    </ul>
  </div>

  <div class="voice-visual" aria-label="Animated abstract voice signal">
    <span class="visual-chip visual-chip--one">text → secure server</span>
    <div class="voice-orb" aria-hidden="true"></div>
    <div class="voice-bars" aria-hidden="true">
      <span style="--height:28%;--delay:-.1s"></span><span style="--height:54%;--delay:-.6s"></span><span style="--height:76%;--delay:-.3s"></span><span style="--height:42%;--delay:-.8s"></span><span style="--height:88%;--delay:-.2s"></span><span style="--height:62%;--delay:-.7s"></span><span style="--height:96%;--delay:-.4s"></span><span style="--height:50%;--delay:-.9s"></span><span style="--height:78%;--delay:-.5s"></span><span style="--height:36%;--delay:-.15s"></span><span style="--height:68%;--delay:-.65s"></span><span style="--height:91%;--delay:-.35s"></span><span style="--height:48%;--delay:-.85s"></span><span style="--height:72%;--delay:-.25s"></span><span style="--height:32%;--delay:-.75s"></span>
    </div>
    <span class="visual-chip visual-chip--two">audio · WebRTC · trust</span>
  </div>
</section>

<section class="home-section" id="workshops">
  <div class="home-section__heading">
    <div>
      <span class="section-label">Learning by building</span>
      <h2>Choose your voice path.</h2>
    </div>
    <p>Comece com uma requisição delimitada de áudio e avance para uma conversa speech-to-speech em tempo real.</p>
  </div>

  <div class="labs-grid">
    <article class="lab-card">
      <span class="lab-number">Lab 01 · Request/response</span>
      <h3>Text to Speech</h3>
      <p>Transforme texto validado em áudio expressivo com streaming, player, download, limites e uma fronteira server-side segura.</p>
      <ul class="tag-list"><li>Next.js</li><li>Speech API</li><li>Streaming</li><li>TypeScript</li></ul>
      <div class="lab-links">
        <a href="{{ '/labs/lab-01-text-to-speech/tutorial/tutorial.html' | relative_url }}">Português →</a>
        <a href="{{ '/labs/lab-01-text-to-speech/tutorial/tutorial-en.html' | relative_url }}">English →</a>
        <a href="{{ '/labs/lab-01-text-to-speech/tutorial/article.html' | relative_url }}">Artigo arquitetural</a>
        <a href="https://github.com/glaucia86/openai-voice-playground/tree/workshop/lab-01-v1-starter">Starter branch ↗</a>
      </div>
    </article>

    <article class="lab-card lab-card--realtime">
      <span class="lab-number">Lab 02 · Live conversation</span>
      <h3>Realtime Voice Agent</h3>
      <p>Construa um agente speech-to-speech com autorização curta, WebRTC, turnos, mute, interrupção, transcript e cleanup.</p>
      <ul class="tag-list"><li>Realtime API</li><li>WebRTC</li><li>Agents SDK</li><li>Ephemeral key</li></ul>
      <div class="lab-links">
        <a href="{{ '/labs/lab-02-realtime-voice-agent/tutorial/tutorial.html' | relative_url }}">Português →</a>
        <a href="{{ '/labs/lab-02-realtime-voice-agent/tutorial/tutorial-en.html' | relative_url }}">English →</a>
        <a href="{{ '/labs/lab-02-realtime-voice-agent/tutorial/article.html' | relative_url }}">Artigo arquitetural</a>
        <a href="https://github.com/glaucia86/openai-voice-playground/tree/workshop/lab-02-v1-starter">Starter branch ↗</a>
      </div>
    </article>
  </div>
</section>

<section class="home-section">
  <div class="home-section__heading">
    <div>
      <span class="section-label">Your pace, your starting point</span>
      <h2>Three ways to learn.</h2>
    </div>
    <p>O resultado é o mesmo. O nível de apoio mecânico muda conforme sua experiência e o tempo disponível.</p>
  </div>
  <div class="learning-path">
    <article class="path-card"><h3>Run the final solution</h3><p>Execute a <code>main</code>, veja a experiência completa e use o código para investigação.</p></article>
    <article class="path-card"><h3>Build from a starter</h3><p>Caminho recomendado: base compilável, implementação por fatias e checkpoints somente de leitura.</p></article>
    <article class="path-card"><h3>Create from zero</h3><p>Crie configuração, pastas e cada arquivo manualmente para uma aula longa ou estudo aprofundado.</p></article>
  </div>
</section>

<section class="home-section">
  <div class="deploy-note">
    <div>
      <span class="section-label">One project, two destinations</span>
      <h2>Documentation here. Voice runtimes on a server.</h2>
      <p>O GitHub Pages hospeda este material estático. As aplicações usam rotas server-side e variáveis protegidas; publique cada laboratório na Vercel ou em outro host compatível com Next.js.</p>
      <a class="button" href="{{ '/docs/github-pages-pt-br.html' | relative_url }}">Read the publishing guide · Ver guia</a>
    </div>
    <div class="deploy-diagram" aria-label="Publishing architecture">
      <span>Markdown + Jekyll</span><i>↓</i><span>GitHub Pages · workshops</span><i>+</i><span>Next.js host · live apps</span>
    </div>
  </div>
</section>
