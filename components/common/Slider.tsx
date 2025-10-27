
import React from 'react';

interface SliderProps {
  label: string;
  id: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Slider: React.FC<SliderProps> = ({ label, id, min, max, step, value, onChange }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="flex items-center space-x-4">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="w-full h-2 bg-gray-200 dark:bg-[#2A2F3A] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#00BFFF] [&::-webkit-slider-thumb]:rounded-full"
        />
        <span className="text-cyan-500 dark:text-cyan-400 font-mono text-sm w-12 text-center">{Number(value).toFixed(2)}</span>
      </div>
    </div>
  );
};