import React, { createContext, useContext } from 'react';

interface ScreenDataContextData {
  accountName?: string;
  screenId?: string;
  activeRecordId?: string;
  displayPreferences?: Record<string, any>;
  featureFlags?: Record<string, boolean>;
  tagsList?: {
    suggestions: string[];
    others: {
      colour: string;
      name: string;
    }[];
  };
  isDirty: boolean;
  setIsDirty?: (dirty: boolean) => void;
  methodIdentity?: string;
  closeDialog?: () => void;
}

const ScreenDataContext = createContext<ScreenDataContextData | null>(null);

export const useScreenDataContext = () => {
  return useContext(ScreenDataContext);
};

interface ScreenDataContextProviderProps {
  children: React.ReactNode;
  accountName?: string;
  displayPreferences?: Record<string, any>;
  featureFlags?: Record<string, boolean>;
  tagsList?: {
    suggestions: string[];
    others: {
      colour: string;
      name: string;
    }[];
  };
  isDirty: boolean;
  setIsDirty?: (dirty: boolean) => void;
  methodIdentity?: string;
  closeDialog?: () => void;
}

export const ScreenDataContextProvider: React.FC<ScreenDataContextProviderProps> = ({
  children,
  accountName,
  displayPreferences,
  featureFlags,
  tagsList,
  isDirty,
  setIsDirty,
  methodIdentity,
  closeDialog,
}) => {
  return (
    <ScreenDataContext.Provider
      value={{
        accountName,
        displayPreferences,
        featureFlags,
        tagsList,
        isDirty,
        setIsDirty,
        methodIdentity,
        closeDialog,
      }}
    >
      {children}
    </ScreenDataContext.Provider>
  );
};
