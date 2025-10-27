
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

const ConnectorLine: React.FC<{ active: boolean }> = ({ active }) => (
  <svg className="w-full h-8" preserveAspectRatio="none" viewBox="0 0 100 20">
    <path
      d="M0,10 C20,20 80,0 100,10"
      stroke={active ? '#EF4444' : '#E5E7EB'}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      className={`${!active && 'dark:stroke-[#2A2F3A]'}`}
    />
  </svg>
);


export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.name}>
            <li className="relative flex flex-col items-center flex-shrink-0 w-20 md:w-28 text-center">
              <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 border-4
                    ${step.id === currentStep ? 'bg-[#00BFFF] text-white border-cyan-500/30 scale-110' : ''}
                    ${step.id < currentStep ? 'bg-gray-100 text-red-500 border-transparent dark:bg-gray-700' : ''}
                    ${step.id > currentStep ? 'bg-gray-200 text-gray-500 border-transparent dark:bg-[#2A2F3A] dark:text-gray-400' : ''}
                  `}
                >
                  {step.id}
              </div>
              <span
                className={`mt-3 text-xs md:text-sm font-medium w-full truncate
                  ${step.id === currentStep ? 'text-[#00BFFF]' : 'text-gray-500 dark:text-gray-400'}
                `}
              >
                {step.name}
              </span>
            </li>

            {index !== steps.length - 1 && (
              <li className="flex-auto">
                <ConnectorLine active={step.id < currentStep} />
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};
