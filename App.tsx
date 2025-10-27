import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  AppStep,
  InputMode,
  Script,
  ElevenLabsModel,
  Voice,
  VoiceSettingsValues,
  GenerationProgress,
  FinalAudio,
  AllVoiceSettings,
} from './types';
import { supabase, supabaseError } from './services/supabaseClient';
import { getModels, generateVoiceoverChunk } from './services/elevenLabsService';
import { StepIndicator } from './components/StepIndicator';
import { Step1_InputType } from './components/steps/Step1_InputType';
import { Step2_Configuration } from './components/steps/Step2_Configuration';
import { Step3_ModelSelection } from './components/steps/Step3_ModelSelection';
import { Step4_VoiceSelection } from './components/steps/Step4_VoiceSelection';
import { Step5_Generation } from './components/steps/Step5_Generation';
import { Step6_Output } from './components/steps/Step6_Output';
import { useAuth } from './components/auth/AuthProvider';
import { LandingPage } from './components/LandingPage';
import { Spinner } from './components/common/Spinner';
// FIX: Add missing import for Button component
import { Button } from './components/common/Button';

const App: React.FC = () => {
  const { session, user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
        <div className="min-h-screen text-white flex flex-col items-center justify-center p-4 bg-[#0E1117]">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text mb-4">
              VoiceGen Pro
            </h1>
            <div className="flex items-center space-x-3">
                <Spinner />
                <p className="text-gray-400 text-lg">Loading Session...</p>
            </div>
        </div>
      );
  }

  if (!session || !user) {
    return <LandingPage />;
  }
  
  if (!supabase) {
    return (
      <div className="min-h-screen text-white flex flex-col items-center justify-center p-4 bg-[#0E1117]">
        <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-red-500 to-orange-400 text-transparent bg-clip-text">
              Configuration Error
            </h1>
        </header>
        <div className="w-full max-w-2xl bg-red-900/30 border border-red-700 rounded-lg p-6 text-center shadow-lg animate-fade-in">
          <h2 className="text-xl font-semibold text-red-300">Could not connect to the backend.</h2>
          <p className="text-red-400 mt-2">{supabaseError || 'An unknown initialization error occurred.'}</p>
          <p className="text-gray-400 mt-4 text-sm">
            Please ensure you have a <code>.env.local</code> file with the correct Supabase credentials (<code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>), or that you have configured the environment variables on your hosting platform.
          </p>
        </div>
      </div>
    );
  }

  return <MainApp userId={user.id} />;
};

