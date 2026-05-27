/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { FieldTypeIds } from '@m-next/types';

import Cell from './Cell';
import { STATUSES } from '../../../../utilities';

expect.extend(matchers);
const readOnlyCell = (
  status = STATUSES.unchanged,
  error = null,
  disable = false,
  onSetEditingRow = null,
  setEditingCell = null,
) =>
  render(
    <table>
      <tbody>
        <tr>
          <Cell
            status={status}
            error={error}
            disabled={disable}
            defaultColumnWidth={25}
            editable={false}
            editingRow={0}
            editingCell={0}
            totalRows={1}
            displayPreferences={[
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ]}
            setEditingCell={onSetEditingRow}
            onSetEditingRow={setEditingCell}
            column={{
              editable: true,
              fieldType: FieldTypeIds.Text,
              visible: true,
              columnAlign: 'left',
              width: 'sm',
            }}
          >
            {' '}
          </Cell>
        </tr>
      </tbody>
    </table>,
  );

const editableCell = (
  id,
  status = STATUSES.unchanged,
  error = null,
  disable = false,
  onSetEditingRow = null,
  setEditingCell = null,
  rowIndex = 1,
  editingRow = 1,
) =>
  render(
    <table>
      <tbody>
        <tr>
          <Cell
            id={id}
            status={status}
            error={error}
            disabled={disable}
            rowIndex={rowIndex}
            cellData='Wasabi'
            defaultColumnWidth={25}
            editable
            editingRow={editingRow}
            editingCell={0}
            totalRows={3}
            index={0}
            displayPreferences={[
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ]}
            setEditingCell={setEditingCell}
            onSetEditingRow={onSetEditingRow}
            scrollerRef={{
              current: {
                scrollLeft: 100,
              },
            }}
            column={{
              editable: true,
              fieldType: FieldTypeIds.Integer,
              visible: true,
              columnAlign: 'left',
              width: 'sm',
            }}
          >
            {' '}
          </Cell>
        </tr>
      </tbody>
    </table>,
  );

