import React, { createContext, useState, useEffect, useContext } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to get the initial theme, preventing flash of incorrect theme
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'light'; // Default for server-side rendering
  }
  try {
    const savedTheme = window.localStorage.getItem('theme') as Theme | null;
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      return savedTheme;
    }
    // If no saved theme, use system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch (error) {
    console.error('Could not access theme preference.', error);
    return 'light'; // Fallback
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state directly from localStorage/system preference to avoid FOUC
  const [theme, _setTheme] = useState<Theme>(getInitialTheme);

  // Effect to apply theme changes to the DOM when the theme state changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Create a setter function that persists the theme to localStorage
  const setTheme = (newTheme: Theme) => {
    try {
      window.localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Could not save theme to localStorage.', error);
    }
    _setTheme(newTheme);
  };
  
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
