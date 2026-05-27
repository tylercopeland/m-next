import { createBaseControl, BaseControlInput, BaseControl } from './baseControl';
import WIDGETS from '../types/widgetTypes';

// Field block-specific data interface
export interface FieldBlockControlData {
  fields?: string[] | null;
  layout?: 'vertical' | 'horizontal' | 'grid';
  columns?: number | null;
  spacing?: number | null;
  showLabels?: boolean;
  labelPosition?: 'top' | 'left' | 'right' | 'bottom';
  labelWidth?: number | null;
  fieldWidth?: number | null;
  groupTitle?: string | null;
  collapsible?: boolean;
  collapsed?: boolean;
  showBorder?: boolean;
  backgroundColor?: string | null;
  borderColor?: string | null;
}

// Complete field block control interface
export interface FieldBlockControl extends BaseControl {
  type: string;
  fields?: string[] | null;
  layout?: 'vertical' | 'horizontal' | 'grid';
  columns?: number | null;
  spacing?: number | null;
  showLabels?: boolean;
  labelPosition?: 'top' | 'left' | 'right' | 'bottom';
  labelWidth?: number | null;
  fieldWidth?: number | null;
  groupTitle?: string | null;
  collapsible?: boolean;
  collapsed?: boolean;
  showBorder?: boolean;
  backgroundColor?: string | null;
  borderColor?: string | null;
}

// Factory function to create field block control
export const createFieldBlockControl = (
  base: BaseControlInput = {
    id: null,
    hideCaption: true,
    caption: '',
    classes: '',
    name: 'fieldBlock',
    widthType: 'auto',
    width: null,
    visible: true,
    disabled: false,
    isBound: false,
    defaultValue: null,
  },
  data: FieldBlockControlData = {
    fields: [],
    layout: 'vertical',
    columns: 2,
    spacing: 10,
    showLabels: true,
    labelPosition: 'top',
    labelWidth: null,
    fieldWidth: null,
    groupTitle: null,
    collapsible: false,
    collapsed: false,
    showBorder: false,
    backgroundColor: null,
    borderColor: null,
  },
): FieldBlockControl => ({
  ...createBaseControl(base),
  type: WIDGETS.FIELD_BLOCK,
  fields: data.fields || [],
  layout: data.layout || 'vertical',
  columns: data.columns || 2,
  spacing: data.spacing || 10,
  showLabels: data.showLabels !== undefined ? data.showLabels : true,
  labelPosition: data.labelPosition || 'top',
  labelWidth: data.labelWidth || null,
  fieldWidth: data.fieldWidth || null,
  groupTitle: data.groupTitle || null,
  collapsible: data.collapsible !== undefined ? data.collapsible : false,
  collapsed: data.collapsed !== undefined ? data.collapsed : false,
  showBorder: data.showBorder !== undefined ? data.showBorder : false,
  backgroundColor: data.backgroundColor || null,
  borderColor: data.borderColor || null,
});

// Type guard function
export const isFieldBlockControl = (control: unknown): control is FieldBlockControl => {
  return (
    control !== null &&
    typeof control === 'object' &&
    'type' in control &&
    (control as { type: unknown }).type === WIDGETS.FIELD_BLOCK
  );
};

export default createFieldBlockControl;
