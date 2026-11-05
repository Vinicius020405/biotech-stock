import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

// Paletas de cores centralizadas
export const lightTheme = {
  isDark: false,
  bg: '#F8FAFC',
  card: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  inputBg: '#F1F5F9',
  cardIconBgBlue: 'rgba(59, 130, 246, 0.1)',
  cardIconBgGreen: 'rgba(34, 197, 94, 0.1)',
  cardIconBgPurple: 'rgba(168, 85, 247, 0.1)',
  cardIconBgOrange: 'rgba(249, 115, 22, 0.1)',
};

export const darkTheme = {
  isDark: true,
  bg: '#020617',
  card: '#1E293B',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  border: '#334155',
  inputBg: '#020617',
  cardIconBgBlue: '#172554',
  cardIconBgGreen: '#052E16',
  cardIconBgPurple: '#3B0764',
  cardIconBgOrange: '#431407',
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [loadingTheme, setLoadingTheme] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedDark = await AsyncStorage.getItem('@pref_dark_mode');
      if (savedDark !== null) {
        setDarkMode(JSON.parse(savedDark));
      }
    } catch (error) {
      console.log('Erro ao carregar tema:', error);
    } finally {
      setLoadingTheme(false);
    }
  };

  const toggleDarkMode = async (value) => {
    setDarkMode(value);
    await AsyncStorage.setItem('@pref_dark_mode', JSON.stringify(value));
  };

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, theme, loadingTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar o tema em qualquer ecrã
export const useTheme = () => useContext(ThemeContext);