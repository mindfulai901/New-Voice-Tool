import React from 'react';
import type { AppView } from '../../App';

interface FooterProps {
    setView: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ setView }) => {
  return (
    <footer className="w-full max-w-5xl mx-auto text-center text-gray-500 dark:text-gray-400 text-sm py-6 mt-8 border-t border-gray-200 dark:border-white/10">
      <div className="flex justify-center items-center gap-6">
        <button onClick={() => setView('manual')} className="hover:text-cyan-400 transition-colors">User Manual</button>
        <span className="opacity-50">|</span>
        <button onClick={() => setView('privacy')} className="hover:text-cyan-400 transition-colors">Privacy Policy</button>
         <span className="opacity-50">|</span>
        <button onClick={() => setView('contact')} className="hover:text-cyan-400 transition-colors">Contact</button>
      </div>
      <p className="mt-4">&copy; {new Date().getFullYear()} VoiceGen Pro. All rights reserved.</p>
    </footer>
  );
};