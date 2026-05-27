/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { FieldTypeNames } from '@m-next/types';
import matchMediaPolyfill from 'mq-polyfill';
import Card from './Card';

expect.extend(matchers);
const data = {
  RecordId: 1,
  FirstName: 'Jane',
  LastName: 'Smith',
  FullName: 'Jane Smith',

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
  Image: 'E-3.mci{{w=24}}',
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
    displayAs: 'pill',
  },
  {
    name: 'Counter',
    caption: 'Counter',
    type: 'Decimal',
    isVisible: true,
    isRequired: false,
    displayAs: 'pill',
    conditionalFormatting: [{ value: 0, color: 'red' }],
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
    type: FieldTypeNames.Tags,
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
  {
    name: 'Image',
    caption: 'Image',
    type: FieldTypeNames.Picture,
    isVisible: true,
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

const setup = (props) => {
  const defaultProps = {
    id: 'test',
    hasAvatar: true,
    avatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg',
    field1: fields[14],
    field2: fields[15],
    field3: fields[3],
    field4: fields[6],
    field5: fields[8],
    field6: fields[11],
    data,
    tagsList,
  };
  const utils = render(<Card {...{ ...defaultProps, ...props }} />);
  // const tree = renderer.create(<Canvas {...props} />).toJSON();
  const tree = utils.container;
  return {
    tree,
    ...utils,
  };
};

describe('Card', () => {
  beforeEach(() => {
    delete window.ResizeObserver;
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    matchMediaPolyfill(window);
    window.resizeTo = function resizeTo(width, height) {
      Object.assign(this, {
        innerWidth: width,
        innerHeight: height,
        outerWidth: width,
        outerHeight: height,
      }).dispatchEvent(new this.Event('resize'));
    };
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    window.resizeTo(1000, 1000);

    jest.restoreAllMocks();
  });
  describe('Functional', () => {});
  describe('Snapshots', () => {
    test('Default', async () => {
      const { container } = render(<Card />);
      expect(container).toMatchSnapshot();
    });
    test('2 columns with avatar', async () => {
      const { tree } = setup();
      expect(tree).toMatchSnapshot();
    });
    test('1 columns with avatar placeholder', async () => {
      const { tree } = setup({
        avatar: null,
        field1: fields[7],
        field2: fields[9],
        field3: fields[10],
        field4: undefined,
        field5: undefined,
        field6: undefined,
      });
      expect(tree).toMatchSnapshot();
    });

    test('1 columns with blanks', async () => {
      const { tree } = setup({
        avatar: null,
        field1: fields[7],
        field2: null,
        field3: fields[10],
        field4: undefined,
        field5: undefined,
        field6: undefined,
      });
      expect(tree).toMatchSnapshot();
    });
    test('0 columns with avatar placeholder', async () => {
      const { tree } = setup({
        avatar: null,
      });
      expect(tree).toMatchSnapshot();
    });
    test('is loading', async () => {
      const { tree } = setup({ isLoading: true });
      expect(tree).toMatchSnapshot();
    });
    test('2 columns no data', async () => {
      const { tree } = setup({ data: null });
      expect(tree).toMatchSnapshot();
    });

    test('hideEmptyFields: trailing row with no data hidden', async () => {
      const testData = {
        ...data,
        BirthDate: null, // field5 empty
        TagList: null, // field6 empty
      };
      const { tree } = setup({ data: testData, hideEmptyFields: true });
      expect(tree).toMatchSnapshot();
    });

    test('hideEmptyFields: entirely unmapped column hidden', async () => {
      const { tree } = setup({
        field4: null,
        field5: null,
        field6: null,
        hideEmptyFields: true,
      });
      expect(tree).toMatchSnapshot();
    });

    test('hideEmptyFields: unmapped fields in visible rows show placeholder', async () => {
      const { tree } = setup({
        field1: null, // Unmapped
        field2: fields[14], // Mapped
        field3: fields[15], // Mapped
        hideEmptyFields: true,
      });
      expect(tree).toMatchSnapshot();
    });

    test('hideEmptyFields false: original behavior preserved', async () => {
      const { tree } = setup({ hideEmptyFields: false });
      expect(tree).toMatchSnapshot();
    });
  });
});
