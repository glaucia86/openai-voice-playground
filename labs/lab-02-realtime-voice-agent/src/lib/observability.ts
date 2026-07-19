type LogLevel = "info" | "error";

type VoiceLog = {
  event: string;
  requestId: string;
  route: "realtime-token";
  durationMs: number;
  status: number;
  model?: string;
  inputSize?: number;
  outputSize?: number;
};

export function logVoiceRequest(level: LogLevel, log: VoiceLog): void {
  const serialized = JSON.stringify({
    timestamp: new Date().toISOString(),
    ...log,
  });

  if (level === "error") {
    console.error(serialized);
  } else {
    console.info(serialized);
  }
}
