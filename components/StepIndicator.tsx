
import React from 'react';
import { AppStep } from '../types';

interface StepIndicatorProps {
  currentStep: AppStep;
}

const steps = [
  { id: AppStep.InputType, name: 'Input Type' },
  { id: AppStep.Configuration, name: 'Configuration' },
  { id: AppStep.ModelSelection, name: 'Model' },
  { id: AppStep.VoiceSelection, name: 'Voice & Settings' },
  { id: AppStep.Generation, name: 'Generate' },
  { id: AppStep.Output, name: 'Output' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center justify-center space-x-2 md:space-x-4">
        {steps.map((step, index) => (
          <li key={step.name} className="flex items-center">
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-colors duration-300
                  ${step.id === currentStep ? 'bg-[#00BFFF] text-white ring-4 ring-cyan-500/30' : ''}
                  ${step.id < currentStep ? 'bg-green-500 text-white' : ''}
                  ${step.id > currentStep ? 'bg-[#2A2F3A] text-gray-400' : ''}
                `}
              >
                {step.id < currentStep ? '✓' : step.id}
              </div>
              <span
                className={`mt-2 text-xs md:text-sm hidden sm:block
                  ${step.id === currentStep ? 'text-[#00BFFF] font-semibold' : 'text-gray-400'}
                `}
              >
                {step.name}
              </span>
            </div>

            {index !== steps.length - 1 && (
              <div
                className={`h-1 w-8 md:w-16 mx-2 transition-colors duration-500
                  ${step.id < currentStep ? 'bg-green-500' : 'bg-[#2A2F3A]'}
                `}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
