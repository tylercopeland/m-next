import { createBaseControl, BaseControlInput, BaseControl } from './baseControl';
import WIDGETS from '../types/widgetTypes';

// App ribbon item interface
export interface AppRibbonItem {
  id: string;
  label: string;
  icon?: string;
  action?: string;
  disabled?: boolean;
  visible?: boolean;
  tooltip?: string;
  badge?: string | number;
  children?: AppRibbonItem[];
}

// App ribbon-specific data interface
export interface AppRibbonControlData {
  items?: AppRibbonItem[] | null;
  layout?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium' | 'large';
  showLabels?: boolean;
  showIcons?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
  backgroundColor?: string | null;
  textColor?: string | null;
  activeColor?: string | null;
  hoverColor?: string | null;
}

// Complete app ribbon control interface
export interface AppRibbonControl extends BaseControl {
  type: string;
  items?: AppRibbonItem[] | null;
  layout?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium' | 'large';
  showLabels?: boolean;
  showIcons?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
  backgroundColor?: string | null;
  textColor?: string | null;
  activeColor?: string | null;
  hoverColor?: string | null;
}

// Factory function to create app ribbon control
export const createAppRibbonControl = (
  base: BaseControlInput = {
    id: null,
    hideCaption: true,
    caption: '',
    classes: '',
    name: 'appRibbon',
    widthType: 'auto',
    width: null,
    visible: true,
    disabled: false,
    isBound: false,
    defaultValue: null,
  },
  data: AppRibbonControlData = {
    items: [],
    layout: 'horizontal',
    size: 'medium',
    showLabels: true,
    showIcons: true,
    collapsible: false,
    collapsed: false,
    backgroundColor: null,
    textColor: null,
    activeColor: null,
    hoverColor: null,
  },
): AppRibbonControl => ({
  ...createBaseControl(base),
  type: WIDGETS.APPRIBBON,
  items: data.items || [],
  layout: data.layout || 'horizontal',
  size: data.size || 'medium',
  showLabels: data.showLabels !== undefined ? data.showLabels : true,
  showIcons: data.showIcons !== undefined ? data.showIcons : true,
  collapsible: data.collapsible !== undefined ? data.collapsible : false,
  collapsed: data.collapsed !== undefined ? data.collapsed : false,
  backgroundColor: data.backgroundColor || null,
  textColor: data.textColor || null,
  activeColor: data.activeColor || null,
  hoverColor: data.hoverColor || null,
});

// Type guard function
export const isAppRibbonControl = (control: unknown): control is AppRibbonControl => {
  return (
    control !== null &&
    typeof control === 'object' &&
    'type' in control &&
    (control as { type: unknown }).type === WIDGETS.APPRIBBON
  );
};

export default createAppRibbonControl;
