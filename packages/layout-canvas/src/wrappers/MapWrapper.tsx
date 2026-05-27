/**
 * MapWrapper - Designer/Runtime wrapper for Map control
 *
 * Translates backend control configuration to M-One Mapbox component props.
 * Supports both designer preview mode and runtime rendering.
 */

import React, { Suspense, useMemo, useRef, useEffect, useState } from 'react';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { useRuntimeContext } from '../contexts/RuntimeContext';
import Mapbox from '@m-next/map';
import type { MapboxProps } from '@m-next/map';
import { useDesignerContext } from '../contexts/DesignerContext';
import { Z_CANVAS } from '../constants/zIndex';

// =============================================================================
// Type Definitions
// =============================================================================

interface AddressItem {
  fullAddress: string;
  recordId?: number;
  isFirstAddress?: boolean;
  isLastAddress?: boolean;
  orderNumber?: number;
  countryCode?: string;
  [key: string]: unknown;
}

interface MapControlValue {
  addressList?: AddressItem[];
  geometry?: Record<string, unknown> | null;
  geocodingData?: Array<Record<string, unknown>>;
}

interface MapControl {
  id: string;
  type?: string;
  componentVersion?: string;
  value?: MapControlValue;
  [key: string]: unknown;
}

interface MapData {
  addressList: AddressItem[];
  geometry: Record<string, unknown> | undefined;
  geocodingData: Array<Record<string, unknown>>;
}

interface MapSize {
  height: string;
  width: string;
}

/**
 * Props for MapDesignerWrapper component
 * @property id - Control ID for fetching from designer context
 * @property mode - Rendering mode ('runtime' or designer mode)
 * @property control - Optional control object (used in runtime mode)
 */
export interface MapDesignerWrapperProps {
  id: string;
  mode?: 'runtime' | 'designer';
  control?: MapControl;
}

// =============================================================================
// Sample Data
// =============================================================================

const sampleAddressList: AddressItem[] = [
  { fullAddress: 'New York, NY', recordId: 1 },
  { fullAddress: 'Los Angeles, CA', recordId: 2 },
  { fullAddress: 'Chicago, IL', recordId: 3 },
];

// =============================================================================
// Component
// =============================================================================

/**
 * MapDesignerWrapper Component
 *
 * Wraps the M-One Mapbox component for use in both designer and runtime contexts.
 * Handles dynamic sizing based on container dimensions using ResizeObserver.
 *
 * @param id - Control ID for fetching from context
 * @param mode - Rendering mode
 * @param control - Optional control object for runtime mode
 */
function MapDesignerWrapper({ id, mode, control: controlProp }: MapDesignerWrapperProps): React.ReactElement | null {
  const runtimeContext = useRuntimeContext();
  const designerContext = useDesignerContext();
  const isRuntimeMode = !!controlProp || mode === 'runtime';
  const control: MapControl | undefined = isRuntimeMode
    ? controlProp
    : designerContext?.selectControlById
      ? designerContext.selectControlById(id)
      : undefined;

  // Track wrapper dimensions for dynamic resizing
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [mapWidthPx, setMapWidthPx] = useState<number>(600);
  const [mapHeightPx, setMapHeightPx] = useState<number>(400);

  const componentVersion = control?.componentVersion || '0.0.0';
  const useDynamicSizing = true; // Always use dynamic sizing in layout canvas

  // Use ResizeObserver to track wrapper dimension changes and calculate map size
  useEffect(() => {
    const currentWrapper = wrapperRef.current;
    if (!currentWrapper) {
      return;
    }

    const updateMapSize = (): void => {
      const wrapperWidth = currentWrapper.clientWidth;
      const wrapperHeight = currentWrapper.clientHeight;

      // Account for wrapper padding: 16px (8px left + 8px right for width, 8px top + 8px bottom for height)
      const horizontalReservedSpace = 16;
      const verticalReservedSpace = 16;

      const calculatedHeightPx = Math.max(100, wrapperHeight - verticalReservedSpace);
      const calculatedWidthPx = Math.max(100, wrapperWidth - horizontalReservedSpace);

      if (useDynamicSizing) {
        setMapHeightPx(calculatedHeightPx);
        setMapWidthPx(calculatedWidthPx);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateMapSize();
    });

    resizeObserver.observe(currentWrapper);

    // Initial calculation
    updateMapSize();

    return () => {
      resizeObserver.disconnect();
    };
  }, [useDynamicSizing, id]);

  const mapSize = useMemo<MapSize>(() => {
    const width = useDynamicSizing ? mapWidthPx : 600;
    const height = useDynamicSizing ? mapHeightPx : 400;

    return {
      height: `${height}px`,
      width: `${width}px`,
    };
  }, [mapWidthPx, mapHeightPx, useDynamicSizing]);

  const mapData = useMemo<MapData>(() => {
    if (isRuntimeMode && runtimeContext && control?.value) {
      return {
        addressList: control.value.addressList || [],
        geometry: control.value.geometry || undefined,
        geocodingData: control.value.geocodingData || [],
      };
    }
    return {
      addressList: sampleAddressList,
      geometry: undefined,
      geocodingData: [],
    };
  }, [isRuntimeMode, runtimeContext, control?.value]);

  const handleError = (): void => {
    console.warn('Map designer wrapper error occurred');
  };

  if (!control) {
    return null;
  }

  // Convert string size to numeric size for MapboxProps
  const numericSize: MapboxProps['size'] = {
    width: parseInt(mapSize.width, 10),
    height: parseInt(mapSize.height, 10),
  };

  return (
    <Suspense fallback={<LoadingSkeleton count={1} height={400} />}>
      <div
        ref={wrapperRef}
        style={{
          width: '100%',
          height: '100%',
          padding: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            width: mapSize.width,
            height: mapSize.height,
            border: '1px solid #ddd',
            borderRadius: '4px',
            overflow: 'hidden',
            position: 'relative',
            zIndex: Z_CANVAS.ITEM_NORMAL,
          }}
        >
          <Mapbox
            addressList={mapData.addressList}
            geometry={mapData.geometry}
            geocodings={mapData.geocodingData}
            size={numericSize}
            onError={handleError}
            showPlaceholder
            componentVersion={componentVersion}
          />
        </div>
      </div>
    </Suspense>
  );
}

export default MapDesignerWrapper;
