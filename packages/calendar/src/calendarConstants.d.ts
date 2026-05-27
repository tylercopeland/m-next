// Type definitions for calendarConstants.js

export interface CompactEventTimeOption {
  key: string;
  label: string;
}

export declare const COMPACT_EVENT_TIME_OPTIONS: {
  None: CompactEventTimeOption;
  TitleLeft: CompactEventTimeOption;
  TitleRight: CompactEventTimeOption;
  Description: CompactEventTimeOption;
};

export interface LayoutOption {
  id: number;
  name: string;
  key: string;
  category: string;
  subCategory: string;
  isSelectedLayout: boolean;
  visible: boolean;
}

export declare const LAYOUT_OPTIONS: readonly LayoutOption[]; 