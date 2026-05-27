import React from 'react';
import { FieldTypeNames } from '@m-next/types';
import ChartDrilldown from '../src';
// expect.extend(matchers);

export default {
  component: ChartDrilldown,
  title: 'm-one/Chart',
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

const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const data = [
  {
    name: 'Tokyo',
    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
  },
  {
    name: 'New York',
    data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3],
  },
  {
    name: 'London',
    data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2],
  },
  {
    name: 'Berlin',
    data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1],
  },
];

const drilldownData = [
  {
    profileimage:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg',
    customer: 'Kitty',
    signupdate: '2020-01-02',
    value: 49.9,
    TagList: 'tag1, tag2, tag3',
  },
  {
    profileimage:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg',
    customer: 'Kitty',
    signupdate: '2020-01-02',
    value: 49.9,
    TagList: 'tag1, tag2, tag3',
  },
  {
    profileimage:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg',
    customer: 'Kitty',
    signupdate: '2020-01-02',
    value: 49.9,
    TagList: 'tag1, tag2, tag3',
  },
  {
    profileimage:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg',
    customer: 'Kitty',
    signupdate: '2020-01-02',
    value: 49.9,
    TagList: 'tag1, tag2, tag3',
  },
];

function Template(args) {
  return <ChartDrilldown {...args} />;
}
export const ChartDrilldownEmpty = Template.bind({});
ChartDrilldownEmpty.args = {
  id: 'test',
  data,
  categories,
  chartType: 'bar',
  height: '400',
  width: 800,
  isLoading: false,
  error: null,
  expanded: true,
  drilldown: {
    enabled: true,
    projection: {},
  },
};

export const ChartDrilldownGrid = Template.bind({});
ChartDrilldownGrid.args = {
  id: 'test',
  data,
  categories,
  chartType: 'bar',
  height: '400',
  width: 800,
  isLoading: false,
  error: null,
  expanded: true,
  drilldown: {
    enabled: true,
    data: drilldownData,
    projection: {
      id: '000',
      fields: [
        {
          name: 'profileimage',
          caption: 'Profile image',
          type: FieldTypeNames.Picture,
        },
        {
          name: 'customer',
          caption: 'Customer',
          type: FieldTypeNames.Text,
        },
        {
          name: 'signupdate',
          caption: 'Signup date',
          type: FieldTypeNames.DateTime,
        },
        {
          name: 'value',
          caption: 'Value',
          type: FieldTypeNames.Money,
        },
        {
          name: 'TagList',
          caption: 'TagList',
          type: FieldTypeNames.Tags,
        },
      ],
    },
  },
};

export const ChartDrilldownGridV4 = Template.bind({});
ChartDrilldownGridV4.args = {
  id: 'test',
  data,
  categories,
  chartType: 'bar',
  height: '400',
  width: 800,
  isLoading: false,
  error: null,
  expanded: true,

  drilldown: {
    enabled: true,
    data: drilldownData,
    projection: {
      id: '000',
      fields: [
        {
          name: 'profileimage',
          caption: 'Profile image',
          type: FieldTypeNames.Picture,
        },
        {
          name: 'customer',
          caption: 'Customer',
          type: FieldTypeNames.Text,
        },
        {
          name: 'signupdate',
          caption: 'Signup date',
          type: FieldTypeNames.DateTime,
        },
        {
          name: 'value',
          caption: 'Value',
          type: FieldTypeNames.Money,
        },
        {
          name: 'TagList',
          caption: 'TagList',
          type: FieldTypeNames.Tags,
        },
      ],
    },
  },
};
