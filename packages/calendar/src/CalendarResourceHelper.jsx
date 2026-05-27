const CalendarResourceHelper = (viewName, columnName) => {
  const activeResourceExpression = [
    {
      operation: 2,
      dateField: null,
      source: null,
    },
    {
      operation: null,
      dateField: null,
      source: {
        ValueType: 3,
        Value: 'IsActive',
        Property: 'YesNo',
        ChildProperty: null,
        ValidationMessage: null,
        FontStyles: null,
      },
    },
    {
      operation: 4,
      dateField: null,
      source: null,
    },
    {
      operation: null,
      dateField: null,
      source: {
        ValueType: 12,
        Value: true,
        Property: '',
        ChildProperty: null,
        ValidationMessage: null,
        FontStyles: null,
      },
    },
    {
      operation: 1,
      dateField: null,
      source: null,
    },
  ];

  const resourceFilter = {
    viewName,
    columns: [
      {
        name: 'RecordID',
        caption: 'ID',
        columnType: 0,
        isKey: true,
        format: { display: 0, visible: false },
        fieldType: 0,
      },
      {
        name: columnName,
        caption: 'Name',
        columnType: 0,
        format: { display: 0, visible: true },
        fieldType: 0,
      },
    ],
    paging: {
      pageNumber: 1,
      pageSize: 50,
    },
    viewFilter: {},
    sorting: { sortField: columnName, sortType: 1 },
    processServerSide: false,
  };

  const buildViewFilter = (shared) => ({
    filterId: '73261e80-ec5d-b174-53d7-3a9a2ec3c221',
    filterName: 'DrpFilter',
    viewName,
    versionId: '00000000-0000-0000-0000-000000000000',
    searchString: null,
    isDefault: true,
    isHidden: false,
    state: 1,
    expression: [
      {
        operation: 0,
        dateField: null,
        source: null,
      },
      {
        operation: null,
        dateField: null,
        source: {
          ValueType: 3,
          Value: 'RecordID',
          Property: 'Integer',
          ChildProperty: null,
          ValidationMessage: null,
          FontStyles: null,
        },
      },
      {
        operation: 17,
        dateField: null,
        source: null,
      },
      {
        operation: null,
        dateField: null,
        source: {
          ValueType: 9,
          Value: shared,
          Property: '',
          ChildProperty: null,
          ValidationMessage: null,
          FontStyles: null,
        },
      },
      {
        operation: 2, // AND
        dateField: null,
        source: null,
      },
      {
        operation: null,
        dateField: null,
        source: {
          ValueType: 3,
          Value: 'TenantID',
          Property: 'Integer',
          ChildProperty: null,
          ValidationMessage: null,
          FontStyles: null,
        },
      },
      {
        operation: 5, // > (greater than)
        dateField: null,
        source: null,
      },
      {
        operation: null,
        dateField: null,
        source: {
          ValueType: 12,
          Value: 0,
          Property: '',
          ChildProperty: null,
          ValidationMessage: null,
          FontStyles: null,
        },
      },
    ],
    sorting: [],
    hidden: [],
    visibleColumns: null,
  });

  return {
    activeResourceExpression,
    resourceFilter,
    buildViewFilter,
  };
};

export default CalendarResourceHelper;
