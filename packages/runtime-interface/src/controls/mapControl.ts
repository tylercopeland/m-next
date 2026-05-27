import { createBaseControl, BaseControlInput, BaseControl } from './baseControl';
import WIDGETS from '../types/widgetTypes';

// Map-specific data interface
export interface MapControlData {
  latitude?: number | null;
  longitude?: number | null;
  zoom?: number | null;
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  showMarker?: boolean;
  markerTitle?: string | null;
  markerDescription?: string | null;
  height?: number | null;
  width?: number | null;
  interactive?: boolean;
  showControls?: boolean;
  address?: string | null;
}

// Complete map control interface
export interface MapControl extends BaseControl {
  type: string;
  latitude?: number | null;
  longitude?: number | null;
  zoom?: number | null;
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  showMarker?: boolean;
  markerTitle?: string | null;
  markerDescription?: string | null;
  height?: number | null;
  width?: number | null;
  interactive?: boolean;
  showControls?: boolean;
  address?: string | null;
  componentVersion?: string;
}

// Factory function to create map control
export const createMapControl = (
  base: BaseControlInput = {
    id: null,
    hideCaption: false,
    caption: 'Map',
    classes: '',
    name: 'map',
    widthType: 'auto',
    width: null,
    visible: true,
    disabled: false,
    isBound: false,
    defaultValue: null,
  },
  data: MapControlData = {
    latitude: 43.6532,
    longitude: -79.3832,
    zoom: 10,
    mapType: 'roadmap',
    showMarker: true,
    markerTitle: null,
    markerDescription: null,
    height: 400,
    width: null,
    interactive: true,
    showControls: true,
    address: null,
  },
): MapControl => ({
  ...createBaseControl(base),
  type: WIDGETS.MAP,
  latitude: data.latitude || 43.6532,
  longitude: data.longitude || -79.3832,
  zoom: data.zoom || 10,
  mapType: data.mapType || 'roadmap',
  showMarker: data.showMarker !== undefined ? data.showMarker : true,
  markerTitle: data.markerTitle || null,
  markerDescription: data.markerDescription || null,
  height: data.height || 400,
  width: data.width || null,
  interactive: data.interactive !== undefined ? data.interactive : true,
  showControls: data.showControls !== undefined ? data.showControls : true,
  address: data.address || null,
});

// Type guard function
export const isMapControl = (control: unknown): control is MapControl => {
  return (
    control !== null &&
    typeof control === 'object' &&
    'type' in control &&
    (control as { type: unknown }).type === WIDGETS.MAP
  );
};

export default createMapControl;
