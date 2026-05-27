import React from 'react';
import Card from '../src';

export default {
  component: Card,
  title: 'm-one/Card',
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
  FullName:
    'JaneSmithxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',

  Email: 'Jane.s@redbubble.co.uk',
  Phone: '',
  Website: '',
  Balance: 12345.678,
  Counter: 0,
  BirthDate: '2021-04-12T08:56:39',
  IsCool: 'true',
  IsNotCool: 'false',
  ExitDate: null,
  TagList: 'one,cake,bunny,Add Tag 12,Contact Edit,New 12 Tag,apr13,Bind,kkkkk,Nelson',
  Address: {
    Line1: 'Line1',
    Line2: 'Line2',
    Line3: 'Line3',
    Line4: 'Line4',
    Line5: 'Line5',
    City: 'City',
    State: 'State',
    PostalCode: 'PostalCode',
    Country: 'Country',
  },
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
    name: 'Balance',
    caption: 'Balance',
    type: 'Money',
    isVisible: true,
    isRequired: false,
  },
  {
    name: 'Counter',
    caption: 'Counter',
    type: 'Decimal',
    isVisible: true,
    isRequired: false,
  },
  {
    name: 'BirthDate',
    caption: 'BirthDate',
    type: 'DateTime',
    isVisible: true,
    isRequired: false,
    displayOptions: {
      dateFormat: 4,
    },
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
  {
    name: 'TagList',
    caption: 'TagList',
    type: 'Tags',
    isVisible: true,
    isRequired: false,
  },
  {
    name: 'ExitDate',
    caption: 'Exit Date',
    type: 'DateTime',
    isVisible: true,
    isRequired: false,
    displayOptions: {
      dateFormat: 2,
    },
  },

  {
    name: 'Address',
    caption: 'Address',
    type: 'Address',
    isVisible: true,
    isRequired: false,
  },
  {
    name: 'FullName',
    caption: 'Full Name',
    type: 'Text',
    isVisible: true,
    isRequired: true,
    maxLength: 40,
    styling: {
      bold: true,
      fontSize: 'large',
    },
  },
];

const tagsList = [
  {
    colour: '#A9D9BF',
    name: 'Add Tag 12',
  },
  {
    colour: '#84F3FF',
    name: 'apr13',
  },
  {
    colour: '#BACAD0',
    name: 'Bind',
  },
  {
    colour: '#B3E5FF',
    name: 'bunny',
  },
  {
    colour: '#FFCDAB',
    name: 'cake',
  },
  {
    colour: '#91A2FF',
    name: 'Contact Edit',
  },
  {
    colour: '#B3E5FF',
    name: 'duck',
  },
  {
    colour: '#91A2FF',
    name: 'Invoices',
  },
  {
    colour: '#FFEA80',
    name: 'kkkkk',
  },
  {
    colour: '#B3E5FF',
    name: 'Memo 123',
  },
  {
    colour: '#FFACA1',
    name: 'Nelson',
  },
  {
    colour: '#FFABB5',
    name: 'New 12 Tag',
  },
  {
    colour: '#B3E5FF',
    name: 'new tag',
  },
  {
    colour: '#B3E5FF',
    name: 'New Tag Feb12',
  },
  {
    colour: '#B3E5FF',
    name: 'new test',
  },
  {
    colour: '#B3E5FF',
    name: 'sdfhsd',
  },
  {
    colour: '#B3E5FF',
    name: 'sdfsd',
  },
  {
    colour: '#B3E5FF',
    name: 'Shoe',
  },
  {
    colour: '#B3E5FF',
    name: 'Test Test',
  },
  {
    colour: '#B3E5FF',
    name: 'Test Test2',
  },
  {
    colour: '#FFCDAB',
    name: 'UATedit',
  },
];

function Template(args) {
  return <Card {...args} />;
}
export const Avatar = Template.bind({});
Avatar.args = {
  id: 'test',
  hasAvatar: true,
  avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg',
  field1: fields[14],
  field3: fields[3],
  field4: fields[6],
  field5: fields[8],
  field6: fields[11],
  data,
  tagsList,
};

export const NoAvatar = Template.bind({});
NoAvatar.args = {
  id: 'test',
  hasAvatar: false,
  field1: fields[14],
  field3: fields[3],
  field4: fields[6],
  field5: fields[7],
  field6: fields[11],
  data,
  tagsList,
};
