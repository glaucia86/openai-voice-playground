---
layout: default
title: OpenAI Voice Labs
description: Hands-on workshops for building OpenAI voice applications with Next.js and TypeScript.
lang: en
alternate_url: "/"
alternate_lang: pt-BR
alternate_label: "Português"
---

<section class="workshop-hero">
  <div>
    <span class="hero-badge">Hands-on workshops in English</span>
    <h1>Build voice apps you can <em>explain.</em></h1>
    <p class="hero-lede">Learn step by step—from the terminal to deployment. Every file is complete, every checkpoint is testable, and every architectural decision has a reason.</p>
    <div class="hero-actions">
      <a class="button button--primary" href="#workshops">Choose a workshop</a>
      <a class="button" href="{{ '/docs/workshop-guide.html' | relative_url }}">How to follow</a>
    </div>
    <ul class="hero-facts" aria-label="Workshop facts">
      <li><strong>02</strong> complete labs</li>
      <li><strong>08</strong> executable checkpoints</li>
      <li><strong>EN</strong> every chapter</li>
    </ul>
  </div>

  <div class="voice-visual" role="img" aria-label="Animated abstract voice signal">
    <span class="visual-chip visual-chip--one">text → secure server</span>
    <div class="voice-orb" aria-hidden="true"></div>
    <div class="voice-bars" aria-hidden="true">
      <span style="--height:28%;--delay:-.1s"></span><span style="--height:54%;--delay:-.6s"></span><span style="--height:76%;--delay:-.3s"></span><span style="--height:42%;--delay:-.8s"></span><span style="--height:88%;--delay:-.2s"></span><span style="--height:62%;--delay:-.7s"></span><span style="--height:96%;--delay:-.4s"></span><span style="--height:50%;--delay:-.9s"></span><span style="--height:78%;--delay:-.5s"></span><span style="--height:36%;--delay:-.15s"></span><span style="--height:68%;--delay:-.65s"></span><span style="--height:91%;--delay:-.35s"></span><span style="--height:48%;--delay:-.85s"></span><span style="--height:72%;--delay:-.25s"></span><span style="--height:32%;--delay:-.75s"></span>
    </div>
    <span class="visual-chip visual-chip--two">audio · WebRTC · trust</span>
  </div>
</section>

<section class="home-section quick-start" id="start-in-5-minutes" aria-labelledby="quick-start-title">
  <div class="home-section__heading">
    <div>
      <span class="section-label">Start in 5 minutes</span>
      <h2 id="quick-start-title">See the outcome. Then choose how to build it.</h2>
    </div>
    <p>The quick start assumes Node.js 22+, Git, an OpenAI API account with active billing, and a project API key. Voice API calls may incur charges.</p>
  </div>
  <div class="quick-start-grid">
    <article class="quick-card">
      <span>01 · Recommended first</span>
      <h3>Text to Speech</h3>
      <dl><div><dt>Time</dt><dd>2–3 h</dd></div><div><dt>Level</dt><dd>Beginner</dd></div><div><dt>Quick test</dt><dd>~5 min</dd></div></dl>
      <p>Generate, play, and download audio without exposing the API key to the browser.</p>
      <a class="button button--primary" href="{{ '/labs/lab-01-text-to-speech/tutorial/tutorial-en.html#start-in-5-minutes' | relative_url }}">Run or build</a>
    </article>
    <article class="quick-card quick-card--realtime">
      <span>02 · Next or standalone</span>
      <h3>Realtime Voice Agent</h3>
      <dl><div><dt>Time</dt><dd>3–4 h</dd></div><div><dt>Level</dt><dd>Intermediate</dd></div><div><dt>Quick test</dt><dd>~5 min</dd></div></dl>
      <p>Talk over WebRTC using a short-lived client secret and explicit microphone controls.</p>
      <a class="button button--primary" href="{{ '/labs/lab-02-realtime-voice-agent/tutorial/tutorial-en.html#start-in-5-minutes' | relative_url }}">Run or build</a>
    </article>
    <aside class="quick-route" aria-label="Choose a learning path">
      <span class="section-label">Choose your path</span>
      <ol>
        <li><strong>I want to try it:</strong> clone <code>main</code> and run the finished solution.</li>
        <li><strong>I want to learn:</strong> use the starter branch and move through the checkpoints.</li>
        <li><strong>I want to master it:</strong> create the application from an empty directory.</li>
      </ol>
      <a href="{{ '/docs/workshop-guide.html' | relative_url }}">Compare the three paths →</a>
    </aside>
  </div>
</section>

