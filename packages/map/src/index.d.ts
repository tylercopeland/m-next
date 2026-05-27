import { FC, CSSProperties } from 'react';

export interface GeocodingFeature {
  place_name: string;
  place_type: string[];
  properties?: {
    address?: string;
    [key: string]: any;
  };
  address?: string;
  text?: string;
  [key: string]: any;
}

export interface MapboxApiInterface {
  getAddressSuggestions: (
    inputValue: string, 
    userGeolocation: string | null
  ) => Promise<{
    data: {
      features: GeocodingFeature[];
    }
  }>;
}

export interface MapboxProps {
  addressList?: Array<{
    fullAddress: string;
    recordId?: number;
    isFirstAddress?: boolean;
    isLastAddress?: boolean;
    orderNumber?: number;
    countryCode?: string;
    [key: string]: any;
  }>;
  geometry?: {
    [key: string]: any;
  };
  geocodings?: Array<{
    [key: string]: any;
  }>;
  size?: {
    width: number;
    height: number;
  };
  onError?: () => void;
  zoom?: number;
  showPlaceholder?: boolean;
  componentVersion?: string;
  style?: CSSProperties;
  [key: string]: any;
}

declare const Mapbox: FC<MapboxProps>;
declare function MapboxApi(): MapboxApiInterface;

export { Mapbox, MapboxApi };
export default Mapbox;

export interface GeocodingResponse {
  data: {
    features: GeocodingFeature[];
  };
}
