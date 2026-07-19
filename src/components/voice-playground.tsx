"use client";

import {
  BookOpen,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Mic2,
  Server,
  ShieldCheck,
  Volume2,
} from "lucide-react";
import { useEffect, useState } from "react";

import { SpeechStudio } from "@/components/speech-studio";
import { StatusMessage } from "@/components/status-message";
import { TranscriptionStudio } from "@/components/transcription-studio";

type Tab = "speech" | "transcription";

type HealthState = {
  configured: boolean;
  requiresAccessToken: boolean;
};

export function VoicePlayground() {
  const [activeTab, setActiveTab] = useState<Tab>("speech");
  const [health, setHealth] = useState<HealthState>();
  const [healthError, setHealthError] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    void fetch("/api/health", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Health check failed");
        return (await response.json()) as HealthState;
      })
      .then(setHealth)
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) setHealthError(true);
      });

    return () => controller.abort();
  }, []);

  const isLoading = !health && !healthError;
  const needsToken = Boolean(health?.requiresAccessToken);
  const isDisabled =
    isLoading || healthError || !health?.configured || (needsToken && !accessToken.trim());

  return (
    <section className="playground-shell" id="playground" aria-labelledby="playground-heading">
      <div className="playground-intro">
        <div>
          <span className="section-kicker">Interactive lab</span>
          <h2 id="playground-heading">Explore both sides of voice</h2>
          <p>Generate expressive speech or turn a bounded recording into text. Every request crosses a typed, validated server boundary.</p>
        </div>
        <div className="architecture-strip" aria-label="Request architecture">
          <span><Mic2 aria-hidden="true" /> Browser</span>
          <i aria-hidden="true">→</i>
          <span><Server aria-hidden="true" /> Next route</span>
          <i aria-hidden="true">→</i>
          <span><ShieldCheck aria-hidden="true" /> OpenAI</span>
        </div>
      </div>

      {isLoading ? (
        <div className="configuration-banner configuration-banner--loading" role="status">
          <LoaderCircle className="spin" aria-hidden="true" /> Checking server configuration…
        </div>
      ) : null}
      {healthError ? (
        <StatusMessage tone="error">The app could not verify its server configuration. Refresh the page or inspect the health route.</StatusMessage>
      ) : null}
      {health && !health.configured ? (
        <StatusMessage tone="error">OPENAI_API_KEY is missing on the server. Add it to .env.local or your deployment environment.</StatusMessage>
      ) : null}
      {health?.configured ? (
        <div className="configuration-banner">
          <span><LockKeyhole aria-hidden="true" /> Server key isolated</span>
          <span><ShieldCheck aria-hidden="true" /> Inputs validated</span>
          <span><Volume2 aria-hidden="true" /> Voice disclosed as AI</span>
        </div>
      ) : null}

      {needsToken ? (
        <div className="access-gate">
          <div className="access-gate__icon"><KeyRound aria-hidden="true" /></div>
          <div>
            <strong>This deployment is access-protected</strong>
            <p>Enter the shared playground token. It stays in memory and is never written to browser storage.</p>
          </div>
          <label>
            <span className="visually-hidden">Playground access token</span>
            <input
              type="password"
              value={accessToken}
              onChange={(event) => setAccessToken(event.target.value)}
              placeholder="Access token"
              autoComplete="off"
            />
          </label>
        </div>
      ) : null}

      <div className="playground-card">
        <div className="tab-list" role="tablist" aria-label="Voice playground mode">
          <button
            id="speech-tab"
            className={activeTab === "speech" ? "tab tab--active" : "tab"}
            type="button"
            role="tab"
            aria-selected={activeTab === "speech"}
            aria-controls="speech-panel"
            onClick={() => setActiveTab("speech")}
          >
            <Volume2 aria-hidden="true" />
            <span><strong>Text to speech</strong><small>Make text sound alive</small></span>
          </button>
          <button
            id="transcription-tab"
            className={activeTab === "transcription" ? "tab tab--active" : "tab"}
            type="button"
            role="tab"
            aria-selected={activeTab === "transcription"}
            aria-controls="transcription-panel"
            onClick={() => setActiveTab("transcription")}
          >
            <Mic2 aria-hidden="true" />
            <span><strong>Speech to text</strong><small>Extract a useful transcript</small></span>
          </button>
          <a className="tutorial-link" href="https://github.com/glaucia86/openai-voice-playground/blob/main/tutorial/tutorial.md" target="_blank" rel="noreferrer">
            <BookOpen aria-hidden="true" /> Read the build guide
          </a>
        </div>

        <div id="speech-panel" role="tabpanel" aria-labelledby="speech-tab" hidden={activeTab !== "speech"}>
          {activeTab === "speech" ? <SpeechStudio accessToken={accessToken} disabled={isDisabled} /> : null}
        </div>
        <div id="transcription-panel" role="tabpanel" aria-labelledby="transcription-tab" hidden={activeTab !== "transcription"}>
          {activeTab === "transcription" ? <TranscriptionStudio accessToken={accessToken} disabled={isDisabled} /> : null}
        </div>
      </div>
    </section>
  );
}
