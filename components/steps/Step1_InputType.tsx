
import React from 'react';
import { Card } from '../common/Card';
import type { InputMode } from '../../types';

interface Step1Props {
  setInputMode: (mode: InputMode) => void;
  onNext: () => void;
}

// Fix: Replaced JSX.Element with React.ReactElement to resolve the "Cannot find namespace 'JSX'" error.
const InputModeCard: React.FC<{ title: string, description: string, icon: React.ReactElement, onClick: () => void }> = ({ title, description, icon, onClick }) => (
    <Card 
        className="text-center w-full sm:w-64 transform hover:-translate-y-2 hover:border-cyan-400 cursor-pointer"
        onClick={onClick}
    >
        <div className="flex justify-center mb-4 text-cyan-400">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
    </Card>
);


export const Step1_InputType: React.FC<Step1Props> = ({ setInputMode, onNext }) => {
  const handleSelect = (mode: InputMode) => {
    setInputMode(mode);
    onNext();
  };

  return (
    <div className="w-full max-w-2xl text-center">
      <h2 className="text-3xl font-bold mb-4">Choose Your Workflow</h2>
      <p className="text-gray-400 mb-12">How would you like to provide your script(s)?</p>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
        <InputModeCard
            title="Single Script Mode"
            description="Paste a single text script for voice generation."
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            onClick={() => handleSelect('single')}
        />
        <InputModeCard
            title="Bulk Mode"
            description="Upload a .txt or .csv file with multiple scripts."
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            onClick={() => handleSelect('bulk')}
        />
      </div>
    </div>
  );
};