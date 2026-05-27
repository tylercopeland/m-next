/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import matchMediaPolyfill from 'mq-polyfill';
import { basicOperationId, complexValueTypes, FieldTypeNames } from '@m-next/types';
import '@testing-library/jest-dom/extend-expect';
import Chip from './Chip';

describe('Chip Component', () => {
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
    id: 'test-chip',
    isOpen: false,
    onClick: jest.fn(),
    onDelete: jest.fn(),
    first: { value: 'testField', metadata: { type: FieldTypeNames.Text } },
    operation: basicOperationId.Is,
    second: { value: 'testValue', type: complexValueTypes.Text },
    third: { value: 'testValue2', type: complexValueTypes.Text },
    fieldList: [{ name: 'testField', type: FieldTypeNames.Text, caption: 'Test Field' }],
    displayPreferences: {},
    index: 0,
    set: 0,
    hasValidSimpleExpression: true,
    onClose: jest.fn(),
    disableMaxWidth: false,
    tooltipId: 'tooltip-test',
  };

  it('should render without crashing', () => {
    const { getByText } = render(<Chip {...defaultProps} />);
    expect(getByText('Test Field', { exact: false })).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const { getByText } = render(<Chip {...defaultProps} />);
    fireEvent.click(getByText('Test Field', { exact: false }));
    expect(defaultProps.onClick).toHaveBeenCalledWith(0);
  });

  it('should display the correct operation label', () => {
    const { getByText } = render(<Chip {...defaultProps} />);
    expect(getByText('is')).toBeInTheDocument();
  });

  it('should display the correct value label', () => {
    const { getByText } = render(<Chip {...defaultProps} />);
    expect(getByText('testValue', { exact: false })).toBeInTheDocument();
  });
});
