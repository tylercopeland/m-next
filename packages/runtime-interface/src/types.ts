/* eslint-disable @typescript-eslint/no-explicit-any */
import { CSSProperties } from 'react';
import { BaseControl, WidthType } from './controls/baseControl';

/**
 * Backend runtime model interfaces
 */
export interface BackendControlStyles {
  variant?: 'primary' | 'secondary' | 'tertiary';
  color?: string;
  [key: string]: unknown;
}

export interface ButtonControl extends BaseControl {
  onClick?: string;
  icon?: string;
  iconAlign?: 'Left' | 'Right' | 'False';
  styles?: BackendControlStyles;
}

/**
 * Frontend widget interfaces
 */
export interface WidgetColorStyling {
  backgroundColor?: string | null;
  color?: string | null;
  borderColor?: string | null;
}

export interface WidgetIcon {
  name: string;
  position: 'left' | 'right';
  size: number;
}

/**
 * Base widget properties shared across all widget types
 */
export interface BaseWidgetProps {
  id: string;
  widthType?: WidthType;
  width?: string;
  classes?: string[];
  name?: string;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  visible?: boolean;

  [key: string]: unknown;
}

export interface ButtonWidgetProps extends BaseWidgetProps {
  value: string;
  icon?: WidgetIcon;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  buttonStyle: 'link' | 'primary';
  onClick?: () => void;
  isV4Design: boolean; // Indicates if this is a v4 design widget
  disabled: boolean;
}

export interface AttachmentsWidgetProps extends BaseWidgetProps {
  caption: string;
  visible: boolean;
  disabled: boolean;
  enableEmailAttachment: boolean;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  onAttachmentUpload?: (files: File[]) => void;
  onAttachmentDelete?: (id: string, documentId: string) => void;
  onAttachmentClick?: (documentId: string, url: string) => void;
  onToggleEmailAttachment?: (documentId: string, attachToEmail: boolean) => void;
}

/**
 * Translation result interfaces
 */
export interface ButtonTranslationResult {
  widgetProps: ButtonWidgetProps;
  v4Styling: WidgetColorStyling | null;
}

export interface AttachmentsTranslationResult {
  widgetProps: AttachmentsWidgetProps;
  v4Styling: WidgetColorStyling | null;
}

export interface ButtonGroupWidgetItems {
  label: string;
  disabled: boolean;
}

export interface ButtonGroupWidgetProps {
  id: string;
  disabled: boolean;
  label?: string; // This is the caption for the button group
  name: string;
  data: ButtonGroupWidgetItems[];
  width: string;
  displayAuto: boolean;
  showCaption: boolean;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  onClick?: () => void;
  menuLabel?: string;
  hasMenuLabel: boolean;
  isV4Design?: boolean;
  [key: string]: any;
}

export interface ButtonGroupTranslationResult {
  widgetProps: ButtonGroupWidgetProps;
  v4Styling: WidgetColorStyling | null;
}
