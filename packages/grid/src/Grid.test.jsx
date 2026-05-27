/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render, fireEvent } from '@testing-library/react';
import { FieldTypeIds } from '@m-next/types';

import { colors } from '@m-next/styles';
import Grid from './Grid';

expect.extend(matchers);

const columns = [
  {
    primary: true,
    name: 'RecordId',
    editable: true,
    fieldType: FieldTypeIds.Integer,
    visible: false,
    columnAlign: 'left',
    width: 'sm',
  },
  {
    primary: false,
    name: 'Name',
    editable: true,
    fieldType: FieldTypeIds.Text,
    visible: true,
    columnAlign: 'left',
    width: 'sm',
  },
  {
    primary: false,
    name: 'Value',
    editable: true,
    fieldType: FieldTypeIds.Decimal,
    visible: true,
    columnAlign: 'right',
    width: 'sm',
  },
  {
    primary: false,
    name: 'Money',
    editable: true,
    fieldType: FieldTypeIds.Money,
    visible: true,
    columnAlign: 'right',
    width: 'sm',
  },
  {
    primary: false,
    name: 'DateTime',
    editable: true,
    fieldType: FieldTypeIds.DateTime,
    visible: true,
    columnAlign: 'right',
    width: 'sm',
  },
  {
    primary: false,
    name: 'YesNo',
    editable: true,
    fieldType: FieldTypeIds.YesNo,
    visible: true,
    columnAlign: 'right',
    width: 'sm',
  },
  {
    primary: false,
    name: 'Dropdown',
    editable: true,
    fieldType: FieldTypeIds.DropDown,
    visible: true,
    columnAlign: 'right',
    width: 'sm',
  },
  {
    primary: false,
    name: 'CardColumn',
    editable: true,
    fieldType: FieldTypeIds.CardColumn,
    visible: true,
    columnAlign: 'right',
    width: 'lg',
    formatType: {
      type: 'avatar-2-cols',
    },
    cardColumnFields: [{}, {}, {}, {}, {}, {}, {}],
  },
  {
    primary: false,
    name: 'Button1',
    editable: true,
    fieldType: FieldTypeIds.Button,
    visible: true,
    columnAlign: 'right',
    width: 'sm',
    formatType: 'button',
  },
  {
    primary: false,
    name: 'Pic',
    editable: true,
    fieldType: FieldTypeIds.Picture,
    visible: true,
    columnAlign: 'right',
    width: 'sm',
    formatType: 'button',
  },
];

