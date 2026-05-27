import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import matchMediaPolyfill from 'mq-polyfill';
import { colors } from '@m-next/styles';
import ListItem from './ListItem';

describe('ListItem Component', () => {
  beforeEach(() => {
    delete window.ResizeObserver;
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    matchMediaPolyfill(window);
    window.resizeTo = function resizeTo(width, height) {
      Object.assign(this, {
        innerWidth: width,
        innerHeight: height,
        outerWidth: width,
        outerHeight: height,
      }).dispatchEvent(new this.Event('resize'));
    };
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    window.resizeTo(1000, 1000);

    jest.restoreAllMocks();
  });

  const defaultProps = {
    id: 'test-id',
    disabled: false,
    label: 'Test Label',
    selected: false,
    onClick: jest.fn(),
    value: 'test-value',
    icon: 'test-icon',
    searchText: '',
  };

  it('renders without crashing', () => {
    const { getByText } = render(<ListItem {...defaultProps} />);
    expect(getByText('Test Label')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const { getByText } = render(<ListItem {...defaultProps} />);
    fireEvent.click(getByText('Test Label'));
    expect(defaultProps.onClick).toHaveBeenCalledWith('test-value');
  });

  it('displays the icon', () => {
    const { container } = render(<ListItem {...defaultProps} />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('applies selected styles', () => {
    const props = { ...defaultProps, selected: true };
    const { getByText } = render(<ListItem {...props} />);
    const label = getByText('Test Label');
    expect(label).toHaveStyle(`color: ${colors.blue}`);
  });
});
