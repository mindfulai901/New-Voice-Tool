import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Slider } from '../common/Slider';
import { Toggle } from '../common/Toggle';
import { Spinner } from '../common/Spinner';
import type { ElevenLabsModel, Voice, VoiceSettingsValues, VoiceSetting } from '../../types';
import { getVoiceSettingsForModel, getVoice, generateVoiceoverChunk } from '../../services/elevenLabsService';
import { supabase } from '../../services/supabaseClient';

interface Step4Props {
  savedVoices: Voice[];
  setSavedVoices: React.Dispatch<React.SetStateAction<Voice[]>>;
  selectedVoiceId: string | null;
  setSelectedVoiceId: (id: string | null) => void;
  voiceSettings: VoiceSettingsValues;
  setVoiceSettings: React.Dispatch<React.SetStateAction<VoiceSettingsValues>>;
  model: ElevenLabsModel | undefined;
  onNext: () => void;
  onBack: () => void;
}

export const Step4_VoiceSelection: React.FC<Step4Props> = ({ savedVoices, setSavedVoices, selectedVoiceId, setSelectedVoiceId, voiceSettings, setVoiceSettings, model, onNext, onBack }) => {
  const [newVoiceId, setNewVoiceId] = useState('');
  const [modelVoiceSettings, setModelVoiceSettings] = useState<VoiceSetting[]>([]);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddingVoice, setIsAddingVoice] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchSettings = useCallback(async () => {
    if (model) {
      setIsLoadingSettings(true);
      const settings = await getVoiceSettingsForModel(model.model_id);
      setModelVoiceSettings(settings);
      
      setVoiceSettings(prevSettings => {
        const newSettings = { ...prevSettings };
        settings.forEach(s => {
          if (newSettings[s.id] === undefined) {
            newSettings[s.id] = s.defaultValue;
          }
        });
        return newSettings;
      });
      
      setIsLoadingSettings(false);
    }
  }, [model, setVoiceSettings]);
  
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const stopCurrentPreview = useCallback(() => {
    if (audioRef.current) {
        audioRef.current.pause();
    }
    audioRef.current = null;
    setIsPlaying(false);
    setPreviewingVoiceId(null);
    setIsPreviewLoading(false);
  }, []);

  useEffect(() => {
    return () => {
        stopCurrentPreview();
    };
  }, [stopCurrentPreview, selectedVoiceId]);
  
  const handleError = useCallback((err: unknown) => {
    const message = err instanceof Error ? err.message : 'An unknown error occurred.';
    console.error(err);
    setError(message);
  }, []);

  const handleAddVoice = async () => {
    if (!newVoiceId.trim() || isAddingVoice) return;
    if (savedVoices.some(v => v.id === newVoiceId)) {
        setError('This voice ID has already been added.');
        return;
    }
    setError(null);
    setIsAddingVoice(true);
    try {
        const voiceDetails = await getVoice(newVoiceId.trim());
        
        // Insert into Supabase
        const { data, error: dbError } = await supabase
          .from('voices')
          .insert({ voice_id: voiceDetails.id, name: voiceDetails.name })
          .select('id:voice_id, name')
          .single();

        if (dbError) throw dbError;

        setSavedVoices([...savedVoices, data as Voice]);
        setSelectedVoiceId(voiceDetails.id);
        setNewVoiceId('');
    } catch (err) {
        handleError(err);
    } finally {
        setIsAddingVoice(false);
    }
  };
  
  const handleRemoveVoice = async (idToRemove: string) => {
    try {
      const { error: dbError } = await supabase.from('voices').delete().eq('voice_id', idToRemove);
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
    setVoiceSettings(prev => ({...prev, [id]: value}));
  };
  
  const handlePreview = async () => {
    if (!selectedVoiceId || !model) return;

    if (previewingVoiceId === selectedVoiceId && audioRef.current) {
        isPlaying ? audioRef.current.pause() : audioRef.current.play();
        setIsPlaying(!isPlaying);
        return;
    }
    
    stopCurrentPreview();
    setIsPreviewLoading(true);
    setPreviewingVoiceId(selectedVoiceId);
    setError(null);

    try {
        const previewText = "Hello, this is a preview of the selected voice and settings.";
        const audioBlob = await generateVoiceoverChunk(previewText, selectedVoiceId, model.model_id, voiceSettings);
        const url = URL.createObjectURL(audioBlob);
        
        audioRef.current = new Audio(url);
        audioRef.current.play();
        setIsPlaying(true);

        audioRef.current.onended = () => {
            setIsPlaying(false);
            setPreviewingVoiceId(null);
            URL.revokeObjectURL(url);
        };
        
        audioRef.current.onerror = () => {
            setError("Failed to play audio preview.");
            stopCurrentPreview();
            URL.revokeObjectURL(url);
        };

    } catch (err) {
        handleError(err);
        stopCurrentPreview();
    } finally {
        setIsPreviewLoading(false);
    }
  };
  
  const selectedVoice = savedVoices.find(v => v.id === selectedVoiceId);
  
  const getButtonContent = () => {
    const isCurrentVoicePreviewing = selectedVoiceId === previewingVoiceId;
    if (isPreviewLoading && isCurrentVoicePreviewing) return <Spinner />;
    if (isPlaying && isCurrentVoicePreviewing) return 'Pause Preview';
    if (!isPlaying && isCurrentVoicePreviewing && audioRef.current) return 'Resume Preview';
    return 'Preview Voice';
  };

  return (
    <Card className="w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Voice & Settings</h2>
      
      <div className="mb-6">
          <label htmlFor="add-voice-input" className="block text-sm font-medium text-gray-300 mb-2">Add ElevenLabs Voice</label>
          <div className="flex gap-2">
            <input
              id="add-voice-input"
              type="text"
              value={newVoiceId}
              onChange={(e) => { setNewVoiceId(e.target.value); setError(null); }}
              placeholder="Enter Voice ID"
              className="flex-grow p-2 bg-[#0E1117] border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
            <Button onClick={handleAddVoice} className="px-4 py-2 w-24" disabled={isAddingVoice || !newVoiceId.trim()}>
              {isAddingVoice ? <Spinner /> : 'Save'}
            </Button>
          </div>
      </div>
      
      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
      
      <div className="mb-6 border-t border-b border-white/10 py-6">
        <h3 className="text-lg font-semibold mb-4 text-cyan-400">Saved Voices</h3>
        <div className="flex flex-wrap gap-3 items-center min-h-[2.5rem]">
            {savedVoices.length === 0 ? (
                <p className="text-gray-500 text-sm">No saved voices yet. Add one above to get started.</p>
            ) : savedVoices.map(voice => (
              <div
                key={voice.id}
                onClick={() => setSelectedVoiceId(voice.id)}
                className={`relative group pl-4 pr-8 py-2 rounded-full cursor-pointer transition-all duration-200 border-2 ${selectedVoiceId === voice.id ? 'bg-cyan-500/20 border-cyan-500' : 'bg-white/5 border-transparent hover:border-gray-600'}`}
              >
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

      {selectedVoice && (
        <div key={selectedVoiceId} className="animate-fade-in">
          <h3 className="text-lg font-semibold mb-4 text-cyan-400">Settings for "{selectedVoice.name}"</h3>
           {isLoadingSettings ? <div className="flex justify-center items-center h-48"><Spinner/></div> : 
           modelVoiceSettings.length > 0 ? (
            <div className="space-y-4">
              {modelVoiceSettings.map(setting => {
                if (setting.type === 'slider') {
                    return (
                        <Slider
                            key={setting.id}
                            id={setting.id}
                            label={setting.name}
                            min={setting.min!}
                            max={setting.max!}
                            step={setting.step!}
                            value={Number(voiceSettings[setting.id] || 0)}
                            onChange={(e) => handleSettingChange(setting.id, parseFloat(e.target.value))}
                        />
                    );
                }
                if (setting.type === 'toggle') {
                    return (
                        <Toggle
                            key={setting.id}
                            id={setting.id}
                            label={setting.name}
                            enabled={voiceSettings[setting.id] === 'true'}
                            onChange={(enabled) => handleSettingChange(setting.id, enabled ? 'true' : 'false')}
                        />
                    );
                }
                return null;
              })}

              <Button onClick={handlePreview} variant="secondary" className="w-full mt-4" disabled={isPreviewLoading}>
                {getButtonContent()}
              </Button>
            </div>
           ) : <p className="text-gray-500 text-sm text-center py-4">No specific settings for this model.</p>
          }
        </div>
      )}

      <div className="flex justify-between items-center mt-8 border-t border-white/10 pt-6">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button onClick={onNext} disabled={!selectedVoiceId}>Generate Voiceover</Button>
      </div>
    </Card>
  );
};