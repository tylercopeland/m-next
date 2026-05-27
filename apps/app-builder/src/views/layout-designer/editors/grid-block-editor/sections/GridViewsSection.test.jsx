import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GridViewsSection from './GridViewsSection';
import { createGridControl, createGridView } from '../../../control-classes';

const mockOnChange = jest.fn();
const mockOnAddView = jest.fn();
const mockOnEditView = jest.fn();

const control = createGridControl({
  viewList: [
    createGridView({ id: '1', name: 'View 1', visible: true }),
    createGridView({ id: '2', name: 'View 2', visible: true }),
    createGridView({ id: '3', name: 'View 3', visible: false }),
  ],
  defaultViewFilter: '1',
  viewFriendlyName: 'Test',
});

const columns = [{ name: 'id', primary: true }, { name: 'isDefault' }, { name: 'name' }, { name: 'visible' }];

describe('GridViewsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    const { tree } = render(
      <GridViewsSection
        control={control}
        onChange={mockOnChange}
        onAddView={mockOnAddView}
        onEditView={mockOnEditView}
        columns={columns}
      />,
    ).container;
    expect(screen.getByText('Views')).toBeInTheDocument();
    expect(tree).toMatchSnapshot();
  });
});