const MainApp: React.FC<{userId: string}> = ({ userId }) => {
  const { signOut } = useAuth();
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.InputType);
  const [inputMode, setInputMode] = useState<InputMode>(null);
  const [scripts, setScripts] = useState<Script[]>([]);
  
  // State from Supabase
  const [paragraphsPerChunk, setParagraphsPerChunk] = useState(2);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [savedVoices, setSavedVoices] = useState<Voice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [allVoiceSettings, setAllVoiceSettings] = useState<AllVoiceSettings>({});

  // App State
  const [models, setModels] = useState<ElevenLabsModel[]>([]);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress[]>([]);
  const [finalAudios, setFinalAudios] = useState<FinalAudio[]>([]);
  const [isModelsLoading, setIsModelsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const selectedModel = useMemo(() => models.find(m => m.model_id === selectedModelId), [models, selectedModelId]);

  // Derived state for the current model's voice settings
  const currentVoiceSettings = useMemo(() => {
    if (!selectedModelId) return {};
    return allVoiceSettings[selectedModelId] || {};
  }, [allVoiceSettings, selectedModelId]);

  // Fetch initial state from Supabase
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!userId) return;
      // Fetch user preferences
      const { data: prefs, error: prefsError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (prefsError && prefsError.code !== 'PGRST116') { // Ignore 'range not found' error for new users
        console.error('Error fetching user preferences:', prefsError);
        setError(`Database Error: ${prefsError.message}`);
      } else if (prefs) {
        setParagraphsPerChunk(prefs.paragraphs_per_chunk || 2);
        setSelectedModelId(prefs.selected_model_id);
        setSelectedVoiceId(prefs.selected_voice_id);
        setAllVoiceSettings(prefs.voice_settings || {});
      }

      // Fetch saved voices
      const { data: voices, error: voicesError } = await supabase
        .from('voices')
        .select('*') // More robust: select all available columns
        .eq('user_id', userId);

      if (voicesError && !error) { 
        console.error('Error fetching voices:', voicesError);
        setError('Could not load saved voices from the database.');
      } else if (voices) {
        // Map to our Voice type, safely handling the optional previewUrl
        const mappedVoices = voices.map(v => ({
            id: v.voice_id,
            name: v.name,
            previewUrl: v.preview_url ?? undefined,
        }));
        setSavedVoices(mappedVoices);
      }
      
      setIsInitialLoad(false);
    };

    fetchInitialData();
  }, [userId, error]);

  // Fetch models from ElevenLabs via our serverless function
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsModelsLoading(true);
        setError(null);
        const fetchedModels = await getModels();
        setModels(fetchedModels);
        if (!selectedModelId && fetchedModels.length > 0) {
          setSelectedModelId(fetchedModels[0].model_id);
        }
      } catch (error) {
        console.error("Failed to fetch models", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred while fetching models.");
      } finally {
        setIsModelsLoading(false);
      }
    };
    fetchModels();
  }, [selectedModelId]);

  // Persist settings changes to Supabase
  const updatePreference = useCallback(async (updates: Partial<{ [key: string]: any }>) => {
      if (!userId) return;
      const { error: dbError } = await supabase
          .from('user_preferences')
          .upsert({ user_id: userId, ...updates, updated_at: new Date().toISOString() });

      if (dbError) {
          console.error(`Failed to upsert preference:`, dbError);
          setError(`Failed to save settings: ${dbError.message}`);
      }
  }, [userId]);

  const handleSettingsUpdate = useCallback((newSettingsForCurrentModel: VoiceSettingsValues) => {
    if (!selectedModelId) return;
    const newAllSettings = {
      ...allVoiceSettings,
      [selectedModelId]: newSettingsForCurrentModel,
    };
    setAllVoiceSettings(newAllSettings);
    updatePreference({ voice_settings: newAllSettings });
  }, [selectedModelId, allVoiceSettings, updatePreference]);


  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 6));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  
  const restart = () => {
    setCurrentStep(AppStep.InputType);
    setInputMode(null);
    setScripts([]);
    setGenerationProgress([]);
    setFinalAudios([]);
    setError(null);
  };

  const handleStartGeneration = useCallback(async () => {
    if (!scripts.length || !selectedVoiceId || !selectedModelId || !userId) {
        setError("Cannot start generation: Missing scripts, voice ID, model ID, or user session.");
        return;
    };
    
    setCurrentStep(AppStep.Generation);
    setFinalAudios([]);
    setError(null);

    const initialProgress = scripts.map(script => ({
      scriptId: script.id,
      scriptName: script.name,
      totalChunks: 0,
      completedChunks: 0,
      status: 'processing' as const,
    }));
    setGenerationProgress(initialProgress);

    for (const script of scripts) {
      const paragraphs = script.content.split('\n').filter(p => p.trim() !== '');
      const chunks: string[] = [];
      for (let i = 0; i < paragraphs.length; i += paragraphsPerChunk) {
        chunks.push(paragraphs.slice(i, i + paragraphsPerChunk).join('\n'));
      }
      
      setGenerationProgress(prev => prev.map(p => p.scriptId === script.id ? { ...p, totalChunks: chunks.length } : p));

      const audioBlobs: Blob[] = [];
      let generationFailed = false;
      for (let i = 0; i < chunks.length; i++) {
        try {
          const blob = await generateVoiceoverChunk(chunks[i], selectedVoiceId, selectedModelId, currentVoiceSettings);
          audioBlobs.push(blob);
          setGenerationProgress(prev => prev.map(p => p.scriptId === script.id ? { ...p, completedChunks: i + 1 } : p));
        } catch (error) {
          const errorMessage = `Generation failed for "${script.name}": ${error instanceof Error ? error.message : 'An unknown generation error occurred.'}`;
          console.error(errorMessage, error);
          setError(errorMessage);
          setGenerationProgress(prev => prev.map(p => p.scriptId === script.id ? { ...p, status: 'failed' } : p));
          generationFailed = true;
          break;
        }
      }
      
      if (!generationFailed && audioBlobs.length === chunks.length) {
        try {
            const stitchedBlob = new Blob(audioBlobs, { type: 'audio/mpeg' });
            const filePath = `${userId}/${script.id}_${Date.now()}.mp3`;

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('audio_files')
                .upload(filePath, stitchedBlob);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('audio_files')
                .getPublicUrl(uploadData.path);
            
            const publicUrl = urlData.publicUrl;

            // Save to generated_audio table
            const { error: dbError } = await supabase
              .from('generated_audio')
              .insert({ script_name: script.name, audio_url: publicUrl, script_id: script.id, user_id: userId });

            if (dbError) throw dbError;

            setFinalAudios(prev => [...prev, { scriptId: script.id, scriptName: script.name, url: publicUrl }]);
            setGenerationProgress(prev => prev.map(p => p.scriptId === script.id ? { ...p, status: 'completed' } : p));
        } catch (error) {
            const message = `Storage failed for "${script.name}": ${error instanceof Error ? error.message : 'Failed to save or upload audio file.'}`;
            console.error(message, error);
            setError(message);
            setGenerationProgress(prev => prev.map(p => p.scriptId === script.id ? { ...p, status: 'failed' } : p));
        }
      }
    }
  }, [scripts, selectedVoiceId, paragraphsPerChunk, selectedModelId, currentVoiceSettings, userId, supabase]);

  if (isInitialLoad) {
      return (
        <div className="min-h-screen text-white flex flex-col items-center justify-center p-4 bg-[#0E1117]">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text mb-4">
              VoiceGen Pro
            </h1>
            <div className="flex items-center space-x-3">
                <Spinner />
                <p className="text-gray-400 text-lg">Loading your workspace...</p>
            </div>
        </div>
      );
  }


  const renderStep = () => {
    switch (currentStep) {
      case AppStep.InputType:
        return <Step1_InputType setInputMode={setInputMode} onNext={handleNext} />;
      case AppStep.Configuration:
        return <Step2_Configuration inputMode={inputMode} setScripts={setScripts} paragraphsPerChunk={paragraphsPerChunk} setParagraphsPerChunk={(val) => { setParagraphsPerChunk(val); updatePreference({ paragraphs_per_chunk: val }); }} onNext={handleNext} onBack={handleBack} userId={userId} />;
      case AppStep.ModelSelection:
        return <Step3_ModelSelection models={models} selectedModelId={selectedModelId} setSelectedModelId={(id) => { setSelectedModelId(id); updatePreference({ selected_model_id: id }); }} onNext={handleNext} onBack={handleBack} isLoading={isModelsLoading} />;
      case AppStep.VoiceSelection:
        return <Step4_VoiceSelection userId={userId} savedVoices={savedVoices} setSavedVoices={setSavedVoices} selectedVoiceId={selectedVoiceId} setSelectedVoiceId={(id) => { setSelectedVoiceId(id); updatePreference({ selected_voice_id: id }); }} voiceSettings={currentVoiceSettings} setVoiceSettings={handleSettingsUpdate} model={selectedModel} onNext={handleStartGeneration} onBack={handleBack} />;
      case AppStep.Generation:
        return <Step5_Generation progress={generationProgress} onComplete={() => setCurrentStep(AppStep.Output)} />;
      case AppStep.Output:
        return <Step6_Output finalAudios={finalAudios} onRestart={restart} />;
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-start p-4 sm:p-8 bg-[#0E1117]">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8 relative">
          <div className="flex justify-between items-center">
            <div></div>
            <div className="flex-grow text-center">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                VoiceGen Pro
              </h1>
              <p className="text-gray-400 mt-2 text-lg">High-Quality Voiceovers, Simplified.</p>
            </div>
            <Button variant="secondary" onClick={signOut} className="!px-4 !py-2">Logout</Button>
          </div>
           {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded-lg animate-fade-in flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="font-bold text-xl">&times;</button>
            </div>
           )}
        </header>
        
        <main className="w-full">
            <div className="mb-12">
                <StepIndicator currentStep={currentStep} />
            </div>
            <div className="min-h-[450px] flex items-center justify-center">
                {renderStep()}
            </div>
        </main>
      </div>
    </div>
  );
}

export default App;
