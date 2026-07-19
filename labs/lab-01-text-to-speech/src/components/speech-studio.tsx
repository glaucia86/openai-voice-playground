"use client";

import {
  CircleStop,
  Download,
  Gauge,
  LoaderCircle,
  Play,
  Radio,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { StatusMessage } from "@/components/status-message";
import { Waveform } from "@/components/waveform";
import {
  AUDIO_FORMATS,
  MAX_INSTRUCTIONS_CHARACTERS,
  MAX_SPEECH_CHARACTERS,
  VOICES,
  type AudioFormat,
  type VoiceId,
} from "@/lib/constants";
import {
  authorizationHeaders,
  formatBytes,
  readApiError,
  type ClientApiError,
} from "@/lib/client-api";

type SpeechStudioProps = {
  accessToken: string;
  disabled: boolean;
};

const DEFAULT_TEXT =
  "Software de qualidade não nasce apenas do código. Ele nasce das decisões que conseguimos explicar, testar e evoluir em equipe.";

export function SpeechStudio({ accessToken, disabled }: SpeechStudioProps) {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [instructions, setInstructions] = useState(
    "Fale em português do Brasil, com um tom confiante, acolhedor e didático.",
  );
  const [voice, setVoice] = useState<VoiceId>("marin");
  const [format, setFormat] = useState<AudioFormat>("mp3");
  const [speed, setSpeed] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [receivedBytes, setReceivedBytes] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string>();
  const [error, setError] = useState<ClientApiError>();
  const [requestId, setRequestId] = useState<string>();
  const abortControllerRef = useRef<AbortController | undefined>(undefined);
  const currentObjectUrlRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (currentObjectUrlRef.current) URL.revokeObjectURL(currentObjectUrlRef.current);
    };
  }, []);

  async function generateSpeech() {
    if (!text.trim() || isGenerating || disabled) return;

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsGenerating(true);
    setReceivedBytes(0);
    setError(undefined);
    setRequestId(undefined);

    try {
      const response = await fetch("/api/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authorizationHeaders(accessToken),
        },
        body: JSON.stringify({ text, instructions, voice, format, speed }),
        signal: controller.signal,
      });

      if (!response.ok) throw await readApiError(response);
      if (!response.body) throw { message: "The browser did not receive an audio stream." };

      setRequestId(response.headers.get("x-request-id") || undefined);
      const reader = response.body.getReader();
      const chunks: ArrayBuffer[] = [];
      let totalBytes = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const copy = new Uint8Array(value.byteLength);
        copy.set(value);
        chunks.push(copy.buffer);
        totalBytes += value.byteLength;
        setReceivedBytes(totalBytes);
      }

      const blob = new Blob(chunks, {
        type: response.headers.get("content-type") || "audio/mpeg",
      });
      const nextUrl = URL.createObjectURL(blob);

      if (currentObjectUrlRef.current) URL.revokeObjectURL(currentObjectUrlRef.current);
      currentObjectUrlRef.current = nextUrl;
      setAudioUrl(nextUrl);
    } catch (caught) {
      if (controller.signal.aborted) return;
      const apiError = caught as ClientApiError;
      setError({
        message: apiError.message || "The audio could not be generated.",
        ...(apiError.code ? { code: apiError.code } : {}),
        ...(apiError.requestId ? { requestId: apiError.requestId } : {}),
      });
    } finally {
      if (abortControllerRef.current === controller) {
        setIsGenerating(false);
        abortControllerRef.current = undefined;
      }
    }
  }

  function cancelGeneration() {
    abortControllerRef.current?.abort();
    setIsGenerating(false);
    setReceivedBytes(0);
  }

  const selectedVoice = VOICES.find((option) => option.id === voice) ?? VOICES[0];

  return (
    <div className="studio-layout">
      <section className="studio-main" aria-labelledby="speech-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow"><Sparkles size={14} /> Speech generation</span>
            <h2 id="speech-title">Give your words a voice</h2>
          </div>
          <span className="model-chip"><span /> gpt-4o-mini-tts</span>
        </div>

        <div className="field-group">
          <div className="field-label-row">
            <label htmlFor="speech-text">Text to speak</label>
            <span className={text.length > MAX_SPEECH_CHARACTERS * 0.9 ? "counter counter--warning" : "counter"}>
              {text.length.toLocaleString()} / {MAX_SPEECH_CHARACTERS.toLocaleString()}
            </span>
          </div>
          <textarea
            id="speech-text"
            className="text-area text-area--hero"
            value={text}
            onChange={(event) => setText(event.target.value)}
            maxLength={MAX_SPEECH_CHARACTERS}
            rows={7}
            placeholder="Write something worth hearing…"
            disabled={disabled || isGenerating}
          />
        </div>

        <div className="field-group">
          <div className="field-label-row">
            <label htmlFor="voice-instructions">Voice direction</label>
            <span className="field-hint">Optional prompt</span>
          </div>
          <textarea
            id="voice-instructions"
            className="text-area"
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            maxLength={MAX_INSTRUCTIONS_CHARACTERS}
            rows={3}
            placeholder="Describe tone, rhythm, accent, emotion, or delivery…"
            disabled={disabled || isGenerating}
          />
          <p className="helper-text">Describe delivery, not identity. Avoid asking the model to impersonate a real person.</p>
        </div>

        {error ? (
          <StatusMessage tone="error" requestId={error.requestId}>{error.message}</StatusMessage>
        ) : null}

        <div className="action-row">
          <button
            className="button button--primary"
            type="button"
            onClick={generateSpeech}
            disabled={disabled || isGenerating || !text.trim()}
          >
            {isGenerating ? <LoaderCircle className="spin" aria-hidden="true" /> : <Play aria-hidden="true" />}
            {isGenerating ? "Streaming audio…" : "Generate voice"}
          </button>
          {isGenerating ? (
            <button className="button button--ghost" type="button" onClick={cancelGeneration}>
              <CircleStop aria-hidden="true" /> Cancel
            </button>
          ) : null}
          <span className="stream-status" aria-live="polite">
            {isGenerating && receivedBytes > 0 ? `${formatBytes(receivedBytes)} received` : "Audio streams through your server"}
          </span>
        </div>
      </section>

      <aside className="studio-sidebar" aria-label="Speech controls and output">
        <div className="control-card">
          <div className="control-card__heading"><Radio size={17} /><span>Voice controls</span></div>
          <label className="select-label" htmlFor="voice-select">Voice</label>
          <div className="select-wrap">
            <select
              id="voice-select"
              value={voice}
              onChange={(event) => setVoice(event.target.value as VoiceId)}
              disabled={disabled || isGenerating}
            >
              {VOICES.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}
            </select>
          </div>
          <p className="selection-note"><strong>{selectedVoice.label}</strong> · {selectedVoice.character}</p>

          <div className="control-grid">
            <div>
              <label className="select-label" htmlFor="format-select">Format</label>
              <div className="select-wrap">
                <select
                  id="format-select"
                  value={format}
                  onChange={(event) => setFormat(event.target.value as AudioFormat)}
                  disabled={disabled || isGenerating}
                >
                  {AUDIO_FORMATS.map((option) => <option value={option} key={option}>{option.toUpperCase()}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="select-label" htmlFor="speed-select">Speed</label>
              <div className="select-wrap select-wrap--icon">
                <Gauge size={15} aria-hidden="true" />
                <select
                  id="speed-select"
                  value={speed}
                  onChange={(event) => setSpeed(Number(event.target.value))}
                  disabled={disabled || isGenerating}
                >
                  <option value={0.75}>0.75×</option>
                  <option value={1}>1.0×</option>
                  <option value={1.25}>1.25×</option>
                  <option value={1.5}>1.5×</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className={`output-card${audioUrl ? " output-card--ready" : ""}`}>
          <div className="output-card__topline">
            <span>Output</span>
            <span className="ai-disclosure"><span /> AI-generated voice</span>
          </div>
          <Waveform active={isGenerating} label={isGenerating ? "Audio is streaming" : "Generated audio waveform"} />
          {audioUrl ? (
            <div className="audio-result">
              <audio controls src={audioUrl} preload="metadata">Your browser does not support audio playback.</audio>
              <a className="button button--secondary button--full" href={audioUrl} download={`openai-voice-${voice}.${format}`}>
                <Download aria-hidden="true" /> Download {format.toUpperCase()}
              </a>
              {requestId ? <small className="request-meta">Request {requestId.slice(0, 8)}…</small> : null}
            </div>
          ) : (
            <p className="empty-state">Your generated voice will appear here. Nothing is stored by this app.</p>
          )}
        </div>
      </aside>
    </div>
  );
}
