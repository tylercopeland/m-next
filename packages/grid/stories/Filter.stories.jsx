import React from 'react';
import Filter from '../src/components/Header/Filter/Filter';

export default {
  title: '@m-next/grid/Filter',
  component: Filter,
  parameters: {
    docs: {
      description: {
        component: 'A dropdown filter component with support for categorized options organized under group headers.',
      },
    },
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the filter is disabled',
    },
    selected: {
      control: 'text',
      description: 'ID of the currently selected option',
    },
    onSelect: {
      action: 'onSelect',
      description: 'Callback fired when an option is selected',
    },
  },
};

// Sample data for categorized options
const categorizedOptions = [
  [
    'My Views',
    [
      { id: 'my-default', name: 'Default View' },
      { id: 'my-custom1', name: 'My Custom View 1' },
      { id: 'my-custom2', name: 'My Custom View 2' },
    ],
  ],
  [
    'Shared Views',
    [
      { id: 'shared-team', name: 'Team View' },
      { id: 'shared-department', name: 'Department View' },
      { id: 'shared-company', name: 'Company Wide View' },
    ],
  ],
  [
    'Standard Views',
    [
      { id: 'std-all', name: 'All Items' },
      { id: 'std-active', name: 'Active Items' },
      { id: 'std-completed', name: 'Completed Items' },
      { id: 'std-archived', name: 'Archived Items' },
    ],
  ],
];

// Flat options for comparison
const flatOptions = [
  { id: 'opt1', name: 'Option 1' },
  { id: 'opt2', name: 'Option 2' },
  { id: 'opt3', name: 'Option 3' },
  { id: 'opt4', name: 'Option 4' },
];

export const CategorizedFilter = {
  args: {
    id: 'categorized-filter',
    options: categorizedOptions,
    selected: 'my-default',
    disabled: false,
  },
};

export const FlatFilter = {
  args: {
    id: 'flat-filter',
    options: flatOptions,
    selected: 'opt1',
    disabled: false,
  },
};

export const DisabledCategorizedFilter = {
  args: {
    id: 'disabled-filter',
    options: categorizedOptions,
    selected: 'shared-team',
    disabled: true,
  },
};

export const EmptyFilter = {
  args: {
    id: 'empty-filter',
    options: [
      ['My Views', []],
      ['Shared Views', []],
      ['Standard Views', []],
    ],
    selected: null,
    disabled: false,
  },
};

export const SingleCategoryFilter = {
  args: {
    id: 'single-category-filter',
    options: [
      [
        'My Views',
        [
          { id: 'single1', name: 'View 1' },
          { id: 'single2', name: 'View 2' },
        ],
      ],
    ],
    selected: 'single1',
    disabled: false,
  },
};
