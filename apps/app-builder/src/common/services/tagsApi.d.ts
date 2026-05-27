import { Api } from '@reduxjs/toolkit/query/react';

interface TagSuggestionModel {
  accountName: string;
}

interface TagSuggestionResponse {
  suggestions: string[];
  others: Array<{
    colour: string;
    name: string;
  }>;
}

export declare const tagsApi: Api<import('@reduxjs/toolkit/query').BaseQueryFn, TagSuggestionResponse, 'getTagSuggestions', string>;

export declare const useGetTagSuggestionsQuery: <T = TagSuggestionResponse>(
  arg: TagSuggestionModel,
  options?: { skip?: boolean; refetchOnMountOrArgChange?: boolean | number }
) => { 
  data: T | undefined; 
  error?: unknown; 
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
};
