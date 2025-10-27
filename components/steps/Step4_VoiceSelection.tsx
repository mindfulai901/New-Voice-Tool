import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Slider } from '../common/Slider';
import { Toggle } from '../common/Toggle';
import { Spinner } from '../common/Spinner';
import type { ElevenLabsModel, Voice, VoiceSettingsValues, VoiceSetting } from '../../types';
import { getVoiceSettingsForModel, getVoice } from '../../services/elevenLabsService';
import { supabase } from '../../services/supabaseClient';

interface Step4Props {
  userId: string;
  savedVoices: Voice[];
  setSavedVoices: React.Dispatch<React.SetStateAction<Voice[]>>;
  selectedVoiceId: string | null;
  setSelectedVoiceId: (id: string | null) => void;
  voiceSettings: VoiceSettingsValues;
  setVoiceSettings: (settings: VoiceSettingsValues) => void;
  model: ElevenLabsModel | undefined;
  onNext: () => void;
  onBack: () => void;
}

export const Step4_VoiceSelection: React.FC<Step4Props> = ({ userId, savedVoices, setSavedVoices, selectedVoiceId, setSelectedVoiceId, voiceSettings, setVoiceSettings, model, onNext, onBack }) => {
  const [newVoiceId, setNewVoiceId] = useState('');
  const [modelVoiceSettings, setModelVoiceSettings] = useState<VoiceSetting[]>([]);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addVoiceError, setAddVoiceError] = useState<string | null>(null);
  const [isAddingVoice, setIsAddingVoice] = useState(false);

  // State for audio preview
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  useEffect(() => {
    // Setup audio element and event listener for seamless playback control
    const audioEl = new Audio();
    const onEnded = () => setPlayingVoiceId(null);
    audioEl.addEventListener('ended', onEnded);
    setAudio(audioEl);

    // Cleanup audio element and listeners on component unmount
    return () => {
      audioEl.removeEventListener('ended', onEnded);
      audioEl.pause();
      setAudio(null);
    };
  }, []);

  useEffect(() => {
    const fetchAndInitializeSettings = async () => {
      if (model) {
        setIsLoadingSettings(true);
        try {
          const settingsSchema = await getVoiceSettingsForModel(model.model_id);
          setModelVoiceSettings(settingsSchema);
          
          const newSettingsForCurrentModel = { ...voiceSettings };
          let needsUpdate = false;
          settingsSchema.forEach(s => {
            if (newSettingsForCurrentModel[s.id] === undefined) {
              newSettingsForCurrentModel[s.id] = s.defaultValue;
              needsUpdate = true;
            }
          });

          if(needsUpdate) {
            setVoiceSettings(newSettingsForCurrentModel);
          }

        } catch (err) {
          handleError(err);
        } finally {
          setIsLoadingSettings(false);
        }
      }
    };
    fetchAndInitializeSettings();
  }, [model, setVoiceSettings, voiceSettings]);
  
  const handleError = useCallback((err: unknown, context?: string) => {
    const message = err instanceof Error ? err.message : 'An unknown error occurred.';
    console.error(context || 'Error', err);
    setError(context ? `${context} ${message}` : message);
  }, []);
  
  const handlePlayPreview = (voice: Voice) => {
    if (!audio || !voice.previewUrl) return;

    if (playingVoiceId === voice.id) {
      audio.pause();
      setPlayingVoiceId(null);
    } else {
      audio.src = voice.previewUrl;
      audio.play();
      setPlayingVoiceId(voice.id);
    }
  };

  const handleAddManualVoice = async () => {
    if (!newVoiceId.trim() || !userId) return;

    if (savedVoices.some(v => v.id === newVoiceId.trim())) {
        setAddVoiceError('This voice is already saved.');
        return;
    }

    setIsAddingVoice(true);
    setAddVoiceError(null);
    try {
        const voiceDetails = await getVoice(newVoiceId.trim());
        
        const { data, error: dbError } = await supabase
          .from('voices')
          .insert({ voice_id: voiceDetails.id, name: voiceDetails.name, user_id: userId, preview_url: voiceDetails.previewUrl })
          .select('id:voice_id, name, previewUrl:preview_url')
          .single();

        if (dbError) throw dbError;

        setSavedVoices(prev => [...prev, data as Voice]);
        setSelectedVoiceId(voiceDetails.id);
        setNewVoiceId('');

    } catch (err) {
        setAddVoiceError(err instanceof Error ? err.message : 'Failed to find or save voice. Please check the Voice ID.');
    } finally {
        setIsAddingVoice(false);
    }
  };
  
  const handleRemoveVoice = async (idToRemove: string) => {
    try {
      const { error: dbError } = await supabase.from('voices').delete().eq('voice_id', idToRemove).eq('user_id', userId);
      if (dbError) throw dbError;
      
      setSavedVoices(savedVoices.filter(v => v.id !== idToRemove));
      if (selectedVoiceId === idToRemove) {
        setSelectedVoiceId(null);
      }
    } catch(err) {
      handleError(err);
    }
  };
  
  const handleSettingChange = (id: string, value: string | number) => {
    setVoiceSettings({ ...voiceSettings, [id]: value });
  };
  
  const selectedVoiceForSettings = savedVoices.find(v => v.id === selectedVoiceId);
  
  return (
    <Card className="w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Voice & Settings</h2>
      
       {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
      
      <div className="space-y-6">
        {/* Saved Voices Section */}
        <div className="border-b border-white/10 pb-6">
          <h3 className="text-lg font-semibold mb-4 text-cyan-400">Your Voices</h3>
          <div className="flex flex-wrap gap-3 items-center min-h-[4rem]">
              {savedVoices.length === 0 ? (
                  <p className="text-gray-500 text-sm">Add a voice from your ElevenLabs account using its Voice ID to get started.</p>
              ) : savedVoices.map(voice => (
                <div
                  key={voice.id}
                  onClick={() => setSelectedVoiceId(voice.id)}
                  className={`relative group flex items-center gap-2 pl-4 pr-8 py-2 rounded-full cursor-pointer transition-all duration-200 border-2 ${selectedVoiceId === voice.id ? 'bg-cyan-500/20 border-cyan-500' : 'bg-white/5 border-transparent hover:border-gray-600'}`}
                >
                  {voice.previewUrl && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePlayPreview(voice); }}
                      className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      aria-label={`Preview ${voice.name}`}
                    >
                      {playingVoiceId === voice.id ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                      )}
                    </button>
                  )}
                  <span className="font-medium">{voice.name}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleRemoveVoice(voice.id); }} 
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-transparent text-gray-400 opacity-50 group-hover:opacity-100 group-hover:bg-red-500/50 group-hover:text-white transition-all"
                    aria-label={`Remove ${voice.name}`}
                  >
                      &times;
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Add Voice Section */}
        <div className="pt-4">
              <label htmlFor="add-voice-input" className="block text-sm font-medium text-gray-400 mb-2">Add a Voice by ID</label>
              <div className="flex gap-2">
                  <input id="add-voice-input" type="text" value={newVoiceId} onChange={(e) => setNewVoiceId(e.target.value)} placeholder="Enter ElevenLabs Voice ID" className="flex-grow p-2 bg-[#0E1117] border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"/>
                  <Button onClick={handleAddManualVoice} className="px-4 py-2 w-24" disabled={isAddingVoice || !newVoiceId.trim()}>
                      {isAddingVoice ? <Spinner /> : 'Add'}
                  </Button>
              </div>
              {addVoiceError && <p className="text-red-400 text-sm mt-2">{addVoiceError}</p>}
        </div>
        
        {/* Settings Section */}
         {selectedVoiceForSettings ? (
          <div key={selectedVoiceId} className="animate-fade-in pt-6 border-t border-white/10">
            <h3 className="text-lg font-semibold mb-4 text-cyan-400">Settings for "{selectedVoiceForSettings.name}"</h3>
             {isLoadingSettings ? <div className="flex justify-center items-center h-48"><Spinner/></div> : 
             modelVoiceSettings.length > 0 ? (
              <div className="space-y-4">
                {modelVoiceSettings.map(setting => setting.type === 'slider' ? (
                  <Slider
                      key={setting.id} id={setting.id} label={setting.name}
                      min={setting.min!} max={setting.max!} step={setting.step!}
                      value={Number(voiceSettings[setting.id] || setting.defaultValue)}
                      onChange={(e) => handleSettingChange(setting.id, parseFloat(e.target.value))}
                  />
                ) : setting.type === 'toggle' ? (
                  <Toggle
                      key={setting.id} id={setting.id} label={setting.name}
                      enabled={voiceSettings[setting.id] === 'true'}
                      onChange={(enabled) => handleSettingChange(setting.id, String(enabled))}
                  />
                 ) : null)}
              </div>
             ) : <p className="text-gray-500 text-sm text-center py-4">No specific settings for this model.</p>}
          </div>
        ) : <div className="text-center text-gray-500 py-10">Select or add a voice to see settings.</div>}
      </div>

      <div className="flex justify-between items-center mt-8 border-t border-white/10 pt-6">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button onClick={onNext} disabled={!selectedVoiceId}>Generate Voiceover</Button>
      </div>
    </Card>
  );
};