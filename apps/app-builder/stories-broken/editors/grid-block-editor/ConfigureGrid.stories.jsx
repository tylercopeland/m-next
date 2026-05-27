import React from 'react';
import { FieldTypeIds } from '@m-next/types';
import '../../../src/app/app.css';
import Component from './GridSettingsTestWrapper';
import fieldListContacts from '../../../testing/data/fieldListContacts.json';
import { createGridColumn, createGridView } from '../../../src/views/layout-designer/control-classes';

export default {
  component: Component,
  title: 'app-builder/editors/GridBlockEditor',
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
    },
  },
};

function Template(args) {
  return <Component {...args} />;
}

export const BlankGridSettings = Template.bind({});
BlankGridSettings.args = {
  control: {
    id: 'test',
    isReadOnly: true,
    viewFriendlyName: null,
    columns: [],
    defaultViewFilter: null,
    viewList: [],

    visible: true,
    disabled: false,
    showHeader: true,
    paging: {
      pageNumber: 1,
      pageSize: 10,
    },
    showGoToPage: true,
    showPagination: true,

    isSearchable: true,
    hideCaption: true,
    hideSearch: false,
    showSort: true,
    hideViewSelector: false,
    showExport: false,
    showRefresh: false,
    isSelectable: false,
    canReorderColumns: false,

    canAddMoreRows: true,
    showDeleteColumn: true,
    showDeleteConfirmation: false,
  },
  fieldList: fieldListContacts,
  tableList: [{ name: 'Contacts', caption: 'Contacts' }],
  onChange: () => {},
  onTableChange: () => {},
};

const viewList = [];
for (let i = 0; i < 15; i++) {
  viewList.push(
    createGridView({
      id: i.toString(),
      name: `All ${i}`,
      filter: null,
      visible: i % 5 !== 0,
      columns: [
        {
          field: 'RecordID',
          visible: i % 2 === 0,
          canDelete: false,
        },
        {
          field: 'ProfileImage',
          visible: true,
          canDelete: true,
        },
        {
          field: 'FullName',
          visible: true,
          canDelete: true,
        },
      ],
    }),
  );
}

export const GridSettings = Template.bind({});
GridSettings.args = {
  control: {
    id: 'test',
    isReadOnly: true,
    viewFriendlyName: 'Contacts',
    columns: [
      createGridColumn({
        field: 'RecordID',
        header: 'Record ID',
        visible: false,
        fieldType: FieldTypeIds.Id,
        canDelete: false,
      }),
      createGridColumn({
        field: 'ProfileImage',
        header: 'Profile image',
        visible: true,
        fieldType: FieldTypeIds.ProfileImage,
      }),
      createGridColumn({ field: 'FullName', header: 'Full name', visible: true, fieldType: FieldTypeIds.Text }),
    ],
    defaultViewFilter: '1',
    viewList,
    visible: true,
    disabled: false,
    showHeader: true,
    paging: {
      pageNumber: 1,
      pageSize: 10,
    },
    showGoToPage: true,
    showPagination: true,

    isSearchable: true,
    hideCaption: true,
    hideSearch: false,
    showSort: true,
    hideViewSelector: false,
    showExport: false,
    showRefresh: false,
    isSelectable: false,
    canReorderColumns: false,

    canAddMoreRows: true,
    showDeleteColumn: true,
    showDeleteConfirmation: false,
  },
  fieldList: fieldListContacts,
  tableList: [{ name: 'Contacts', caption: 'Contacts' }],
  onChange: () => {},
  onTableChange: () => {},
};
