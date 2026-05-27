import React from 'react';
import { FieldTypeNames } from '@m-next/types';
import FieldBlock from '../src';
// expect.extend(matchers);

export default {
  component: FieldBlock,
  title: 'm-one/FieldBlock',
  argTypes: {},
  parameters: {
    cssresources: [
      {
        id: `Method Styles`,
        code: `<link rel="stylesheet" type="text/css" href="https://alocetsystem.method.me/apps/public/styles/styles.min.css"></link>`,
        picked: true,
      },
    ],
    design: {
      type: 'figma',
    },
  },
};

const data = {
  RecordId: 1,
  FirstName: 'Jane',
  LastName: 'Smith',
  Email: 'Jane.s@redbubble.co.uk',
  Phone: '',
  Website: '',
  TagList: 'aaa,bbb,ccc',
  IsCool: 'true',
  IsNotCool: 'false',
};

const tagsList = [
  {
    name: 'aaa',
    colour: '#84f3ff',
  },
  {
    name: 'bbb',
    colour: '#A9d9bf',
  },
  {
    name: 'ccc',
    colour: '#ffabb5',
  },
  {
    name: 'ddd',
    colour: '#bacad0',
  },
  {
    name: 'eee',
    colour: '#ffea80',
  },
  {
    name: 'fff',
    colour: '#ffaca1',
  },
  {
    name: 'ggg',
    colour: '#91a2ff',
  },
  {
    name: 'hhh',
    colour: '#ffcdab',
  },
  {
    name: 'iii',
    colour: '',
  },
];
const fields = [
  {
    name: 'RecordId',
    caption: 'RecordId',
    type: 'Id',
    isVisible: false,
    isRequired: false,
  },

  {
    name: 'FirstName',
    caption: 'First Name',
    type: 'Text',
    isVisible: true,
    isRequired: true,
    maxLength: 40,
  },
  {
    name: 'LastName',
    caption: 'Last Name',
    type: 'Text',
    isVisible: true,
    isRequired: false,
    maxLength: 5,
  },
  {
    name: 'Email',
    caption: 'Email',
    type: 'Email',
    isVisible: true,
    isRequired: false,
    maxLength: 400,
  },
  {
    name: 'Phone',
    caption: 'Phone',
    type: 'Text',
    isVisible: true,
    isRequired: false,
    maxLength: 12,
  },
  {
    name: 'Website',
    caption: 'Website',
    type: 'Text',
    isVisible: true,
    isRequired: false,
    maxLength: 400,
  },
  {
    name: 'Address',
    caption: 'Address',
    type: FieldTypeNames.Address,
    isVisible: true,
    isRequired: false,
  },
  {
    name: 'TagList',
    caption: 'Tag list',
    type: FieldTypeNames.Tags,
    isVisible: true,
    isRequired: false,
  },
  {
    name: 'IsCool',
    caption: 'IsCool',
    type: 'YesNo',
    isVisible: true,
    isRequired: false,
  },
  {
    name: 'IsNotCool',
    caption: 'IsNotCool',
    type: 'YesNo',
    isVisible: true,
    isRequired: false,
    displayOptions: {
      trueValue: 'Cool',
      falseValue: 'not',
    },
  },
];

function Template(args) {
  return (
    <div style={{ height: 400, overflowY: 'scroll' }}>
      <FieldBlock {...args} />
    </div>
  );
}
export const Default = Template.bind({});
Default.args = {
  id: 'test',
  fields,
  data,
  isLoading: false,
  collapseEmpty: false,
  inDesignMode: false,
  error: null,
  tagsList,
};
export const CollapseEmpty = Template.bind({});
CollapseEmpty.args = {
  id: 'test',
  fields,
  data,
  isLoading: false,
  collapseEmpty: true,
  inDesignMode: false,
  error: null,
  tagsList,
};

export const Loading = Template.bind({});
Loading.args = {
  id: 'test',
  fields,
  data,
  isLoading: true,
  collapseEmpty: false,
  inDesignMode: false,
  error: null,
  tagsList,
};

export const Error = Template.bind({});
Error.args = {
  id: 'test',
  fields,
  data,
  isLoading: true,
  collapseEmpty: false,
  inDesignMode: false,
  error: 'Error',
  tagsList,
};
export const Editable = Template.bind({});
Editable.args = {
  id: 'test',
  fields,
  data,
  isLoading: false,
  collapseEmpty: false,
  inDesignMode: false,
  mode: 1,
  tagsList,
};
