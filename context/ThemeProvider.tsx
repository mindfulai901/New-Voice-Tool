
import React, { createContext, useState, useEffect, useContext } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to 'light', will be updated by useEffect on mount
  const [theme, setTheme] = useState<Theme>('light');

  // Effect to set the initial theme from localStorage or system preference
  useEffect(() => {
    let initialTheme: Theme = 'light';
    try {
      if (typeof window !== 'undefined') {
        const savedTheme = window.localStorage.getItem('theme') as Theme | null;
        if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
          initialTheme = savedTheme;
        } else {
          initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
      }
    } catch (error) {
      console.error('Could not access theme preference.', error);
      initialTheme = 'light'; // Fallback
    }
    setTheme(initialTheme);
  }, []); // Empty dependency array means this runs only once on mount

  // Effect to apply theme changes to the DOM and localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      
      // Clean up previous theme classes
      root.classList.remove('light', 'dark');

      // Add the new theme class
      root.classList.add(theme);

      try {
        window.localStorage.setItem('theme', theme);
      } catch (error) {
        console.error('Could not save theme to localStorage.', error);
      }
    }
  }, [theme]); // Runs whenever theme state changes

  const value = { theme, setTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
