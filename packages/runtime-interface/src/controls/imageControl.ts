import { createBaseControl, BaseControlInput, BaseControl } from './baseControl';
import WIDGETS from '../types/widgetTypes';

// Image-specific data interface
export interface ImageControlData {
  src?: string | null;
  alt?: string | null;
  title?: string | null;
  width?: number | null;
  height?: number | null;
  fit?: 'contain' | 'cover' | 'fill' | 'scale-down' | 'none';
  alignment?: 'left' | 'center' | 'right';
  onClick?: string | null;
  border?: boolean;
  borderRadius?: number | null;
}

// Complete image control interface
export interface ImageControl extends BaseControl {
  type: string;
  src?: string | null;
  alt?: string | null;
  title?: string | null;
  width?: number | null;
  height?: number | null;
  fit?: 'contain' | 'cover' | 'fill' | 'scale-down' | 'none';
  alignment?: 'left' | 'center' | 'right';
  onClick?: string | null;
  border?: boolean;
  borderRadius?: number | null;
}

// Factory function to create image control
export const createImageControl = (
  base: BaseControlInput = {
    id: null,
    hideCaption: true,
    caption: '',
    classes: '',
    name: 'image',
    widthType: 'auto',
    width: null,
    visible: true,
    disabled: false,
    isBound: false,
    defaultValue: null,
  },
  data: ImageControlData = {
    src: null,
    alt: null,
    title: null,
    width: null,
    height: null,
    fit: 'contain',
    alignment: 'left',
    onClick: null,
    border: false,
    borderRadius: null,
  },
): ImageControl => ({
  ...createBaseControl(base),
  type: WIDGETS.PICTURE,
  src: data.src || null,
  alt: data.alt || null,
  title: data.title || null,
  width: data.width || null,
  height: data.height || null,
  fit: data.fit || 'contain',
  alignment: data.alignment || 'left',
  onClick: data.onClick || null,
  border: data.border !== undefined ? data.border : false,
  borderRadius: data.borderRadius || null,
});

// Type guard function
export const isImageControl = (control: unknown): control is ImageControl => {
  return (
    control !== null &&
    typeof control === 'object' &&
    'type' in control &&
    (control as { type: unknown }).type === WIDGETS.PICTURE
  );
};

export default createImageControl;
