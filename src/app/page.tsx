import {
  ArrowDown,
  ArrowUpRight,
  BookOpenText,
  Braces,
  Code2,
  LockKeyhole,
  RadioTower,
  ShieldCheck,
  Sparkles,
  TestTube2,
  Waves,
} from "lucide-react";

import { VoicePlayground } from "@/components/voice-playground";
import { Waveform } from "@/components/waveform";

const REPOSITORY_URL = "https://github.com/glaucia86/openai-voice-playground";

export default function HomePage() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="OpenAI Voice Playground home">
          <span className="brand__mark" aria-hidden="true"><Waves /></span>
          <span className="brand__copy"><strong>Voice Playground</strong><small>OpenAI · educational OSS</small></span>
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#playground">Playground</a>
          <a href="#principles">Principles</a>
          <a href={`${REPOSITORY_URL}/blob/main/tutorial/tutorial.md`} target="_blank" rel="noreferrer">Tutorial</a>
        </nav>
        <a className="github-button" href={REPOSITORY_URL} target="_blank" rel="noreferrer">
          <Code2 aria-hidden="true" /> <span>View source</span> <ArrowUpRight aria-hidden="true" />
        </a>
      </header>

      <div id="top" className="hero-wrap">
        <section className="hero">
          <div className="hero__copy">
            <div className="hero-badge"><span className="hero-badge__pulse" /> Production patterns, explained</div>
            <h1>Build voice experiences people can <em>trust.</em></h1>
            <p className="hero__lede">
              A hands-on lab for expressive speech and accurate transcription—designed to teach the server boundaries, safeguards, and trade-offs behind the demo.
            </p>
            <div className="hero__actions">
              <a className="button button--primary button--large" href="#playground"><Sparkles aria-hidden="true" /> Open the playground</a>
              <a className="button button--ghost button--large" href={`${REPOSITORY_URL}/blob/main/tutorial/tutorial.md`} target="_blank" rel="noreferrer"><BookOpenText aria-hidden="true" /> Follow the tutorial</a>
            </div>
            <dl className="hero__facts">
              <div><dt>13</dt><dd>built-in voices</dd></div>
              <div><dt>2</dt><dd>transcription tiers</dd></div>
              <div><dt>0</dt><dd>keys in the browser</dd></div>
            </dl>
          </div>

          <div className="hero-visual" aria-label="Abstract voice pipeline visualization">
            <div className="hero-visual__glow" />
            <div className="signal-card signal-card--input">
              <span className="signal-card__icon"><Braces /></span>
              <span><small>Input</small><strong>Typed request</strong></span>
              <i>01</i>
            </div>
            <div className="sound-orb">
              <span className="sound-orb__ring sound-orb__ring--one" />
              <span className="sound-orb__ring sound-orb__ring--two" />
              <span className="sound-orb__core"><Waves /></span>
            </div>
            <div className="visual-wave"><Waveform active label="Animated generated voice signal" /></div>
            <div className="signal-card signal-card--output">
              <span className="signal-card__icon signal-card__icon--green"><RadioTower /></span>
              <span><small>Output</small><strong>Streamed audio</strong></span>
              <i>02</i>
            </div>
            <div className="visual-note"><LockKeyhole /> OPENAI_API_KEY stays server-side</div>
          </div>
        </section>
        <a className="scroll-cue" href="#playground"><span>Explore the lab</span><ArrowDown aria-hidden="true" /></a>
      </div>

      <VoicePlayground />

      <section className="principles" id="principles" aria-labelledby="principles-title">
        <div className="principles__heading">
          <span className="section-kicker">Beyond the happy path</span>
          <h2 id="principles-title">The demo is small. The engineering lessons are not.</h2>
          <p>Each layer exists because a production team eventually pays for shortcuts—in security, cost, usability, or maintainability.</p>
        </div>
        <div className="principles-grid">
          <article className="principle-card principle-card--featured">
            <span className="principle-card__number">01</span>
            <div className="principle-card__icon"><LockKeyhole /></div>
            <h3>A deliberate server boundary</h3>
            <p>The browser knows your product contract, never your provider credential. Route Handlers validate and translate the request.</p>
            <code>browser → /api/* → OpenAI</code>
          </article>
          <article className="principle-card">
            <span className="principle-card__number">02</span>
            <div className="principle-card__icon"><ShieldCheck /></div>
            <h3>Guardrails that users can see</h3>
            <p>Size limits, allowlists, AI-voice disclosure, same-origin checks, and actionable errors are part of the experience.</p>
          </article>
          <article className="principle-card">
            <span className="principle-card__number">03</span>
            <div className="principle-card__icon"><RadioTower /></div>
            <h3>Streaming with a reason</h3>
            <p>TTS streams bytes to reduce buffering. Bounded transcription stays request/response; live captions belong on Realtime.</p>
          </article>
          <article className="principle-card">
            <span className="principle-card__number">04</span>
            <div className="principle-card__icon"><TestTube2 /></div>
            <h3>A repeatable delivery loop</h3>
            <p>Strict TypeScript, focused unit tests, CI gates, request IDs, and an AGENTS.md make change safer for humans and Codex.</p>
          </article>
        </div>
      </section>

      <section className="learn-cta">
        <div>
          <span className="section-kicker">Build it, don’t just clone it</span>
          <h2>Follow every decision from empty folder to deployment.</h2>
          <p>The tutorial documents the incremental slices, validation gates, trade-offs, and the prompts used to collaborate with Codex.</p>
        </div>
        <a className="button button--primary button--large" href={`${REPOSITORY_URL}/blob/main/tutorial/tutorial.md`} target="_blank" rel="noreferrer">
          <BookOpenText aria-hidden="true" /> Read tutorial/tutorial.md
        </a>
      </section>

      <footer className="site-footer">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true"><Waves /></span>
          <span className="brand__copy"><strong>Voice Playground</strong><small>Built to be read, run, and questioned.</small></span>
        </div>
        <p>Created by <a href="https://github.com/glaucia86" target="_blank" rel="noreferrer">Glaucia Lemos</a> · MIT licensed · Not an official OpenAI product.</p>
        <div className="footer-links">
          <a href={REPOSITORY_URL} target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://developers.openai.com/api/docs/guides/audio" target="_blank" rel="noreferrer">OpenAI audio docs</a>
        </div>
      </footer>
    </main>
  );
}
