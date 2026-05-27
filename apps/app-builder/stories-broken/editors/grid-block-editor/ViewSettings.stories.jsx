import React from 'react';
import { FieldTypeIds } from '@m-next/types';
import '../../../src/app/app.css';
import Component from '../../../src/views/layout-designer/editors/grid-block-editor/ViewSettings';
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
  return (
    <div style={{ maxWidth: 384, maxHeight: 500, overflowY: 'scroll' }}>
      <Component {...args} />
    </div>
  );
}

export const ViewSettings = Template.bind({});
ViewSettings.args = {
  view: createGridView({
    id: 'test',
    name: `Test`,
    filter: null,
    visible: true,
    columns: [
      {
        field: 'RecordID',
        visible: false,
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
  fieldList: fieldListContacts,

  columns: [
    createGridColumn({ field: 'RecordID', header: 'Record ID', visible: false, fieldType: FieldTypeIds.Id }),
    createGridColumn({
      field: 'ProfileImage',
      header: 'Profile image',
      visible: true,
      fieldType: FieldTypeIds.ProfileImage,
    }),
    createGridColumn({ field: 'FullName', header: 'Full name', visible: true, fieldType: FieldTypeIds.Text }),
  ],
  onChange: () => {},
  viewFriendlyName: 'Contacts',
};
