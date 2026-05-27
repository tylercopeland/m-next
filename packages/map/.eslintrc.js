module.exports = {
  extends: ['../../.eslintrc.js'],
  rules: {
    // Disable the import/no-unresolved rule for specific packages
    'import/no-unresolved': [
      'error',
      {
        ignore: [
          'react-map-gl',
          'viewport-mercator-project',
          '@turf/turf',
          'mapbox-gl/dist/mapbox-gl.css'
        ]
      }
    ]
  }
};
