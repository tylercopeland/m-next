/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { addDays } from 'date-fns';
import { colors } from '@m-next/styles';

import { IconMeasurementBlock } from '../src';

export default {
  component: IconMeasurementBlock,
  title: 'm-one/MeasurementBlock/Icon',
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

const futureDate = addDays(new Date(), 10);
const data = {
  RecordId: 1,
  FirstName: 'Jane',
  LastName: 'Smith',
  Email: 'Jane.s@redbubble.co.uk',
  Phone: '',
  Website: '',
  EntityCreatedDate: futureDate.toISOString(),
  CalcEmails: 47,
};
const fields = [
  {
    name: 'RecordId',
    caption: 'RecordId',
    type: 'Integer',
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
    displayOptions: { dateFormat: 0 },
  },
  {
    name: 'CalcEmails',
    caption: 'CalcEmails',
    type: 'Integer',
    isVisible: false,
    isRequired: false,
  },
];

function Template(args) {
  return <IconMeasurementBlock {...args} />;
}
export const Emails = Template.bind({});
Emails.args = {
  id: 'test',
  fields,
  data,
  isLoading: false,
  error: null,
  width: '25%',
  backgroundColor: colors['green-lightest'],
  icon: {
    name: 'email',
    size: 48,
    color: colors.green,
    position: 'left',
  },
  subFooter: [{ valueType: 9, value: 'Year to date' }],
  value: [{ valueType: 3, value: 'CalcEmails' }],
  unit: 'Emails',
};

