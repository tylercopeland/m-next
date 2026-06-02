/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Pagination, { getPageRange } from './Pagination';

describe('@m-next/pagination', () => {
  describe('getPageRange', () => {
    it('returns every page when total fits the window', () => {
      // siblingCount 1 → 5 + 2 = 7 slots, totalPages 5 fits entirely
      expect(getPageRange(3, 5, 1)).toEqual([1, 2, 3, 4, 5]);
    });

    it('pins the window to the left edge near the start', () => {
      expect(getPageRange(2, 10, 1)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 10]);
    });

    it('pins the window to the right edge near the end', () => {
      expect(getPageRange(9, 10, 1)).toEqual([1, 'ellipsis', 6, 7, 8, 9, 10]);
    });

    it('shows both ellipsis in the middle', () => {
      expect(getPageRange(5, 10, 1)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
    });

    it('honors siblingCount=2', () => {
      expect(getPageRange(7, 20, 2)).toEqual([1, 'ellipsis', 5, 6, 7, 8, 9, 'ellipsis', 20]);
    });
  });

  describe('Pagination', () => {
    it('renders nothing when totalPages < 1', () => {
      const { container } = render(
        <Pagination currentPage={1} totalPages={0} onPageChange={() => {}} />,
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders a nav landmark with default aria-label', () => {
      render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);
      expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
    });

    it('honors a custom ariaLabel', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={() => {}}
          ariaLabel='Customer table pages'
        />,
      );
      expect(
        screen.getByRole('navigation', { name: /customer table pages/i }),
      ).toBeInTheDocument();
    });

    it('auto-generates an id when none is provided', () => {
      const { container } = render(
        <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />,
      );
      expect(container.querySelector('nav').id).toMatch(/^m-next-pagination-\d+$/);
    });

    it('marks the current page button with aria-current="page"', () => {
      render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />);
      const current = screen.getByRole('button', { name: /go to page 3/i });
      expect(current).toHaveAttribute('aria-current', 'page');
    });

    it('calls onPageChange with the clicked page number', () => {
      const handle = jest.fn();
      render(<Pagination currentPage={1} totalPages={5} onPageChange={handle} />);
      fireEvent.click(screen.getByRole('button', { name: /go to page 3/i }));
      expect(handle).toHaveBeenCalledWith(3);
    });

    it('does not fire onPageChange when clicking the active page', () => {
      const handle = jest.fn();
      render(<Pagination currentPage={3} totalPages={5} onPageChange={handle} />);
      fireEvent.click(screen.getByRole('button', { name: /go to page 3/i }));
      expect(handle).not.toHaveBeenCalled();
    });

    it('advances to the next page on Next click', () => {
      const handle = jest.fn();
      render(<Pagination currentPage={2} totalPages={5} onPageChange={handle} />);
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(handle).toHaveBeenCalledWith(3);
    });

    it('rewinds on Previous click', () => {
      const handle = jest.fn();
      render(<Pagination currentPage={4} totalPages={5} onPageChange={handle} />);
      fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
      expect(handle).toHaveBeenCalledWith(3);
    });

    it('jumps to first page on First click', () => {
      const handle = jest.fn();
      render(<Pagination currentPage={4} totalPages={10} onPageChange={handle} />);
      fireEvent.click(screen.getByRole('button', { name: /first page/i }));
      expect(handle).toHaveBeenCalledWith(1);
    });

    it('jumps to last page on Last click', () => {
      const handle = jest.fn();
      render(<Pagination currentPage={4} totalPages={10} onPageChange={handle} />);
      fireEvent.click(screen.getByRole('button', { name: /last page/i }));
      expect(handle).toHaveBeenCalledWith(10);
    });

    it('disables Previous/First on the first page', () => {
      render(<Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />);
      expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /first page/i })).toBeDisabled();
    });

    it('disables Next/Last on the last page', () => {
      render(<Pagination currentPage={10} totalPages={10} onPageChange={() => {}} />);
      expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /last page/i })).toBeDisabled();
    });

    it('omits First/Last buttons when showFirstLast={false}', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={10}
          onPageChange={() => {}}
          showFirstLast={false}
        />,
      );
      expect(screen.queryByRole('button', { name: /first page/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /last page/i })).not.toBeInTheDocument();
      // Prev/Next remain.
      expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
    });

    it('emits a one-time console.warn on legacy `forwardRef` prop', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const dummyRef = { current: null };
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={() => {}}
          forwardRef={dummyRef}
        />,
      );
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('forwardRef'));
      warn.mockRestore();
    });
  });
});
