import { v4 as uuidv4 } from 'uuid';

const CalendarHelperModel = (calendarModel, gridPageSize) => {
  const gridModelFilter = calendarModel.filterDef ? [...calendarModel.filterDef[0].expression] : [];

  gridModelFilter.pop();

  const filterWaitlistExpression = [
    {
      operation: 2,
    },
    {
      source: {
        ValueType: gridModelFilter.length === 0 ? 0 : 3,
        Value: 'ActivityStatus',
        Property: 'DropDown',
      },
    },
    {
      operation: 12,
    },
    {
      source: {
        ValueType: 9,
        Value: calendarModel.model.toWaitlistStatus,
        Property: '',
      },
    },
    {
      operation: 1,
    },
  ];

  filterWaitlistExpression.forEach((exp) => gridModelFilter.push(exp));

  const gridModel = {
    columnTotals: [],
    Type: 'EDT',
    IsComplexType: true,
    viewList: [
      {
        name: 'View 1',
        id: '2e5c56c2-09d2-221e-d95a-7220b6a0cf20',
        columns: [
          {
            field: 'RecordID',
            visible: false,
          },
          {
            field: 'CardColumn1',
            visible: true,
          },
        ],
        sorting: [],
        filtering: gridModelFilter,
      },
    ],
    viewFriendlyName: 'Activity',
    defaultViewFilter: '2e5c56c2-09d2-221e-d95a-7220b6a0cf20',
    columns: [
      {
        controlId: '3aa77dba-249d-a620-b430-f377ba3fe036',
        header: 'RecordID',
        field: 'RecordID',
        fieldType: 2,
        displayField: 'RecordID',
      },
      {
        controlId: 'ebefec82-39cd-8951-ad74-2266f423f846',
        header: 'CardColumn1',
        field: 'CardColumn1',
        fieldType: 11,
        columnType: 4,
        onChangeEvent: null,
        readOnly: true,
        canDelete: true,
        isLocked: true,
        cardColumnFields: [
          {
            fldTypeId: 11,
            label: 'Entity',
            table: 'Entity',
            value: 'Entity',
          },
          {
            fldTypeId: 11,
            label: 'Comments',
            table: 'Activity',
            value: 'Comments',
          },
          {
            fldTypeId: 11,
            label: 'ContactsName',
            table: 'Activity',
            value: 'ContactsName',
          },
          {
            fldTypeId: 11,
            label: 'ActivityStatus',
            table: 'Activity',
            value: 'ActivityStatus',
          },
          {
            fldTypeId: 11,
            label: 'WorkOrderInstructions',
            table: 'Activity',
            value: 'WorkOrderInstructions',
          },
        ],
        showOnMobile: true,
        format: {
          width: 'md',
          alignment: 'left',
          type: 'no-avatar-1-col',
          rounding: '0',
          headerAlignment: 'left',
          disabled: false,
        },
        control: {
          Type: 'CRD',
          defaultValue: 'CardColumn1',
          id: 'ebefec82-39cd-8951-ad74-2266f423f846',
          name: 'CardColumn1',
          TypeOverride: 'CRD',
          FieldType: 0,
          value: 'CardColumn1',
          caption: 'CardColumn1',
        },
        displayField: 'CardColumn1',
      },
    ],
    isSearchable: true,
    isSelectable: false,
    SearchString: '',
    hideViewSelector: false,
    showDividers: true,
    hasZebraStripes: true,
    addLabel: 'Add lines',
    isReadOnly: false,
    canAddMoreRows: true,
    newRowsCount: 0,
    showDeleteColumn: false,
    showDeleteConfirmation: false,
    showGoToPage: false,
    onActiveRowChange: null,
    paging: {
      pageNumber: 1,
      pageSize: gridPageSize,
      totalRows: 0,
    },
    showExport: false,
    viewFilter: '2e5c56c2-09d2-221e-d95a-7220b6a0cf20',
    selectAll: false,
    hideAdvSearch: false,
    hideColumnHeaders: false,
    hideNavigation: false,
    hideSearch: false,
    hideViewsDropdown: false,
    id: uuidv4(),
    name: 'EditableGrid',
    TypeOverride: 'EDT',
    isBound: false,
    FieldType: 0,
    caption: 'EditableGrid',
    hideCaption: true,
    isOutputOnly: false,
    regularCaption: true,
    widthType: 'auto',
    disabled: false,
  };

  const gridColumns = [
    {
      name: 'RecordID',
      header: 'RecordID',
      field: 'RecordID',
      fieldType: 2,
      columnType: 0,
      readOnly: true,
      canDelete: false,
      isLocked: true,
      showOnMobile: false,
      primary: true,
      hasColumnTotal: false,
      displayField: 'RecordID',
      visible: false,
    },
    {
      name: 'CardColumn1',
      header: 'CardColumn1',
      field: 'CardColumn1',
      formatType: { type: 'no-avatar-1-col' },
      fieldType: 11,
      columnType: 4,
      readOnly: true,
      canDelete: true,
      isLocked: true,
      visible: true,
      cardColumnFields: [
        {
          format: {
            type: 'Text',
            visible: true,
            hasExpression: true,
          },
          fldTypeId: 11,
          label: 'Entity',
          table: 'Entity',
          value: 'Entity',
        },
        {
          format: {
            type: 'Text',
            visible: true,
            hasExpression: true,
          },
          fldTypeId: 11,
          label: 'Comments',
          table: 'Activity',
          value: 'Comments',
        },
        {
          format: {
            type: 'Text',
            visible: true,
            hasExpression: true,
          },
          fldTypeId: 11,
          label: 'ContactsName',
          table: 'Activity',
          value: 'ContactsName',
        },
        {
          format: {
            type: 'Text',
            visible: true,
            hasExpression: true,
          },
          fldTypeId: 11,
          label: 'ActivityStatus',
          table: 'Activity',
          value: 'ActivityStatus',
        },
        {
          format: {
            type: 'Text',
            visible: true,
            hasExpression: true,
          },
          fldTypeId: 11,
          label: 'WorkOrderInstructions',
          table: 'Activity',
          value: 'WorkOrderInstructions',
        },
      ],
      showOnMobile: true,
      format: {
        width: 'md',
        alignment: 'left',
        type: 'no-avatar-1-col',
        rounding: '0',
        headerAlignment: 'left',
        visible: true,
        disabled: false,
      },
      hasColumnTotal: false,
      displayField: 'CardColumn1',
    },
  ];

  const calendar = {
    ...calendarModel,
    id: uuidv4(),
    model: {
      ...calendarModel.model,
      fromDate: '',
      toDate: '',
      showWaitlist: true,
      isWaitlistData: true,
      resources: [],
      config: {
        ...calendarModel.model.config,
        resources: [],
      },
    },
  };

  return {
    gridModel,
    gridColumns,
    calendar,
  };
};

export default CalendarHelperModel;
