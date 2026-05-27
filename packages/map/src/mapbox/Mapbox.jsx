/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import WebMercatorViewport from 'viewport-mercator-project';
import ReactMapGL, { Marker, Popup, FlyToInterpolator, NavigationControl } from 'react-map-gl';
import { featureCollection, feature, bbox } from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../mapStyle.css';
import MapboxApi from './mapbox-api';
import MapboxAccessToken from './token';

const propTypes = {
  addressList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  geometry: PropTypes.instanceOf(Object),
  geocodings: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  size: PropTypes.instanceOf(Object),
  onError: PropTypes.func,
  zoom: PropTypes.number,
  showPlaceholder: PropTypes.bool,
  componentVersion: PropTypes.string,
};

function Mapbox({
  addressList,
  geometry,
  geocodings,
  size,
  onError,
  zoom = 3,
  showPlaceholder = false,
  componentVersion = '0.0.0',
}) {
  // Early return if required props are missing
  if (!size || (!addressList && !showPlaceholder)) {
    return null;
  }

  // By default, the center of map is on North America
  const [viewport, setViewport] = useState({
    width: size.width,
    height: size.height,
    latitude: 39.8283,
    longitude: -98.5795,
    zoom,
  });

  const [settings, setSettings] = useState({
    dragPan: true,
    dragRotate: true,
    scrollZoom: false,
    touchZoom: true,
    touchRotate: true,
    keyboard: true,
    doubleClickZoom: true,
    minZoom: 0,
    maxZoom: 20,
    minPitch: 0,
    maxPitch: 85,
  });

  const wrapperRef = useRef();
  const overlayRef = useRef();
  const mapRef = useRef(null);
  const pendingGeometryRef = useRef(null); // Store geometry to add when map loads
  const hasFitBoundsRef = useRef(false); // Prevents repeated viewport resets after user interaction
  const mapboxApi = useMemo(() => MapboxApi(), []);

  const [selectedPin, setSelectedPin] = useState(null);
  const [mapData, setMapData] = useState({
    geometry: null,
    markerCoordinates: null,
    startAddress: '',
    endAddress: '',
  });
  const [routeUpdate, setRouteUpdate] = useState({
    shouldUpdate: false,
    coordinates: null,
    startAddress: null,
    endAddress: null,
  });

  // Legacy variable for backward compatibility with existing code
  let reactMap = null;

  const intialize = (map, coordinates) => {
    if (!coordinates) return;

    try {
      const routeData = featureCollection([feature(coordinates)]);

      // Check if source already exists - update it, otherwise add it
      if (map.getSource('route')) {
        map.getSource('route').setData(routeData);
      } else {
        map.addSource('route', {
          type: 'geojson',
          data: routeData,
          buffer: 0,
        });
      }

      // Add layers only if they don't exist
      if (!map.getLayer('routeline-active')) {
        map.addLayer({
          id: 'routeline-active',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#3887be',
            'line-width': ['interpolate', ['linear'], ['zoom'], 12, 3, 22, 12],
          },
        });
      }

      if (!map.getLayer('routearrows')) {
        map.addLayer({
          id: 'routearrows',
          type: 'symbol',
          source: 'route',
          layout: {
            'symbol-placement': 'line',
            'text-field': '▶',
            'text-size': ['interpolate', ['linear'], ['zoom'], 12, 24, 22, 60],
            'symbol-spacing': ['interpolate', ['linear'], ['zoom'], 12, 30, 22, 160],
            'text-keep-upright': false,
          },
          paint: {
            'text-color': '#3887be',
            'text-halo-color': 'hsl(55, 11%, 96%)',
            'text-halo-width': 3,
          },
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error initializing route on map:', error);
    }

    // Skip if we've already fit bounds for current data (prevents reset after pan/zoom)
    if (hasFitBoundsRef.current) {
      return;
    }

    setTimeout(() => {
      if (wrapperRef.current) {
        try {
          const webMercator = new WebMercatorViewport({
            width: wrapperRef.current.offsetWidth,
            height: wrapperRef.current.offsetHeight,
          });
          const box = bbox(coordinates);
          const bound = webMercator.fitBounds(
            [
              [box[0], box[1]],
              [box[2], box[3]],
            ],
            {
              padding: 20,
            },
          );
          setViewport({
            ...bound,
            transitionDuration: 2000,
            transitionInterpolator: new FlyToInterpolator(),
          });
          hasFitBoundsRef.current = true;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error fitting bounds:', error);
        }
      }
    }, 500);
  };

  const initMap = (coordinates) => {
    if (!coordinates) return;

    // Store the geometry so it can be added when map loads/reloads
    pendingGeometryRef.current = coordinates;

    // Use mapRef instead of reactMap to ensure we have the correct reference in effects
    const mapInstance = mapRef.current || reactMap;
    if (!mapInstance) return;

    const map = mapInstance.getMap();
    if (!map) return;

    // Check if map is already loaded - if so, initialize directly
    if (map.loaded() && map.isStyleLoaded()) {
      intialize(map, coordinates);
    }
  };

  const formatMapData = (geocodes) => {
    if (!geocodes || !Array.isArray(geocodes) || !addressList || !Array.isArray(addressList)) {
      return [];
    }

    const coordinates = mapboxApi.getMarkerCoordinates(geocodes, addressList);

    const startAddress = addressList.length > 0 && addressList[0]?.isFirstAddress ? addressList[0].fullAddress : null;

    const endAddress =
      addressList.length > 0 && addressList[addressList.length - 1]?.isLastAddress
        ? addressList[addressList.length - 1].fullAddress
        : null;

    setMapData({
      ...mapData,
      markerCoordinates: coordinates,
      startAddress,
      endAddress,
    });

    return coordinates;
  };

  const mapOneAddress = (geocodes) => {
    const markerCoordinates = formatMapData(geocodes);

    if (markerCoordinates && markerCoordinates.length > 0 && markerCoordinates[0]?.geometry) {
      setViewport({
        ...viewport,
        zoom: 15,
        longitude: markerCoordinates[0].geometry.longitude,
        latitude: markerCoordinates[0].geometry.latitude,
      });
    }

    return markerCoordinates;
  };

  if (!mapData.markerCoordinates && geocodings && addressList) {
    if (!geocodings.length && onError) {
      onError();
    }
    // If there is less than two coordinates, we just need to map one address
    else if (geocodings.length < 2) {
      mapOneAddress(geocodings);
    } else {
      formatMapData(geocodings);
    }
  }

  const checkAddressListUpdates = () => {
    if (
      !mapData.markerCoordinates ||
      !Array.isArray(mapData.markerCoordinates) ||
      !addressList ||
      !Array.isArray(addressList)
    ) {
      return;
    }

    // check address list changes by work order record id
    let isAddressListChanged = false;
    const prevAddressList = mapData.markerCoordinates.filter((coordinate) => coordinate?.recordId > 0);
    const currentAddressList = addressList.filter((address) => address?.recordId > 0);

    const prevStartAddress = mapData.startAddress;
    const prevEndAddress = mapData.endAddress;

    if (prevAddressList.length !== currentAddressList.length) {
      isAddressListChanged = true;
    } else {
      for (let i = 0; i < currentAddressList.length; i++) {
        const address = prevAddressList.filter((addrs) => addrs?.recordId === currentAddressList[i]?.recordId);
        if (!address || address.length === 0) {
          isAddressListChanged = true;
          break;
        }
      }
    }

    // set current start and address to local state
    const currentStartAddress =
      addressList.length > 0 && addressList[0]?.isFirstAddress ? addressList[0].fullAddress : null;

    const currentEndAddress =
      addressList.length > 0 && addressList[addressList.length - 1]?.isLastAddress
        ? addressList[addressList.length - 1].fullAddress
        : null;

    // check for start/end address change
    const isStartAddressChanged = prevStartAddress !== currentStartAddress;
    const isEndAddressChanged = prevEndAddress !== currentEndAddress;
    isAddressListChanged = isStartAddressChanged || isEndAddressChanged;

    if (!routeUpdate.startAddress && addressList.length > 0 && addressList[0]?.isFirstAddress === true) {
      setRouteUpdate({
        ...routeUpdate,
        startAddress: currentStartAddress,
      });
    }

    if (
      !routeUpdate.endAddress &&
      addressList.length > 0 &&
      addressList[addressList.length - 1]?.isLastAddress === true
    ) {
      setRouteUpdate({
        ...routeUpdate,
        endAddress: currentEndAddress,
      });
    }

    // check if start and end addresses have been updated
    let isStartUpdated = false;
    let isEndUpdated = false;

    isStartUpdated =
      routeUpdate.startAddress && currentStartAddress && currentStartAddress !== routeUpdate.startAddress;
    isEndUpdated = routeUpdate.endAddress && currentEndAddress && currentEndAddress !== routeUpdate.endAddress;

    if (isAddressListChanged || isStartUpdated || isEndUpdated) {
      setMapData({
        geometry: null,
        markerCoordinates: null,
      });

      setRouteUpdate({
        shouldUpdate: true,
        coordinates: geometry,
        startAddress: currentStartAddress,
        endAddress: currentEndAddress,
      });
    }
  };

  // Used to control when zoom is enabled.
  // Zoom works only when you hold ctrl key down
  const handleKeyUp = (event) => {
    if (event.keyCode === 17) {
      // Control key
      setSettings({ ...settings, scrollZoom: false });
    }
  };

  const hideOverlay = () => {
    if (overlayRef.current) {
      overlayRef.current.style.visibility = 'hidden';
    }
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 17) {
      // Control key
      hideOverlay();
    }
  };

  useEffect(() => {
    if (mapData.markerCoordinates && mapData.markerCoordinates.length > 1 && geometry) {
      initMap(geometry);
    }

    if (addressList && Array.isArray(addressList)) {
      checkAddressListUpdates();
    }

    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keyup', handleKeyUp, false);
      document.removeEventListener('keydown', handleKeyDown, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapData, addressList, geometry]);

  useEffect(() => {
    if (routeUpdate.shouldUpdate && routeUpdate.coordinates) {
      const mapInstance = mapRef.current || reactMap;
      const map = mapInstance?.getMap();

      if (map) {
        // Check if layers exist before removing
        if (map.getLayer('routeline-active')) {
          map.removeLayer('routeline-active');
        }
        if (map.getLayer('routearrows')) {
          map.removeLayer('routearrows');
        }
        if (map.getSource('route')) {
          map.removeSource('route');
        }

        // Reset fit bounds flag since data has changed
        hasFitBoundsRef.current = false;

        intialize(map, routeUpdate.coordinates);
      }

      setRouteUpdate({
        shouldUpdate: false,
        coordinates: null,
        startAddress: routeUpdate.startAddress,
        endAddress: routeUpdate.endAddress,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeUpdate.shouldUpdate]);

  // Update viewport dimensions when size prop changes (for dynamic resizing)
  useEffect(() => {
    if (size && (viewport.width !== size.width || viewport.height !== size.height)) {
      setViewport((prevViewport) => ({
        ...prevViewport,
        width: size.width,
        height: size.height,
      }));

      // Trigger map resize if the map instance exists
      if (reactMap) {
        const map = reactMap.getMap();
        if (map && map.resize) {
          // Small delay to ensure DOM updates have completed
          setTimeout(() => {
            map.resize();
          }, 100);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.width, size.height, componentVersion]);

  // Reset internal state when geocodings, addressList, or geometry prop changes to trigger re-processing and viewport adjustment
  const geocodingsRef = useRef(geocodings);
  const addressListRef = useRef(addressList);
  const geometryRef = useRef(geometry);
  useEffect(() => {
    // Skip on initial mount when all refs match current props
    const geocodingsChanged = geocodingsRef.current !== geocodings;
    const addressListChanged = addressListRef.current !== addressList;
    const geometryChanged = geometryRef.current !== geometry;

    if (!geocodingsChanged && !addressListChanged && !geometryChanged) {
      return;
    }

    geocodingsRef.current = geocodings;
    addressListRef.current = addressList;
    geometryRef.current = geometry;

    // Reset fit bounds flag so new data triggers viewport adjustment
    hasFitBoundsRef.current = false;

    // Clear existing route layers from the map
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      if (map) {
        if (map.getLayer('routeline-active')) {
          map.removeLayer('routeline-active');
        }
        if (map.getLayer('routearrows')) {
          map.removeLayer('routearrows');
        }
        if (map.getSource('route')) {
          map.removeSource('route');
        }
      }
    }

    // Clear pending geometry
    pendingGeometryRef.current = null;

    // Reset route state
    setRouteUpdate({
      shouldUpdate: false,
      coordinates: null,
      startAddress: null,
      endAddress: null,
    });

    // Reset map data to trigger re-processing
    setMapData({
      geometry: null,
      markerCoordinates: null,
      startAddress: '',
      endAddress: '',
    });

    // Also clear selected pin
    setSelectedPin(null);
  }, [geocodings, addressList, geometry]);

  const setOverlayVisibility = (isVisible) => {
    if (overlayRef.current) {
      if (isVisible) {
        overlayRef.current.style.visibility = 'visible';
        setTimeout(() => hideOverlay(), 2000);
      } else {
        hideOverlay();
      }
    }
  };

  const map = () => (
    <div
      ref={wrapperRef}
      style={{
        position: 'relative',
        height: viewport.height,
      }}
    >
      <div onMouseDown={() => hideOverlay()} id='map-overlay' ref={overlayRef} role='button'>
        Use ctrl + scroll to zoom the map
      </div>

      <ReactMapGL
        // controller={mapController}
        ref={(newMap) => {
          reactMap = newMap;
          const previousMap = mapRef.current;
          mapRef.current = newMap;

          // If we got a new map instance and there's pending geometry, set up listeners
          if (newMap && newMap !== previousMap && pendingGeometryRef.current) {
            const mapInstance = newMap.getMap();
            if (mapInstance) {
              const addPendingRoute = () => {
                if (pendingGeometryRef.current) {
                  intialize(mapInstance, pendingGeometryRef.current);
                }
              };

              // Check if already loaded, otherwise wait for load
              if (mapInstance.loaded() && mapInstance.isStyleLoaded()) {
                addPendingRoute();
              } else {
                mapInstance.once('load', addPendingRoute);
              }
            }
          }
        }}
        mapStyle='mapbox://styles/mapbox/streets-v11'
        {...viewport}
        width='auto'
        mapboxApiAccessToken={MapboxAccessToken}
        onViewportChange={(view) => setViewport(view)}
        {...settings}
        onDblClick={() => {
          setSettings({ ...settings, dragPan: true });
        }}
        onInteractionStateChange={() => {
          // No interaction state handling needed
        }}
        onWheel={(event) => {
          if (event.srcEvent.ctrlKey) {
            setOverlayVisibility(false);
            // setViewport({ ...viewport, longitude: event.lngLat[0], latitude:event.lngLat[1], transitionDuration: 100, zoom: viewport.zoom + (event.delta > 0 ?  0.5 : -0.5) })
            setSettings({ ...settings, scrollZoom: true });
            event.preventDefault();
          } else {
            setOverlayVisibility(true);
          }
        }}
        onClick={() => setSelectedPin(null)}
        // transitionDuration={1000}
        // transitionInterpolator={new FlyToInterpolator()}
      >
        <div id='navigation-control' style={{ position: 'absolute', right: 28 }}>
          <NavigationControl showZoom showCompass />
        </div>
        {mapData.markerCoordinates &&
          Array.isArray(mapData.markerCoordinates) &&
          mapData.markerCoordinates.map((place) => (
            <Marker
              key={`${place?.geometry?.latitude}_${place?.geometry?.longitude}_${place?.order}_${place?.recordId}`}
              latitude={place?.geometry?.latitude}
              longitude={place?.geometry?.longitude}
            >
              <div
                className='map-pin1'
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedPin(place);
                }}
                role='button'
              >
                <p>
                  <span>{place?.order}</span>
                </p>
              </div>
            </Marker>
          ))}

        {selectedPin ? (
          <Popup
            latitude={selectedPin?.geometry?.latitude}
            longitude={selectedPin?.geometry?.longitude}
            anchor='bottom'
            offsetTop={-10}
            onClose={() => {
              setSelectedPin(null);
            }}
          >
            <div>
              <p>{selectedPin?.address}</p>
            </div>
          </Popup>
        ) : null}
      </ReactMapGL>
    </div>
  );

  return mapData.markerCoordinates || showPlaceholder ? map() : null;
}

Mapbox.propTypes = propTypes;
export default Mapbox;
