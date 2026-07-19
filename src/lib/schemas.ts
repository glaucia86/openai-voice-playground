import { z } from "zod";

import {
  AUDIO_FORMATS,
  MAX_INSTRUCTIONS_CHARACTERS,
  MAX_SPEECH_CHARACTERS,
  MAX_TRANSCRIPTION_PROMPT_CHARACTERS,
  TRANSCRIPTION_MODELS,
  VOICE_IDS,
} from "@/lib/constants";

export const speechRequestSchema = z
  .object({
    text: z.string().trim().min(1).max(MAX_SPEECH_CHARACTERS),
    voice: z.enum(VOICE_IDS),
    format: z.enum(AUDIO_FORMATS).default("mp3"),
    instructions: z
      .string()
      .trim()
      .max(MAX_INSTRUCTIONS_CHARACTERS)
      .optional()
      .default(""),
    speed: z.coerce.number().min(0.25).max(4).default(1),
  })
  .strict();

export const transcriptionFieldsSchema = z.object({
  model: z.enum(TRANSCRIPTION_MODELS).default("gpt-4o-mini-transcribe"),
  language: z
    .string()
    .trim()
    .toLowerCase()
    .refine((value) => value === "" || /^[a-z]{2}$/.test(value), {
      message: "Language must be an ISO-639-1 code.",
    })
    .default(""),
  prompt: z
    .string()
    .trim()
    .max(MAX_TRANSCRIPTION_PROMPT_CHARACTERS)
    .default(""),
});

export type SpeechRequest = z.infer<typeof speechRequestSchema>;
export type TranscriptionFields = z.infer<typeof transcriptionFieldsSchema>;
