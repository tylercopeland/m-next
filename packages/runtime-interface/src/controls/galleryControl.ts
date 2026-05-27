import { createBaseControl, BaseControlInput, BaseControl } from './baseControl';
import WIDGETS from '../types/widgetTypes';

// Gallery item interface
export interface GalleryItem {
  id: string | number;
  src: string;
  alt?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  width?: number;
  height?: number;
}

// Gallery-specific data interface
export interface GalleryControlData {
  items?: GalleryItem[] | null;
  layout?: 'grid' | 'carousel' | 'masonry';
  columns?: number | null;
  spacing?: number | null;
  showThumbnails?: boolean;
  showCaptions?: boolean;
  allowZoom?: boolean;
  allowFullscreen?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number | null;
  height?: number | null;
  aspectRatio?: string | null;
}

// Complete gallery control interface
export interface GalleryControl extends BaseControl {
  type: string;
  items?: GalleryItem[] | null;
  layout?: 'grid' | 'carousel' | 'masonry';
  columns?: number | null;
  spacing?: number | null;
  showThumbnails?: boolean;
  showCaptions?: boolean;
  allowZoom?: boolean;
  allowFullscreen?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number | null;
  height?: number | null;
  aspectRatio?: string | null;
}

// Factory function to create gallery control
export const createGalleryControl = (
  base: BaseControlInput = {
    id: null,
    hideCaption: false,
    caption: 'Gallery',
    classes: '',
    name: 'gallery',
    widthType: 'auto',
    width: null,
    visible: true,
    disabled: false,
    isBound: false,
    defaultValue: null,
  },
  data: GalleryControlData = {
    items: [],
    layout: 'grid',
    columns: 3,
    spacing: 10,
    showThumbnails: false,
    showCaptions: true,
    allowZoom: true,
    allowFullscreen: true,
    autoPlay: false,
    autoPlayInterval: 3000,
    height: 400,
    aspectRatio: '16:9',
  },
): GalleryControl => ({
  ...createBaseControl(base),
  type: WIDGETS.GALLERY,
  items: data.items || [],
  layout: data.layout || 'grid',
  columns: data.columns || 3,
  spacing: data.spacing || 10,
  showThumbnails: data.showThumbnails !== undefined ? data.showThumbnails : false,
  showCaptions: data.showCaptions !== undefined ? data.showCaptions : true,
  allowZoom: data.allowZoom !== undefined ? data.allowZoom : true,
  allowFullscreen: data.allowFullscreen !== undefined ? data.allowFullscreen : true,
  autoPlay: data.autoPlay !== undefined ? data.autoPlay : false,
  autoPlayInterval: data.autoPlayInterval || 3000,
  height: data.height || 400,
  aspectRatio: data.aspectRatio || '16:9',
});

// Type guard function
export const isGalleryControl = (control: unknown): control is GalleryControl => {
  return (
    control !== null &&
    typeof control === 'object' &&
    'type' in control &&
    (control as { type: unknown }).type === WIDGETS.GALLERY
  );
};

export default createGalleryControl;
