import React from 'react';

interface Crumb {
  id: string;
  label: string;
  onClick?: () => void;
}

interface Action {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SettingsHeaderProps {
  controlId?: string;
  crumbs: Crumb[];
  iconName?: string;
  actions?: Action[];
  contextType?: string;
  contextLabel?: string;
  onActionSelect?: (action: Action) => void;
  controlProperty?: { controlReferencesSelected?: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onControlPropertySelected?: (controlId: string, property: any) => void;
  showDeleteIcon?: boolean;
  showDuplicateIcon?: boolean;
  deleteDialogTitle?: string;
  deleteDialogMessage?: string | React.ReactNode;
  onDelete?: () => void;
  onDuplicate?: () => void;
  menuWidth?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  screenData?: any;
}

declare const SettingsHeader: React.FC<SettingsHeaderProps>;

export default SettingsHeader;
