/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Pagination from './Pagination';

describe('Pagination Component', () => {
  const defaultProps = {
    id: 'test-pagination',
    pageNumber: 1,
    perPage: 10,
    rowStatuses: [],
    totalRecords: 100,
    totalRows: 100,
    isPartialCount: false,
    isMobile: false,
    onClickMany: jest.fn(),
    onClickNext: jest.fn(),
    onClickPrevious: jest.fn(),
  };

  it('renders without crashing', () => {
    const { container } = render(<Pagination {...defaultProps} />);
    expect(container.textContent).toContain('100 results');
  });

  it('calls onClickNext when next button is clicked', () => {
    const { getByTitle } = render(<Pagination {...defaultProps} />);
    const nextButton = getByTitle('Next Page');
    fireEvent.click(nextButton);
    expect(defaultProps.onClickNext).toHaveBeenCalledWith(2);
  });

  it('calls onClickPrevious when previous button is clicked', () => {
    const props = { ...defaultProps, pageNumber: 2 };
    const { getByTitle } = render(<Pagination {...props} />);
    const prevButton = getByTitle('Previous Page');
    fireEvent.click(prevButton);
    expect(props.onClickPrevious).toHaveBeenCalledWith(1);
  });

  it('disables previous button on first page', () => {
    const { getByTitle } = render(<Pagination {...defaultProps} />);
    const prevButton = getByTitle('Previous Page');
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    const props = { ...defaultProps, pageNumber: 10 };
    const { getByTitle } = render(<Pagination {...props} />);
    const nextButton = getByTitle('Next Page');
    expect(nextButton).toBeDisabled();
  });
});
