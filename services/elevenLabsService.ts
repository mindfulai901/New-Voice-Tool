import type { ElevenLabsModel, VoiceSetting, Voice, VoiceSettingsValues } from '../types';

// --- PROXY API FUNCTIONS ---

export const getModels = async (): Promise<ElevenLabsModel[]> => {
  const response = await fetch('/api/get-models');

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch ElevenLabs models.');
  }
  return response.json();
};

export const getVoice = async (voiceId: string): Promise<Voice> => {
    const response = await fetch(`/api/get-voice?voiceId=${voiceId}`);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch voice. It may be an invalid ID.`);
    }
    const data = await response.json();
    return { id: data.voice_id, name: data.name };
};

// This can remain on the client as it's just static configuration data.
const VOICE_SETTINGS: { [key: string]: VoiceSetting[] } = {
  eleven_v3_alpha: [
    { id: 'stability', name: 'Stability', type: 'slider', min: 0, max: 1, step: 0.5, defaultValue: 0.5 },
  ],
  eleven_multilingual_v2: [
    { id: 'stability', name: 'Stability', type: 'slider', min: 0, max: 1, step: 0.01, defaultValue: 0.5 },
    { id: 'similarity_boost', name: 'Clarity + Similarity', type: 'slider', min: 0, max: 1, step: 0.01, defaultValue: 0.75 },
    { id: 'style', name: 'Style Exaggeration', type: 'slider', min: 0, max: 1, step: 0.01, defaultValue: 0.0 },
    { id: 'use_speaker_boost', name: 'Speaker Boost', type: 'toggle', defaultValue: 'true' },
  ],
  eleven_monolingual_v1: [
    { id: 'stability', name: 'Stability', type: 'slider', min: 0, max: 1, step: 0.01, defaultValue: 0.5 },
    { id: 'similarity_boost', name: 'Similarity Boost', type: 'slider', min: 0, max: 1, step: 0.01, defaultValue: 0.75 },
  ],
   eleven_turbo_v2: []
};

export const getVoiceSettingsForModel = async (modelId: string): Promise<VoiceSetting[]> => {
  const modelFamily = Object.keys(VOICE_SETTINGS).find(key => modelId.startsWith(key));
  return modelFamily ? VOICE_SETTINGS[modelFamily] : [];
};

export const generateVoiceoverChunk = async (
  textChunk: string, 
  voiceId: string, 
  modelId: string,
  voiceSettings: VoiceSettingsValues
): Promise<Blob> => {

  const response = await fetch('/api/generate-voice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: textChunk,
      voiceId,
      modelId,
      voiceSettings,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Failed to generate audio chunk.`);
  }

  return response.blob();
};