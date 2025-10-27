import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeProvider';
import type { Profile } from '../../types';

interface ProfileDropdownProps {
  profile: Profile | null;
  onSignOut: () => void;
  onShowHistory: () => void;
  onShowAdvancedSettings: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ profile, onSignOut, onShowHistory, onShowAdvancedSettings }) => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userName = profile ? `${profile.first_name} ${profile.last_name}` : 'Loading...';
  const userInitials = profile ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() : '';
  
  // Close dropdown on clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };
  
  const handleMenuClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-full text-white font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-gray-100 dark:focus:ring-offset-[#0E1117]"
      >
        {userInitials}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1F242F] border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20 animate-fade-in origin-top-right">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-gray-800 dark:text-white truncate">{userName}</p>
          </div>
          <div className="p-2">
             <div className="px-2 py-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">THEME</p>
                <div className="flex items-center gap-2">
                    <button onClick={() => handleThemeChange('light')} className={`w-1/2 py-1.5 text-sm rounded-md transition-colors ${theme === 'light' ? 'bg-cyan-500 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>Light</button>
                    <button onClick={() => handleThemeChange('dark')} className={`w-1/2 py-1.5 text-sm rounded-md transition-colors ${theme === 'dark' ? 'bg-cyan-500 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>Dark</button>
                </div>
            </div>
            <button onClick={() => handleMenuClick(onShowHistory)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              Generation History
            </button>
            <button onClick={() => handleMenuClick(onShowAdvancedSettings)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              Advanced Settings
            </button>
          </div>
          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
             <button onClick={() => handleMenuClick(onSignOut)} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-md">
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};