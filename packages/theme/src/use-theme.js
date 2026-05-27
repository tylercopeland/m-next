import { useTheme as useEmotionTheme } from '@emotion/react';

const useTheme = () => {
  const theme = useEmotionTheme();
  if (!theme || Object.keys(theme).length === 0) {
    throw new Error('@m-next/theme: useTheme() must be used inside <ThemeProvider>.');
  }
  return theme;
};

export default useTheme;
