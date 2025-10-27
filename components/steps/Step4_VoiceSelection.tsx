import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Slider } from '../common/Slider';
import { Toggle } from '../common/Toggle';
import { Spinner } from '../common/Spinner';
import type { ElevenLabsModel, Voice, VoiceSettingsValues, VoiceSetting, ElevenLabsVoice } from '../../types';
import { getVoiceSettingsForModel, getVoice, getAllVoices } from '../../services/elevenLabsService';
import { supabase } from '../../services/supabaseClient';

interface Step4Props {
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

const VoiceLibraryItem: React.FC<{
    voice: ElevenLabsVoice;
    isSaved: boolean;
    onSave: (voice: ElevenLabsVoice) => void;
    onPreview: (url: string) => void;
    isPlaying: boolean;
}> = ({ voice, isSaved, onSave, onPreview, isPlaying }) => (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
        <div>
            <p className="font-semibold text-white">{voice.name}</p>
            <p className="text-xs text-gray-400 capitalize">
                {Object.values(voice.labels).join(' · ')}
            </p>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => onPreview(voice.preview_url)} className="p-2 rounded-full hover:bg-cyan-500/20" aria-label={`Preview ${voice.name}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isPlaying ? 'text-cyan-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d={isPlaying ? "M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1zm7 0a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1z" : "M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"} clipRule="evenodd" />
                </svg>
            </button>
            <Button variant={isSaved ? 'secondary' : 'primary'} onClick={() => onSave(voice)} disabled={isSaved} className="text-xs px-3 py-1 h-8 w-20">
                {isSaved ? 'Saved' : 'Save'}
            </Button>
        </div>
    </div>
);


export const Step4_VoiceSelection: React.FC<Step4Props> = ({ savedVoices, setSavedVoices, selectedVoiceId, setSelectedVoiceId, voiceSettings, setVoiceSettings, model, onNext, onBack }) => {
  const [newVoiceId, setNewVoiceId] = useState('');
  const [modelVoiceSettings, setModelVoiceSettings] = useState<VoiceSetting[]>([]);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addVoiceError, setAddVoiceError] = useState<string | null>(null);
  const [isAddingVoice, setIsAddingVoice] = useState(false);
  
  // State for the new voice library
  const [allVoices, setAllVoices] = useState<ElevenLabsVoice[]>([]);
  const [isLibraryLoading, setIsLibraryLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch voice library
  useEffect(() => {
    const fetchLibrary = async () => {
      setIsLibraryLoading(true);
      setError(null);
      try {
        const voices = await getAllVoices();
        setAllVoices(voices);
      } catch (err) {
        handleError(err, 'Failed to load voice library.');
      } finally {
        setIsLibraryLoading(false);
      }
    };
    fetchLibrary();
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

  const handlePreview = useCallback((url: string) => {
    if (!audioRef.current) return;

    if (currentPreviewUrl === url && !audioRef.current.paused) {
      audioRef.current.pause();
    } else {
      if (currentPreviewUrl !== url) {
        setCurrentPreviewUrl(url);
        audioRef.current.src = url;
      }
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  }, [currentPreviewUrl]);


  const handleSaveVoice = useCallback(async (voice: ElevenLabsVoice | { voice_id: string, name: string }) => {
    const voiceId = 'voice_id' in voice ? voice.voice_id : '';
    const voiceName = voice.name;

    if (!voiceId || !voiceName) return;
    
    if (savedVoices.some(v => v.id === voiceId)) {
        setAddVoiceError('This voice is already saved.');
        return;
    }
    
    setIsAddingVoice(true);
    setAddVoiceError(null);
    try {
        const { data, error: dbError } = await supabase
          .from('voices')
          .insert({ voice_id: voiceId, name: voiceName })
          .select('id:voice_id, name')
          .single();

        if (dbError) throw dbError;

        setSavedVoices(prev => [...prev, data as Voice]);
        setSelectedVoiceId(voiceId);
    } catch (err) {
        handleError(err, 'Could not save voice.');
    } finally {
        setIsAddingVoice(false);
    }
  }, [savedVoices, setSavedVoices, setSelectedVoiceId, handleError]);

  const handleAddManualVoice = async () => {
    if (!newVoiceId.trim()) return;
    setIsAddingVoice(true);
    setAddVoiceError(null);
    try {
        const voiceDetails = await getVoice(newVoiceId.trim());
        await handleSaveVoice({ voice_id: voiceDetails.id, name: voiceDetails.name });
        setNewVoiceId('');
    } catch (err) {
        setAddVoiceError(err instanceof Error ? err.message : 'Failed to find or save voice.');
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
    setVoiceSettings({ ...voiceSettings, [id]: value });
  };
  
  const selectedVoiceForSettings = savedVoices.find(v => v.id === selectedVoiceId);
  const filteredVoices = useMemo(() => 
    allVoices.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [allVoices, searchTerm]
  );
  
  return (
    <Card className="w-full max-w-4xl">
      {/* A single, persistent audio element for reliable playback */}
      <audio 
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentPreviewUrl(null);
        }}
      />
      
      <h2 className="text-2xl font-bold mb-6 text-center">Voice & Settings</h2>
      
       {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Voice Library */}
        <div>
            <h3 className="text-lg font-semibold mb-4 text-cyan-400">Voice Library</h3>
            <input
                type="text"
                placeholder="Search voices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 mb-4 bg-[#0E1117] border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
            <div className="h-96 overflow-y-auto pr-2 space-y-2">
                {isLibraryLoading ? <div className="flex justify-center items-center h-full"><Spinner/></div>
                : filteredVoices.map(voice => (
                    <VoiceLibraryItem
                        key={voice.voice_id}
                        voice={voice}
                        isSaved={savedVoices.some(v => v.id === voice.voice_id)}
                        onSave={handleSaveVoice}
                        onPreview={handlePreview}
                        isPlaying={isPlaying && currentPreviewUrl === voice.preview_url}
                    />
                ))}
            </div>
        </div>

        {/* Right Column: Saved Voices & Settings */}
        <div>
          <div className="mb-6 border-b border-white/10 pb-6">
            <h3 className="text-lg font-semibold mb-4 text-cyan-400">Saved Voices</h3>
            <div className="flex flex-wrap gap-3 items-center min-h-[4rem]">
                {savedVoices.length === 0 ? (
                    <p className="text-gray-500 text-sm">Save a voice from the library to get started.</p>
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
          
           {selectedVoiceForSettings ? (
            <div key={selectedVoiceId} className="animate-fade-in">
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
          ) : <div className="text-center text-gray-500 py-10">Select a saved voice to see settings.</div>}
           <div className="mt-4 pt-4 border-t border-white/10">
                <label htmlFor="add-voice-input" className="block text-xs font-medium text-gray-400 mb-2">Manually Add by Voice ID</label>
                <div className="flex gap-2">
                    <input id="add-voice-input" type="text" value={newVoiceId} onChange={(e) => setNewVoiceId(e.target.value)} placeholder="Enter Voice ID" className="flex-grow p-2 bg-[#0E1117] border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"/>
                    <Button onClick={handleAddManualVoice} className="px-4 py-2 w-24" disabled={isAddingVoice || !newVoiceId.trim()}>
                        {isAddingVoice ? <Spinner /> : 'Add'}
                    </Button>
                </div>
                {addVoiceError && <p className="text-red-400 text-sm mt-2">{addVoiceError}</p>}
           </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 border-t border-white/10 pt-6">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button onClick={onNext} disabled={!selectedVoiceId}>Generate Voiceover</Button>
      </div>
    </Card>
  );
};