import { z } from "zod";

import {
  AUDIO_FORMATS,
  MAX_INSTRUCTIONS_CHARACTERS,
  MAX_SPEECH_CHARACTERS,
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

export type SpeechRequest = z.infer<typeof speechRequestSchema>;
