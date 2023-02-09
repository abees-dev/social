/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-unused-vars */
import { createContext, ReactElement, useEffect, useState } from 'react';
import useCookiesTheme from 'src/hooks/useCookies';

interface IInitialState {
  themeMode: string;
  onChange: (mode: string) => void;
  onToggleMode: () => void;
}

const initialState: IInitialState = {
  themeMode: 'light',
  onChange: () => {},
  onToggleMode: () => {},
};

const SettingContext = createContext(initialState);

interface SettingProviderProp {
  children: ReactElement;
}

export default function SettingContextProvider({ children }: SettingProviderProp): ReactElement {
  const { themeMode, setThemeMode } = useCookiesTheme();

  const [theme, setTheme] = useState('light');

  useEffect(() => setTheme(themeMode || 'light'), [themeMode]);

  const handleChangeTheme = (mode: string) => {
    setThemeMode(mode);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <SettingContext.Provider value={{ themeMode: theme, onChange: handleChangeTheme, onToggleMode: handleToggleTheme }}>
      {children}
    </SettingContext.Provider>
  );
}

export { SettingContext };
