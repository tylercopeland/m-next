import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ViewSettings from './ViewSettings';

const mockOnChange = jest.fn();

const defaultProps = {
  view: {
    columns: [],
    filtering: [],
    sorting: [],
    name: '',
    id: '1',
  },
  onChange: mockOnChange,
  disabled: false,
  displayPreferences: {},
  controlList: {},
  fieldList: [],
  viewFriendlyName: 'Test View',
  columns: [],
};

describe('ViewSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    const { tree } = render(<ViewSettings {...defaultProps} />);
    expect(screen.getByText('Create your custom view for the grid.')).toBeInTheDocument();
    expect(tree).toMatchSnapshot();
  });
});
