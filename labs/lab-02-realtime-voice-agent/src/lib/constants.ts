export const REALTIME_MODEL = "gpt-realtime-2.1" as const;
export const REALTIME_TRANSCRIPTION_MODEL = "gpt-4o-mini-transcribe" as const;

export const REALTIME_VOICES = [
  { id: "alloy", label: "Alloy", character: "Balanced and versatile" },
  { id: "ash", label: "Ash", character: "Clear and conversational" },
  { id: "ballad", label: "Ballad", character: "Warm and expressive" },
  { id: "coral", label: "Coral", character: "Bright and engaging" },
  { id: "echo", label: "Echo", character: "Calm and measured" },
  { id: "sage", label: "Sage", character: "Composed and thoughtful" },
  { id: "shimmer", label: "Shimmer", character: "Light and articulate" },
  { id: "verse", label: "Verse", character: "Natural and dynamic" },
  { id: "marin", label: "Marin", character: "Natural, high-quality voice" },
  { id: "cedar", label: "Cedar", character: "Natural, high-quality voice" },
] as const;

export const REALTIME_VOICE_IDS = REALTIME_VOICES.map((voice) => voice.id) as [
  (typeof REALTIME_VOICES)[number]["id"],
  ...(typeof REALTIME_VOICES)[number]["id"][],
];

export const CONVERSATION_LANGUAGES = [
  { id: "pt", label: "Português (Brasil)", instruction: "Brazilian Portuguese" },
  { id: "en", label: "English", instruction: "English" },
  { id: "es", label: "Español", instruction: "Spanish" },
  { id: "fr", label: "Français", instruction: "French" },
] as const;

export const CONVERSATION_LANGUAGE_IDS = CONVERSATION_LANGUAGES.map(
  (language) => language.id,
) as [
  (typeof CONVERSATION_LANGUAGES)[number]["id"],
  ...(typeof CONVERSATION_LANGUAGES)[number]["id"][],
];

export const MICROPHONE_PROFILES = [
  { id: "near_field", label: "Headset / close mic" },
  { id: "far_field", label: "Laptop / room mic" },
] as const;

export const MICROPHONE_PROFILE_IDS = MICROPHONE_PROFILES.map((profile) => profile.id) as [
  (typeof MICROPHONE_PROFILES)[number]["id"],
  ...(typeof MICROPHONE_PROFILES)[number]["id"][],
];

export const MAX_CONVERSATION_GOAL_CHARACTERS = 600;
export const MAX_REALTIME_REQUEST_BYTES = 4 * 1024;
export const CLIENT_SECRET_TTL_SECONDS = 60;
export const REALTIME_SESSION_LIMIT_SECONDS = 60 * 60;

export type RealtimeVoiceId = (typeof REALTIME_VOICE_IDS)[number];
export type ConversationLanguageId = (typeof CONVERSATION_LANGUAGE_IDS)[number];
export type MicrophoneProfileId = (typeof MICROPHONE_PROFILE_IDS)[number];
