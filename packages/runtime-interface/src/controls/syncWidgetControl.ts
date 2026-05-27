import { createBaseControl, BaseControlInput, BaseControl } from './baseControl';
import { WIDGETS } from '../types/widgetTypes';

// SyncWidget-specific data interface
export interface SyncWidgetControlData {
  syncType?: 'manual' | 'auto' | null;
  syncInterval?: number | null;
  lastSyncTime?: string | null;
  syncStatus?: 'idle' | 'syncing' | 'error' | null;
}

// Complete sync widget control interface
export interface SyncWidgetControl extends BaseControl {
  type: string;
  syncType?: 'manual' | 'auto' | null;
  syncInterval?: number | null;
  lastSyncTime?: string | null;
  syncStatus?: 'idle' | 'syncing' | 'error' | null;
}

// Factory function to create sync widget control
export const createSyncWidgetControl = (
  base: BaseControlInput = {
    id: null,
    hideCaption: false,
    caption: 'Sync widget',
    classes: '',
    name: 'syncWidget',
    widthType: 'auto',
    width: null,
    visible: true,
    disabled: false,
    isBound: false,
    defaultValue: null,
  },
  data: SyncWidgetControlData = {
    syncType: 'manual',
    syncInterval: null,
    lastSyncTime: null,
    syncStatus: 'idle',
  },
): SyncWidgetControl => ({
  ...createBaseControl(base),
  type: WIDGETS.SYNCWIDGET,
  syncType: data.syncType || 'manual',
  syncInterval: data.syncInterval || null,
  lastSyncTime: data.lastSyncTime || null,
  syncStatus: data.syncStatus || 'idle',
});

export default createSyncWidgetControl;
