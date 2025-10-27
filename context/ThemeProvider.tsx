import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for theme in a try-catch block for environments where localStorage might be disabled.
    try {
      if (typeof window !== 'undefined') {
        const savedTheme = window.localStorage.getItem('theme') as Theme | null;
        // Ensure saved theme is a valid value
        if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
          return savedTheme;
        }
        // If no saved theme, check system preference
        const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return userPrefersDark ? 'dark' : 'light';
      }
    } catch (error) {
      console.error('Could not access localStorage to get theme.', error);
    }
    // Default theme if window is not defined or localStorage fails
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Save theme preference to localStorage, wrapped in try-catch.
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Could not access localStorage to set theme.', error);
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
