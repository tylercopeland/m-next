import React, { Suspense, useMemo } from 'react';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { useSelector } from 'react-redux';
import Mapbox from '@m-next/map';
import { selectControls } from '../../../common/services/screenLayoutSlice';


function MapDesignerWrapper({ id }) {
  const control = useSelector((state) => selectControls(state)[id]);

  const mapSize = useMemo(() => {
    const height = control.height || '100vh';

    let width = 'auto';
    if (control.widthType === 'fixed' && control.width) width = `${control.width}px`;

    return { height, width };
  }, [control]);

  // Sample data for design preview
  const sampleAddressList = [
    { fullAddress: 'New York, NY', recordId: 1 },
    { fullAddress: 'Los Angeles, CA', recordId: 2 },
    { fullAddress: 'Chicago, IL', recordId: 3 },
  ];

  const handleError = () => {
    console.warn('Map designer wrapper error occurred');
  };

  if (!control) {
    return null;
  }

  return (
    <Suspense fallback={<LoadingSkeleton count={1} height={400} />}>
      <div
        style={{
          width: mapSize.width,
          height: mapSize.height,
          border: '1px solid #ddd',
          borderRadius: '4px',
          overflow: 'hidden',
          // Fix Issue #10: Add proper z-index for map display
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Mapbox 
          addressList={sampleAddressList} 
          size={mapSize} 
          onError={handleError} 
          showPlaceholder
          style={{ zIndex: 1 }}
        />
      </div>
    </Suspense>
  );
}

export default MapDesignerWrapper;
