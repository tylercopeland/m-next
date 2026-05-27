import React from 'react';
import { FieldTypeIds } from '@m-next/types';
import Grid from '../src/Grid';
import GridWrapper from './GridWrapper';
import {
  data,
  legacyData,
  columns,
  legacyColumn,
  tagsList,
  tagsListSuggestions,
  columnsSmall,
  columnsOpportunities,
  dataOpportunity,
  tagsListOpportunities,
  autoSizeColumns,
} from './gridData';

export default {
  component: Grid,
  title: 'm-one/Grid',
  argTypes: {},
  // decorators: [withTests({ results })],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/xnh6ZMW6oZ1pwWgKzfROqJ/Version-Managment?node-id=11%3A4',
    },
  },
};

function Template(args) {
  return <GridWrapper {...args} />;
}

export const Readonly = Template.bind({});

Readonly.args = {
  id: 'test',
  isMobile: false,
  isLoading: false,
  editable: false,
  width: '100%',
  data,
  errorData: null,
  columns,
  onRenderRow: null,
  viewFilters: [
    {
      name: 'Top Contacts',
      id: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'All Contacts',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
  ],
  selectedView: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
  showReload: true,
  showExport: false,
  showViewFilter: true,
  selectable: true,
  columnTotals: [],
  tagsList,
  showInlineExport: true,
  showShowHideColumns: true,
};

export const ReadonlyNoHeader = Template.bind({});

ReadonlyNoHeader.args = {
  id: 'test',
  isMobile: false,
  isLoading: false,
  editable: false,
  width: '100%',
  data,
  errorData: null,
  columns,
  onRenderRow: null,
  viewFilters: [
    {
      name: 'Top Contacts',
      id: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'All Contacts',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
  ],
  selectedView: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
  showReload: false,
  showExport: false,
  showViewFilter: false,
  selectable: true,
  columnTotals: [],
  tagsList,
  tagsSuggestions: tagsListSuggestions,
  showInlineExport: false,
  showShowHideColumns: false,
  searchable: false,
  showSort: false,
};

export const ReadonlyLargeDataSet = Template.bind({});

ReadonlyLargeDataSet.args = {
  id: 'test',
  dataMultiplier: 1000,
  initialPageSize: 100,
  isMobile: false,
  isLoading: false,
  editable: false,
  width: '100%',
  data,
  errorData: null,
  columns,
  onRenderRow: null,
  viewFilters: [
    {
      name: 'Top Contacts',
      id: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'All Contacts',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
  ],
  selectedView: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
  showReload: true,
  showExport: true,
  showViewFilter: true,
  selectable: true,
  columnTotals: [],
  tagsSuggestions: tagsListSuggestions,
  tagsList,
};

export const ReadonlyLongFilterList = Template.bind({});

ReadonlyLongFilterList.args = {
  id: 'test',
  isMobile: false,
  isLoading: false,
  editable: false,
  width: '100%',
  data,
  errorData: null,
  columns,
  onRenderRow: null,
  viewFilters: [
    {
      name: 'Top Contacts',
      id: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'All Contacts',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'C1',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'C2',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'C3',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'C4',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'C5',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'C6',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'C7',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'C8',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'C9',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'C10',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'C11',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'C12',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'C13',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'C14',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'C15',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'C16',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'C17',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'C18',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'C19',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'C20',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
  ],
  selectedView: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
  showReload: true,
  showExport: true,
  showViewFilter: true,
  selectable: true,
  columnTotals: [],
  tagsSuggestions: tagsListSuggestions,
  tagsList,
};

export const ReadonlySearched = Template.bind({});

ReadonlySearched.args = {
  id: 'test',
  isMobile: false,
  isLoading: false,
  editable: false,
  width: '100%',
  searchValue: 'Cold lead',
  data: data.filter((item) => item.TagList?.includes('Cold lead')),
  errorData: null,
  columns,
  onRenderRow: null,
  viewFilters: [
    {
      name: 'Top Contacts',
      id: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'All Contacts',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
  ],
  selectedView: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
  showReload: true,
  showExport: true,
  showViewFilter: true,
  selectable: true,
  columnTotals: [],
  tagsSuggestions: tagsListSuggestions,
  tagsList,
};

export const ReadonlyNoData = Template.bind({});

ReadonlyNoData.args = {
  id: 'test',
  isMobile: false,
  isLoading: false,
  editable: false,
  width: '100%',
  data: [],
  errorData: null,
  columns,
  onRenderRow: null,
  viewFilters: [
    {
      name: 'Top Contacts',
      id: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'All Contacts',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
  ],
  selectedView: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
  showReload: true,
  showExport: true,
  showViewFilter: true,
  selectable: true,
  columnTotals: [],
  tagsSuggestions: tagsListSuggestions,
  tagsList,
};

export const ReadonlyNoDataSearch = Template.bind({});

ReadonlyNoDataSearch.args = {
  id: 'test',
  isMobile: false,
  isLoading: false,
  editable: false,
  width: '100%',
  data: [],
  errorData: null,
  columns,
  onRenderRow: null,
  viewFilters: [
    {
      name: 'Top Contacts',
      id: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'All Contacts',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
  ],
  selectedView: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
  showReload: true,
  showExport: true,
  showViewFilter: true,
  selectable: true,
  columnTotals: [],
  tagsSuggestions: tagsListSuggestions,
  tagsList,
  searchValue: 'Cold lead',
};

export const Editable = Template.bind({});
Editable.args = {
  id: 'test',
  isMobile: false,
  isLoading: false,
  editable: true,
  width: '100%',
  data,
  errorData: null,
  columns,
  onRenderRow: null,
  tagsSuggestions: tagsListSuggestions,
  tagsList,
};

export const EditableSingleRow = Template.bind({});
EditableSingleRow.args = {
  id: 'test',
  isMobile: false,
  isLoading: false,
  editable: true,
  width: '100%',
  data: [data[0]],
  errorData: null,
  columns,
  onRenderRow: null,
  tagsSuggestions: tagsListSuggestions,
  tagsList,
};

export const EditableLessColumns = Template.bind({});
EditableLessColumns.args = {
  id: 'test',
  isMobile: false,
  isLoading: false,
  editable: true,
  width: '100%',
  data,
  errorData: null,
  columns: columnsSmall,
  onRenderRow: null,
  tagsSuggestions: tagsListSuggestions,
  tagsList,
  selectable: true,
};

export const MobileReadonly = Template.bind({});

MobileReadonly.args = {
  id: 'test',
  isMobile: true,
  isLoading: false,
  editable: false,
  width: '300px',
  data,
  errorData: null,
  columns,
  onRenderRow: null,
  viewFilters: [
    {
      name: 'Top Contacts',
      id: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'All Contacts',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
  ],
  selectedView: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
  showReload: true,
  showExport: true,
  showViewFilter: true,
  selectable: true,
  tagsSuggestions: tagsListSuggestions,
  tagsList,
  hasCardColumns: true,
};

export const MobileCardReadonly = Template.bind({});

MobileCardReadonly.args = {
  id: 'test',
  isMobile: true,
  isLoading: false,
  editable: false,
  width: '480px',
  data: legacyData,
  errorData: null,
  columns: legacyColumn,
  onRenderRow: null,
  viewFilters: [
    {
      name: 'Top Contacts',
      id: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'All Contacts',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
  ],
  selectedView: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
  showReload: true,
  showExport: true,
  showViewFilter: true,
  selectable: true,
  tagsSuggestions: tagsListSuggestions,
  tagsList,
  hasCardColumns: true,
};

export const ResponsiveReadonly = Template.bind({});

ResponsiveReadonly.args = {
  id: 'test',
  isMobile: false,
  isLoading: false,
  editable: false,
  containerWidth: '25%',
  data,
  errorData: null,
  columns,
  onRenderRow: null,
  viewFilters: [
    {
      name: 'Top Contacts',
      id: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'All Contacts',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
  ],
  selectedView: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
  showReload: true,
  showExport: true,
  showViewFilter: true,
  selectable: true,
  hasCardColumns: true,
  tagsSuggestions: tagsListSuggestions,
  tagsList,
  showSort: true,
};

export const ResponsiveReadonlyNoSort = Template.bind({});

ResponsiveReadonlyNoSort.args = {
  id: 'test',
  isMobile: false,
  isLoading: false,
  editable: false,
  containerWidth: '25%',
  data,
  errorData: null,
  columns,
  onRenderRow: null,
  viewFilters: [
    {
      name: 'Top Contacts',
      id: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'All Contacts',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
  ],
  selectedView: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
  showReload: true,
  showExport: true,
  showViewFilter: true,
  selectable: true,
  hasCardColumns: true,
  tagsSuggestions: tagsListSuggestions,
  tagsList,
  showSort: false,
};

export const Draggable = Template.bind({});

Draggable.args = {
  id: 'test',
  isMobile: false,
  isLoading: false,
  editable: false,
  width: '100%',
  data,
  errorData: null,
  columns,
  onRenderRow: null,
  reorderColumns: true,
  draggable: true,
  viewFilters: [
    {
      name: 'Top Contacts',
      id: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'All Contacts',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
  ],
  selectedView: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
  showReload: true,
  showExport: true,
  showViewFilter: true,
  selectable: true,
  tagsSuggestions: tagsListSuggestions,
  tagsList,
  columnTotals: [],
  showShowHideColumns: true,
};

export const DraggableNoSelect = Template.bind({});

DraggableNoSelect.args = {
  id: 'test',
  isMobile: false,
  isLoading: false,
  editable: false,
  width: '100%',
  data,
  errorData: null,
  columns,
  onRenderRow: null,
  reorderColumns: true,
  draggable: true,
  viewFilters: [
    {
      name: 'Top Contacts',
      id: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'All Contacts',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
  ],
  selectedView: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
  showReload: true,
  showExport: true,
  showViewFilter: true,
  selectable: false,
  tagsSuggestions: tagsListSuggestions,
  tagsList,
  columnTotals: [],
};

export const IsLoading = Template.bind({});

IsLoading.args = {
  id: 'test',
  isMobile: false,
  isLoading: true,
  editable: false,
  width: '100%',
  data,
  errorData: null,
  columns,
  onRenderRow: null,
  viewFilters: [
    {
      name: 'Top Contacts',
      id: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'All Contacts',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
  ],
  selectedView: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
  showReload: true,
  showExport: true,
  showViewFilter: true,
  selectable: true,
  tagsSuggestions: tagsListSuggestions,
  tagsList,
  columnTotals: [],
};

export const IsLoadingNoData = Template.bind({});

IsLoadingNoData.args = {
  id: 'test',
  isMobile: false,
  isLoading: true,
  editable: false,
  width: '100%',
  data: [],
  errorData: null,
  columns,
  onRenderRow: null,
  viewFilters: [
    {
      name: 'Top Contacts',
      id: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'All Contacts',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
  ],
  selectedView: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
  showReload: true,
  showExport: true,
  showViewFilter: true,
  selectable: true,
  tagsSuggestions: tagsListSuggestions,
  tagsList,
  columnTotals: [],
};

export const ReadonlyWithAdvancedSearch = Template.bind({});

ReadonlyWithAdvancedSearch.args = {
  id: 'test',
  isMobile: false,
  isLoading: false,
  hasAdvancedSearch: true,
  editable: false,
  width: '100%',
  data: dataOpportunity,
  errorData: null,
  columns: columnsOpportunities,
  onRenderRow: null,
  selectedView: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
  showReload: true,
  showExport: true,
  showViewFilter: true,
  selectable: true,
  columnTotals: [],
  tagsList: tagsListOpportunities,
  tagsSuggestions: tagsListSuggestions,
};

export const ReadonlyWithInlineButtons = Template.bind({});

ReadonlyWithInlineButtons.args = {
  id: 'test',
  isMobile: false,
  isLoading: false,
  hasAdvancedSearch: false,
  editable: false,
  width: '100%',
  data: dataOpportunity,
  errorData: null,
  columns: columnsOpportunities,
  onRenderRow: null,
  selectedView: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
  showReload: false,
  showExport: false,
  showViewFilter: true,
  selectable: true,
  columnTotals: [],
  tagsList: tagsListOpportunities,
  tagsSuggestions: tagsListSuggestions,
  showInlineExport: true,
  showShowHideColumns: true,
};

export const ReadonlyAutoSizes = Template.bind({});

ReadonlyAutoSizes.args = {
  id: 'test',
  isMobile: false,
  isLoading: false,
  editable: false,
  width: '100%',
  data,
  errorData: null,
  columns: autoSizeColumns,
  onRenderRow: null,
  viewFilters: [
    {
      name: 'Top Contacts',
      id: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'All Contacts',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
  ],
  selectedView: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
  showReload: true,
  showExport: true,
  showViewFilter: true,
  selectable: true,
  columnTotals: [],
  tagsSuggestions: tagsListSuggestions,
  tagsList,
};

export const ButtonStyles = Template.bind({});

ButtonStyles.args = {
  id: 'test',
  isMobile: false,
  isLoading: false,
  editable: false,
  width: '100%',
  data,
  errorData: null,
  columns: [
    {
      primary: false,
      name: 'Button',
      editable: true,
      fieldType: FieldTypeIds.Button,
      visible: true,
      columnAlign: 'center',
      width: 'auto',
      buttonLabel: 'Button',
    },
    {
      primary: false,
      name: 'Button2',
      editable: true,
      fieldType: FieldTypeIds.Button,
      visible: true,
      columnAlign: 'center',
      width: 'auto',
      buttonLabel: 'Button',
      formatStyle: {
        textColor: 'mi-color-success',
        fontSize: 'mi-button-xxxlarge',
        backgroundColor: 'button-alert',
      },
    },
  ],
  onRenderRow: null,
  viewFilters: [
    {
      name: 'Top Contacts',
      id: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
    },
    {
      name: 'All Contacts',
      id: 'aa1840a8-b452-4df2-856f-56a548fa9a2b',
    },
  ],
  selectedView: 'ea1840a8-b452-4df2-856f-56a548fa9a2b',
  showReload: true,
  showExport: true,
  showViewFilter: true,
  selectable: true,
  columnTotals: [],
  tagsSuggestions: tagsListSuggestions,
  tagsList,
};
