module.exports = {
  extends: ['../../.eslintrc.js'],
  rules: {
    // Disable the import/no-unresolved rule for specific packages used by the calendar
    'import/no-unresolved': [
      'error',
      {
        ignore: [
          '@syncfusion/ej2-react-schedule',
          '@syncfusion/ej2-base',
          '@syncfusion/ej2-react-inputs',
          '@syncfusion/ej2-react-dropdowns',
          '@syncfusion/ej2-react-buttons',
          '@syncfusion/ej2-react-popups',
          '@syncfusion/ej2-react-calendars',
          '@syncfusion/ej2-react-navigations'
        ]
      }
    ]
  }
};