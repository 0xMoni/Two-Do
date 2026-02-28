import React, { createContext, useContext, ReactNode } from 'react';
import { useTheme } from '../lib/useTheme';
import { RPG_COLORS } from '../lib/constants';

export interface ThemeColors {
  background: string;
  card: string;
  cardBorder: string;
  accent: string;
  gold: string;
  success: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  danger: string;
  inputBg: string;
  inputBorder: string;
  overlay: string;
  statusBarStyle: 'light' | 'dark';
}

const darkColors: ThemeColors = {
  ...RPG_COLORS,
  statusBarStyle: 'light',
};

const lightColors: ThemeColors = {
  background: '#f5f0ff',
  card: '#ffffff',
  cardBorder: '#d4c8ef',
  accent: '#7c3aed',
  gold: '#d97706',
  success: '#10b981',
  text: '#1e1033',
  textSecondary: '#5b4a7a',
  textMuted: '#9584b0',
  danger: '#ef4444',
  inputBg: '#ede8f7',
  inputBorder: '#d4c8ef',
  overlay: 'rgba(30, 16, 51, 0.5)',
  statusBarStyle: 'dark',
};

interface ThemeContextValue {
  dark: boolean;
  colors: ThemeColors;
  toggle: () => void;
  loaded: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  dark: true,
  colors: darkColors,
  toggle: () => {},
  loaded: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { dark, toggle, loaded } = useTheme();
  const colors = dark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ dark, colors, toggle, loaded }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
