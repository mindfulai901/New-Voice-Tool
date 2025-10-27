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

// New type to store voice settings for all models
export type AllVoiceSettings = {
  [modelId: string]: VoiceSettingsValues;
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
