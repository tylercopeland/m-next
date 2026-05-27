import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { cssVariables } from '@m-next/tokens';
import composeTheme, { themeNames } from './compose-theme';

const SwitcherContext = createContext(null);

const InjectCssVariables = () => (
  // eslint-disable-next-line react/no-danger
  <style data-m-next-tokens dangerouslySetInnerHTML={{ __html: cssVariables }} />
);

const ThemeProvider = ({
  name: nameProp,
  theme: themeProp,
  defaultName = 'light',
  injectCssVariables = true,
  children,
}) => {
  const isControlled = nameProp != null || themeProp != null;
  const [internalName, setInternalName] = useState(defaultName);
  const activeName = nameProp ?? internalName;

  const composed = useMemo(
    () => (themeProp ? composeTheme(themeProp) : composeTheme(activeName)),
    [themeProp, activeName],
  );

  const setTheme = useCallback(
    (next) => {
      if (isControlled) {
        // eslint-disable-next-line no-console
        console.warn('@m-next/theme: setTheme() ignored — ThemeProvider is controlled via the `name` or `theme` prop.');
        return;
      }
      if (!themeNames.includes(next)) {
        // eslint-disable-next-line no-console
        console.warn(`@m-next/theme: unknown theme "${next}". Expected one of: ${themeNames.join(', ')}`);
        return;
      }
      setInternalName(next);
    },
    [isControlled],
  );

  const switcher = useMemo(
    () => ({ current: activeName, setTheme, available: themeNames }),
    [activeName, setTheme],
  );

  return (
    <SwitcherContext.Provider value={switcher}>
      <EmotionThemeProvider theme={composed}>
        {injectCssVariables && <InjectCssVariables />}
        {children}
      </EmotionThemeProvider>
    </SwitcherContext.Provider>
  );
};

export const useThemeSwitcher = () => {
  const ctx = useContext(SwitcherContext);
  if (!ctx) {
    throw new Error('@m-next/theme: useThemeSwitcher() must be used inside <ThemeProvider>.');
  }
  return ctx;
};

export default ThemeProvider;
