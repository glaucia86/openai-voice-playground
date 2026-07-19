"use client";

import {
  RealtimeAgent,
  RealtimeSession,
  type RealtimeItem,
  type TransportEvent,
} from "@openai/agents/realtime";
import {
  Bot,
  CircleStop,
  Clock3,
  Headphones,
  LoaderCircle,
  MessageSquareText,
  Mic,
  MicOff,
  PhoneOff,
  Radio,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  Volume2,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { StatusMessage } from "@/components/status-message";
import {
  CONVERSATION_LANGUAGES,
  MAX_CONVERSATION_GOAL_CHARACTERS,
  MICROPHONE_PROFILES,
  REALTIME_MODEL,
  REALTIME_SESSION_LIMIT_SECONDS,
  REALTIME_VOICES,
  type ConversationLanguageId,
  type MicrophoneProfileId,
  type RealtimeVoiceId,
} from "@/lib/constants";
import { authorizationHeaders, readApiError, type ClientApiError } from "@/lib/client-api";
import { buildAgentInstructions } from "@/lib/realtime-config";
import { getElapsedSessionSeconds, hasReachedSessionLimit } from "@/lib/session-lifetime";

type RealtimeVoiceAgentProps = {
  accessToken: string;
  disabled: boolean;
};

type ConnectionState = "idle" | "authorizing" | "connecting" | "connected" | "error";
type ActivityState = "ready" | "listening" | "hearing" | "thinking" | "speaking";

type TranscriptEntry = {
  id: string;
  role: "user" | "assistant";
  text: string;
  pending: boolean;
};

type ClientSecretResponse = {
  clientSecret: string;
  expiresAt: number;
  session: {
    model: string;
    voice: string;
    transport: "webrtc";
  };
};

const SESSION_LIMIT_MINUTES = REALTIME_SESSION_LIMIT_SECONDS / 60;

export function RealtimeVoiceAgent({ accessToken, disabled }: RealtimeVoiceAgentProps) {
  const [voice, setVoice] = useState<RealtimeVoiceId>("marin");
  const [language, setLanguage] = useState<ConversationLanguageId>("pt");
  const [microphoneProfile, setMicrophoneProfile] =
    useState<MicrophoneProfileId>("near_field");
  const [goal, setGoal] = useState("");
  const [consent, setConsent] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>("idle");
  const [activity, setActivity] = useState<ActivityState>("ready");
  const [muted, setMuted] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [textMessage, setTextMessage] = useState("");
  const [error, setError] = useState<ClientApiError>();
  const [startedAt, setStartedAt] = useState<number>();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const sessionRef = useRef<RealtimeSession | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const attemptRef = useRef(0);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  const isBusy = connectionState === "authorizing" || connectionState === "connecting";
  const isConnected = connectionState === "connected";
  const settingsLocked = isBusy || isConnected;
  const selectedVoice = useMemo(
    () => REALTIME_VOICES.find((candidate) => candidate.id === voice),
    [voice],
  );

  const endSession = useCallback((nextState: ConnectionState = "idle") => {
    attemptRef.current += 1;
    requestRef.current?.abort();
    requestRef.current = null;
    sessionRef.current?.close();
    sessionRef.current = null;
    setConnectionState(nextState);
    setActivity("ready");
    setMuted(false);
    setStartedAt(undefined);
  }, []);

  useEffect(() => {
    return () => {
      attemptRef.current += 1;
      requestRef.current?.abort();
      sessionRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!startedAt) {
      setElapsedSeconds(0);
      return;
    }

    const tick = () => {
      const elapsed = getElapsedSessionSeconds(startedAt);
      setElapsedSeconds(elapsed);
      if (hasReachedSessionLimit(elapsed)) {
        endSession();
        setError({
          code: "session_limit_reached",
          message: `The ${SESSION_LIMIT_MINUTES}-minute workshop session limit was reached. Start a new session to continue.`,
        });
      }
    };
    tick();
    const timer = window.setInterval(tick, 1_000);
    return () => window.clearInterval(timer);
  }, [endSession, startedAt]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [transcript]);

  async function startSession() {
    if (disabled || !consent || isBusy || isConnected) return;

    if (!navigator.mediaDevices?.getUserMedia || !("RTCPeerConnection" in window)) {
      setError({
        code: "browser_not_supported",
        message: "This browser does not provide the WebRTC and microphone APIs required by the live agent.",
      });
      setConnectionState("error");
      return;
    }

    const attempt = attemptRef.current + 1;
    attemptRef.current = attempt;
    const controller = new AbortController();
    requestRef.current = controller;
    setError(undefined);
    setTranscript([]);
    setConnectionState("authorizing");
    setActivity("ready");

    try {
      const response = await fetch("/api/realtime/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authorizationHeaders(accessToken),
        },
        body: JSON.stringify({
          voice,
          language,
          microphoneProfile,
          goal,
        }),
        cache: "no-store",
        signal: controller.signal,
      });

      if (!response.ok) throw await readApiError(response);
      const token = (await response.json()) as ClientSecretResponse;
      if (!token.clientSecret || token.session.model !== REALTIME_MODEL) {
        throw new Error("The server returned an invalid Realtime session contract.");
      }

      if (attempt !== attemptRef.current) return;
      setConnectionState("connecting");

      const agent = new RealtimeAgent({
        name: "OpenAI Voice Playground guide",
        instructions: buildAgentInstructions({ goal, language }),
      });
      const session = new RealtimeSession(agent, {
        model: REALTIME_MODEL,
        historyStoreAudio: false,
        tracingDisabled: true,
        config: {
          outputModalities: ["audio"],
          audio: {
            input: {
              noiseReduction: { type: microphoneProfile },
              transcription: { model: "gpt-4o-mini-transcribe", language },
              turnDetection: {
                type: "semantic_vad",
                eagerness: "auto",
                createResponse: true,
                interruptResponse: true,
              },
            },
            output: { voice },
          },
          reasoning: { effort: "low" },
          tracing: null,
        },
      });

      sessionRef.current = session;
      registerSessionEvents(session);
      await session.connect({ apiKey: token.clientSecret, model: REALTIME_MODEL });

      if (attempt !== attemptRef.current) {
        session.close();
        return;
      }

      requestRef.current = null;
      setConnectionState("connected");
      setActivity("listening");
      setStartedAt(Date.now());
    } catch (caught) {
      if (controller.signal.aborted) return;
      endSession("error");
      setError(normalizeClientError(caught));
    }
  }

  function registerSessionEvents(session: RealtimeSession) {
    session.on("history_updated", (history) => setTranscript(historyToTranscript(history)));
    session.on("agent_start", () => setActivity("thinking"));
    session.on("audio_start", () => setActivity("speaking"));
    session.on("audio_stopped", () => setActivity("listening"));
    session.on("audio_interrupted", () => setActivity("listening"));
    session.on("transport_event", (event) => updateActivityFromTransport(event));
    session.on("error", ({ error: sessionError }) => {
      endSession("error");
      setError(normalizeClientError(sessionError));
    });
  }

  function updateActivityFromTransport(event: TransportEvent) {
    if (event.type === "input_audio_buffer.speech_started") setActivity("hearing");
    if (event.type === "input_audio_buffer.speech_stopped") setActivity("thinking");
  }

  function toggleMute() {
    const session = sessionRef.current;
    if (!session) return;
    const nextMuted = !muted;
    session.mute(nextMuted);
    setMuted(nextMuted);
  }

  function interruptAgent() {
    sessionRef.current?.interrupt();
    setActivity(muted ? "ready" : "listening");
  }

  function sendTextMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = textMessage.trim();
    if (!message || !sessionRef.current) return;
    sessionRef.current.sendMessage(message);
    setTextMessage("");
    setActivity("thinking");
  }

  const statusLabel = getStatusLabel(connectionState, activity, muted);

  return (
    <div className="realtime-layout">
      <aside className="agent-settings" aria-labelledby="agent-settings-title">
        <div className="agent-settings__heading">
          <div>
            <span className="eyebrow"><Sparkles aria-hidden="true" /> Session design</span>
            <h3 id="agent-settings-title">Configure before connecting</h3>
          </div>
          <span className="model-chip"><span /> {REALTIME_MODEL}</span>
        </div>

        <label className="select-label" htmlFor="realtime-voice">Voice</label>
        <div className="select-wrap">
          <select
            id="realtime-voice"
            value={voice}
            disabled={settingsLocked}
            onChange={(event) => setVoice(event.target.value as RealtimeVoiceId)}
          >
            {REALTIME_VOICES.map((option) => (
              <option key={option.id} value={option.id}>{option.label} · {option.character}</option>
            ))}
          </select>
        </div>
        <p className="selection-note"><strong>{selectedVoice?.label}</strong> is fixed after the first audio response.</p>

        <div className="control-grid">
          <div>
            <label className="select-label" htmlFor="conversation-language">Language</label>
            <div className="select-wrap">
              <select
                id="conversation-language"
                value={language}
                disabled={settingsLocked}
                onChange={(event) => setLanguage(event.target.value as ConversationLanguageId)}
              >
                {CONVERSATION_LANGUAGES.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="select-label" htmlFor="microphone-profile">Microphone</label>
            <div className="select-wrap">
              <select
                id="microphone-profile"
                value={microphoneProfile}
                disabled={settingsLocked}
                onChange={(event) => setMicrophoneProfile(event.target.value as MicrophoneProfileId)}
              >
                {MICROPHONE_PROFILES.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="field-label-row agent-goal-label">
          <label htmlFor="conversation-goal">Conversation goal <span>(optional)</span></label>
          <span className={goal.length > 540 ? "counter counter--warning" : "counter"}>
            {goal.length}/{MAX_CONVERSATION_GOAL_CHARACTERS}
          </span>
        </div>
        <textarea
          id="conversation-goal"
          className="text-area text-area--small"
          value={goal}
          maxLength={MAX_CONVERSATION_GOAL_CHARACTERS}
          disabled={settingsLocked}
          onChange={(event) => setGoal(event.target.value)}
          placeholder="Example: Help me rehearse a system design interview."
        />

        <label className="consent-check">
          <input
            type="checkbox"
            checked={consent}
            disabled={settingsLocked}
            onChange={(event) => setConsent(event.target.checked)}
          />
          <span>
            <strong>I understand the live audio flow</strong>
            My microphone audio is streamed to OpenAI. This application does not write its copy of audio or transcripts to a database; provider data handling is a separate boundary.
          </span>
        </label>

        {!isConnected && !isBusy ? (
          <button
            className="button button--primary button--large button--full"
            type="button"
            disabled={disabled || !consent}
            onClick={() => void startSession()}
          >
            <Mic aria-hidden="true" /> Start live conversation
          </button>
        ) : null}
        {isBusy ? (
          <button className="button button--secondary button--large button--full" type="button" onClick={() => endSession()}>
            <LoaderCircle className="spin" aria-hidden="true" /> Cancel connection
          </button>
        ) : null}

        <div className="privacy-note">
          <ShieldCheck aria-hidden="true" />
          <p><strong>Credential boundary</strong>The browser receives a short-lived client secret, never `OPENAI_API_KEY`.</p>
        </div>
      </aside>

      <section className="agent-console" aria-labelledby="agent-console-title">
        <div className="agent-console__topbar">
          <div>
            <span className={`live-dot${isConnected ? " live-dot--active" : ""}`} />
            <span id="agent-console-title">Live session</span>
          </div>
          <div className="session-meta">
            <span title={`Workshop sessions end after ${SESSION_LIMIT_MINUTES} minutes`}><Clock3 aria-hidden="true" /> {formatDuration(elapsedSeconds)} / {formatDuration(REALTIME_SESSION_LIMIT_SECONDS)}</span>
            <span><Radio aria-hidden="true" /> WebRTC</span>
          </div>
        </div>

        <div className={`conversation-orb conversation-orb--${activity}${isConnected ? " conversation-orb--connected" : ""}`} aria-hidden="true">
          <span className="conversation-orb__ring conversation-orb__ring--outer" />
          <span className="conversation-orb__ring conversation-orb__ring--inner" />
          <span className="conversation-orb__core">{activity === "speaking" ? <Volume2 /> : <Mic />}</span>
        </div>
        <div className="activity-status" aria-live="polite">
          <strong>{statusLabel}</strong>
          <span>{getStatusHint(connectionState, activity, muted)}</span>
        </div>

        {error ? (
          <StatusMessage tone="error" {...(error.requestId ? { requestId: error.requestId } : {})}>
            {error.message}
          </StatusMessage>
        ) : null}

        <div className="transcript" aria-label="Live conversation transcript" aria-live="polite">
          {transcript.length === 0 ? (
            <div className="transcript-placeholder">
              <MessageSquareText aria-hidden="true" />
              <strong>{isConnected ? "The microphone is live" : "Your conversation will appear here"}</strong>
              <p>{isConnected ? "Start speaking naturally. Semantic turn detection decides when you have finished." : "Configure the session, acknowledge the audio flow, and connect."}</p>
            </div>
          ) : (
            transcript.map((entry) => (
              <article className={`transcript-entry transcript-entry--${entry.role}`} key={entry.id}>
                <span className="transcript-entry__avatar" aria-hidden="true">
                  {entry.role === "user" ? <UserRound /> : <Bot />}
                </span>
                <div>
                  <span>{entry.role === "user" ? "You" : "Voice agent"}{entry.pending ? " · responding" : ""}</span>
                  <p>{entry.text}</p>
                </div>
              </article>
            ))
          )}
          <div ref={transcriptEndRef} />
        </div>

        {isConnected ? (
          <div className="session-controls">
            <div className="session-controls__buttons">
              <button className="round-control" type="button" onClick={toggleMute} aria-pressed={muted}>
                {muted ? <MicOff aria-hidden="true" /> : <Mic aria-hidden="true" />}
                <span>{muted ? "Unmute" : "Mute"}</span>
              </button>
              <button className="round-control" type="button" onClick={interruptAgent} disabled={activity !== "speaking" && activity !== "thinking"}>
                <CircleStop aria-hidden="true" />
                <span>Interrupt</span>
              </button>
              <button className="round-control round-control--danger" type="button" onClick={() => endSession()}>
                <PhoneOff aria-hidden="true" />
                <span>End</span>
              </button>
            </div>
            <form className="text-fallback" onSubmit={sendTextMessage}>
              <label className="visually-hidden" htmlFor="text-fallback-message">Send a text message to the live agent</label>
              <input
                id="text-fallback-message"
                value={textMessage}
                maxLength={1_000}
                onChange={(event) => setTextMessage(event.target.value)}
                placeholder="Type instead of speaking…"
              />
              <button type="submit" disabled={!textMessage.trim()} aria-label="Send text message"><Send aria-hidden="true" /></button>
            </form>
          </div>
        ) : (
          <div className="console-boundaries">
            <span><Headphones aria-hidden="true" /> Headphones reduce echo</span>
            <span><ShieldCheck aria-hidden="true" /> AI voice disclosed</span>
          </div>
        )}
      </section>
    </div>
  );
}

function historyToTranscript(history: RealtimeItem[]): TranscriptEntry[] {
  return history.flatMap((item) => {
    if (item.type !== "message" || (item.role !== "user" && item.role !== "assistant")) return [];

    const text = item.content
      .map((content) => {
        if (content.type === "input_text" || content.type === "output_text") return content.text;
        if (content.type === "input_audio" || content.type === "output_audio") return content.transcript ?? "";
        return "";
      })
      .join(" ")
      .trim();

    if (!text) return [];
    return [{
      id: item.itemId,
      role: item.role,
      text,
      pending: item.status === "in_progress",
    }];
  });
}

function normalizeClientError(error: unknown): ClientApiError {
  if (isClientApiError(error)) return error;

  if (error instanceof DOMException && error.name === "NotAllowedError") {
    return {
      code: "microphone_permission_denied",
      message: "Microphone permission was denied. Allow access in your browser settings and try again.",
    };
  }

  if (error instanceof Error) {
    if (/microphone|permission|notallowed/i.test(error.message)) {
      return {
        code: "microphone_unavailable",
        message: "The microphone could not be opened. Check browser permission and whether another app is using it.",
      };
    }
    if (/network|webrtc|connection|fetch/i.test(error.message)) {
      return {
        code: "realtime_connection_failed",
        message: "The live connection could not be established. Check your network and try again.",
      };
    }
  }

  return {
    code: "realtime_session_failed",
    message: "The live voice session ended unexpectedly. Start a new session to continue.",
  };
}

function isClientApiError(error: unknown): error is ClientApiError {
  return Boolean(
    error &&
      typeof error === "object" &&
      "message" in error &&
      typeof error.message === "string",
  );
}

function getStatusLabel(
  connection: ConnectionState,
  activity: ActivityState,
  muted: boolean,
): string {
  if (connection === "authorizing") return "Creating protected access…";
  if (connection === "connecting") return "Connecting microphone…";
  if (connection === "error") return "Session disconnected";
  if (connection !== "connected") return "Ready when you are";
  if (muted) return "Microphone muted";
  if (activity === "hearing") return "I’m listening";
  if (activity === "thinking") return "Thinking…";
  if (activity === "speaking") return "Agent is speaking";
  return "Listening for your voice";
}

function getStatusHint(
  connection: ConnectionState,
  activity: ActivityState,
  muted: boolean,
): string {
  if (connection === "authorizing") return "The server is minting a 60-second client secret.";
  if (connection === "connecting") return "Your browser is negotiating a direct WebRTC media path.";
  if (connection === "error") return "Review the error below, then reconnect.";
  if (connection !== "connected") return "No microphone access is requested before you press Start.";
  if (muted) return "Unmute when you want the agent to hear you.";
  if (activity === "speaking") return "Speak at any time to interrupt naturally, or use the interrupt button.";
  if (activity === "thinking") return "Your turn ended; the response is being prepared.";
  return "Speak naturally—semantic VAD handles turn boundaries.";
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remaining = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remaining}`;
}
