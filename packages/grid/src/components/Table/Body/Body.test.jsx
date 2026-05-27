/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { render } from '@testing-library/react';
import { FieldTypeIds } from '@m-next/types';

import Body from './Body';
import { STATUSES } from '../../../utilities';
import { Row } from './Row';

const data = [
  { Name: 'First', Value: 1, Money: 1 },
  { Name: 'Second', Value: 2, Money: 2 },
  { Name: 'Third', Value: 3.5, Money: 3.5 },
  { Name: 'Fourth', Value: 4, Money: 4 },
  { Name: 'Fifth', Value: 5, Money: 5 },
  { Name: 'Sixth', Value: 6.5, Money: 6.5 },
  { Name: 'Seventh', Value: 7, Money: 7 },
  { Name: 'Eigth', Value: 8, Money: 8 },
  { Name: 'Nineth', Value: 9.5, Money: 9.5 },
  { Name: 'Tenth', Value: 10, Money: 10 },
  { Name: 'Eleventh', Value: 11, Money: 11 },
  { Name: 'Twelf', Value: 12.5, Money: 12.5 },
];
const columns = [
  {
    primary: true,
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
];

const rowStatuses = [STATUSES.unchanged, STATUSES.blank];
const activeElement = {
  rowIndex: null,
  columnType: null,
};
const renderRow = (index) => (
  <Row
    id={`123-${index}`}
    key={index}
    index={index}
    columns={columns}
    data={data[index]}
    primaryKeyName='Name'
    status={rowStatuses ? rowStatuses[index] : STATUSES.unchanged}
    totalRows={data ? data.length : 0}
    defaultColumnWidth={100}
    isLoading={false}
    isSelected={false}
    activeElement={activeElement}
  />
);
describe('Body', () => {
  describe('Snapshots', () => {
    it('default', () => {
      expect(
        render(
          <table>
            <Body
              id='123'
              noSearchResults={false}
              showHeader
              isLoading={false}
              rowStatuses={rowStatuses}
              totalRows={2}
              columns={columns}
              pageSize={5}
              pageNumber={1}
              onRenderRow={renderRow}
              activeElement={activeElement}
            >
              {renderRow(0)}
              {renderRow(1)}
            </Body>
          </table>,
        ),
      ).toMatchSnapshot();
    });
    it('no results', () => {
      const wrapper = render(
        <table>
          <Body
            id='123'
            noSearchResults
            showHeader
            isLoading={false}
            rowStatuses={rowStatuses}
            totalRows={0}
            columns={columns}
            pageSize={5}
            pageNumber={1}
            onRenderRow={renderRow}
            activeElement={activeElement}
          />
        </table>,
      );

      expect(wrapper.getByText('No Results Found')).toBeDefined();
      expect(
        render(
          <table>
            <Body
              id='123'
              noSearchResults
              showHeader
              isLoading={false}
              rowStatuses={rowStatuses}
              totalRows={0}
              columns={columns}
              pageSize={5}
              pageNumber={1}
              onRenderRow={renderRow}
              activeElement={activeElement}
            />
          </table>,
        ).container,
      ).toMatchSnapshot();
    });
    it('loading with data', () => {
      expect(
        render(
          <table>
            <Body
              id='123'
              noSearchResults={false}
              showHeader
              isLoading
              rowStatuses={rowStatuses}
              totalRows={2}
              columns={columns}
              pageSize={5}
              pageNumber={1}
              onRenderRow={renderRow}
              activeElement={activeElement}
            >
              {renderRow(0)}
              {renderRow(1)}
            </Body>
          </table>,
        ),
      ).toMatchSnapshot();
    });
    it('loading without data', () => {
      expect(
        render(
          <table>
            <Body
              id='123'
              noSearchResults={false}
              showHeader
              isLoading
              columns={columns}
              pageSize={5}
              pageNumber={1}
              onRenderRow={renderRow}
              activeElement={activeElement}
            />
          </table>,
        ),
      ).toMatchSnapshot();
    });
  });
  describe('Functional', () => {
    it('should render correct number of rows', () => {
      const wrapper = render(
        <table>
          <Body
            id='123'
            noSearchResults={false}
            showHeader
            isLoading={false}
            rowStatuses={[STATUSES.unchanged, STATUSES.blank]}
            totalRows={2}
            columns={columns}
            pageSize={5}
            pageNumber={1}
            onRenderRow={renderRow}
          >
            {renderRow(0)}
            {renderRow(1)}
          </Body>
        </table>,
      );

      expect(wrapper.getAllByRole('row')).toHaveLength(2);
    });
  });
});
