/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom/extend-expect';
import CriteriaEditor from './CriteriaEditor';
import fieldList from '../testing/data/fieldListActivities.json';
import controlList from '../testing/data/controlList.json';

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
      Value: '2023-02-01',
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
];

describe('CriteriaBuilder', () => {
  const setup = (props) => {
    const mockOnChange = jest.fn();
    const mockOnUpdateElementCount = jest.fn();
    const defaultProps = {
      fieldList: [...fieldList],
      controlList: { ...controlList },
      expression: [...expression],
      dataModelId: 'Activity',
      onChange: mockOnChange,
      onUpdateElementCount: mockOnUpdateElementCount,
    };

    const utils = render(<CriteriaEditor {...{ ...defaultProps, ...props }} />);
    const tree = utils.container;
    return {
      tree,
      mockOnChange,
      mockOnUpdateElementCount,
      ...utils,
    };
  };
  describe('Snapshots', () => {
    test('Supported expression', async () => {
      const { tree } = setup();

      expect(tree).toMatchSnapshot();
    });

    test('Not supported expression', async () => {
      const { tree } = setup({
        expression: [
          {
            operation: 3,
            dateField: null,
            source: null,
          },
          {
            operation: 4,
            dateField: null,
            source: null,
          },
          {
            operation: 5,
            dateField: null,
            source: null,
          },
        ],
      });

      expect(tree).toMatchSnapshot();
    });

    test('No expression', async () => {
      const { tree } = setup({ expression: null });

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
  describe('Functional', () => {
    // eslint-disable-next-line jest/no-commented-out-tests
    /*  test('Change Predicate', async () => {
      const mini = [
        {
          operation: 0,
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
          dateField: null,
          operation: 1,
          source: null,
        },
      ];
      const { getByText, mockOnChange } = setup({ expression: mini });

      const button = getByText('No');
      userEvent.click(button);
      const updated = [...mini];
      updated[3].source.Value = 'false';
      expect(mockOnChange).toHaveBeenCalled();
      expect(mockOnChange).toHaveBeenCalledWith(updated);
    });

    test('Add Predicate', async () => {
      const mini = [
        {
          operation: 0,
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
          dateField: null,
          operation: 1,
          source: null,
        },
      ];
      const { getByText, mockOnChange, mockOnUpdateElementCount } = setup({ expression: mini });

      const add = getByText('+Add filter');
      userEvent.click(add);
      const updated = [...mini];
      updated[3].source.Value = 'false';
      const button = getByText('No');
      userEvent.click(button);
      expect(mockOnChange).toHaveBeenCalled();
      expect(mockOnChange).toHaveBeenCalledWith(updated);
      expect(mockOnUpdateElementCount).toHaveBeenCalled();
    });

    test('Change First', async () => {
      const mini = [
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
            ValueType: 12,
            Property: null,
            ChildProperty: null,
          },
        },
        {
          dateField: null,
          operation: 1,
          source: null,
        },
      ];
      const { getByText, mockOnChange } = setup({ expression: mini });
      const button = getByText('Actual start date');
      userEvent.click(button);
      getByText('Actual completed date').click();
      mini[1].source.Value = 'ActualCompletedDate';

      expect(mockOnChange).toHaveBeenCalled();
      expect(mockOnChange).toHaveBeenCalledWith(mini);
    });

    test('Change First to different', async () => {
      const mini = [
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
            Value: null,
            ValueType: 9,
            Property: null,
            ChildProperty: null,
          },
        },
        {
          dateField: null,
          operation: 1,
          source: null,
        },
      ];
      const { getByText, mockOnChange } = setup({ expression: mini });
      const button = getByText('Actual start date');
      userEvent.click(button);
      getByText('Comments').click();
      mini[1].source.Value = 'Comments';
      mini[2].operation = null;

      expect(mockOnChange).toHaveBeenCalled();
      expect(mockOnChange).toHaveBeenCalledWith(mini);
    });

    test('Change Operation', async () => {
      const mini = [
        {
          operation: 0,
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
            Value: 'true',
            ValueType: 12,
            Property: null,
            ChildProperty: null,
          },
        },
        {
          dateField: null,
          operation: 1,
          source: null,
        },
      ];
      const { getByText, mockOnChange } = setup({ expression: mini });
      const button = getByText('Contains');
      userEvent.click(button);
      getByText('In list').click();
      mini[2].operation = 17;

      expect(mockOnChange).toHaveBeenCalled();
      expect(mockOnChange).toHaveBeenCalledWith(mini);
    });


    test('Change Second Type', async () => {
      const mini = [
        {
          operation: 0,
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
            Value: 'true',
            ValueType: 9,
            Property: null,
            ChildProperty: null,
          },
        },
        {
          dateField: null,
          operation: 1,
          source: null,
        },
      ];
      const { getByText, mockOnChange } = setup({ expression: mini });
      const button = getByText('Text');
      userEvent.click(button);
      getByText('Control').click();
      mini[3].source.Value = null;
      mini[3].source.ValueType = 5;

      expect(mockOnChange).toHaveBeenCalled();
      expect(mockOnChange).toHaveBeenCalledWith(mini);
    });
    */
  });
});
