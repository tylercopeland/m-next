/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { FieldTypeNames } from '@m-next/types';
import matchMediaPolyfill from 'mq-polyfill';
import FieldBlock from './fieldBlock';

expect.extend(matchers);

const data = {
  RecordId: 1,
  FirstName: 'Jane',
  LastName: 'Smith',
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
  ProfileImage: 'JS-3.mci',
  Currency: {
    value: 1,
    label: 'CAD',
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
    name: 'ProfileImage',
    caption: 'ProfileImage',
    type: FieldTypeNames.User,
    isVisible: true,
    isRequired: false,
  },

  {
    name: 'Image',
    caption: 'My Image',
    type: FieldTypeNames.Picture,
    isVisible: true,
    isRequired: false,
  },

  {
    name: 'Currency',
    caption: 'Currency pick',
    type: FieldTypeNames.DropDown,
    isVisible: true,
    isRequired: false,
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
describe('Field Block', () => {
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
  describe('Functional', () => {
    test('Defaults', async () => {
      const { getByText, queryByText } = render(<FieldBlock />);
      const text = getByText('No fields added');
      expect(text).toBeDefined();

      const missing = queryByText('To add fields select this object and add fields from the right panel.');
      expect(missing).toBeNull();
    });

    test('show error', async () => {
      const { getByText } = render(<FieldBlock error='Error' fields={fields} />);
      const text = getByText('Unable to load fields');
      expect(text).toBeDefined();
    });

    test('Displays Readonly fields', async () => {
      const { getByText, queryByText } = render(
        <FieldBlock tagsList={tagsList} isEditable={false} fields={fields} data={data} />,
      );
      const missing = queryByText('No fields added');
      expect(missing).toBeNull();

      let text = getByText('First Name');
      expect(text).toBeDefined();
      text = getByText('Jane');
      expect(text).toBeDefined();

      text = getByText('Last Name');
      expect(text).toBeDefined();
      text = getByText('Smith');
      expect(text).toBeDefined();
      text = getByText('Email');
      expect(text).toBeDefined();
      text = getByText('Jane.s@redbubble.co.uk');
      expect(text).toBeDefined();
      text = getByText('Phone');
      expect(text).toBeDefined();
      text = getByText('Website');
      expect(text).toBeDefined();
    });

    test('Displays Readonly fields Collapse Empty', async () => {
      const { getByText, queryByText } = render(
        <FieldBlock tagsList={tagsList} isEditable={false} fields={fields} data={data} collapseEmpty />,
      );
      const missing = queryByText('No fields added');
      expect(missing).toBeNull();

      let text = getByText('First Name');
      expect(text).toBeDefined();
      text = getByText('Jane');
      expect(text).toBeDefined();

      text = getByText('Last Name');
      expect(text).toBeDefined();
      text = getByText('Smith');
      expect(text).toBeDefined();
      text = getByText('Email');
      expect(text).toBeDefined();
      text = getByText('Jane.s@redbubble.co.uk');
      expect(text).toBeDefined();
      text = queryByText('Phone');
      expect(text).toBeNull();
      text = queryByText('Website');
      expect(text).toBeNull();

      text = getByText('Show more');
      expect(text).toBeDefined();
    });

    test('Toggle Collapsed', async () => {
      const mockOnMore = jest.fn();

      const { getByText } = render(
        <FieldBlock
          tagsList={tagsList}
          isEditable={false}
          fields={fields}
          data={data}
          collapseEmpty
          onMoreClick={mockOnMore}
        />,
      );
      let button = getByText('Show more');
      expect(button).toBeDefined();
      fireEvent.click(button);

      button = getByText('Show less');
      expect(button).toBeDefined();

      let text = getByText('First Name');
      expect(text).toBeDefined();
      text = getByText('Jane');
      expect(text).toBeDefined();

      text = getByText('Last Name');
      expect(text).toBeDefined();
      text = getByText('Smith');
      expect(text).toBeDefined();
      text = getByText('Email');
      expect(text).toBeDefined();
      text = getByText('Jane.s@redbubble.co.uk');
      expect(text).toBeDefined();
      text = getByText('Phone');
      expect(text).toBeDefined();
      text = getByText('Website');
      expect(text).toBeDefined();
    });

    test('isLoading', async () => {
      const { queryByText } = render(
        <FieldBlock tagsList={tagsList} isEditable={false} fields={fields} data={data} isLoading />,
      );
      const missing = queryByText('No fields added');
      expect(missing).toBeNull();

      let text = queryByText('First Name');
      expect(text).toBeNull();
      text = queryByText('Jane');
      expect(text).toBeNull();

      text = queryByText('Last Name');
      expect(text).toBeNull();
      text = queryByText('Smith');
      expect(text).toBeNull();
      text = queryByText('Email');
      expect(text).toBeNull();
      text = queryByText('Jane.s@redbubble.co.uk');
      expect(text).toBeNull();
      text = queryByText('Phone');
      expect(text).toBeNull();
      text = queryByText('Website');
      expect(text).toBeNull();
    });

    test('Force Open', async () => {
      let obj = render(
        <FieldBlock
          tagsList={tagsList}
          isEditable={false}
          fields={fields}
          data={data}
          collapseEmpty
          forceOpen={false}
        />,
      );
      let button = obj.getByText('Show more');
      expect(button).toBeDefined();

      obj = render(
        <FieldBlock tagsList={tagsList} isEditable={false} fields={fields} data={data} collapseEmpty forceOpen />,
      );
      button = obj.getByText('Show less');
      expect(button).toBeDefined();
    });

    test('Clicking on Readonly field fires select', async () => {
      const mockOnSelect = jest.fn();

      const { getByText } = render(
        <FieldBlock tagsList={tagsList} isEditable={false} fields={fields} data={data} onSelect={mockOnSelect} />,
      );
      const text = getByText('First Name');
      expect(text).toBeDefined();
      fireEvent.click(text);
    });

    test('Clicking on Edit field fires select', async () => {
      const mockOnSelect = jest.fn();
      const mockOnSave = jest.fn();

      const { getByText, getByTestId } = render(
        <FieldBlock
          id='test'
          tagsList={tagsList}
          isEditable={false}
          fields={fields}
          data={data}
          onSelect={mockOnSelect}
          onSaveClick={mockOnSave}
          mode={1}
          showSave
        />,
      );

      fields
        .filter((x) => x.isVisible && x.name !== 'TagList')
        .forEach((field) => () => {
          const text = getByTestId(`test-data-block-line-${field.name}`);
          expect(text).toBeDefined();
          fireEvent.click(text);
          //  fireEvent.change(getByText(data[field.name]), { target: { value: dataAfter[field.name] } });
        });
      const button = getByText('Save');

      fireEvent.click(button);
      expect(mockOnSave).toHaveBeenCalledWith(data);
    });
  });

  describe('Snapshots', () => {
    test('Defaults', async () => {
      const tree = render(<FieldBlock />).container;
      expect(tree).toMatchSnapshot();
    });

    test('show error', async () => {
      const tree = render(<FieldBlock tagsList={tagsList} error='Error' fields={fields} />).container;
      expect(tree).toMatchSnapshot();
    });

    test('Displays Readonly fields', async () => {
      const tree = render(<FieldBlock tagsList={tagsList} isEditable={false} fields={fields} data={data} />).container;
      expect(tree).toMatchSnapshot();
    });

    test('Displays Readonly fields Collapse Empty', async () => {
      const tree = render(
        <FieldBlock tagsList={tagsList} isEditable={false} fields={fields} data={data} collapseEmpty />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    test('isLoading', async () => {
      const tree = render(<FieldBlock isEditable={false} fields={fields} data={data} isLoading />).container;
      expect(tree).toMatchSnapshot();
    });

    test('Force Open', async () => {
      let tree = render(
        <FieldBlock
          isEditable={false}
          tagsList={tagsList}
          fields={fields}
          data={data}
          collapseEmpty
          forceOpen={false}
        />,
      ).container;
      expect(tree).toMatchSnapshot();
      tree = render(
        <FieldBlock isEditable={false} tagsList={tagsList} fields={fields} data={data} collapseEmpty forceOpen />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    test('Blank Tag', async () => {
      const tree = render(<FieldBlock tagsList={tagsList} fields={fields} data={{ ...data, TagList: '' }} />).container;
      expect(tree).toMatchSnapshot();
    });

    test('Null Tag', async () => {
      const tree = render(
        <FieldBlock tagsList={tagsList} fields={fields} data={{ ...data, TagList: null }} />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    test('Blank True and false', async () => {
      const tempFields = [...fields];
      tempFields[9].displayOptions = {
        trueValue: '',
        falseValue: '',
      };
      tempFields[10].displayOptions.trueValue = {
        trueValue: '',
        falseValue: '',
      };

      const tree = render(<FieldBlock tagsList={tagsList} fields={tempFields} data={data} />).container;
      expect(tree).toMatchSnapshot();
    });

    test('Null True and false', async () => {
      const tempFields = [...fields];
      tempFields[9].displayOptions = {
        trueValue: null,
        falseValue: null,
      };
      tempFields[10].displayOptions.trueValue = {
        trueValue: null,
        falseValue: null,
      };

      const tree = render(<FieldBlock tagsList={tagsList} fields={tempFields} data={data} />).container;
      expect(tree).toMatchSnapshot();
    });

    test('Custom True and false', async () => {
      const tempFields = [...fields];
      tempFields[9].displayOptions = {
        trueValue: 'e',
        falseValue: 'f',
      };
      tempFields[10].displayOptions.trueValue = {
        trueValue: 'c',
        falseValue: 'd',
      };

      const tree = render(<FieldBlock tagsList={tagsList} fields={tempFields} data={data} />).container;
      expect(tree).toMatchSnapshot();
    });

    test('Unset True and false', async () => {
      const tempFields = [...fields];
      tempFields[9].displayOptions = null;
      tempFields[10].displayOptions.trueValue = null;

      const tree = render(<FieldBlock tagsList={tagsList} fields={tempFields} data={data} />).container;
      expect(tree).toMatchSnapshot();
    });

    test('Highlight selected field', async () => {
      const tree = render(
        <FieldBlock tagsList={tagsList} isEditable={false} fields={fields} data={data} selectedField='LastName' />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    test('Displays editable fields', async () => {
      const tree = render(<FieldBlock tagsList={tagsList} mode={1} fields={fields} data={data} />).container;
      expect(tree).toMatchSnapshot();
    });

    test('Show Clear button', async () => {
      const tree = render(
        <FieldBlock tagsList={tagsList} mode={1} showClearAndNew fields={fields} data={data} />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    test('Show Clear and save button', async () => {
      const tree = render(
        <FieldBlock tagsList={tagsList} mode={1} showClearAndNew showSave fields={fields} data={data} />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    test('Show edit button', async () => {
      const { container, getByTestId } = render(
        <FieldBlock id='test' tagsList={tagsList} showClearAndNew showEdit fields={fields} data={data} />,
      );
      expect(container).toMatchSnapshot();

      expect(getByTestId('test-edit')).toBeDefined();
      fireEvent.click(getByTestId('test-edit'));
      expect(container).toMatchSnapshot();
    });
  });
});
