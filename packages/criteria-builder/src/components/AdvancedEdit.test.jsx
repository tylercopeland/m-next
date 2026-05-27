/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render } from '@testing-library/react';
import { basicOperationId, complexValueTypes } from '@m-next/types';
import { formatter, Guid } from '@m-next/utilities';

import '@testing-library/jest-dom/extend-expect';

import fieldList from '../../testing/data/fieldListActivities.json';
import controlList from '../../testing/data/controlList.json';
import AdvancedEdit from './AdvancedEdit';
import parseExpression from '../parser/parseExpression';

expect.extend(matchers);

const expression = [
  {
    operation: 0,
  },
  {
    operation: null,
    dateField: null,
    source: {
      Value: 'ActualCompletedDate',
      ValueType: 3,
      Property: null,
      ChildProperty: null,
    },
  },
  {
    operation: 7,
    dateField: null,
    source: null,
  },
  {
    operation: null,
    dateField: null,
    source: {
      Value: '2023-02-01T18:00',
      ValueType: 11,
      Property: null,
      ChildProperty: null,
    },
  },
  {
    operation: 2,
    dateField: null,
    source: null,
  },
  {
    operation: null,
    dateField: null,
    source: {
      Value: 'ActualDuration',
      ValueType: 3,
      Property: null,
      ChildProperty: null,
    },
  },
  {
    operation: 5,
    dateField: null,
    source: null,
  },
  {
    operation: null,
    dateField: null,
    source: {
      Value: '0e13acc0-36a4-dc8b-304f-3a60488955f5',
      ValueType: 5,
      Property: null,
      ChildProperty: null,
    },
  },
  {
    operation: 2,
    dateField: null,
    source: null,
  },
  {
    operation: null,
    dateField: null,
    source: {
      Value: 'Comments',
      ValueType: 3,
      Property: null,
      ChildProperty: null,
    },
  },
  {
    operation: 12,
    dateField: null,
    source: null,
  },
  {
    operation: null,
    dateField: null,
    source: {
      Value: 'gggg',
      ValueType: 9,
      Property: null,
      ChildProperty: null,
    },
  },
  {
    operation: 2,
    dateField: null,
    source: null,
  },
  {
    operation: null,
    dateField: null,
    source: {
      Value: 'FollowUpFromActivityNo',
      ValueType: 3,
      Property: null,
      ChildProperty: null,
    },
  },
  {
    operation: 6,
    dateField: null,
    source: null,
  },
  {
    operation: null,
    dateField: null,
    source: {
      Value: 'entityfullname',
      ValueType: 6,
      Property: null,
      ChildProperty: null,
    },
  },
  {
    operation: 2,
    dateField: null,
    source: null,
  },
  {
    operation: null,
    dateField: null,
    source: {
      Value: 'IsAllDayAppointment',
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
      ValueType: 12,
      Property: null,
      ChildProperty: null,
    },
  },
  {
    operation: 2,
    dateField: null,
    source: null,
  },
  {
    operation: 0,
    dateField: null,
    source: null,
  },
  {
    operation: null,
    dateField: null,
    source: {
      Value: 'SaaSphaltMarkupDollars',
      ValueType: 3,
      Property: null,
      ChildProperty: null,
    },
  },
  {
    operation: 8,
    dateField: null,
    source: null,
  },
  {
    operation: null,
    dateField: null,
    source: {
      Value: '1001',
      ValueType: 10,
      Property: null,
      ChildProperty: null,
    },
  },
  {
    operation: 2,
    dateField: null,
    source: null,
  },
  {
    operation: null,
    dateField: null,
    source: {
      Value: 'ContactsAssignedTo',
      ValueType: 3,
      Property: null,
      ChildProperty: null,
    },
  },
  {
    operation: 11,
    dateField: null,
    source: null,
  },
  {
    operation: 1,
    dateField: null,
    source: null,
  },
  {
    operation: 1,
    dateField: null,
    source: null,
  },
];
describe('AdvancedEdit', () => {
  const setup = (props) => {
    const spy = jest.spyOn(Guid, 'create');
    spy.mockReturnValueOnce('cf1b1149-fc76-48fe-9f33-192771b58bd5');
    spy.mockReturnValueOnce('c8ba4681-25a3-4873-88f8-314feb894a99');
    spy.mockReturnValueOnce('5e00b1d0-deb7-4b4c-85d8-c6019f7073ea');
    spy.mockReturnValueOnce('503ee5e9-5c9b-4e83-bc4d-ca2bc3307c3d');
    spy.mockReturnValueOnce('f7ddd87a-368f-4fb2-9da0-106e68b9d347');
    spy.mockReturnValueOnce('dcba1cae-282c-4b7a-aeae-9960301a60f9');
    spy.mockReturnValueOnce('dec44267-b3d7-479b-b1ac-c6366fba3e42');
    spy.mockReturnValueOnce('043e6469-8efc-4772-b3ff-a4837b41a580');
    spy.mockReturnValueOnce('dc9faa23-afab-49c2-8af8-4519672b1cd9');
    spy.mockReturnValueOnce('afeaf630-f8c5-467c-8075-5690f4470d0f');

    const mockOnConnectorChange = jest.fn();
    const mockOnPredicateChange = jest.fn();
    const mockOnPredicateDelete = jest.fn();
    const mockOnClose = jest.fn();
    const mockOnCancel = jest.fn();
    const mockOnAddGroup = jest.fn();
    const fieldListOptions = formatter.formatFieldList(fieldList, 'Activity', null, {}, null);
    const formattedExpression = parseExpression(props?.expression || expression);
    if (formattedExpression !== null) {
      formattedExpression.forEach((set) => {
        // eslint-disable-next-line no-param-reassign
        set.key = Guid.create();
        set.expression.forEach((item) => {
          // eslint-disable-next-line no-param-reassign
          item.key = Guid.create();
        });
      });
    }
    const defaultProps = {
      id: 'advanced-edit-filter',
      fieldList: [...fieldList],
      controlList: { ...controlList },
      elementKey: 'elKey',
      anchorEl: 'modal-container',
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
      operation: basicOperationId.Contains,
      index: 0,
      set: 0,
      onConnectorChange: mockOnConnectorChange,
      onPredicateChange: mockOnPredicateChange,
      onPredicateDelete: mockOnPredicateDelete,
      onClose: mockOnClose,
      onCancel: mockOnCancel,
      onAddGroup: mockOnAddGroup,
      formattedExpression,
      open: true,
      isPortal: true,
    };

    const utils = render(<AdvancedEdit {...{ ...defaultProps, ...props }} />);
    const tree = utils.container;
    return {
      tree,
      mockOnConnectorChange,
      mockOnPredicateChange,
      mockOnPredicateDelete,
      mockOnClose,
      mockOnCancel,
      mockOnAddGroup,
      ...utils,
    };
  };
  describe('Snapshots', () => {
    test('Edit Text expression', async () => {
      const { tree, getByText } = setup();

      expect(getByText('Advanced edit')).toBeDefined();
      expect(getByText('Comments')).toBeDefined();
      expect(getByText('and if')).toBeDefined();
      expect(tree).toMatchSnapshot();
    });
    test('Empty', async () => {
      const { tree, getByText } = setup({ expression: [] });
      expect(getByText('Advanced edit')).toBeDefined();
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
