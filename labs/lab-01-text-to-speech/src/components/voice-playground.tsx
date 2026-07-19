"use client";

import {
  BookOpen,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Server,
  ShieldCheck,
  Volume2,
} from "lucide-react";
import { useEffect, useState } from "react";

import { SpeechStudio } from "@/components/speech-studio";
import { StatusMessage } from "@/components/status-message";

type HealthState = {
  configured: boolean;
  requiresAccessToken: boolean;
};

export function VoicePlayground() {
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
          <h2 id="playground-heading">Turn text into expressive speech</h2>
          <p>Control voice, delivery, speed, and format while every request crosses a typed, validated server boundary.</p>
        </div>
        <div className="architecture-strip" aria-label="Request architecture">
          <span><Volume2 aria-hidden="true" /> Browser</span>
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
        <div className="tab-list">
          <div className="tab tab--active">
            <Volume2 aria-hidden="true" />
            <span><strong>Text to speech</strong><small>Make text sound alive</small></span>
          </div>
          <a className="tutorial-link" href="https://github.com/glaucia86/openai-voice-playground/blob/main/labs/lab-01-text-to-speech/tutorial/tutorial.md" target="_blank" rel="noreferrer">
            <BookOpen aria-hidden="true" /> Follow Lab 01
          </a>
        </div>

        <SpeechStudio accessToken={accessToken} disabled={isDisabled} />
      </div>
    </section>
  );
}
