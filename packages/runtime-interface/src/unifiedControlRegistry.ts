/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Unified Control Registry Types
 *
 * Types for the unified control registry system that provides
 * editor components, wrapper components, and right panel configurations.
 */

import React from 'react';
import { ValidControlType } from './controlRegistry';
import { ControlInterfaceLookup } from './controlInterfaceRegistry';
import { BaseControl } from './index';

/**
 * Type-safe editor component props interface
 */
export interface BaseEditorProps<TControl = unknown> {
  id?: string;
  control?: TControl;
  rawControl?: TControl; // Some editors use rawControl instead of control
  onChange: (control: TControl) => void;
  onSelect?: (property: string) => void;
  onAddAction?: (() => void) | ((control: TControl, eventName: string) => void);
  data?: unknown;
  appId?: string;
  screenId?: string;
  versionId?: string;
  onSendAnalytics?: (event: string, data?: unknown) => void;
  featureFlags?: unknown;
  onActionChange?: (action: unknown) => void;
  onOpenAdvancedDesigner?: () => void;
  controlProperty?: unknown;
}

/**
 * Legacy component props interface for components that expect specific prop shapes
 */
export interface LegacyEditorProps {
  rawControl: any;
  onChange: any;
  onAddAction?: any;
  control?: any;
  onSelect?: any;
  onActionChange?: any;
  onOpenAdvancedDesigner?: any;
  appId?: any;
  screenId?: any;
  versionId?: any;
  onSendAnalytics?: any;
  featureFlags?: any;
  controlProperty?: any;
}

export interface RightPanelProps {
  control: BaseControl;
  onControlChange: (control: BaseControl) => void;
  onControlPropertySelected: (property: string) => void;
  onAddAction?: () => void;
  onActionChange?: (action: unknown) => void;
  onRibbonChange?: (control: BaseControl) => void;
  data?: unknown;
  appId?: string;
  screenId?: string;
  versionId?: string;
  onSendAnalytics?: (event: string, data?: unknown) => void;
  featureFlags?: unknown;
  controlProperty?: string;
  onTabsSettingsChange?: (settings: unknown) => void;
  tabList?: unknown[];
  activeRecordId?: string;
  onOpenAdvancedDesigner?: () => void;
  onDrilldownSelected?: (drilldown: unknown) => void;
}

export type EditorComponent<TControl = unknown> =
  | React.ComponentType<BaseEditorProps<TControl>>
  | React.LazyExoticComponent<React.FC<BaseEditorProps<TControl>>>
  | React.ComponentType<LegacyEditorProps>
  | React.LazyExoticComponent<React.FC<LegacyEditorProps>>
  | React.ComponentType<any>
  | React.LazyExoticComponent<React.FC<any>>;

export type WrapperComponent<TControl = unknown> = React.ComponentType<{
  id: string;
  onControlClick?: (controlId: string) => void;
  item?: { id: string };
  control?: TControl;
  onChange?: (control: TControl) => void;
  onSelect?: (property: string) => void;
  isSelected?: boolean;
  // Container-specific props
  containerConfig?: unknown;
  childComponents?: unknown[];
  isEmpty?: boolean;
  onChildClick?: (childId: string) => void;
  selectedChildId?: string | null;
}>;

/**
 * Display restrictions for controls on the designer canvas
 * Canvas uses 12-column grid system (desktop)
 * Heights are measured in row units (1 row = ~8px)
 */
export interface ControlDisplayRestrictions {
  maxWidth?: number; // Max columns (1-12)
  maxHeight?: number; // Max rows (minimum 2)
  minWidth?: number; // Min columns (1-12)
  minHeight?: number; // Min rows (minimum 2)
  defaultWidth?: number; // Default columns on creation
  defaultHeight?: number; // Default rows on creation
}

export interface ControlConfiguration<TControl = unknown> {
  editorName: string;
  rumRoute: string;
  editor: EditorComponent<TControl>;
  wrapper: WrapperComponent<TControl>;
  widgetConstants: string[]; // Maps to legacy widget constants (Widget type)
  getHeader: (props: RightPanelProps) => React.ReactNode;
  getProps: (props: RightPanelProps) => Record<string, unknown>;
  displayRestrictions: ControlDisplayRestrictions;
  defaultValues: Partial<TControl>;
}

/**
 * The unified control registry type that ensures ALL ValidControlType entries
 * have complete configurations.
 */
export type UnifiedControlRegistryType = {
  [K in ValidControlType]: ControlConfiguration<ControlInterfaceLookup[K & keyof ControlInterfaceLookup]>;
};
