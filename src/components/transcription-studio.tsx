"use client";

import {
  AudioLines,
  Check,
  Clipboard,
  FileAudio,
  LoaderCircle,
  Mic,
  Square,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { StatusMessage } from "@/components/status-message";
import { Waveform } from "@/components/waveform";
import { MAX_AUDIO_BYTES, type TranscriptionModel } from "@/lib/constants";
import {
  authorizationHeaders,
  formatBytes,
  readApiError,
  type ClientApiError,
} from "@/lib/client-api";

type TranscriptionStudioProps = {
  accessToken: string;
  disabled: boolean;
};

type TranscriptionResult = {
  text: string;
  meta: {
    requestId: string;
    model: string;
    durationMs: number;
    audioBytes: number;
  };
};

const MAX_RECORDING_SECONDS = 120;
const ACCEPTED_AUDIO = ".flac,.m4a,.mp3,.mp4,.mpeg,.mpga,.ogg,.wav,.webm,audio/*";

export function TranscriptionStudio({ accessToken, disabled }: TranscriptionStudioProps) {
  const [audioFile, setAudioFile] = useState<File>();
  const [model, setModel] = useState<TranscriptionModel>("gpt-4o-mini-transcribe");
  const [language, setLanguage] = useState("");
  const [prompt, setPrompt] = useState("OpenAI, Codex, TypeScript, Next.js, DevRel");
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [result, setResult] = useState<TranscriptionResult>();
  const [error, setError] = useState<ClientApiError>();
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | undefined>(undefined);
  const mediaStreamRef = useRef<MediaStream | undefined>(undefined);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | undefined>(undefined);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      stopMediaTracks();
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, []);

  function selectFile(file?: File) {
    setError(undefined);
    setResult(undefined);

    if (!file) return;
    if (file.size > MAX_AUDIO_BYTES) {
      setError({ message: "Audio files must be 25 MB or smaller." });
      return;
    }

    setAudioFile(file);
  }

  async function toggleRecording() {
    if (isRecording) {
      recorderRef.current?.stop();
      return;
    }

    setError(undefined);
    setResult(undefined);

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError({ message: "Audio recording is not supported in this browser." });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      mediaStreamRef.current = stream;
      const mimeType = pickRecordingMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      recorder.onerror = () => {
        setError({ message: "The browser could not finish the recording." });
        finishRecordingState();
      };
      recorder.onstop = () => {
        const type = recorder.mimeType || "audio/webm";
        const extension = type.includes("mp4") ? "m4a" : "webm";
        const blob = new Blob(chunks, { type });
        if (blob.size > 0) {
          selectFile(new File([blob], `recording-${Date.now()}.${extension}`, { type }));
        }
        finishRecordingState();
      };

      recorderRef.current = recorder;
      recorder.start(250);
      setRecordingSeconds(0);
      setIsRecording(true);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((current) => {
          const next = current + 1;
          if (next >= MAX_RECORDING_SECONDS && recorder.state === "recording") recorder.stop();
          return next;
        });
      }, 1_000);
    } catch (caught) {
      const message =
        caught instanceof DOMException && caught.name === "NotAllowedError"
          ? "Microphone access was denied. Allow it in your browser settings or upload a file."
          : "The microphone could not be started.";
      setError({ message });
      stopMediaTracks();
    }
  }

  async function transcribe() {
    if (!audioFile || isTranscribing || disabled) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsTranscribing(true);
    setError(undefined);
    setResult(undefined);

    try {
      const formData = new FormData();
      formData.append("audio", audioFile);
      formData.append("model", model);
      formData.append("language", language);
      formData.append("prompt", prompt);

      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: authorizationHeaders(accessToken),
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) throw await readApiError(response);
      setResult((await response.json()) as TranscriptionResult);
    } catch (caught) {
      if (controller.signal.aborted) return;
      const apiError = caught as ClientApiError;
      setError({
        message: apiError.message || "The audio could not be transcribed.",
        ...(apiError.code ? { code: apiError.code } : {}),
        ...(apiError.requestId ? { requestId: apiError.requestId } : {}),
      });
    } finally {
      if (abortControllerRef.current === controller) {
        setIsTranscribing(false);
        abortControllerRef.current = undefined;
      }
    }
  }

  async function copyTranscript() {
    if (!result?.text) return;
    await navigator.clipboard.writeText(result.text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1_500);
  }

  function finishRecordingState() {
    setIsRecording(false);
    recorderRef.current = undefined;
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = undefined;
    stopMediaTracks();
  }

  function stopMediaTracks() {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = undefined;
  }

  const timeLabel = `${String(Math.floor(recordingSeconds / 60)).padStart(2, "0")}:${String(recordingSeconds % 60).padStart(2, "0")}`;

  return (
    <div className="studio-layout">
      <section className="studio-main" aria-labelledby="transcription-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow"><AudioLines size={14} /> Speech recognition</span>
            <h2 id="transcription-title">Turn audio into useful text</h2>
          </div>
          <span className="model-chip"><span /> {model}</span>
        </div>

        <div
          className={`drop-zone${isDragging ? " drop-zone--active" : ""}${audioFile ? " drop-zone--selected" : ""}`}
          onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => { event.preventDefault(); setIsDragging(false); }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            selectFile(event.dataTransfer.files[0]);
          }}
        >
          <input
            ref={inputRef}
            className="visually-hidden"
            id="audio-file"
            type="file"
            accept={ACCEPTED_AUDIO}
            onChange={(event) => selectFile(event.target.files?.[0])}
            disabled={disabled || isTranscribing || isRecording}
          />
          {audioFile ? (
            <div className="selected-file">
              <div className="file-icon"><FileAudio aria-hidden="true" /></div>
              <div className="selected-file__copy">
                <strong>{audioFile.name}</strong>
                <span>{formatBytes(audioFile.size)} · Ready to transcribe</span>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label="Remove selected audio"
                onClick={() => { setAudioFile(undefined); setResult(undefined); if (inputRef.current) inputRef.current.value = ""; }}
              >
                <Trash2 aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="drop-zone__content">
              <div className="upload-orbit"><UploadCloud aria-hidden="true" /></div>
              <strong>Drop an audio file here</strong>
              <span>MP3, M4A, WAV, WebM and more · up to 25 MB</span>
              <button className="button button--secondary" type="button" onClick={() => inputRef.current?.click()} disabled={disabled}>
                Choose a file
              </button>
            </div>
          )}
        </div>

        <div className="record-divider"><span>or capture a short sample</span></div>

        <button
          className={`record-button${isRecording ? " record-button--active" : ""}`}
          type="button"
          onClick={toggleRecording}
          disabled={disabled || isTranscribing}
          aria-pressed={isRecording}
        >
          <span className="record-button__icon">{isRecording ? <Square aria-hidden="true" /> : <Mic aria-hidden="true" />}</span>
          <span>
            <strong>{isRecording ? "Stop recording" : "Record with microphone"}</strong>
            <small>{isRecording ? `${timeLabel} · maximum 02:00` : "Recorded audio stays in this browser until submitted"}</small>
          </span>
          {isRecording ? <Waveform active compact label="Microphone is recording" /> : null}
        </button>

        {error ? <StatusMessage tone="error" requestId={error.requestId}>{error.message}</StatusMessage> : null}

        <div className="action-row">
          <button className="button button--primary" type="button" onClick={transcribe} disabled={disabled || !audioFile || isTranscribing || isRecording}>
            {isTranscribing ? <LoaderCircle className="spin" aria-hidden="true" /> : <AudioLines aria-hidden="true" />}
            {isTranscribing ? "Transcribing…" : "Transcribe audio"}
          </button>
          {isTranscribing ? (
            <button className="button button--ghost" type="button" onClick={() => abortControllerRef.current?.abort()}>
              Cancel
            </button>
          ) : null}
        </div>
      </section>

      <aside className="studio-sidebar" aria-label="Transcription controls and result">
        <div className="control-card">
          <div className="control-card__heading"><AudioLines size={17} /><span>Recognition controls</span></div>
          <label className="select-label" htmlFor="transcription-model">Model</label>
          <div className="select-wrap">
            <select id="transcription-model" value={model} onChange={(event) => setModel(event.target.value as TranscriptionModel)} disabled={disabled || isTranscribing}>
              <option value="gpt-4o-mini-transcribe">Mini · faster, lower cost</option>
              <option value="gpt-4o-transcribe">Full · higher accuracy</option>
            </select>
          </div>

          <label className="select-label" htmlFor="language-select">Input language</label>
          <div className="select-wrap">
            <select id="language-select" value={language} onChange={(event) => setLanguage(event.target.value)} disabled={disabled || isTranscribing}>
              <option value="">Auto detect</option>
              <option value="pt">Portuguese</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <label className="select-label" htmlFor="transcription-prompt">Vocabulary hints</label>
          <textarea
            id="transcription-prompt"
            className="text-area text-area--small"
            rows={3}
            maxLength={1_000}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            disabled={disabled || isTranscribing}
            placeholder="Product names, acronyms, and domain vocabulary…"
          />
          <p className="helper-text">A hint can improve uncommon names and acronyms. It is context, not a command to rewrite the audio.</p>
        </div>

        <div className={`transcript-card${result ? " transcript-card--ready" : ""}`}>
          <div className="output-card__topline">
            <span>Transcript</span>
            {result ? (
              <button className="copy-button" type="button" onClick={copyTranscript}>
                {copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
                {copied ? "Copied" : "Copy"}
              </button>
            ) : null}
          </div>
          {result ? (
            <>
              <p className="transcript-text">{result.text}</p>
              <div className="result-meta">
                <span>{result.meta.model}</span>
                <span>{(result.meta.durationMs / 1_000).toFixed(1)}s</span>
                <span>{formatBytes(result.meta.audioBytes)}</span>
              </div>
            </>
          ) : (
            <div className="transcript-empty">
              <AudioLines aria-hidden="true" />
              <p>Your transcript will appear here after the bounded upload finishes.</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function pickRecordingMimeType(): string {
  const options = ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"];
  return options.find((option) => MediaRecorder.isTypeSupported(option)) ?? "";
}
