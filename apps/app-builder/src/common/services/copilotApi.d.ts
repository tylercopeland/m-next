import { Api } from '@reduxjs/toolkit/query/react';

interface CopilotRequest {
  accountName: string;
  prompt: string;
  context?: Record<string, unknown>;
}

interface CopilotResponse {
  suggestion: string;
  confidence: number;
  alternatives?: string[];
}

type CopilotEndpoints = 'getCopilotSuggestion';

export declare const copilotApi: Api<import('@reduxjs/toolkit/query').BaseQueryFn, Record<string, unknown>, CopilotEndpoints, string>;

export declare const useGetCopilotSuggestionQuery: <T = CopilotResponse>(
  arg: CopilotRequest
) => { 
  data: T; 
  error?: unknown; 
  isLoading: boolean 
};

export declare const useGenerateFormulaMutation: () => [
  (data: { prompt: string; context?: Record<string, unknown>; appId?: string }) => Promise<{ unwrap: () => Promise<string> }>,
  {
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error?: unknown;
  }
];
