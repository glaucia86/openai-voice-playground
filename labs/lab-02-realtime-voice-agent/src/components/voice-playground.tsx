"use client";

import {
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Radio,
  Server,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

import { RealtimeVoiceAgent } from "@/components/realtime-voice-agent";
import { StatusMessage } from "@/components/status-message";

type HealthState = {
  configured: boolean;
  configurationIssues: string[];
  distributedRateLimit: boolean;
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
          <span className="section-kicker">Lab 02 · interactive workshop</span>
          <h2 id="playground-heading">Talk, interrupt, continue.</h2>
          <p>A speech-to-speech agent with semantic turn detection. Your server protects the API key; WebRTC carries the live media.</p>
        </div>
        <div className="architecture-strip" aria-label="Realtime connection architecture">
          <span><Server aria-hidden="true" /> Token route</span>
          <i aria-hidden="true">→</i>
          <span><ShieldCheck aria-hidden="true" /> Ephemeral secret</span>
          <i aria-hidden="true">→</i>
          <span><Radio aria-hidden="true" /> WebRTC</span>
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
        <StatusMessage tone="error">Server configuration is incomplete. Add these environment variables: {health.configurationIssues.join(", ")}.</StatusMessage>
      ) : null}
      {health?.configured ? (
        <div className="configuration-banner">
          <span><LockKeyhole aria-hidden="true" /> Standard key stays server-side</span>
          <span><ShieldCheck aria-hidden="true" /> Client secret expires in 60s</span>
          <span><ShieldCheck aria-hidden="true" /> {health.distributedRateLimit ? "Distributed quota" : "Local development quota"}</span>
          <span><Radio aria-hidden="true" /> Media uses WebRTC</span>
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

      <div className="playground-card playground-card--realtime">
        <RealtimeVoiceAgent accessToken={accessToken} disabled={isDisabled} />
      </div>
    </section>
  );
}