const data = [
  {
    RecordId: 1,
    Name: 'First',
    Value: 1,
    Money: 1,
    DateTime: '2016-03-10T17:00:00',
    YesNo: false,
    Dropdown: { value: 1, text: 'one' },
    CardColumn: {},
    Pic: 'NR-3.mci{{w=48}}',
  },
  {
    RecordId: 2,
    Name: 'Second',
    Value: 2,
    Money: 2,
    DateTime: '2016-03-10T17:00:00',
    YesNo: true,
    Dropdown: { value: 1, text: 'one' },
    CardColumn: {},
    Pic: 'NR-3.mci{{w=48}}',
  },
  {
    RecordId: 3,
    Name: 'Third',
    Value: 3.5,
    Money: 3.5,
    DateTime: '2016-03-10T17:00:00',
    YesNo: false,
    Dropdown: { value: 1, text: 'one' },
    CardColumn: {},
    Pic: 'NR-3.mci{{w=48}}',
  },
  {
    RecordId: 4,
    Name: 'Fourth',
    Value: 4,
    Money: 4,
    DateTime: '2016-03-10T17:00:00',
    YesNo: false,
    Dropdown: { value: 1, text: 'one' },
    CardColumn: {},
    Pic: 'NR-3.mci{{w=48}}',
  },
  {
    RecordId: 5,
    Name: 'Fifth',
    Value: 5,
    Money: 5,
    DateTime: '2016-03-10T17:00:00',
    YesNo: true,
    Dropdown: { value: 1, text: 'one' },
    CardColumn: {},
    Pic: 'NR-3.mci{{w=48}}',
  },
  {
    RecordId: 6,
    Name: 'Sixth',
    Value: 6.5,
    Money: 6.5,
    DateTime: '2016-03-10T17:00:00',
    YesNo: false,
    Dropdown: { value: 1, text: 'one' },
    CardColumn: {},
    Pic: 'NR-3.mci{{w=48}}',
  },
  {
    RecordId: 7,
    Name: 'Seventh',
    Value: 7,
    Money: 7,
    DateTime: '2016-03-10T17:00:00',
    YesNo: true,
    Dropdown: { value: 1, text: 'one' },
    CardColumn: {},
    Pic: 'NR-3.mci{{w=48}}',
  },
  {
    RecordId: 8,
    Name: 'Eigth',
    Value: 8,
    Money: 8,
    DateTime: '2016-03-10T17:00:00',
    YesNo: false,
    Dropdown: { value: 1, text: 'one' },
    CardColumn: {},
    Pic: 'NR-3.mci{{w=48}}',
  },
  {
    RecordId: 9,
    Name: 'Nineth',
    Value: 9.5,
    Money: 9.5,
    DateTime: '2016-03-10T17:00:00',
    YesNo: false,
    Dropdown: { value: 1, text: 'one' },
    CardColumn: {},
    Pic: 'NR-3.mci{{w=48}}',
  },
  {
    RecordId: 10,
    Name: 'Tenth',
    Value: 10,
    Money: 10,
    DateTime: '2016-03-10T17:00:00',
    YesNo: true,
    Dropdown: { value: 1, text: 'one' },
    CardColumn: {},
    Pic: 'NR-3.mci{{w=48}}',
  },
  {
    RecordId: 111,
    Name: 'Eleventh',
    Value: 11,
    Money: 11,
    DateTime: '2016-03-10T17:00:00',
    YesNo: false,
    Dropdown: { value: 1, text: 'one' },
    CardColumn: {},
    Pic: 'NR-3.mci{{w=48}}',
  },
  {
    RecordId: 112,
    Name: 'Twelf',
    Value: 12.5,
    Money: 12.5,
    DateTime: '2016-03-10T17:00:00',
    YesNo: true,
    Dropdown: { value: 1, text: 'one' },
    CardColumn: {},
    Pic: 'NR-3.mci{{w=48}}',
  },
];

const setup = (props) => {
  const defaultProps = {
    id: 'test',
    data,
    addRowsEnabled: false,
    canDelete: false,
    caption: 'Test',
    gridKey: 'Test',
    disabled: false, // False in your case probably
    editable: false, // False in your case probably
    isLoading: false, // Set to true when loading data and on mount for the grid to show skelton on loading message.
    showGoToPage: false, // False in your case probably
    hideCaption: false,
    showViewFilter: false, // False in your case probably
    totalRecords: 1,
    rowRecordIds: [1], // array of unique ids for each row
    unselectedRecords: [], // []
    columnTotals: [], // []
    rowStatuses: [], // []
    visible: true,
    maxWidth: 1000,
    columns,
    responsive: false,
  };
  const utils = render(<Grid {...{ ...defaultProps, ...props }} />);
  // const tree = renderer.create(<Canvas {...props} />).toJSON();
  const tree = utils.container;
  return {
    tree,
    ...utils,
  };
};