describe('<Cell />', () => {
  it('should have the default styles', () => {
    const { getByRole } = readOnlyCell();
    const cell = getByRole('cell');

    expect(cell).toHaveStyleRule('text-align', 'left');
    expect(cell).toHaveStyleRule('pointer-events', 'auto');
    expect(cell).toHaveStyleRule('font-weight', 'normal');
  });

  it('should apply fontWeight from formatStyle', () => {
    const { getByRole } = render(
      <table>
        <tbody>
          <tr>
            <Cell
              status={STATUSES.unchanged}
              disabled={false}
              defaultColumnWidth={25}
              editable={false}
              editingRow={0}
              editingCell={0}
              totalRows={1}
              displayPreferences={Array(19).fill(null)}
              setEditingCell={jest.fn()}
              onSetEditingRow={jest.fn()}
              column={{
                editable: false,
                fieldType: FieldTypeIds.Text,
                visible: true,
                columnAlign: 'left',
                width: 'sm',
                formatStyle: { fontWeight: 'bold' },
              }}
              cellData='Test'
            />
          </tr>
        </tbody>
      </table>,
    );
    const cell = getByRole('cell');
    expect(cell).toHaveStyleRule('font-weight', 'bold');
  });

  describe('error', () => {
    it('should not show error message on blank', () => {
      const { queryByText } = readOnlyCell(STATUSES.blank, 'Needs more hot sauce!');
      expect(queryByText('Needs more hot sauce!')).toBeNull();
    });
  });

  describe('context.disabled', () => {
    it('should have the disabled styles', () => {
      const { getByRole } = readOnlyCell(STATUSES.unchanged, null, true);
      const cell = getByRole('cell');

      expect(cell).toHaveStyleRule('pointer-events', 'none');
    });

    it('should have the disabled styles when blank', () => {
      const { getByRole } = readOnlyCell(STATUSES.blank, null, true);
      const cell = getByRole('cell');
      expect(cell).toHaveStyleRule('pointer-events', 'none');
    });
  });

  describe('Events', () => {
    it('should do nothing on TAB', () => {
      const onSetEditingRow = jest.fn();
      const setEditingCell = jest.fn();

      readOnlyCell(STATUSES.unchanged, null, false, onSetEditingRow, setEditingCell);
      fireEvent.keyDown(document.body, { key: 'TAB' });

      expect(onSetEditingRow).not.toHaveBeenCalled();
      expect(setEditingCell).not.toHaveBeenCalled();
    });

    it('should do nothing on UP', () => {
      const onSetEditingRow = jest.fn();
      const setEditingCell = jest.fn();
      readOnlyCell(STATUSES.unchanged, null, false, onSetEditingRow, setEditingCell);

      fireEvent.keyDown(document.body, { key: 'ArrowDown', keyCode: 38 });
      expect(onSetEditingRow).not.toHaveBeenCalled();
      expect(setEditingCell).not.toHaveBeenCalled();
    });

    it('should do nothing on DOWN', () => {
      const onSetEditingRow = jest.fn();
      const setEditingCell = jest.fn();
      readOnlyCell(STATUSES.unchanged, null, false, onSetEditingRow, setEditingCell);

      fireEvent.keyDown(document.body, { key: 'ArrowDown', keyCode: 40 });
      expect(onSetEditingRow).not.toHaveBeenCalled();
      expect(setEditingCell).not.toHaveBeenCalled();
    });
  });

  describe('Editing', () => {
    describe('CellData', () => {
      it('should on DOWN change to next row', () => {
        const onSetEditingRow = jest.fn();
        const setEditingCell = jest.fn();

        const { getByRole } = editableCell(
          'should on DOWN change to next row',
          STATUSES.unchanged,
          null,
          false,
          onSetEditingRow,
          setEditingCell,
          1,
          1,
        );
        const cell = getByRole('textbox');

        fireEvent.keyUp(cell, { key: 'ArrowDown', keyCode: 40 });
        expect(onSetEditingRow).toHaveBeenCalled();
        expect(onSetEditingRow).toHaveBeenCalledWith(2);
        expect(setEditingCell).toHaveBeenCalled();
        expect(setEditingCell).toHaveBeenCalledWith(0);
      });
    });

    describe('Events', () => {
      it('should on DOWN change to next row', () => {
        const onSetEditingRow = jest.fn();
        const setEditingCell = jest.fn();

        const { getByRole } = editableCell(
          'should on DOWN change to next row',
          STATUSES.unchanged,
          null,
          false,
          onSetEditingRow,
          setEditingCell,
          2,
          2,
        );
        const cell = getByRole('textbox');

        fireEvent.keyUp(cell, { key: 'ArrowDown', keyCode: 40 });
        expect(onSetEditingRow).not.toHaveBeenCalled();
        expect(setEditingCell).not.toHaveBeenCalled();
      });

      it('should on UP change to prev row', () => {
        const onSetEditingRow = jest.fn();
        const setEditingCell = jest.fn();

        const { getByRole } = editableCell(
          'should on UP change to prev row',
          STATUSES.unchanged,
          null,
          false,
          onSetEditingRow,
          setEditingCell,
        );
        const cell = getByRole('textbox');

        fireEvent.keyUp(cell, { key: 'ArrowUp', keyCode: 38 });
        expect(onSetEditingRow).toHaveBeenCalled();
        expect(onSetEditingRow).toHaveBeenCalledWith(0);
        expect(setEditingCell).toHaveBeenCalled();
        expect(setEditingCell).toHaveBeenCalledWith(0);
      });

      it('should on UP do nothing if on first row', () => {
        const onSetEditingRow = jest.fn();
        const setEditingCell = jest.fn();

        const { getByRole } = editableCell(
          'should on UP do nothing if on first row',
          STATUSES.unchanged,
          null,
          false,
          onSetEditingRow,
          setEditingCell,
          0,
          0,
        );
        const cell = getByRole('textbox');

        fireEvent.keyUp(cell, { key: 'ArrowDown', keyCode: 38 });
        expect(onSetEditingRow).not.toHaveBeenCalled();
        expect(setEditingCell).not.toHaveBeenCalled();
      });

      it('default case for keys other than UP / DOWN', () => {
        const onSetEditingRow = jest.fn();
        const setEditingCell = jest.fn();

        const { getByRole } = editableCell(
          'default case for keys other than UP / DOWN',
          STATUSES.unchanged,
          null,
          false,
          onSetEditingRow,
          setEditingCell,
        );
        const cell = getByRole('textbox');

        fireEvent.keyUp(cell, { key: 'ArrowLeft', keyCode: 37 });
        expect(onSetEditingRow).not.toHaveBeenCalled();
        expect(setEditingCell).not.toHaveBeenCalled();
      });
    });
  });
});
