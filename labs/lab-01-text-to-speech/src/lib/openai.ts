import OpenAI from "openai";

import { AppError } from "@/lib/errors";

const globalForOpenAI = globalThis as unknown as { openai?: OpenAI };

export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new AppError(
      503,
      "configuration_error",
      "The voice service is not configured.",
    );
  }

  globalForOpenAI.openai ??= new OpenAI({
    apiKey,
    maxRetries: 2,
    timeout: 45_000,
  });

  return globalForOpenAI.openai;
}
