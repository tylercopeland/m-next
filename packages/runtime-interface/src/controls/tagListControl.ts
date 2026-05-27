import { createBaseControl, BaseControlInput, BaseControl } from './baseControl';
import WIDGETS from '../types/widgetTypes';

// Tag item interface
export interface TagItem {
  id: string | number;
  label: string;
  value?: string | number;
  color?: string;
  removable?: boolean;
  disabled?: boolean;
}

// Tag list-specific data interface
export interface TagListControlData {
  tags?: TagItem[] | null;
  allowAdd?: boolean;
  allowRemove?: boolean;
  maxTags?: number | null;
  placeholder?: string | null;
  separator?: string | null;
  readonly?: boolean;
  tagColor?: string | null;
  tagSize?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'outlined' | 'filled';
}

// Complete tag list control interface
export interface TagListControl extends BaseControl {
  type: string;
  tags?: TagItem[] | null;
  allowAdd?: boolean;
  allowRemove?: boolean;
  maxTags?: number | null;
  placeholder?: string | null;
  separator?: string | null;
  readonly?: boolean;
  tagColor?: string | null;
  tagSize?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'outlined' | 'filled';
}

// Factory function to create tag list control
export const createTagListControl = (
  base: BaseControlInput = {
    id: null,
    hideCaption: false,
    caption: 'Tag list',
    classes: '',
    name: 'tagList',
    widthType: 'auto',
    width: null,
    visible: true,
    disabled: false,
    isBound: false,
    defaultValue: null,
  },
  data: TagListControlData = {
    tags: [],
    allowAdd: true,
    allowRemove: true,
    maxTags: null,
    placeholder: 'Add tags...',
    separator: ',',
    readonly: false,
    tagColor: null,
    tagSize: 'medium',
    variant: 'default',
  },
): TagListControl => ({
  ...createBaseControl(base),
  type: WIDGETS.TAGLIST,
  tags: data.tags || [],
  allowAdd: data.allowAdd !== undefined ? data.allowAdd : true,
  allowRemove: data.allowRemove !== undefined ? data.allowRemove : true,
  maxTags: data.maxTags || null,
  placeholder: data.placeholder || 'Add tags...',
  separator: data.separator || ',',
  readonly: data.readonly !== undefined ? data.readonly : false,
  tagColor: data.tagColor || null,
  tagSize: data.tagSize || 'medium',
  variant: data.variant || 'default',
});

// Type guard function
export const isTagListControl = (control: unknown): control is TagListControl => {
  return (
    control !== null &&
    typeof control === 'object' &&
    'type' in control &&
    (control as { type: unknown }).type === WIDGETS.TAGLIST
  );
};

export default createTagListControl;
