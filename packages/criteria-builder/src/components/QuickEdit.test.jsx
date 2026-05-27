/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { basicOperationId, complexValueTypes } from '@m-next/types';
import { formatter } from '@m-next/utilities';
import '@testing-library/jest-dom/extend-expect';

import fieldList from '../../testing/data/fieldListActivities.json';
import controlList from '../../testing/data/controlList.json';
import QuickEdit from './QuickEdit';

expect.extend(matchers);

describe('QuickEdit', () => {
  const setup = (props) => {
    const mockOnChange = jest.fn();
    const mockOnClose = jest.fn();
    const mockOnCancel = jest.fn();
    const fieldListOptions = formatter.formatFieldList(fieldList, 'Activity', null, {}, null);
    const defaultProps = {
      id: 'quick-edit-filter',
      fieldList: [...fieldList],
      controlList: { ...controlList },
      elementKey: 'elKey',
      anchorEl: document.body,
      fieldListOptions,
      first: {
        value: 'Comments',
        type: complexValueTypes.Field,
        property: null,
        childProperty: null,
      },
      second: {
        value: 'Dog',
        type: complexValueTypes.Text,
        property: null,
        childProperty: null,
      },
      operation: Number(basicOperationId.Contains),
      index: 0,
      set: 0,
      onChange: mockOnChange,
      onClose: mockOnClose,
      onCancel: mockOnCancel,
      open: true,
      ghost: false,
      isPortal: true,
    };

    const utils = render(<QuickEdit {...{ ...defaultProps, ...props }} />);
    const tree = utils.container;
    return {
      tree,
      mockOnChange,
      mockOnClose,
      mockOnCancel,
      ...utils,
    };
  };
  describe('Snapshots', () => {
    test('Edit Text expression', async () => {
      const { tree, getByText } = setup();

      expect(tree).toMatchSnapshot();
      expect(getByText('Edit Filter')).toBeDefined();
      expect(getByText('Comments')).toBeDefined();
    });
    test('Empty', async () => {
      const { tree, getByText } = setup({ first: {}, second: {}, operation: undefined });
      expect(getByText('Add Filter')).toBeDefined();
      expect(tree).toMatchSnapshot();
    });

    test('No controls', async () => {
      const { tree } = setup({ controlList: null });

      expect(tree).toMatchSnapshot();
    });

    test('No fields', async () => {
      const { tree } = setup({ fieldList: null });

      expect(tree).toMatchSnapshot();
    });

    test('Unmatched control', async () => {
      const { tree } = setup({
        expression: [
          {
            operation: 0,
          },
          {
            operation: null,
            dateField: null,
            source: {
              Value: 'ActualStartDate',
              ValueType: 3,
              Property: null,
              ChildProperty: null,
            },
          },
          {
            operation: 4,
            dateField: null,
            source: null,
          },
          {
            operation: null,
            dateField: null,
            source: {
              Value: 'true',
              ValueType: 5,
              Property: null,
              ChildProperty: null,
            },
          },
          {
            dateField: null,
            operation: 1,
            source: null,
          },
        ],
      });

      expect(tree).toMatchSnapshot();
    });
  });
});
