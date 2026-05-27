 
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom/extend-expect';
import DataTab from './DataTab';
import fieldList from '../../../../../testing/data/fieldListActivities.json';
import { ChartTypes, legacySortValue, primarySortValue, seriesSortValue, sortOrderTypes } from './types';

expect.extend(matchers);

const setup = (props) => {
  const mockOnTableChange = jest.fn();
  const mockOnColumnChange = jest.fn();
  // const mockChangeChartCallback = jest.fn();
  const mockOnSortChange = jest.fn();
  
  const defaultProps = {
    fieldList,
    tableList: [
      { name: 'Activity', caption: 'Activity' },
      { name: 'Contacts', caption: 'Contact List' },
    ],
    tableName: 'Activity',
    columns: [
      { caption: 'PrimaryColumn', name: 'ActivityType' },
      { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 1 },
    ],
    chartType: 1,
    onTableChange: mockOnTableChange,
    onColumnChange: mockOnColumnChange,
    expandAll: true,
    // onChangeChart: mockChangeChartCallback,
    //  onChangeTitles: mockChangeTitlesCallback,
    onSortChange: mockOnSortChange,
    sorting: [{filterField: primarySortValue, filterOrder: 'asc'}],
  };

  const utils = render(<DataTab {...{ ...defaultProps, ...props }} />);
  const tree = utils.container;
  return {
    tree,
    mockOnTableChange,
    mockOnColumnChange,
    mockOnSortChange,
 //   mockChangeChartCallback,
    ...utils,
  };
};

