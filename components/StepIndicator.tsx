
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
      <ol role="list" className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.name}>
            <li className="relative flex-shrink-0">
              <div className="flex flex-col items-center text-center w-20 md:w-28">
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-all duration-300
                    ${step.id === currentStep ? 'bg-[#00BFFF] text-white ring-4 ring-cyan-500/30 scale-110' : ''}
                    ${step.id < currentStep ? 'bg-green-500 text-white' : ''}
                    ${step.id > currentStep ? 'bg-gray-200 text-gray-500 dark:bg-[#2A2F3A] dark:text-gray-400' : ''}
                  `}
                >
                  {step.id < currentStep ? (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : step.id}
                </div>
                <span
                  className={`mt-2 text-xs md:text-sm font-medium hidden sm:block w-full truncate
                    ${step.id === currentStep ? 'text-[#00BFFF]' : 'text-gray-500 dark:text-gray-400'}
                  `}
                >
                  {step.name}
                </span>
              </div>
            </li>

            {index !== steps.length - 1 && (
              <li className="flex-auto">
                <div
                  className={`h-1 transition-colors duration-500
                    ${step.id < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-[#2A2F3A]'}
                  `}
                />
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};
