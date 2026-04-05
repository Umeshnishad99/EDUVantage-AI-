import React, { createContext, useContext, useEffect, useState } from 'react';

type Mode = 'light' | 'dark';
type ThemeColor = 'blue' | 'purple' | 'emerald' | 'rose' | 'amber';

interface ThemeContextType {
  mode: Mode;
  themeColor: ThemeColor;
  setMode: (mode: Mode) => void;
  setThemeColor: (color: ThemeColor) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<Mode>(() => {
    const savedMode = localStorage.getItem('theme-mode');
    if (savedMode === 'light' || savedMode === 'dark') return savedMode;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [themeColor, setThemeColor] = useState<ThemeColor>(() => {
    const savedColor = localStorage.getItem('theme-color');
    if (['blue', 'purple', 'emerald', 'rose', 'amber'].includes(savedColor as string)) {
      return savedColor as ThemeColor;
    }
    return 'blue';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove old classes
    root.classList.remove('light', 'dark');
    root.classList.remove('theme-blue', 'theme-purple', 'theme-emerald', 'theme-rose', 'theme-amber');
    
    // Add new classes
    root.classList.add(mode);
    root.classList.add(`theme-${themeColor}`);
    
    // Update local storage
    localStorage.setItem('theme-mode', mode);
    localStorage.setItem('theme-color', themeColor);
  }, [mode, themeColor]);

  const toggleMode = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ mode, themeColor, setMode, setThemeColor, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
