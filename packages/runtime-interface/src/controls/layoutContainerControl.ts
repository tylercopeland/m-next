import { createBaseControl, BaseControlInput, BaseControl } from './baseControl';
import WIDGETS from '../types/widgetTypes';

// Container configuration interface
export interface ContainerConfig {
  direction: 'row' | 'column';
  children: string[];
  wrap?: boolean;
  gap?: number;
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
}

// Layout Container-specific data interface
export interface LayoutContainerControlData {
  title?: string | null;
  containerStyle?: 'default' | 'card' | 'bordered' | 'elevated';
  collapsible?: boolean;
  collapsed?: boolean;
  showBorder?: boolean;
  showShadow?: boolean;
  backgroundColor?: string | null;
  borderColor?: string | null;
  titleColor?: string | null;
  padding?: string | null;
  margin?: string | null;
  headerHeight?: number | null;
  icon?: string | null;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
  container?: ContainerConfig;
}

// Complete layout container control interface
export interface LayoutContainerControl extends BaseControl {
  type: string;
  title?: string | null;
  containerStyle?: 'default' | 'card' | 'bordered' | 'elevated';
  collapsible?: boolean;
  collapsed?: boolean;
  showBorder?: boolean;
  backgroundColor?: string | null;
  borderColor?: string | null;
  titleColor?: string | null;
  padding?: string | null;
  margin?: string | null;
  headerHeight?: number | null;
  icon?: string | null;
  iconPosition?: 'left' | 'right';
  showIcon?: boolean;
  showShadow?: boolean;
  container?: ContainerConfig;
}

// Factory function to create layout container control
export const createLayoutContainerControl = (
  base: BaseControlInput = {
    id: null,
    hideCaption: false,
    caption: 'Container',
    classes: '',
    name: 'layoutContainer',
    widthType: 'auto',
    width: null,
    visible: true,
    disabled: false,
    isBound: false,
    defaultValue: null,
  },
  data: LayoutContainerControlData = {
    title: 'Container',
    containerStyle: 'default',
    collapsible: true,
    collapsed: false,
    showBorder: true,
    showShadow: false,
    backgroundColor: null,
    borderColor: null,
    titleColor: null,
    padding: null,
    margin: null,
    headerHeight: null,
    icon: null,
    showIcon: false,
    iconPosition: 'left',
    container: {
      direction: 'column',
      children: [],
      wrap: true,
      gap: 4,
      alignItems: 'start',
      justifyContent: 'start',
    },
  },
): LayoutContainerControl => ({
  ...createBaseControl(base),
  type: WIDGETS.LAYOUT_CONTAINER,
  title: data.title || 'Container',
  containerStyle: data.containerStyle || 'default',
  collapsible: data.collapsible !== undefined ? data.collapsible : true,
  collapsed: data.collapsed !== undefined ? data.collapsed : false,
  showBorder: data.showBorder !== undefined ? data.showBorder : true,
  showShadow: data.showShadow !== undefined ? data.showShadow : false,
  backgroundColor: data.backgroundColor || null,
  borderColor: data.borderColor || null,
  titleColor: data.titleColor || null,
  padding: data.padding || null,
  margin: data.margin || null,
  headerHeight: data.headerHeight || null,
  icon: data.icon || null,
  showIcon: data.showIcon !== undefined ? data.showIcon : false,
  iconPosition: data.iconPosition || 'left',
  container: data.container || {
    direction: 'column',
    children: [],
    wrap: true,
    gap: 4,
    alignItems: 'start',
    justifyContent: 'start',
  },
});

// Type guard function
export const isLayoutContainerControl = (control: unknown): control is LayoutContainerControl => {
  return (
    control !== null &&
    typeof control === 'object' &&
    'type' in control &&
    (control as { type: unknown }).type === WIDGETS.LAYOUT_CONTAINER
  );
};

export default createLayoutContainerControl;
