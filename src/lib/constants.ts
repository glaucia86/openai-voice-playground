export const VOICES = [
  { id: "alloy", label: "Alloy", character: "Balanced and versatile" },
  { id: "ash", label: "Ash", character: "Clear and conversational" },
  { id: "ballad", label: "Ballad", character: "Warm and expressive" },
  { id: "coral", label: "Coral", character: "Bright and engaging" },
  { id: "echo", label: "Echo", character: "Calm and measured" },
  { id: "fable", label: "Fable", character: "Narrative and textured" },
  { id: "nova", label: "Nova", character: "Energetic and polished" },
  { id: "onyx", label: "Onyx", character: "Grounded and resonant" },
  { id: "sage", label: "Sage", character: "Composed and thoughtful" },
  { id: "shimmer", label: "Shimmer", character: "Light and articulate" },
  { id: "verse", label: "Verse", character: "Natural and dynamic" },
  { id: "marin", label: "Marin", character: "Natural, high-quality voice" },
  { id: "cedar", label: "Cedar", character: "Natural, high-quality voice" },
] as const;

export const VOICE_IDS = VOICES.map((voice) => voice.id) as [
  (typeof VOICES)[number]["id"],
  ...(typeof VOICES)[number]["id"][],
];

export const AUDIO_FORMATS = ["mp3", "wav", "opus"] as const;
export const TRANSCRIPTION_MODELS = [
  "gpt-4o-mini-transcribe",
  "gpt-4o-transcribe",
] as const;

export const MAX_SPEECH_CHARACTERS = 4_096;
export const MAX_INSTRUCTIONS_CHARACTERS = 4_096;
export const MAX_AUDIO_BYTES = 25 * 1024 * 1024;
export const MAX_TRANSCRIPTION_PROMPT_CHARACTERS = 1_000;

export type VoiceId = (typeof VOICE_IDS)[number];
export type AudioFormat = (typeof AUDIO_FORMATS)[number];
export type TranscriptionModel = (typeof TRANSCRIPTION_MODELS)[number];