<section class="home-section" id="workshops">
  <div class="home-section__heading">
    <div>
      <span class="section-label">Learning by building</span>
      <h2>Choose your voice path.</h2>
    </div>
    <p>Begin with a bounded audio request and progress to a live speech-to-speech conversation.</p>
  </div>

  <div class="labs-grid">
    <article class="lab-card">
      <span class="lab-number">Lab 01 · Request and response</span>
      <h3>Text to Speech</h3>
      <p>Turn validated text into expressive audio with streaming, playback, download, limits, and a secure server-side boundary.</p>
      <dl class="lab-card__facts"><div><dt>Time</dt><dd>2–3 h</dd></div><div><dt>Level</dt><dd>Beginner</dd></div><div><dt>Cost</dt><dd>Usage-based API</dd></div></dl>
      <ul class="tag-list"><li>Next.js</li><li>Speech API</li><li>Streaming</li><li>TypeScript</li></ul>
      <div class="lab-links">
        <a href="{{ '/labs/lab-01-text-to-speech/tutorial/tutorial-en.html' | relative_url }}">Open tutorial →</a>
        <a href="{{ '/labs/lab-01-text-to-speech/tutorial/article-en.html' | relative_url }}">Architecture article</a>
        <a href="https://github.com/glaucia86/openai-voice-playground/tree/main/labs/lab-01-text-to-speech">Finished code ↗</a>
        <a href="https://github.com/glaucia86/openai-voice-playground/tree/workshop/lab-01-v1-starter">Starter branch ↗</a>
        <a href="https://github.com/glaucia86/openai-voice-playground/tree/workshop/lab-01-v1-step-01-contract">First checkpoint ↗</a>
      </div>
    </article>

    <article class="lab-card lab-card--realtime">
      <span class="lab-number">Lab 02 · Live conversation</span>
      <h3>Realtime Voice Agent</h3>
      <p>Build a speech-to-speech agent with short-lived authorization, WebRTC, turns, mute, interruption, transcript, and safe cleanup.</p>
      <dl class="lab-card__facts"><div><dt>Time</dt><dd>3–4 h</dd></div><div><dt>Level</dt><dd>Intermediate</dd></div><div><dt>Cost</dt><dd>Usage-based API</dd></div></dl>
      <ul class="tag-list"><li>Realtime API</li><li>WebRTC</li><li>Agents SDK</li><li>Client secret</li></ul>
      <div class="lab-links">
        <a href="{{ '/labs/lab-02-realtime-voice-agent/tutorial/tutorial-en.html' | relative_url }}">Open tutorial →</a>
        <a href="{{ '/labs/lab-02-realtime-voice-agent/tutorial/article-en.html' | relative_url }}">Architecture article</a>
        <a href="https://github.com/glaucia86/openai-voice-playground/tree/main/labs/lab-02-realtime-voice-agent">Finished code ↗</a>
        <a href="https://github.com/glaucia86/openai-voice-playground/tree/workshop/lab-02-v1-starter">Starter branch ↗</a>
        <a href="https://github.com/glaucia86/openai-voice-playground/tree/workshop/lab-02-v1-step-01-session-contract">First checkpoint ↗</a>
      </div>
    </article>
  </div>
</section>

<section class="home-section" aria-labelledby="results-title">
  <div class="home-section__heading">
    <div><span class="section-label">Outcome before code</span><h2 id="results-title">See what you will build.</h2></div>
    <p>The Lab 01 demo is real and compressed. The Lab 02 recording is explicitly pending; no result was fabricated.</p>
  </div>
  <div class="demo-grid">
    <figure class="demo-card">
      <img src="{{ '/docs/assets/openai-voice-labs-demo.gif' | relative_url }}" loading="lazy" width="960" height="540" alt="Real demonstration of the Lab 01 Text to Speech interface, from its initial screen to the audio-generation area.">
      <figcaption><strong>Lab 01 · Real demonstration</strong><span>The interface accepts text, generates audio, and displays playback and download controls. The recording contains no credentials or personal information.</span></figcaption>
    </figure>
    <div class="demo-card demo-card--pending" role="img" aria-label="Lab 02 demonstration pending a controlled recording session">
      <div><span>REC</span><strong>Lab 02 · Recording pending</strong><p>The space is ready, but a real Realtime conversation requires a credential, microphone, and API usage. Follow the safe plan to record without exposing tokens.</p><a href="{{ '/docs/demo-recording-guide.html' | relative_url }}">Open the recording plan →</a></div>
    </div>
  </div>
</section>

<section class="home-section">
  <div class="home-section__heading">
    <div>
      <span class="section-label">Your pace, your starting point</span>
      <h2>Three ways to learn.</h2>
    </div>
    <p>The outcome is the same. The amount of mechanical support changes with your experience and available time.</p>
  </div>
  <div class="learning-path">
    <article class="path-card"><h3>Run the finished solution</h3><p>Run <code>main</code>, see the complete experience, and use the code for investigation.</p></article>
    <article class="path-card"><h3>Build from the starter branch</h3><p>Recommended path: a compiling base, implementation in slices, and read-only checkpoints.</p></article>
    <article class="path-card"><h3>Create from zero</h3><p>Create the configuration, directories, and every file manually for a long class or deeper study.</p></article>
  </div>
</section>

<section class="home-section">
  <div class="deploy-note">
    <div>
      <span class="section-label">One project, two destinations</span>
      <h2>Documentation here. Voice applications on a server.</h2>
      <p>GitHub Pages hosts this static learning material. The applications use server-side routes and protected variables; deploy each lab to Vercel or another Next.js-compatible host.</p>
      <a class="button" href="{{ '/docs/github-pages.html' | relative_url }}">View the publishing guide</a>
    </div>
    <div class="deploy-diagram" aria-label="Publishing architecture">
      <span>Markdown + Jekyll</span><i>↓</i><span>GitHub Pages · workshops</span><i>+</i><span>Next.js host · applications</span>
    </div>
  </div>
</section>
