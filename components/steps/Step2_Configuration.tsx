import React, { useState, useCallback } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { supabase } from '../../services/supabaseClient';
import type { InputMode, Script } from '../../types';

interface Step2Props {
  inputMode: InputMode;
  setScripts: (scripts: Script[]) => void;
  paragraphsPerChunk: number;
  setParagraphsPerChunk: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
  userId: string;
}

export const Step2_Configuration: React.FC<Step2Props> = ({ inputMode, setScripts, paragraphsPerChunk, setParagraphsPerChunk, onNext, onBack, userId }) => {
  const [singleScript, setSingleScript] = useState('');
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tempScripts, setTempScripts] = useState<Omit<Script, 'id' | 'user_id'>[]>([]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) {
        setTempScripts([]);
        setFileNames([]);
        return;
      };

      setError(null);
      setFileNames(Array.from(files).map((f: File) => f.name));

      const fileReadPromises: Promise<Omit<Script, 'id' | 'user_id'>[]>[] = Array.from(files).map((file: File) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            const scriptsFromFile: Omit<Script, 'id' | 'user_id'>[] = [];
            
            if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
              const lines = content.split('\n').filter(line => line.trim() !== '');
              lines.forEach((line, index) => {
                scriptsFromFile.push({ 
                  name: `${file.name.replace(/\.[^/.]+$/, "")} (Line ${index + 1})`, 
                  content: line.trim() 
                });
              });
            } else { 
              const lines = content.split('\n').filter(line => line.trim() !== '');
              scriptsFromFile.push({ 
                name: file.name.replace(/\.[^/.]+$/, ""), 
                content: lines.join('\n') 
              });
            }
            resolve(scriptsFromFile);
          };
          reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
          reader.readAsText(file);
        });
      });

      Promise.all(fileReadPromises)
        .then(scriptsArrays => {
          const allScripts = scriptsArrays.flat();
          setTempScripts(allScripts);
        })
        .catch(err => {
          setError(err.message);
          setTempScripts([]);
          setFileNames([]);
        });
    },
    []
  );

  const handleSubmit = async () => {
    setError(null);
    if (!userId) {
        setError("User not logged in. Please refresh the page.");
        return;
    }
    let scriptsToProcess: Omit<Script, 'id' | 'user_id'>[] = [];

    if (inputMode === 'single') {
      if (!singleScript.trim()) {
        setError('Script content cannot be empty.');
        return;
      }
      scriptsToProcess = [{ name: 'My Script', content: singleScript.trim() }];
    } else {
      if (tempScripts.length === 0) {
        setError('Please upload and process at least one file.');
        return;
      }
      scriptsToProcess = tempScripts;
    }

    // Add user_id to each script before upload
    const scriptsToUpload = scriptsToProcess.map(s => ({...s, user_id: userId }));

    // Insert scripts into Supabase
    const { data, error: dbError } = await supabase.from('scripts').insert(scriptsToUpload).select();

    if (dbError) {
        setError(`Failed to save scripts to database: ${dbError.message}`);
        return;
    }
    
    setScripts(data as Script[]);
    onNext();
  };
  
  const handleParagraphsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= 100) {
      setParagraphsPerChunk(value);
    }
  };


  return (
    <Card className="w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Script Configuration</h2>
      
      {inputMode === 'single' ? (
        <div className="mb-6">
          <label htmlFor="script-input" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            Paste Your Script
          </label>
          <textarea
            id="script-input"
            rows={8}
            className="w-full p-3 bg-gray-50 dark:bg-[#0E1117] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            placeholder="Enter your script here. Each new line is treated as a paragraph."
            value={singleScript}
            onChange={(e) => setSingleScript(e.target.value)}
          />
        </div>
      ) : (
        <div className="mb-6 text-center">
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            Upload Script File(s) (.txt or .csv)
          </label>
          <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
            <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label htmlFor="file-upload-input" className="relative cursor-pointer bg-transparent rounded-md font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 focus-within:outline-none">
                        <span>Upload files</span>
                        <input id="file-upload-input" name="file-upload" type="file" className="sr-only" accept=".txt,.csv" onChange={handleFileChange} multiple />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">{fileNames.length > 0 ? `${fileNames.length} file(s) selected` : 'TXT or CSV up to 10MB'}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="paragraphs-per-chunk" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
          Paragraphs per Generation
        </label>
        <div className="relative group">
          <input
            id="paragraphs-per-chunk"
            type="number"
            min="1"
            max="100"
            value={paragraphsPerChunk}
            onChange={handleParagraphsChange}
            className="w-full p-3 bg-gray-50 dark:bg-[#0E1117] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 p-2 text-xs text-center text-white bg-gray-700 dark:bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chunks of this many paragraphs are sent for smoother, higher-quality voice generation.
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-700 dark:border-t-gray-800"></div>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
      
      <div className="flex justify-between items-center">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button onClick={handleSubmit}>Select Model</Button>
      </div>
    </Card>
  );
};