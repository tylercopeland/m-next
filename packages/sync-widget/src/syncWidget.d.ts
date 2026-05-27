import { ReactElement } from 'react';

export interface SyncWidgetIcon {
  name?: string;
  size?: number;
  color?: string;
}

export interface SyncWidgetProps {
  /**
   * Optional ID for the widget container
   */
  id?: string;
  
  /**
   * Sync status of the record
   * 0 = Synced, 1 = Pending sync approval, 2 = Sync conflict, 3 = Not ready to sync
   */
  status: 0 | 1 | 2 | 3;
  
  /**
   * Optional message to display when the chevron is clicked
   */
  message?: string;
  
  /**
   * Optional analytics callback function
   */
  fnSyncWidgetInteractionAnalytics?: (
    interactionType: string,
    analyticsData: {
      buttonCaption: string;
      buttonIcon: string;
      controlType: string;
    }
  ) => void;
}

declare const SyncWidget: React.FC<SyncWidgetProps>;

export default SyncWidget;

export interface SyncWidgetStatusConfig {
  text: string;
  color: string;
  icon: () => ReactElement;
  title: string;
}

export const SyncWidgetStatus: {
  readonly 0: SyncWidgetStatusConfig;
  readonly 1: SyncWidgetStatusConfig;
  readonly 2: SyncWidgetStatusConfig;
  readonly 3: SyncWidgetStatusConfig;
  readonly 4: { text: string; color: string; icon: string; };
};

export const AccountingTableViewsSupportedForSyncWidget: {
  readonly 0: string[];
  readonly 1: string[];
  readonly 2: string[];
  readonly 3: string[];
  readonly 4: string[];
};
