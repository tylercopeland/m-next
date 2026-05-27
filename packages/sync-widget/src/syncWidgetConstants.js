import { NotReadyToSyncIcon, PendingApprovalIcon, SyncConflictIcon, SyncedIcon } from './syncWidgetIcons';
import { colors } from '@m-next/styles';
import { AccountingTableViewsSupportedForSyncWidget } from './accountingTableViewsSupportedForSyncWidget';

// Enum for Sync Widget Statuses with color codes
export const SyncWidgetStatus = Object.freeze({
  0: { text: 'Synced', color: colors['green-lighter'], icon: SyncedIcon, title: 'Synced successfully' },
  1: {
    text: 'Pending sync approval',
    color: colors['yellow-lighter'],
    icon: PendingApprovalIcon,
    title: 'Sync approval required',
  },
  2: {
    text: 'Sync conflict',
    color: colors['yellow-lighter'],
    icon: SyncConflictIcon,
    title: 'This record encountered a syncing error',
  },
  3: { text: 'Not ready to sync', color: colors['grey-lighter'], icon: NotReadyToSyncIcon, title: '' },
  4: { text: 'BlankOrNoWidget', color: 'NA', icon: 'NA' },
  5: {
    text: 'Synced – Requires Review',
    color: colors['green-lighter'],
    icon: SyncedIcon,
  },
});

export { AccountingTableViewsSupportedForSyncWidget };
