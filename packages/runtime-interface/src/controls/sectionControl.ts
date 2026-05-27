import { createBaseControl, BaseControlInput, BaseControl } from './baseControl';
import WIDGETS from '../types/widgetTypes';

// Section-specific data interface
export interface SectionControlData {
  title?: string | null;
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
}

// Complete section control interface
export interface SectionControl extends BaseControl {
  type: string;
  title?: string | null;
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
}

// Factory function to create section control
export const createSectionControl = (
  base: BaseControlInput = {
    id: null,
    hideCaption: true,
    caption: '',
    classes: '',
    name: 'section',
    widthType: 'auto',
    width: null,
    visible: true,
    disabled: false,
    isBound: false,
    defaultValue: null,
  },
  data: SectionControlData = {
    title: 'Section',
    collapsible: false,
    collapsed: false,
    showBorder: true,
    backgroundColor: null,
    borderColor: null,
    titleColor: null,
    padding: null,
    margin: null,
    headerHeight: null,
    icon: null,
    iconPosition: 'left',
  },
): SectionControl => ({
  ...createBaseControl(base),
  type: WIDGETS.SECTION,
  title: data.title || 'Section',
  collapsible: data.collapsible !== undefined ? data.collapsible : false,
  collapsed: data.collapsed !== undefined ? data.collapsed : false,
  showBorder: data.showBorder !== undefined ? data.showBorder : true,
  backgroundColor: data.backgroundColor || null,
  borderColor: data.borderColor || null,
  titleColor: data.titleColor || null,
  padding: data.padding || null,
  margin: data.margin || null,
  headerHeight: data.headerHeight || null,
  icon: data.icon || null,
  iconPosition: data.iconPosition || 'left',
});

// Type guard function
export const isSectionControl = (control: unknown): control is SectionControl => {
  return (
    control !== null &&
    typeof control === 'object' &&
    'type' in control &&
    (control as { type: unknown }).type === WIDGETS.SECTION
  );
};

export default createSectionControl;
