import React from 'react';
import MeasurementBlock from '../src';

export default {
  component: MeasurementBlock,
  title: 'm-one/MeasurementBlock',
  argTypes: {},
  parameters: {
    cssresources: [
      {
        id: `Method Styles`,
        code: `<link rel="stylesheet" type="text/css" href="https://alocetsystem.method.me/apps/public/styles/styles.min.css"></link>`,
        picked: true,
      },
    ],
  },
};

const data = {
  RecordId: 1,
  FirstName: 'Jane',
  LastName: 'Smith',
  Email: 'Jane.s@redbubble.co.uk',
  Phone: '',
  Website: '',
  EntityCreatedDate: '20221003T12:00',
  CalcDays: 120,
};
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
    name: 'EntityCreatedDate',
    caption: 'Entity created date',
    type: 'DateTime',
    isVisible: true,
    isRequired: false,
    sourceModel: 'Entity',
    sourceField: 'CreatedDate',
    displayOptions: { dateFormat: 4 },
  },
  {
    name: 'CalcDays',
    caption: 'CalcDays',
    type: 'Number',
    isVisible: true,
    isRequired: false,
  },
];

function Template(args) {
  return <MeasurementBlock {...args} />;
}

export const Default = Template.bind({});
Default.args = {
  id: 'test',
  fields,
  data,
  isLoading: false,
  error: null,
  width: '25%',
  title: [{ valueType: 9, value: 'Project Launch Date' }],
  subtitle: [{ valueType: 3, value: 'EntityCreatedDate' }],
  value: [{ valueType: 3, value: 'CalcDays' }],
  unit: 'Days',
};

export const NoTitle = Template.bind({});
NoTitle.args = {
  id: 'test',
  fields,
  data,
  isLoading: false,
  error: null,
  width: '25%',
  subtitle: [{ valueType: 3, value: 'EntityCreatedDate' }],
  value: [{ valueType: 3, value: 'CalcDays' }],
  unit: 'Days',
};

export const NoSubtitle = Template.bind({});
NoSubtitle.args = {
  id: 'test',
  fields,
  data,
  isLoading: false,
  error: null,
  width: '25%',
  title: [{ valueType: 9, value: 'Project Launch Date' }],
  value: [{ valueType: 3, value: 'CalcDays' }],
  unit: 'Days',
};

export const Percentage = Template.bind({});
Percentage.args = {
  id: 'test',
  fields,
  data,
  isLoading: false,
  error: null,
  width: '25%',
  title: [{ valueType: 9, value: 'Project Launch Date' }],
  subtitle: [{ valueType: 3, value: 'EntityCreatedDate' }],
  value: [{ valueType: 3, value: 'CalcDays' }],
  unit: '%',
};

export const Loading = Template.bind({});
Loading.args = {
  id: 'test',
  fields,
  data,
  isLoading: true,
  error: null,
  width: '25%',
  title: [{ valueType: 9, value: 'Project Launch Date' }],
  subtitle: [{ valueType: 3, value: 'EntityCreatedDate' }],
  value: [{ valueType: 3, value: 'CalcDays' }],
  unit: 'Days',
};

export const Error = Template.bind({});
Error.args = {
  id: 'test',
  fields,
  data,
  isLoading: true,
  error: 'Error',
  width: '25%',
  title: [{ valueType: 9, value: 'Project Launch Date' }],
  subtitle: [{ valueType: 3, value: 'EntityCreatedDate' }],
  value: [{ valueType: 3, value: 'CalcDays' }],
  unit: 'Days',
};

