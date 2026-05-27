/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import '@testing-library/jest-dom/extend-expect';

// Mock external dependencies
jest.mock('@m-next/svg-icon', () => {
  // eslint-disable-next-line react/prop-types
  const MockSvgIcon = ({ name, size, color }) => (
    <span data-testid={`svg-icon-${name}`} data-size={size} data-color={color} />
  );
  return MockSvgIcon;
});

const mockTheme = {
  content: {
    primary: '#333333',
    secondary: '#666666',
    border: '#cccccc',
  },
  fontFamily: 'Arial, sans-serif',
};

jest.mock('@m-next/styles', () => ({
  colors: {
    grey: '#888888',
    'grey-dark': '#444444',
  },
  lightTheme: {
    content: {
      primary: '#333333',
      secondary: '#666666',
      border: '#cccccc',
    },
    fontFamily: 'Arial, sans-serif',
  },
}));

// Mock the useDebounce hook to make tests synchronous
jest.mock('@m-next/utilities/src/hooks', () => ({
  useDebounce: (value) => value,
}));

// Import after mocks are set up
const SearchInput = require('./SearchInput').default;

// Helper to render with theme
const renderWithTheme = (component) => render(<ThemeProvider theme={mockTheme}>{component}</ThemeProvider>);

describe('SearchInput', () => {
  describe('Functional', () => {
    it('renders with default props', () => {
      const { getByTestId } = renderWithTheme(<SearchInput id='test' />);
      expect(getByTestId('test-search-input')).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      const { getByPlaceholderText } = renderWithTheme(<SearchInput id='test' placeholder='Search...' />);
      expect(getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('calls onChange when user types', async () => {
      const onChange = jest.fn();
      const { getByTestId } = renderWithTheme(<SearchInput id='test' onChange={onChange} />);

      const input = getByTestId('test-search-input');
      fireEvent.change(input, { target: { value: 'test query' } });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('test query');
      });
    });
  });

  describe('Clearing input behavior', () => {
    it('calls onChange with empty string when user clears input after typing', async () => {
      const onChange = jest.fn();
      const { getByTestId } = renderWithTheme(<SearchInput id='test' onChange={onChange} />);

      const input = getByTestId('test-search-input');

      // User types something
      fireEvent.change(input, { target: { value: 'search term' } });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('search term');
      });

      onChange.mockClear();

      // User clears the input
      fireEvent.change(input, { target: { value: '' } });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('');
      });
    });

    it('calls onChange when clearing input even when value prop is undefined', async () => {
      const onChange = jest.fn();
      // Explicitly pass undefined to simulate uncontrolled mode
      const { getByTestId } = renderWithTheme(<SearchInput id='test' value={undefined} onChange={onChange} />);

      const input = getByTestId('test-search-input');

      // User types something
      fireEvent.change(input, { target: { value: 'invalid search' } });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('invalid search');
      });

      onChange.mockClear();

      // User clears the input - this should still trigger onChange
      fireEvent.change(input, { target: { value: '' } });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('');
      });
    });

    it('calls onChange when clearing input even when value prop is null', async () => {
      const onChange = jest.fn();
      const { getByTestId } = renderWithTheme(<SearchInput id='test' value={null} onChange={onChange} />);

      const input = getByTestId('test-search-input');

      // User types something
      fireEvent.change(input, { target: { value: 'test' } });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('test');
      });

      onChange.mockClear();

      // User clears the input
      fireEvent.change(input, { target: { value: '' } });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('');
      });
    });

    it('does not call onChange on initial render with empty input', () => {
      const onChange = jest.fn();
      renderWithTheme(<SearchInput id='test' onChange={onChange} />);

      // onChange should not be called just from rendering with empty input
      expect(onChange).not.toHaveBeenCalled();
    });

    it('does not call onChange on initial render when value prop is undefined', () => {
      const onChange = jest.fn();
      renderWithTheme(<SearchInput id='test' value={undefined} onChange={onChange} />);

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Controlled mode', () => {
    it('calls onChange when value differs from prop', async () => {
      const onChange = jest.fn();
      const { getByTestId } = renderWithTheme(<SearchInput id='test' value='initial' onChange={onChange} />);

      const input = getByTestId('test-search-input');
      fireEvent.change(input, { target: { value: 'changed' } });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('changed');
      });
    });

    it('updates internal state when value prop changes', () => {
      const { getByTestId, rerender } = renderWithTheme(<SearchInput id='test' value='initial' />);

      const input = getByTestId('test-search-input');
      expect(input.value).toBe('initial');

      rerender(
        <ThemeProvider theme={mockTheme}>
          <SearchInput id='test' value='updated' />
        </ThemeProvider>,
      );
      expect(input.value).toBe('updated');
    });
  });

  describe('Clear button', () => {
    it('calls onChange with empty string when clear button is clicked', async () => {
      const onChange = jest.fn();
      const { getByTestId } = renderWithTheme(<SearchInput id='test' showClearButton onChange={onChange} />);

      const input = getByTestId('test-search-input');

      // Type something first to make clear button visible
      fireEvent.change(input, { target: { value: 'search' } });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('search');
      });

      onChange.mockClear();

      // Click clear button
      const clearButton = getByTestId('test-search-clear-button');
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith('');
      });
    });
  });

  describe('Snapshots', () => {
    it('Default', () => {
      const tree = renderWithTheme(<SearchInput id='test' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('With placeholder', () => {
      const tree = renderWithTheme(<SearchInput id='test' placeholder='Search...' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('With value', () => {
      const tree = renderWithTheme(<SearchInput id='test' value='test value' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Disabled', () => {
      const tree = renderWithTheme(<SearchInput id='test' disabled />).container;
      expect(tree).toMatchSnapshot();
    });

    it('With clear button', () => {
      const tree = renderWithTheme(<SearchInput id='test' showClearButton value='test' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Mobile', () => {
      const tree = renderWithTheme(<SearchInput id='test' isMobile />).container;
      expect(tree).toMatchSnapshot();
    });
  });
});
