import { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
};

export const DarkModeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    try {
      // Check localStorage first
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        console.log('Loading dark mode from localStorage:', saved);
        return JSON.parse(saved);
      }
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      console.log('Using system preference:', systemPrefersDark);
      return systemPrefersDark;
    } catch (error) {
      console.error('Error initializing dark mode:', error);
      return false;
    }
  });

  useEffect(() => {
    try {
      // Apply dark mode class to document
      const htmlElement = document.documentElement;
      if (isDark) {
        htmlElement.classList.add('dark');
        console.log('✓ Dark mode ENABLED - dark class added to <html>');
      } else {
        htmlElement.classList.remove('dark');
        console.log('✓ Dark mode DISABLED - dark class removed from <html>');
      }
      // Save to localStorage
      localStorage.setItem('darkMode', JSON.stringify(isDark));
      console.log('Saved to localStorage:', isDark);
    } catch (error) {
      console.error('Error updating dark mode:', error);
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    console.log('🌓 Toggle dark mode clicked! Current:', isDark, '→ New:', !isDark);
    setIsDark(prev => !prev);
  };

  const value = {
    isDark,
    toggleDarkMode,
    setDarkMode: setIsDark
  };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};
