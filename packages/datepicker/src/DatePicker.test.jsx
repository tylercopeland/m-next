/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import DatePicker from './DatePicker';

expect.extend(matchers);

const setup = (props) => {
  const defaultProps = {
    id: 'test',
    formatType: 'Short Date',
    value: '2022-11-08T13:20',
  };
  const utils = render(<DatePicker {...{ ...defaultProps, ...props }} />);
  const tree = utils.container;
  return {
    tree,
    ...utils,
  };
};

describe('DatePicker', () => {
  describe('Functional', () => {
    test('Date Change', async () => {
      const mockOnChange = jest.fn();
      const { getByRole } = setup({ onChange: mockOnChange });

      let input = getByRole('textbox');
      userEvent.clear(input);
      userEvent.type(input, '04-03-2020');
      input = getByRole('textbox');

      userEvent.tab(input);
      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(input).toHaveValue('Apr-03-2020');
    });

    test('Bad Date Change', async () => {
      const mockOnChange = jest.fn();

      const { getByRole } = setup({ onChange: mockOnChange });

      let input = getByRole('textbox');
      userEvent.clear(input);
      userEvent.type(input, 'fish');
      input = getByRole('textbox');

      expect(mockOnChange).toHaveBeenCalledTimes(0);
    });

    test('Handles Jun-0 Input', async () => {
      const mockOnChange = jest.fn();
      const { getByRole } = setup({ onChange: mockOnChange, formatType: 'Short Date' });

      let input = getByRole('textbox');
      userEvent.clear(input);
      userEvent.type(input, 'Jun-0');
      input = getByRole('textbox');
      userEvent.tab(input);

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      // Should show Jun-01-<currentYear>
      const currentYear = new Date().getFullYear();
      expect(input).toHaveValue(`Jun-01-${currentYear}`);
    });

    test('Handles June-0 Input', async () => {
      const mockOnChange = jest.fn();
      const { getByRole } = setup({ onChange: mockOnChange, formatType: 'Short Date' });

      let input = getByRole('textbox');
      userEvent.clear(input);
      userEvent.type(input, 'June-0');
      input = getByRole('textbox');
      userEvent.tab(input);

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      // Should show Jun-01-<currentYear>
      const currentYear = new Date().getFullYear();
      expect(input).toHaveValue(`Jun-01-${currentYear}`);
    });
  });

  describe('iOS Mobile DateTime Fix', () => {
    test('Mobile: iOS empty picker opens without auto-populating', () => {
      // Mock iOS user agent
      const originalUserAgent = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });

      try {
        const mockOnChange = jest.fn();

        const { container } = setup({
          onChange: mockOnChange,
          value: null,
          isMobile: true,
          formatType: 'Short Date and Time',
          hideIcon: false,
        });

        const iconElement = container.querySelector('svg');
        expect(iconElement).toBeTruthy();
        const iconWrapper = iconElement.parentElement.parentElement;
        fireEvent.click(iconWrapper);

        // Should NOT auto-populate - just open the picker
        expect(mockOnChange).not.toHaveBeenCalled();
      } finally {
        Object.defineProperty(navigator, 'userAgent', {
          value: originalUserAgent,
          configurable: true,
        });
      }
    });

    test('Mobile: iOS datetime picker commits value from input on blur', () => {
      const originalUserAgent = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });

      try {
        const mockOnChange = jest.fn();

        const { container } = setup({
          onChange: mockOnChange,
          value: '2024-03-12T14:30',
          isMobile: true,
          formatType: 'Short Date and Time',
        });

        // Simulate the native input having a new value
        const input = container.querySelector('input[type="datetime-local"]');
        expect(input).toBeTruthy();

        // Manually set the input value (simulating iOS time wheel interaction)
        Object.defineProperty(input, 'value', {
          value: '2024-03-12T16:45',
          configurable: true,
        });

        // Trigger blur (time wheels close)
        fireEvent.blur(input);

        // Should commit the new value from the input
        expect(mockOnChange).toHaveBeenCalled();
        const calledValue = mockOnChange.mock.calls[0][0];
        expect(calledValue).toBeInstanceOf(Date);
        expect(calledValue.getHours()).toBe(16);
        expect(calledValue.getMinutes()).toBe(45);
      } finally {
        Object.defineProperty(navigator, 'userAgent', {
          value: originalUserAgent,
          configurable: true,
        });
      }
    });

    test('Mobile: iOS datetime picker does not commit if value unchanged', () => {
      const originalUserAgent = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });

      try {
        const mockOnChange = jest.fn();
        const existingDate = '2024-03-12T14:30';

        const { container } = setup({
          onChange: mockOnChange,
          value: existingDate,
          isMobile: true,
          formatType: 'Short Date and Time',
        });

        const input = container.querySelector('input[type="datetime-local"]');

        // Input value matches current value
        Object.defineProperty(input, 'value', {
          value: '2024-03-12T14:30',
          configurable: true,
        });

        fireEvent.blur(input);

        // Should NOT call onChange since value didn't change
        expect(mockOnChange).not.toHaveBeenCalled();
      } finally {
        Object.defineProperty(navigator, 'userAgent', {
          value: originalUserAgent,
          configurable: true,
        });
      }
    });

    test('Mobile: iOS fix only applies to datetime/time pickers, not date-only', () => {
      const originalUserAgent = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });

      try {
        const mockOnChange = jest.fn();

        const { container } = setup({
          onChange: mockOnChange,
          value: '2024-03-12',
          isMobile: true,
          formatType: 'Short Date', // Date-only, no time component
        });

        const input = container.querySelector('input[type="date"]');

        // Trigger blur
        fireEvent.blur(input);

        // Should use standard behavior (not iOS datetime fix)
        // Standard behavior doesn't commit on blur if isFocused is false
        expect(mockOnChange).not.toHaveBeenCalled();
      } finally {
        Object.defineProperty(navigator, 'userAgent', {
          value: originalUserAgent,
          configurable: true,
        });
      }
    });
  });

  describe('Snapshots', () => {
    test('Default', async () => {
      const { tree } = setup();
      expect(tree).toMatchSnapshot();
    });
    test('Date format Short Date and Time', async () => {
      const { tree } = setup({ formatType: 'Short Date and Time' });
      expect(tree).toMatchSnapshot();
    });

    test('Date format Short Date', async () => {
      const { tree } = setup({ formatType: 'Short Date' });
      expect(tree).toMatchSnapshot();
    });

    test('Date format Long Date and Time', async () => {
      const { tree } = setup({ formatType: 'Long Date and Time' });
      expect(tree).toMatchSnapshot();
    });

    test('Date format Time', async () => {
      const { tree } = setup({ formatType: 'Time' });
      expect(tree).toMatchSnapshot();
    });

    test('Date format Long Date', async () => {
      const { tree } = setup({ formatType: 'Long Date' });
      expect(tree).toMatchSnapshot();
    });

    test('Date format Hour', async () => {
      const { tree } = setup({ formatType: 'Hour' });
      expect(tree).toMatchSnapshot();
    });

    test('Date format Day', async () => {
      const { tree } = setup({ formatType: 'Day' });
      expect(tree).toMatchSnapshot();
    });

    test('Date format Day of Week', async () => {
      const { tree } = setup({ formatType: 'Day of Week' });
      expect(tree).toMatchSnapshot();
    });

    test('Date format Month', async () => {
      const { tree } = setup({ formatType: 'Month' });
      expect(tree).toMatchSnapshot();
    });

    test('Date format Month and Year', async () => {
      const { tree } = setup({ formatType: 'Month and Year' });
      expect(tree).toMatchSnapshot();
    });

    test('Date format Year', async () => {
      const { tree } = setup({ formatType: 'Year' });
      expect(tree).toMatchSnapshot();
    });

    test('Date format Short Date and Time isMobile', async () => {
      const { tree } = setup({ formatType: 'Short Date and Time', isMobile: true });
      expect(tree).toMatchSnapshot();
    });

    test('Date format Short Date isMobile', async () => {
      const { tree } = setup({ formatType: 'Short Date', isMobile: true });
      expect(tree).toMatchSnapshot();
    });

    test('Date format Long Date and Time isMobile', async () => {
      const { tree } = setup({ formatType: 'Long Date and Time', isMobile: true });
      expect(tree).toMatchSnapshot();
    });

    test('Date format Time isMobile', async () => {
      const { tree } = setup({ formatType: 'Time', isMobile: true });
      expect(tree).toMatchSnapshot();
    });

    test('Date format Long Date isMobile', async () => {
      const { tree } = setup({ formatType: 'Long Date', isMobile: true });
      expect(tree).toMatchSnapshot();
    });

    test('Date format Hour isMobile', async () => {
      const { tree } = setup({ formatType: 'Hour', isMobile: true });
      expect(tree).toMatchSnapshot();
    });

    test('Date format Day isMobile', async () => {
      const { tree } = setup({ formatType: 'Day', isMobile: true });
      expect(tree).toMatchSnapshot();
    });

    test('Date format Day of Week isMobile', async () => {
      const { tree } = setup({ formatType: 'Day of Week', isMobile: true });
      expect(tree).toMatchSnapshot();
    });

    test('Date format Month isMobile', async () => {
      const { tree } = setup({ formatType: 'Month', isMobile: true });
      expect(tree).toMatchSnapshot();
    });

    test('Date format Month and Year isMobile', async () => {
      const { tree } = setup({ formatType: 'Month and Year', isMobile: true });
      expect(tree).toMatchSnapshot();
    });

    test('Date format Year isMobile', async () => {
      const { tree } = setup({ formatType: 'Year', isMobile: true });
      expect(tree).toMatchSnapshot();
    });

    test('Disabled', async () => {
      const { tree } = setup({ disabled: true });
      expect(tree).toMatchSnapshot();
    });
  });

  describe('Event handlers and props', () => {
    test('Detects enter key press when the input box is focused', async () => {
      const mockOnKeyDown = jest.fn();
      const { getByRole } = setup({ onKeyDown: mockOnKeyDown });
      const input = getByRole('textbox');
      input.focus();
      userEvent.type(input, '{enter}');
      expect(mockOnKeyDown).toHaveBeenCalled();
    });

    test('Renders input field and caption with 50% opacity when disabled', async () => {
      const { container } = setup({ disabled: true });
      const wrapper = container.firstChild;
      expect(wrapper).toHaveStyle('opacity: 0.5');
    });

    test('Input is disabled when disabled prop is true', async () => {
      const { getByRole } = setup({ disabled: true });
      const input = getByRole('textbox');
      expect(input).toBeDisabled();
    });

    test('Renders placeholder when no caption is provided', async () => {
      const { getByPlaceholderText } = setup({ caption: null, placeholder: 'Pick a date' });
      expect(getByPlaceholderText('Pick a date')).toBeInTheDocument();
    });
  });
});
