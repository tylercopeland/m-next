/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DateRangePicker from './DateRangePicker';

describe('DateRangePicker', () => {
  const defaultProps = {
    id: 'test',
    startDateValue: new Date('2023-01-01'),
    endDateValue: new Date('2023-01-10'),
    onStartDateChange: jest.fn(),
    onEndDateChange: jest.fn(),
    disabled: false,
    interval: 1,
    readOnly: false,
    isMobile: false,
    displayPreferences: {},
    containerStyle: {},
    anchorEl: '',
    forcedTimeZone: '',
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByText } = render(<DateRangePicker {...defaultProps} />);
    expect(getByText('Start date')).toBeInTheDocument();
    expect(getByText('End date')).toBeInTheDocument();
  });

  it('shows validation message when end date is before start date', () => {
    const { getByText } = render(
      <DateRangePicker
        {...defaultProps}
        startDateValue={new Date('2023-01-10')}
        endDateValue={new Date('2023-01-05')}
      />,
    );
    expect(getByText('Invalid range')).toBeInTheDocument();
  });
});
