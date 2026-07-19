import {
  ArrowDown,
  ArrowUpRight,
  BookOpenText,
  BrainCircuit,
  Code2,
  LockKeyhole,
  Mic,
  Radio,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Waves,
} from "lucide-react";

import { VoicePlayground } from "@/components/voice-playground";
import { Waveform } from "@/components/waveform";

const REPOSITORY_URL = "https://github.com/glaucia86/openai-voice-playground";
const LAB_URL = `${REPOSITORY_URL}/tree/main/labs/lab-02-realtime-voice-agent`;
const TUTORIAL_URL = `${REPOSITORY_URL}/blob/main/labs/lab-02-realtime-voice-agent/tutorial/tutorial.md`;

export default function HomePage() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="OpenAI Voice Playground home">
          <span className="brand__mark" aria-hidden="true"><Waves /></span>
          <span className="brand__copy"><strong>Voice Playground</strong><small>Lab 02 · Realtime</small></span>
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#playground">Live agent</a>
          <a href="#principles">Architecture</a>
          <a href={TUTORIAL_URL} target="_blank" rel="noreferrer">Lab 02 guide</a>
        </nav>
        <a className="github-button" href={LAB_URL} target="_blank" rel="noreferrer">
          <Code2 aria-hidden="true" /> <span>View lab</span> <ArrowUpRight aria-hidden="true" />
        </a>
      </header>

      <div id="top" className="hero-wrap">
        <section className="hero">
          <div className="hero__copy">
            <div className="hero-badge"><span className="hero-badge__pulse" /> Live speech-to-speech with WebRTC</div>
            <h1>Have a conversation, <em>not a sequence of clips.</em></h1>
            <p className="hero__lede">
              A production-minded lab for building a fluid voice agent with the OpenAI Agents SDK, <code>gpt-realtime-2.1</code>, semantic turn detection, natural interruption, and protected credentials.
            </p>
            <div className="hero__actions">
              <a className="button button--primary button--large" href="#playground"><Mic aria-hidden="true" /> Start a live session</a>
              <a className="button button--ghost button--large" href={TUTORIAL_URL} target="_blank" rel="noreferrer"><BookOpenText aria-hidden="true" /> Follow Lab 02</a>
            </div>
            <dl className="hero__facts">
              <div><dt>WebRTC</dt><dd>low-latency media</dd></div>
              <div><dt>60s</dt><dd>client-secret TTL</dd></div>
              <div><dt>0</dt><dd>standard keys in browser</dd></div>
            </dl>
          </div>

          <div className="hero-visual hero-visual--realtime" aria-label="Abstract live voice session visualization">
            <div className="hero-visual__glow" />
            <div className="signal-card signal-card--input">
              <span className="signal-card__icon"><Mic /></span>
              <span><small>Input</small><strong>Live microphone</strong></span>
              <i>01</i>
            </div>
            <div className="sound-orb sound-orb--live">
              <span className="sound-orb__ring sound-orb__ring--one" />
              <span className="sound-orb__ring sound-orb__ring--two" />
              <span className="sound-orb__core"><Radio /></span>
            </div>
            <div className="visual-wave"><Waveform active label="Animated bidirectional voice signal" /></div>
            <div className="signal-card signal-card--output">
              <span className="signal-card__icon signal-card__icon--green"><Waves /></span>
              <span><small>Output</small><strong>Conversational audio</strong></span>
              <i>02</i>
            </div>
            <div className="visual-note"><LockKeyhole /> EPHEMERAL SECRET · WEBRTC · SEMANTIC VAD</div>
          </div>
        </section>
        <a className="scroll-cue" href="#playground"><span>Open the live lab</span><ArrowDown aria-hidden="true" /></a>
      </div>

      <VoicePlayground />

      <section className="principles" id="principles" aria-labelledby="principles-title">
        <div className="principles__heading">
          <span className="section-kicker">The architecture changed for a reason</span>
          <h2 id="principles-title">Realtime is a session, not a faster REST call.</h2>
          <p>Low-latency conversation adds identity, media permissions, turn state, interruption, reconnection, cost, and privacy decisions.</p>
        </div>
        <div className="principles-grid">
          <article className="principle-card principle-card--featured">
            <span className="principle-card__number">01</span>
            <div className="principle-card__icon"><LockKeyhole /></div>
            <h3>Ephemeral browser access</h3>
            <p>A Route Handler uses the standard server key to mint a 60-second client secret. The standard credential never enters JavaScript sent to the browser.</p>
            <code>browser → /api/realtime/token → ek_…</code>
          </article>
          <article className="principle-card">
            <span className="principle-card__number">02</span>
            <div className="principle-card__icon"><Radio /></div>
            <h3>WebRTC for live media</h3>
            <p>The browser negotiates a low-latency media path with the Realtime API. Your app server stays on the authorization path, not in every audio packet.</p>
          </article>
          <article className="principle-card">
            <span className="principle-card__number">03</span>
            <div className="principle-card__icon"><BrainCircuit /></div>
            <h3>Semantic turn detection</h3>
            <p>The session estimates whether a thought is complete instead of treating every short pause as the end. Barge-in can interrupt an active response.</p>
          </article>
          <article className="principle-card">
            <span className="principle-card__number">04</span>
            <div className="principle-card__icon"><ShieldCheck /></div>
            <h3>Data minimization by default</h3>
            <p>Audio is not copied into client history, tracing is disabled in this tutorial, content is absent from application logs, and transcripts live in memory only.</p>
          </article>
        </div>
      </section>

      <section className="architecture-callout" aria-labelledby="architecture-callout-title">
        <div className="architecture-callout__icon"><TimerReset aria-hidden="true" /></div>
        <div>
          <span className="section-kicker">Know the production boundary</span>
          <h2 id="architecture-callout-title">A polished session is still not your entire production system.</h2>
          <p>The tutorial explains distributed quotas, real authentication, abuse controls, consent, reconnect strategy, session limits, observability without content, and controlled tool access.</p>
        </div>
        <a className="button button--primary button--large" href={TUTORIAL_URL} target="_blank" rel="noreferrer">
          <Sparkles aria-hidden="true" /> Read the engineering guide
        </a>
      </section>

      <footer className="site-footer">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true"><Waves /></span>
          <span className="brand__copy"><strong>Voice Playground</strong><small>Built to be read, run, and questioned.</small></span>
        </div>
        <p>Created by <a href="https://github.com/glaucia86" target="_blank" rel="noreferrer">Glaucia Lemos</a> · MIT licensed · AI-generated voice · Not an official OpenAI product.</p>
        <div className="footer-links">
          <a href={LAB_URL} target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://developers.openai.com/api/docs/guides/realtime" target="_blank" rel="noreferrer">Realtime docs</a>
        </div>
      </footer>
    </main>
  );
}
