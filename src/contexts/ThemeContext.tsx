import React from 'react';

interface ThemeContextValue {
  mode: 'light' | 'dark';
  toggleMode: () => void;
}

export const ThemeContext = React.createContext<ThemeContextValue>({
  mode: 'dark',
  toggleMode: () => {},
});

export const useThemeMode = () => React.useContext(ThemeContext);
