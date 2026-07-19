import { z } from "zod";

import {
  CONVERSATION_LANGUAGE_IDS,
  MAX_CONVERSATION_GOAL_CHARACTERS,
  MICROPHONE_PROFILE_IDS,
  REALTIME_VOICE_IDS,
} from "@/lib/constants";

export const realtimeSessionRequestSchema = z
  .object({
    voice: z.enum(REALTIME_VOICE_IDS).default("marin"),
    language: z.enum(CONVERSATION_LANGUAGE_IDS).default("pt"),
    microphoneProfile: z.enum(MICROPHONE_PROFILE_IDS).default("near_field"),
    goal: z.string().trim().max(MAX_CONVERSATION_GOAL_CHARACTERS).default(""),
  })
  .strict();

export type RealtimeSessionRequest = z.infer<typeof realtimeSessionRequestSchema>;
