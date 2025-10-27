

import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Spinner } from '../common/Spinner';
import type { ElevenLabsModel } from '../../types';

interface Step3Props {
  models: ElevenLabsModel[];
  selectedModelId: string | null;
  setSelectedModelId: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export const Step3_ModelSelection: React.FC<Step3Props> = ({ models, selectedModelId, setSelectedModelId, onNext, onBack, isLoading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    const initialIndex = models.findIndex(m => m.model_id === selectedModelId);
    if (initialIndex !== -1) {
      setCurrentIndex(initialIndex);
    } else if (models.length > 0) {
      setCurrentIndex(0);
      setSelectedModelId(models[0].model_id);
    }
  }, [models, selectedModelId, setSelectedModelId]);

  const handlePrev = () => {
    const newIndex = currentIndex === 0 ? models.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedModelId(models[newIndex].model_id);
  };

  const handleNextCarousel = () => {
    const newIndex = currentIndex === models.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setSelectedModelId(models[newIndex].model_id);
  };
  
  if (isLoading) {
      return <div className="flex flex-col items-center justify-center"><Spinner /><p className="mt-4 text-gray-600 dark:text-gray-400">Loading Models...</p></div>;
  }

  return (
    <Card className="w-full max-w-2xl text-center">
      <h2 className="text-2xl font-bold mb-6">Select a Model</h2>
      
      <div className="relative h-48 flex items-center justify-center">
        {models.length > 0 && (
          <div className="w-full max-w-md p-4">
            <h3 className="text-xl font-semibold text-cyan-600 dark:text-cyan-400">{models[currentIndex].name}</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2 h-16">{models[currentIndex].description}</p>
          </div>
        )}
        
        {models.length > 1 && (
            <>
            <button onClick={handlePrev} className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={handleNextCarousel} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            </>
        )}
      </div>
      
       <div className="flex justify-center space-x-2 mt-4">
        {models.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setSelectedModelId(models[index].model_id);
            }}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-cyan-500 dark:bg-cyan-400' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
            }`}
          ></button>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button onClick={onNext} disabled={!selectedModelId}>Configure Voice</Button>
      </div>
    </Card>
  );
};