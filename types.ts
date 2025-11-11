export enum AppStep {
  InputType = 1,
  Configuration = 2,
  ModelSelection = 3,
  VoiceSelection = 4,
  Generation = 5,
  Output = 6,
}

export type InputMode = 'single' | 'bulk' | null;

export interface Script {
  id: string;
  name: string;
  content: string;
}

export interface ElevenLabsModel {
  model_id: string;
  name: string;
  description: string;
  can_be_finetuned: boolean;
}

// Raw voice object from ElevenLabs API
export interface ElevenLabsVoice {
    voice_id: string;
    name: string;
    labels: { [key: string]: string };
    preview_url: string;
}

export interface VoiceSetting {
  id: string;
  name: string;
  type: 'slider' | 'select' | 'toggle';
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | string;
  options?: string[];
}

// Simplified Voice object for our app state
export interface Voice {
  id: string;
  name: string;
  previewUrl?: string;
}

export type VoiceSettingsValues = {
  [key: string]: number | string;
};

// FIX: Correct the type to allow both an index signature for model settings and a specific property `_saved_voices`.
// The previous type caused a conflict because `_saved_voices` (string[]) was not assignable to `VoiceSettingsValues`.
// This new type ensures all properties are compatible.
export type AllVoiceSettings = {
  _saved_voices?: string[];
  [key: string]: VoiceSettingsValues | string[] | undefined;
};

export interface GenerationProgress {
  scriptId: string;
  scriptName: string;
  totalChunks: number;
  completedChunks: number;
  status: 'processing' | 'completed' | 'failed';
}

export interface FinalAudio {
  scriptId: string;
  scriptName: string;
  url: string;
}

export interface HistoryItem {
  id: number; // The id from the generated_audio table
  scriptName: string;
  audioUrl: string;
  scriptContent: string;
  createdAt: string;
  filePath: string; // The path in Supabase storage
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
}
