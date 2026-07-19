import { REALTIME_SESSION_LIMIT_SECONDS } from "@/lib/constants";

export function getElapsedSessionSeconds(startedAt: number, now = Date.now()): number {
  return Math.max(0, Math.floor((now - startedAt) / 1_000));
}

export function hasReachedSessionLimit(elapsedSeconds: number): boolean {
  return elapsedSeconds >= REALTIME_SESSION_LIMIT_SECONDS;
}
