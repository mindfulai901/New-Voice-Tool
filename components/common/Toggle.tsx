import React from 'react';

interface ToggleProps {
  label: string;
  id: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ label, id, enabled, onChange }) => {
  return (
    <div className="flex items-center justify-between w-full py-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-600 dark:text-gray-300">
        {label}
      </label>
      <button
        id={id}
        type="button"
        className={`${
          enabled ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-[#2A2F3A]'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0E1117]`}
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
      >
        <span
          aria-hidden="true"
          className={`${
            enabled ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );
};