describe('<Grid />', () => {
  beforeEach(() => {
    delete window.ResizeObserver;
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    jest.restoreAllMocks();
  });

  describe('Functional', () => {
    it('should render default styles', () => {
      const { getByText } = setup();

      const label = getByText('Test');
      expect(label).toHaveStyleRule('font-size', '14px');
      expect(label).toHaveStyleRule('font-weight', '600');
      expect(label).toHaveStyleRule('color', '#0F1B31');
    });

    it('should render with legacy styles', () => {
      const { getByText } = setup({
        classes: 'mi-caption-font-xxxlarge mi-caption-primary mi-text-bolder mi-caption-center',
      });

      const label = getByText('Test');

      expect(label).toHaveStyleRule('font-size', '14px');
      expect(label).toHaveStyleRule('font-weight', '600');
      expect(label).toHaveStyleRule('text-align', 'center');
      expect(label).toHaveStyleRule('color', colors.blue);
    });

    it('Caption is hidden', () => {
      const { queryByText } = setup({ hideCaption: true });

      const label = queryByText('Test');
      expect(label).toBeNull();
    });
    it('should render correct row count', () => {
      const wrapper = setup({ rowRecordIds: [1, 2, 3, 4, 5], totalRecords: 5 });

      expect(wrapper.getAllByRole('row')).toHaveLength(6);
    });

    it('should render isLoading state', () => {
      const { getByText, getAllByRole } = setup({
        isLoading: true,
        totalRecords: 0,
        data: [],
      });

      expect(getByText('Loading content')).toBeDefined();
      expect(getAllByRole('row')).toHaveLength(2);
    });

    it('click on row', () => {
      const { getAllByRole } = setup({
        rowRecordIds: [1, 2, 3, 4, 5],
        totalRecords: 5,
      });
      const rows = getAllByRole('row');
      expect(rows).toHaveLength(6);
      fireEvent.click(rows[1]);

      fireEvent.keyUp(document.body, { key: 'ArrowUp', keyCode: 38 });
      fireEvent.keyUp(document.body, { key: 'ArrowUp', keyCode: 38 });
      fireEvent.keyDown(document.body, { key: 'ArrowDown', keyCode: 38 });
      fireEvent.keyDown(document.body, { key: 'ArrowDown', keyCode: 38 });
      fireEvent.keyDown(document.body, { key: 'ArrowDown', keyCode: 38 });
      fireEvent.keyDown(document.body, { key: 'ArrowDown', keyCode: 38 });
      fireEvent.keyDown(document.body, { key: 'ArrowDown', keyCode: 38 });
      fireEvent.keyDown(document.body, { key: 'ArrowDown', keyCode: 38 });
      fireEvent.keyDown(document.body, { key: 'Tab', keyCode: 38 });
    });
  });

  describe('Snapshots', () => {
    it('with defaults', () => {
      const tree = render(<Grid id='Test' columns={columns} data={data} responsive={false} />).container;
      expect(tree).toMatchSnapshot();
    });

    it('isLoading', () => {
      const tree = render(<Grid id='Test' columns={columns} data={data} responsive={false} />).container;
      expect(tree).toMatchSnapshot();
    });
    it('isLoading no data', () => {
      const tree = render(<Grid id='Test' columns={columns} responsive={false} />).container;
      expect(tree).toMatchSnapshot();
    });
    it('with showReload and with showExport', () => {
      const tree = render(
        <Grid id='Test' showReload showExport columns={columns} data={data} responsive={false} />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('with showReload and without showExport', () => {
      const tree = render(
        <Grid id='Test' showReload showExport={false} columns={columns} data={data} responsive={false} />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('without showReload and with showExport', () => {
      const tree = render(
        <Grid id='Test' showReload={false} showExport columns={columns} data={data} responsive={false} />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('without showReload and without showExport', () => {
      const tree = render(
        <Grid id='Test' showReload={false} showExport columns={columns} data={data} responsive={false} />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('with typical menu props', () => {
      const tree = render(
        <Grid
          id='Test'
          columns={columns}
          showReload
          showExport
          disabled={false}
          totalRecords={5}
          onRefresh={() => {}}
          onExport={() => {}}
          data={data}
          responsive={false}
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Partial Page', () => {
      const tree = render(
        <Grid
          id='Test'
          pageSize={1}
          columns={columns}
          totalRecords={51}
          data={data}
          isLoading={false}
          isPartialCount
          responsive={false}
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    it('Editable', () => {
      const tree = render(<Grid id='Test' columns={columns} data={data} editable responsive={false} />).container;
      expect(tree).toMatchSnapshot();
    });
    it('Editable no data', () => {
      const tree = render(<Grid id='Test' columns={columns} data={null} editable responsive={false} />).container;
      expect(tree).toMatchSnapshot();
    });
    it('Editable no data and loading', () => {
      const tree = render(
        <Grid id='Test' columns={columns} data={null} editable isLoading={false} responsive={false} />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Editable data and loading', () => {
      const tree = render(
        <Grid id='Test' columns={columns} data={data} editable isLoading responsive={false} />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('ReadOnly no data', () => {
      const tree = render(
        <Grid id='Test' columns={columns} data={null} editable={false} responsive={false} />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
  });
});
