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
  HistoryItem,
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
import { HistoryPanel } from './components/history/HistoryPanel';
import { useAuth } from './components/auth/AuthProvider';
import { LandingPage } from './components/LandingPage';
import { Spinner } from './components/common/Spinner';
import { UpdatePasswordModal } from './components/auth/UpdatePasswordModal';
import { ProfileDropdown } from './components/profile/ProfileDropdown';
import { AdvancedSettingsModal } from './components/profile/AdvancedSettingsModal';

const App: React.FC = () => {
  const { session, user, loading: authLoading, isPasswordRecovery, clearPasswordRecoveryFlag, signOut } = useAuth();
  
  const handlePasswordUpdated = () => {
    // The user has been signed out by the modal.
    // Clearing the flag will cause a re-render, and the app will show the LandingPage.
    clearPasswordRecoveryFlag();
  };
  
  const handleCancelPasswordUpdate = async () => {
    clearPasswordRecoveryFlag();
    await signOut(); // Sign out to invalidate the recovery session
  };

  if (authLoading) {
    return (
        <div className="min-h-screen text-gray-800 dark:text-white flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-[#0E1117]">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500 text-transparent bg-clip-text mb-4">
              VoiceGen Pro
            </h1>
            <div className="flex items-center space-x-3">
                <Spinner />
                <p className="text-gray-600 dark:text-gray-400 text-lg">Loading Session...</p>
            </div>
        </div>
      );
  }

  if (supabaseError) {
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
  
  // If the auth state is PASSWORD_RECOVERY, exclusively show the update modal.
  if (isPasswordRecovery) {
    return <UpdatePasswordModal onUpdated={handlePasswordUpdated} onCancel={handleCancelPasswordUpdate} />;
  }

  // Otherwise, proceed with the normal flow.
  if (!session || !user) {
    return <LandingPage />;
  }
  
  return <MainApp userId={user.id} />;
};

interface MainAppProps {
  userId: string;
}

const MainApp: React.FC<MainAppProps> = ({ userId }) => {
  const { signOut, profile } = useAuth();
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
  
  // UI State
  const [showHistory, setShowHistory] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const selectedModel = useMemo(() => models.find(m => m.model_id === selectedModelId), [models, selectedModelId]);

  const currentVoiceSettings = useMemo(() => {
    if (!selectedModelId) return {};
    return allVoiceSettings[selectedModelId] || {};
  }, [allVoiceSettings, selectedModelId]);

  const fetchHistory = useCallback(async () => {
    if (!userId || !supabase) return;
    setIsHistoryLoading(true);
    setError(null);
    try {
        const { data, error: dbError } = await supabase
            .from('generated_audio')
            .select(`
                id,
                created_at,
                script_name,
                audio_url,
                scripts ( content )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (dbError) throw dbError;

        const items: HistoryItem[] = data.map((item: any) => {
            const url = new URL(item.audio_url);
            const filePath = url.pathname.split('/public/audio_files/')[1];
            return {
                id: item.id,
                scriptName: item.script_name,
                audioUrl: item.audio_url,
                createdAt: item.created_at,
                scriptContent: item.scripts?.content || 'Original script not found.',
                filePath: filePath,
            };
        });
        setHistoryItems(items);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Could not load generation history.";
        console.error("History fetch error:", err);
        setError(message);
    } finally {
        setIsHistoryLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!userId) return;
      
      const { data: prefs, error: prefsError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (prefsError && prefsError.code !== 'PGRST116') {
        console.error('Error fetching user preferences:', prefsError);
        setError(`Database Error: ${prefsError.message}`);
      } else if (prefs) {
        setParagraphsPerChunk(prefs.paragraphs_per_chunk || 2);
        setSelectedModelId(prefs.selected_model_id);
        setSelectedVoiceId(prefs.selected_voice_id);
        setAllVoiceSettings(prefs.voice_settings || {});
      }

      const { data: voices, error: voicesError } = await supabase
        .from('voices')
        .select('*')
        .eq('user_id', userId);

      if (voicesError && !error) { 
        console.error('Error fetching voices:', voicesError);
        setError('Could not load saved voices from the database.');
      } else if (voices) {
        const mappedVoices = voices.map(v => ({ id: v.voice_id, name: v.name, previewUrl: v.preview_url ?? undefined }));
        setSavedVoices(mappedVoices);
      }
      
      await fetchHistory();
      setIsInitialLoad(false);
    };

    fetchInitialData();
  }, [userId, error, fetchHistory]);

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
    const newAllSettings = { ...allVoiceSettings, [selectedModelId]: newSettingsForCurrentModel };
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
  
  const handleDeleteHistoryItems = async (itemsToDelete: HistoryItem[]) => {
    if (!itemsToDelete.length || !supabase) return;

    const itemIds = itemsToDelete.map(item => item.id);
    const filePaths = itemsToDelete.map(item => item.filePath);

    try {
        // 1. Delete files from storage
        const { error: storageError } = await supabase.storage.from('audio_files').remove(filePaths);
        if (storageError) throw storageError;

        // 2. Delete records from database
        const { error: dbError } = await supabase.from('generated_audio').delete().in('id', itemIds);
        if (dbError) throw dbError;

        // 3. Update local state
        setHistoryItems(prev => prev.filter(item => !itemIds.includes(item.id)));

    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete history items.";
        console.error("Delete history error:", err);
        setError(message);
    }
  };

  const handleStartGeneration = useCallback(async () => {
    if (!scripts.length || !selectedVoiceId || !selectedModelId || !userId || !supabase) {
        setError("Cannot start generation: Missing scripts, voice ID, model ID, or user session.");
        return;
    };
    
    setCurrentStep(AppStep.Generation);
    setFinalAudios([]);
    setError(null);

    const initialProgress = scripts.map(script => ({ scriptId: script.id, scriptName: script.name, totalChunks: 0, completedChunks: 0, status: 'processing' as const }));
    setGenerationProgress(initialProgress);

    for (const script of scripts) {
      const paragraphs = script.content.split('\n').filter(p => p.trim() !== '');
      const chunks: string[] = [];
      for (let i = 0; i < paragraphs.length; i += paragraphsPerChunk) {
        chunks.push(paragraphs.slice(i, i + paragraphsPerChunk).join('\n'));
      }
      
      setGenerationProgress(prev => prev.map(p => p.scriptId === script.id ? { ...p, totalChunks: chunks.length } : p));

      const allAudioBlobs: Blob[] = [];
      let generationFailed = false;
      const BATCH_SIZE = 5;

      for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batchChunks = chunks.slice(i, i + BATCH_SIZE);
        
        const promises = batchChunks.map(chunk => 
          generateVoiceoverChunk(chunk, selectedVoiceId, selectedModelId, currentVoiceSettings)
        );
        
        const results = await Promise.allSettled(promises);

        const successfulBlobs: Blob[] = [];
        const batchErrors: string[] = [];

        results.forEach(result => {
          if (result.status === 'fulfilled') {
            successfulBlobs.push(result.value);
          } else {
            batchErrors.push(result.reason instanceof Error ? result.reason.message : String(result.reason));
          }
        });
        
        if (batchErrors.length > 0) {
            const errorMessage = `Generation failed for "${script.name}": ${batchErrors.join(', ')}`;
            console.error(errorMessage);
            setError(errorMessage);
            setGenerationProgress(prev => prev.map(p => p.scriptId === script.id ? { ...p, status: 'failed' } : p));
            generationFailed = true;
            break; 
        }

        allAudioBlobs.push(...successfulBlobs);
        
        const currentCompletedCount = allAudioBlobs.length;
        setGenerationProgress(prev => 
          prev.map(p => 
            p.scriptId === script.id 
              ? { ...p, completedChunks: currentCompletedCount } 
              : p
          )
        );
      }
      
      if (!generationFailed && allAudioBlobs.length === chunks.length) {
        try {
            const stitchedBlob = new Blob(allAudioBlobs, { type: 'audio/mpeg' });
            const filePath = `${userId}/${script.id}_${Date.now()}.mp3`;

            const { data: uploadData, error: uploadError } = await supabase.storage.from('audio_files').upload(filePath, stitchedBlob);
            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage.from('audio_files').getPublicUrl(uploadData.path);
            const publicUrl = urlData.publicUrl;

            const { error: dbError } = await supabase.from('generated_audio').insert({ script_name: script.name, audio_url: publicUrl, script_id: script.id, user_id: userId });
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
    await fetchHistory(); // Refresh history after generation completes
  }, [scripts, selectedVoiceId, paragraphsPerChunk, selectedModelId, currentVoiceSettings, userId, supabase, fetchHistory]);

  if (isInitialLoad) {
      return (
        <div className="min-h-screen text-gray-800 dark:text-white flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-[#0E1117]">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500 text-transparent bg-clip-text mb-4">
              VoiceGen Pro
            </h1>
            <div className="flex items-center space-x-3">
                <Spinner />
                <p className="text-gray-600 dark:text-gray-400 text-lg">Loading your workspace...</p>
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
    <div className="min-h-screen text-gray-900 dark:text-white flex flex-col items-center justify-start p-4 sm:p-8 bg-gray-50 dark:bg-[#0E1117]">
      {showHistory && (
          <HistoryPanel 
              items={historyItems}
              isLoading={isHistoryLoading}
              onClose={() => setShowHistory(false)}
              onDelete={handleDeleteHistoryItems}
          />
      )}
      {showAdvancedSettings && (
        <AdvancedSettingsModal onClose={() => setShowAdvancedSettings(false)} />
      )}
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8 relative">
          <div className="flex justify-between items-center">
            <div className="w-24"></div> {/* Spacer */}
            <div className="flex-grow text-center">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500 text-transparent bg-clip-text">
                VoiceGen Pro
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">High-Quality Voiceovers, Simplified.</p>
            </div>
             <div className="w-24 flex justify-end">
                <ProfileDropdown 
                  profile={profile}
                  onShowHistory={() => setShowHistory(true)}
                  onShowAdvancedSettings={() => setShowAdvancedSettings(true)}
                  onSignOut={signOut}
                />
             </div>
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