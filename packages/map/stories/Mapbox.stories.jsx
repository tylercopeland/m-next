import React from 'react';
import { Mapbox } from '../src/index';

export default {
  title: 'M-One/Map/Mapbox',
  component: Mapbox,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Interactive map component using Mapbox GL JS for displaying addresses and routes.',
      },
    },
  },
  argTypes: {
    accessToken: {
      description: 'Mapbox API access token',
      control: { type: 'text' },
    },
    addressList: {
      description: 'Array of address objects to display on the map',
      control: { type: 'object' },
    },
    size: {
      description: 'Map dimensions',
      control: { type: 'object' },
    },
    zoom: {
      description: 'Initial zoom level',
      control: { type: 'range', min: 1, max: 20, step: 1 },
    },
  },
};

const Template = (args) => <Mapbox {...args} />;

const mockAddressList = [
  {
    fullAddress: '1600 Pennsylvania Avenue NW, Washington, DC 20500',
    recordId: 1,
    isFirstAddress: true,
    orderNumber: 1,
  },
  {
    fullAddress: '350 5th Ave, New York, NY 10118',
    recordId: 2,
    orderNumber: 2,
  },
  {
    fullAddress: '1 Infinite Loop, Cupertino, CA 95014',
    recordId: 3,
    isLastAddress: true,
    orderNumber: 3,
  },
];

const mockGeocodings = [
  {
    features: [
      {
        geometry: {
          coordinates: [-77.0365, 38.8977], // White House
        },
      },
    ],
  },
  {
    features: [
      {
        geometry: {
          coordinates: [-73.9857, 40.7484], // Empire State Building
        },
      },
    ],
  },
  {
    features: [
      {
        geometry: {
          coordinates: [-122.0308, 37.3316], // Apple Park
        },
      },
    ],
  },
];

const mockGeometry = {
  type: 'LineString',
  coordinates: [
    [-77.0365, 38.8977],
    [-73.9857, 40.7484],
    [-122.0308, 37.3316],
  ],
};

export const Default = Template.bind({});
Default.args = {
  geometry: mockGeometry,
  size: { width: 800, height: 600 },
  showPlaceholder: true,
  zoom: 4,
};

export const MultipleAddresses = Template.bind({});
MultipleAddresses.args = {
  addressList: mockAddressList,
  geocodings: mockGeocodings,
  geometry: mockGeometry,
  size: { width: 800, height: 600 },
  zoom: 4,
};

export const SingleAddress = Template.bind({});
SingleAddress.args = {
  addressList: [mockAddressList[0]],
  geocodings: [mockGeocodings[0]],
  size: { width: 800, height: 600 },
  zoom: 15,
};

export const HighZoom = Template.bind({});
HighZoom.args = {
  addressList: mockAddressList.slice(0, 2),
  geocodings: mockGeocodings.slice(0, 2),
  geometry: {
    type: 'LineString',
    coordinates: [
      [-77.0365, 38.8977],
      [-73.9857, 40.7484],
    ],
  },
  size: { width: 800, height: 600 },
  zoom: 8,
};

export const CustomSize = Template.bind({});
CustomSize.args = {
  addressList: mockAddressList,
  geocodings: mockGeocodings,
  geometry: mockGeometry,
  size: { width: 400, height: 300 },
  zoom: 4,
};
