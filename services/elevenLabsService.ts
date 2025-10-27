import type { ElevenLabsModel, VoiceSetting, Voice, VoiceSettingsValues, ElevenLabsVoice } from '../types';

// --- PROXY API FUNCTIONS ---

/**
 * A centralized fetch wrapper for our serverless API endpoints.
 * Provides more specific error messages for easier debugging.
 * @param url The API endpoint path (e.g., '/api/get-models')
 * @param options The standard RequestInit options for fetch.
 * @returns A Promise that resolves to the successful Response object.
 * @throws An Error with a user-friendly message if the fetch fails.
 */
async function fetchApi(url: string, options?: RequestInit): Promise<Response> {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            // Try to parse the JSON error from our serverless function
            try {
                const errorData = await response.json();
                throw new Error(errorData.error || `Request failed with status ${response.status}`);
            } catch (e) {
                // If the body is not JSON or another error occurs
                throw new Error(`Request failed with status ${response.status}. Could not parse error response.`);
            }
        }
        return response;
    } catch (error) {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            // This suggests a network error or that the API endpoint doesn't exist/is misconfigured
            throw new Error('Network error: Could not connect to the API. Please check your connection.');
        }
        // Re-throw other errors (like the ones we threw above)
        throw error;
    }
}


export const getModels = async (): Promise<ElevenLabsModel[]> => {
  const response = await fetchApi('/api/get-models');
  return response.json();
};

export const getAllVoices = async (): Promise<ElevenLabsVoice[]> => {
  const response = await fetchApi('/api/get-all-voices');
  const data = await response.json();
  return data.voices;
};

export const getVoice = async (voiceId: string): Promise<Voice> => {
    const response = await fetchApi(`/api/get-voice?voiceId=${voiceId}`);
    const data = await response.json();
    return { id: data.voice_id, name: data.name };
};

// This can remain on the client as it's just static configuration data.
const VOICE_SETTINGS: { [key: string]: VoiceSetting[] } = {
  eleven_english_v3: [
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

  const response = await fetchApi('/api/generate-voice', {
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

  return response.blob();
};
