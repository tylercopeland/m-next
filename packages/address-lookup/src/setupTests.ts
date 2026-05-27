import '@testing-library/jest-dom';

// Mock fetch for geolocation
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        data: {
          longitude: -73.935242,
          latitude: 40.73061,
        },
      }),
  }),
);
