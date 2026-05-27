import axios from 'axios';
import MapboxAccessToken from './token';

const MapboxApi = () => {
  const mapBoxBaseUrl = 'https://api.mapbox.com';
  const geocodingPath = '/geocoding/v5/mapbox.places';
  const optimizationPath = '/optimized-trips/v1/mapbox/driving';
  const directionPath = '/directions/v5/mapbox/driving';

  const formatCoordinates = (geocodingData) =>
    geocodingData
      .map((geocoding) => {
        if (geocoding.data.features && geocoding.data.features.length) {
          const geometry = geocoding.data.features[0].geometry.coordinates;
          return `${geometry[0]},${geometry[1]}`;
        }
        return null;
      })
      // Remove possible null values
      .filter((val) => val)
      .join(';');

  const getAddressOrderLabel = (address) => {
    if (!address.isFirstAddress && !address.isLastAddress) {
      return address.orderNumber;
    }

    if (address.isFirstAddress) {
      return 'S';
    }

    if (address.isLastAddress) {
      return 'E';
    }
  };

  const getCoordinates = async (addressList) => {
    // Grab all addresses coordinates (calling geocoding api)
    try {
      return await axios.all(
        addressList.map((address) => {
          let url = `${mapBoxBaseUrl}${geocodingPath}/${address.fullAddress}.json?access_token=${MapboxAccessToken}&types=address`;
          if (address.countryCode) {
            url += `&country=${address.countryCode}`;
          }
          return axios.get(url);
        }),
      );
    } catch (error) {
      console.log(error); // eslint-disable-line
    }
  };

  const getDirection = async (geocodingData) => {
    try {
      const coordinates = formatCoordinates(geocodingData);
      const url = `${mapBoxBaseUrl}${directionPath}/${coordinates}?access_token=${MapboxAccessToken}&geometries=geojson&overview=full&steps=true`;
      return await axios.get(url);
    } catch (error) {
      console.log(error); // eslint-disable-line
    }
  };

  const getOptimizedRoute = async (geocodingData) => {
    try {
      const coordinates = formatCoordinates(geocodingData);
      // var url = `${mapBoxBaseUrl}${optimizationPath}/mapbox/driving/${coordinates};-79.432554,43.786355;-79.448335,43.864892?access_token=${accessToken}&geometries=geojson&overview=full&steps=true&roundtrip=false&source=first&destination=last`;
      const url = `${mapBoxBaseUrl}${optimizationPath}/${coordinates}?access_token=${MapboxAccessToken}&geometries=geojson&overview=full&steps=true&roundtrip=false&source=first&destination=last`;
      return await axios.get(url);
    } catch (error) {
      console.log(error); // eslint-disable-line
    }
  };

  const getAddressSuggestions = async (searchParameter, proximity) => {
    if (!searchParameter) {
      return;
    }

    const encodedSearchParameter = encodeURI(searchParameter);
    const url = `${mapBoxBaseUrl}${geocodingPath}/${encodedSearchParameter}.json`;

    const requestParams = {
      method: 'get',
      url,
      params: {
        access_token: MapboxAccessToken,
      },
    };

    if (proximity !== null) {
      requestParams.params['proximity'] = proximity;
    }

    return axios(requestParams);
  };

  const getMarkerCoordinates = (geocodingData, addressList) => {
    const result = geocodingData.map((geocoding, idx) => {
      if (geocoding.features && geocoding.features.length) {
        return {
          geometry: {
            latitude: geocoding.features[0].geometry.coordinates[1],
            longitude: geocoding.features[0].geometry.coordinates[0],
          },
          address: addressList[idx].fullAddress,
          order: getAddressOrderLabel(addressList[idx]),
          recordId: addressList[idx].recordId,
        };
      }

      return {
        geometry: null,
        failedAddress: addressList[idx],
      };
    });

    return result;
  };

  return {
    getCoordinates,
    getOptimizedRoute,
    getMarkerCoordinates,
    getDirection,
    getAddressSuggestions,
  };
};

export default MapboxApi;