describe('DataTab', () => {
  /*
  describe('Snapshots', () => {
    test('Collapsed', async () => {
      const { tree } = setup();

      expect(tree).toMatchSnapshot();
    });

    test('Expanded', async () => {
      const { tree, getAllByRole } = setup();
      userEvent.click(getAllByRole('img')[0]);
      userEvent.click(getAllByRole('img')[1]);
      userEvent.click(getAllByRole('img')[2]);
      userEvent.click(getAllByRole('img')[3]);
      userEvent.click(getAllByRole('img')[4]);

      expect(tree).toMatchSnapshot();
    });

    test('Expanded blank model', async () => {
      const { tree, getAllByRole } = setup({ tableName: null, columns: null });
      userEvent.click(getAllByRole('img')[0]);
      userEvent.click(getAllByRole('img')[1]);
      userEvent.click(getAllByRole('img')[2]);
      userEvent.click(getAllByRole('img')[3]);
      userEvent.click(getAllByRole('img')[4]);

      expect(tree).toMatchSnapshot();
    });

    test('Expanded with all axis options', async () => {
      const { tree, getAllByRole } = setup({
        columns: [
          { caption: 'PrimaryColumn', name: 'DueDateStart', type: 'DateTime' },
          { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 2 },
        ],
      });
      userEvent.click(getAllByRole('img')[0]);
      userEvent.click(getAllByRole('img')[1]);
      userEvent.click(getAllByRole('img')[2]);
      userEvent.click(getAllByRole('img')[3]);
      userEvent.click(getAllByRole('img')[4]);

      expect(tree).toMatchSnapshot();
    });
  });
*/
  describe('Functional', () => {
    it('Change table', async () => {
      const { getByText, mockOnTableChange } = setup();

      userEvent.click(document.getElementById('chart-table-dropdown-list-input'));
      userEvent.type(document.getElementById('chart-table-dropdown-list-input'), 'cont');

      userEvent.click(getByText('Contact List'));

      expect(mockOnTableChange).toHaveBeenCalledTimes(1);

      expect(mockOnTableChange).toHaveBeenCalledWith('Contacts');
    });

    it('Change aggegrate', async () => {
      const { getByText, mockOnColumnChange } = setup({
        columns: [
          { caption: 'PrimaryColumn', name: 'ActivityType' },
          { caption: 'SecondaryColumn', name: 'RecordID', aggregate: null },
        ],
      });

      userEvent.click(getByText('Sum'));

      expect(mockOnColumnChange).toHaveBeenCalledTimes(1);

      expect(mockOnColumnChange).toHaveBeenCalledWith([
        { caption: 'PrimaryColumn', name: 'ActivityType' },
        {
          aggregate: 2,
          fieldType: 2,
          caption: 'SecondaryColumn',
          isLinked: false,
          isRequired: false,
          isVisible: true,
          name: 'RecordID',
          size: 0,
          sourceField: 'RecordID',
          sourceModel: 'Activity',
          type: 'Integer',
        },
      ]);
    });

    it('Change X-Axis', async () => {
      const { getByText, mockOnColumnChange } = setup();

      userEvent.click(document.getElementById('x-axis-field-dropdown-list-input'));
      userEvent.type(document.getElementById('x-axis-field-dropdown-list-input'), 'calendar');

      userEvent.click(getByText('Activity type is show on calendar'));

      expect(mockOnColumnChange).toHaveBeenCalledTimes(1);

      expect(mockOnColumnChange).toHaveBeenCalledWith([
        {
          caption: 'PrimaryColumn',
          dateGroupBy: null,
          isLinked: true,
          isRequired: false,
          isVisible: true,
          name: 'ActivityTypeIsShowOnCalendar',
          size: 0,
          sourceField: 'IsShowOnCalendar',
          sourceModel: 'ActivityType',
          type: 'YesNo',
        },
        { aggregate: 1, caption: 'SecondaryColumn', name: 'RecordID' },
      ]);
    });

    it('Change Y-Axis', async () => {
      const { getByText, mockOnColumnChange } = setup();
      userEvent.click(document.getElementById('series-field-dropdown-list-input'));
      userEvent.type(document.getElementById('series-field-dropdown-list-input'), 'balance');

      userEvent.click(getByText('Contacts balance'));

      expect(mockOnColumnChange).toHaveBeenCalledTimes(1);

      expect(mockOnColumnChange).toHaveBeenCalledWith([
        { caption: 'PrimaryColumn', name: 'ActivityType' },
        {
          aggregate: 2,
          fieldType: 4,
          caption: 'SecondaryColumn',
          isLinked: true,
          isRequired: false,
          isVisible: true,
          name: 'ContactsBalance',
          size: 0,
          sourceField: 'Balance',
          sourceModel: 'Contacts',
          type: 'Money',
        },
      ]);
    });

    describe('Sorting', () => {
      it('should default to x-axis option in ascending order when no sorting is set', async () => {
        setup({sorting: undefined});
        const sortByFieldElement = document.getElementById(`sort-by-field-option-label-${primarySortValue}`);
        const sortByOrderElement = document.getElementById('sort-by-order-option-label-asc');

        expect(sortByFieldElement).not.toBe(null);
        expect(sortByFieldElement.textContent).toEqual("X axis (Activity type)");

        expect(sortByOrderElement).not.toBe(null);
        expect(sortByOrderElement.textContent).toEqual(sortOrderTypes.DefaultAsc);
      });
      
      it(`should properly grab x-axis column label when set to ${primarySortValue}`, async () => {
        setup({
          sorting: [{filterField: primarySortValue, filterOrder: 'asc'}],
          columns: [
            { caption: 'PrimaryColumn', name: 'DueDateStart', type: 'DateTime' },
            { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 2 },
          ],
        });
        const sortByFieldElement = document.getElementById(`sort-by-field-option-label-${primarySortValue}`);
        expect(sortByFieldElement).not.toBe(null);
        expect(sortByFieldElement.textContent).toEqual("X axis (Due date start)");
      });
      
      it(`should properly grab primary sort label when chart type is set to bar`, async () => {
        setup({
          sorting: [{filterField: primarySortValue, filterOrder: 'asc'}],
          columns: [
            { caption: 'PrimaryColumn', name: 'DueDateStart', type: 'DateTime' },
            { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 2 },
          ],
          chartType: ChartTypes.Bar.value,
        });
        const sortByFieldElement = document.getElementById(`sort-by-field-option-label-${primarySortValue}`);
        expect(sortByFieldElement).not.toBe(null);
        expect(sortByFieldElement.textContent).toEqual("Y axis (Due date start)");
      });
      
      it(`should properly grab primary sort label when chart type is set to pie chart`, async () => {
        setup({
          sorting: [{filterField: primarySortValue, filterOrder: 'asc'}],
          columns: [
            { caption: 'PrimaryColumn', name: 'DueDateStart', type: 'DateTime' },
            { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 2 },
          ],
          chartType: ChartTypes.Pie.value,
        });
        const sortByFieldElement = document.getElementById(`sort-by-field-option-label-${primarySortValue}`);
        expect(sortByFieldElement).not.toBe(null);
        expect(sortByFieldElement.textContent).toEqual("Wedges (Due date start)");
      });
      
      it(`should properly grab primary sort label when chart type is set to donut chart`, async () => {
        setup({
          sorting: [{filterField: primarySortValue, filterOrder: 'asc'}],
          columns: [
            { caption: 'PrimaryColumn', name: 'DueDateStart', type: 'DateTime' },
            { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 2 },
          ],
          chartType: ChartTypes.Donut.value,
        });
        const sortByFieldElement = document.getElementById(`sort-by-field-option-label-${primarySortValue}`);
        expect(sortByFieldElement).not.toBe(null);
        expect(sortByFieldElement.textContent).toEqual("Wedges (Due date start)");
      });
      
      it(`should properly grab y-axis column label when set to ${seriesSortValue}`, async () => {
        setup({
          sorting: [{filterField: seriesSortValue, filterOrder: 'asc'}],
          columns: [
            { caption: 'PrimaryColumn', name: 'DueDateStart', type: 'DateTime' },
            { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 2 },
          ],
        });
        const sortByFieldElement = document.getElementById(`sort-by-field-option-label-${seriesSortValue}`);
        expect(sortByFieldElement).not.toBe(null);
        expect(sortByFieldElement.textContent).toEqual("Y axis (Record id of Activity)");
      });
      
      it(`should properly grab series sort label when chart type is set to bar`, async () => {
        setup({
          sorting: [{filterField: seriesSortValue, filterOrder: 'asc'}],
          columns: [
            { caption: 'PrimaryColumn', name: 'DueDateStart', type: 'DateTime' },
            { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 2 },
          ],
          chartType: ChartTypes.Bar.value,
        });
        const sortByFieldElement = document.getElementById(`sort-by-field-option-label-${seriesSortValue}`);
        expect(sortByFieldElement).not.toBe(null);
        expect(sortByFieldElement.textContent).toEqual("X axis (Record id of Activity)");
      });
      
      it(`should properly grab series sort label when chart type is set to pie chart`, async () => {
        setup({
          sorting: [{filterField: seriesSortValue, filterOrder: 'asc'}],
          columns: [
            { caption: 'PrimaryColumn', name: 'DueDateStart', type: 'DateTime' },
            { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 2 },
          ],
          chartType: ChartTypes.Pie.value,
        });
        const sortByFieldElement = document.getElementById(`sort-by-field-option-label-${seriesSortValue}`);
        expect(sortByFieldElement).not.toBe(null);
        expect(sortByFieldElement.textContent).toEqual("Values (Record id of Activity)");
      });
      
      it(`should properly grab series sort label when chart type is set to donut chart`, async () => {
        setup({
          sorting: [{filterField: seriesSortValue, filterOrder: 'asc'}],
          columns: [
            { caption: 'PrimaryColumn', name: 'DueDateStart', type: 'DateTime' },
            { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 2 },
          ],
          chartType: ChartTypes.Donut.value,
        });
        const sortByFieldElement = document.getElementById(`sort-by-field-option-label-${seriesSortValue}`);
        expect(sortByFieldElement).not.toBe(null);
        expect(sortByFieldElement.textContent).toEqual("Values (Record id of Activity)");
      });
      
      it(`should label fields not matching any axis with the legacy label`, async () => {
        setup({
          sorting: [{filterField: 'Calendar', filterOrder: 'asc'}],
          columns: [
            { caption: 'PrimaryColumn', name: 'DueDateStart', type: 'DateTime' },
            { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 2 },
          ],
        });
        const sortByFieldElement = document.getElementById(`sort-by-field-option-label-${legacySortValue}`);
        expect(sortByFieldElement).not.toBe(null);
        expect(sortByFieldElement.textContent).toEqual("Legacy Sort (Calendar)");
      });
      
      it(`should set sort to primary sort value when legacy sort field matches primary axis`, async () => {
        setup({
          sorting: [{filterField: 'DueDateStart', filterOrder: 'asc'}],
          columns: [
            { caption: 'PrimaryColumn', name: 'DueDateStart', type: 'DateTime' },
            { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 2 },
          ],
        });
        const sortByFieldElement = document.getElementById(`sort-by-field-option-label-${primarySortValue}`);
        expect(sortByFieldElement).not.toBe(null);
        expect(sortByFieldElement.textContent).toEqual("X axis (Due date start)");
      });
      
      it(`should set sort to series sort value when legacy sort field matches series axis`, async () => {
        setup({
          sorting: [{filterField: 'RecordID', filterOrder: 'asc'}],
          columns: [
            { caption: 'PrimaryColumn', name: 'DueDateStart', type: 'DateTime' },
            { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 2 },
          ],
        });
        const sortByFieldElement = document.getElementById(`sort-by-field-option-label-${seriesSortValue}`);
        expect(sortByFieldElement).not.toBe(null);
        expect(sortByFieldElement.textContent).toEqual("Y axis (Record id of Activity)");
      });
      
      it(`should properly handle legacy sort using multiple fields to sort on`, async () => {
        const {getByText} = setup({
          sorting: [
            {filterField: 'Calendar', filterOrder: 'asc'},
            {filterField: 'RecordID', filterOrder: 'desc'}
          ],
          columns: [
            { caption: 'PrimaryColumn', name: 'DueDateStart', type: 'DateTime' },
            { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 2 },
          ],
        });
        const sortByFieldElement = document.getElementById(`sort-by-field-option-label-${legacySortValue}`);
        expect(sortByFieldElement).not.toBe(null);
        expect(sortByFieldElement.textContent).toEqual("Legacy Sort (Multi)");
        expect(getByText("Calendar, ascending")).toBeDefined();
        expect(getByText("RecordID, descending")).toBeDefined();
      });

      it('should call onSortChange when sort by field changes', async () => {
        const { mockOnSortChange } = setup({
          sorting: [{filterField: primarySortValue, filterOrder: 'desc'}],
        });
        userEvent.click(document.getElementById('sort-by-field-dropdown-list-input'));
        userEvent.click(document.getElementById(`sort-by-field-option-label-${seriesSortValue}`));

        expect(mockOnSortChange).toHaveBeenCalledTimes(1);

        expect(mockOnSortChange).toHaveBeenCalledWith(seriesSortValue, 'desc');
      });

      it('should call onSortChange when sort by order changes', async () => {
        const { mockOnSortChange } = setup({
          sorting: [{filterField: primarySortValue, filterOrder: 'desc'}],
        });
        userEvent.click(document.getElementById('sort-by-order-dropdown-list-input'));
        userEvent.click(document.getElementById('sort-by-order-option-label-asc'));

        expect(mockOnSortChange).toHaveBeenCalledTimes(1);

        expect(mockOnSortChange).toHaveBeenCalledWith(primarySortValue, 'asc');
      });

      it('should properly distinguish between ascending and descending', async () => {
        setup({
          sorting: [{filterField: primarySortValue, filterOrder: 'desc'}],
          columns: [
            { caption: 'PrimaryColumn', name: 'ActivityType' },
            { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 2 },
          ],
        });
        const sortByOrderElement = document.getElementById('sort-by-order-option-label-desc');

        expect(sortByOrderElement).not.toBe(null);
        expect(sortByOrderElement.textContent).toEqual(sortOrderTypes.DefaultDesc);
      });
      
      describe('should properly change sort order labels based on column type', () => {
        it(`when set to date time asc`, async () => {
          setup({
            sorting: [{filterField: primarySortValue, filterOrder: 'asc'}],
            columns: [
              { caption: 'PrimaryColumn', name: 'DueDateStart', type: 'DateTime' },
              { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 2 },
            ],
          });
          const sortByOrderElement = document.getElementById('sort-by-order-option-label-asc');
  
          expect(sortByOrderElement).not.toBe(null);
          expect(sortByOrderElement.textContent).toEqual(sortOrderTypes.DatetimeAsc);
        });

        it(`when set to date time desc`, async () => {
          setup({
            sorting: [{filterField: primarySortValue, filterOrder: 'desc'}],
            columns: [
              { caption: 'PrimaryColumn', name: 'DueDateStart', type: 'DateTime' },
              { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 2 },
            ],
          });
          const sortByOrderElement = document.getElementById('sort-by-order-option-label-desc');
  
          expect(sortByOrderElement).not.toBe(null);
          expect(sortByOrderElement.textContent).toEqual(sortOrderTypes.DatetimeDesc);
        });
        
        it(`when set to money asc`, async () => {
          setup({
            sorting: [{filterField: primarySortValue, filterOrder: 'asc'}],
            columns: [
              { caption: 'PrimaryColumn', name: 'TotalAmount', type: 'Money' },
              { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 2 },
            ],
          });
          const sortByOrderElement = document.getElementById('sort-by-order-option-label-asc');
  
          expect(sortByOrderElement).not.toBe(null);
          expect(sortByOrderElement.textContent).toEqual(sortOrderTypes.MoneyAsc);
        });
        
        it(`when set to money desc`, async () => {
          setup({
            sorting: [{filterField: primarySortValue, filterOrder: 'desc'}],
            columns: [
              { caption: 'PrimaryColumn', name: 'TotalAmount', type: 'Money' },
              { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 2 },
            ],
          });
          const sortByOrderElement = document.getElementById('sort-by-order-option-label-desc');
  
          expect(sortByOrderElement).not.toBe(null);
          expect(sortByOrderElement.textContent).toEqual(sortOrderTypes.MoneyDesc);
        });
        
        it(`when set to integer asc`, async () => {
          setup({
            sorting: [{filterField: primarySortValue, filterOrder: 'asc'}],
            columns: [
              { caption: 'PrimaryColumn', name: 'RecordID', type: 'Integer' },
              { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 2 },
            ],
          });
          const sortByOrderElement = document.getElementById('sort-by-order-option-label-asc');
  
          expect(sortByOrderElement).not.toBe(null);
          expect(sortByOrderElement.textContent).toEqual(sortOrderTypes.IntegerAsc);
        });
        
        it(`when set to integer desc`, async () => {
          setup({
            sorting: [{filterField: primarySortValue, filterOrder: 'desc'}],
            columns: [
              { caption: 'PrimaryColumn', name: 'RecordID', type: 'Integer' },
              { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 2 },
            ],
          });
          const sortByOrderElement = document.getElementById('sort-by-order-option-label-desc');
  
          expect(sortByOrderElement).not.toBe(null);
          expect(sortByOrderElement.textContent).toEqual(sortOrderTypes.IntegerDesc);
        });
        
        it(`when set to decimal asc`, async () => {
          setup({
            sorting: [{filterField: seriesSortValue, filterOrder: 'asc'}],
            columns: [
              { caption: 'PrimaryColumn', name: 'DueDateStart', type: 'DateTime' },
              { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 3 },
            ],
          });
          const sortByOrderElement = document.getElementById('sort-by-order-option-label-asc');
  
          expect(sortByOrderElement).not.toBe(null);
          expect(sortByOrderElement.textContent).toEqual(sortOrderTypes.IntegerAsc);
        });
        
        it(`when set to decimal desc`, async () => {
          setup({
            sorting: [{filterField: seriesSortValue, filterOrder: 'desc'}],
            columns: [
              { caption: 'PrimaryColumn', name: 'DueDateStart', type: 'DateTime' },
              { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 3 },
            ],
          });
          const sortByOrderElement = document.getElementById('sort-by-order-option-label-desc');
  
          expect(sortByOrderElement).not.toBe(null);
          expect(sortByOrderElement.textContent).toEqual(sortOrderTypes.IntegerDesc);
        });
      });
    });
  });
});

/*
 it('Change X-Axis Date Grouping', async () => {
      const { getByText, mockOnColumnChange } = setup({
        column: [
          { caption: 'PrimaryColumn', name: 'DueDateStart', type: 'DateTime' },
          { caption: 'SecondaryColumn', name: 'RecordID', aggregate: 2 },
        ],
      });

      userEvent.click(getByText('Year'));

      expect(mockOnColumnChange).toHaveBeenCalledTimes(1);

      expect(mockOnColumnChange).toHaveBeenCalledWith('');
    });
*/
