import React, { useEffect } from 'react';
import type { GenerationProgress } from '../../types';

interface Step5Props {
  progress: GenerationProgress[];
  onComplete: () => void;
}

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <div className="w-full bg-gray-200 dark:bg-[#2A2F3A] rounded-full h-4 overflow-hidden">
    <div
      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-4 rounded-full transition-all duration-500 ease-out"
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

export const Step5_Generation: React.FC<Step5Props> = ({ progress, onComplete }) => {
    useEffect(() => {
        if (progress.length === 0) return;
        const isComplete = progress.every(p => p.status === 'completed' || p.status === 'failed');
        
        if (isComplete) {
            // Automatically navigate to the output page after a short delay
            const timer = setTimeout(() => {
                onComplete();
            }, 1200);
            
            return () => clearTimeout(timer); // Cleanup timer on component unmount
        }
    }, [progress, onComplete]);

    const getStatusInfo = (p: GenerationProgress) => {
        switch (p.status) {
            case 'processing':
                return {
                    text: `${p.completedChunks} / ${p.totalChunks} chunks`,
                    percentage: p.totalChunks > 0 ? (p.completedChunks / p.totalChunks) * 90 : 0,
                    className: 'text-cyan-600 dark:text-cyan-400'
                };
            case 'stitching':
                return {
                    text: 'Stitching audio...',
                    percentage: 95,
                    className: 'text-cyan-600 dark:text-cyan-400'
                };
            case 'uploading':
                return {
                    text: 'Saving to cloud...',
                    percentage: 98,
                    className: 'text-cyan-600 dark:text-cyan-400'
                };
            case 'completed':
                return {
                    text: 'Completed',
                    percentage: 100,
                    className: 'text-green-500 dark:text-green-400'
                };
            case 'failed':
                return {
                    text: 'Failed',
                    percentage: p.totalChunks > 0 ? (p.completedChunks / p.totalChunks) * 90 : 0,
                    className: 'text-red-500 dark:text-red-400'
                };
            default:
                return { text: '', percentage: 0, className: '' };
        }
    };

    return (
        <div className="w-full max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">Generating Voiceovers...</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Please wait while we process your scripts. This may take a few moments.</p>

            <div className="space-y-6">
                {progress.map(p => {
                    const { text, percentage, className } = getStatusInfo(p);
                    return (
                        <div key={p.scriptId} className="bg-black/5 dark:bg-white/5 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium truncate pr-4">{p.scriptName}</span>
                                <span className={`text-sm ${className}`}>{text}</span>
                            </div>
                            <ProgressBar value={percentage} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
