import { Api } from '@reduxjs/toolkit/query/react';

interface CalendarRequest {
  accountName: string;
  startDate?: string;
  endDate?: string;
  resourceId?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  resourceId?: string;
  color?: string;
  description?: string;
}

interface CalendarData {
  events: CalendarEvent[];
  resources?: Array<{
    id: string;
    title: string;
  }>;
  totalRows: number;
  partialCount: number;
}

interface CalendarResponse {
  data: CalendarData;
  filter?: Record<string, unknown>;
  dataSource?: Record<string, unknown>;
}

type CalendarEndpoints = 'getCalendarEvents' | 'getCalendarResources' | 'getStatuses';

export declare const calendarApi: Api<import('@reduxjs/toolkit/query').BaseQueryFn, Record<string, unknown>, CalendarEndpoints, string>;

export declare const useGetCalendarEventsQuery: <T = CalendarResponse>(
  arg: CalendarRequest
) => { 
  data: T; 
  error?: unknown; 
  isLoading: boolean;
  refetch: () => void;
};

export declare const useGetCalendarResourcesQuery: <T = CalendarResponse>(
  arg: CalendarRequest
) => { 
  data: T; 
  error?: unknown; 
  isLoading: boolean;
  refetch: () => void;
};

export declare const useGetStatusesQuery: <T = Array<{ id: string; name: string }>>(
  arg: CalendarRequest
) => { 
  data: T; 
  error?: unknown; 
  isLoading: boolean;
  refetch: () => void;
};

// Additional hooks used by calendar components
export declare const useGetSharedUsersQuery: <T = Array<number>>(
  arg: null | undefined,
  options?: { skip?: boolean }
) => { 
  data: T; 
  error?: unknown; 
  isLoading: boolean;
  refetch: () => void;
};

export declare const useGetCalendarDataQuery: <T = CalendarData>(
  arg: CalendarRequest,
  options?: { skip?: boolean }
) => { 
  data: T; 
  error?: unknown; 
  isLoading: boolean;
  refetch: () => void;
};

export declare const useGetGridDataLegacyQuery: <T = { dataSource: Array<{ cells: Array<{ name: string; value: string }> }>; partialCount: number; totalRows: number }>(
  arg: CalendarRequest,
  options?: { skip?: boolean }
) => { 
  data: T; 
  error?: unknown; 
  isLoading: boolean;
  refetch: () => void;
};

export declare const useGetResourcesQuery: <T = { data: Array<{ RecordID: string | number }> }>(
  arg: CalendarRequest,
  options?: { skip?: boolean }
) => { 
  data: T; 
  error?: unknown; 
  isLoading: boolean;
  refetch: () => void;
};
