/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from './Sidebar';

describe('@m-next/sidebar', () => {
  describe('Sidebar root', () => {
    it('renders an <aside> landmark with a default aria-label', () => {
      render(<Sidebar>content</Sidebar>);
      const aside = screen.getByRole('complementary', { name: /sidebar navigation/i });
      expect(aside).toBeInTheDocument();
    });

    it('honors a custom ariaLabel', () => {
      render(<Sidebar ariaLabel='Customer workspace nav'>content</Sidebar>);
      expect(
        screen.getByRole('complementary', { name: /customer workspace nav/i }),
      ).toBeInTheDocument();
    });

    it('auto-generates an id when none is provided', () => {
      const { container } = render(<Sidebar>x</Sidebar>);
      const aside = container.querySelector('aside');
      expect(aside.id).toMatch(/^m-next-sidebar-\d+$/);
    });

    it('uses the provided id when given', () => {
      const { container } = render(<Sidebar id='workspace-nav'>x</Sidebar>);
      expect(container.querySelector('aside').id).toBe('workspace-nav');
    });

    it('emits a one-time console.warn on legacy `forwardRef` prop', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const dummyRef = { current: null };
      render(<Sidebar forwardRef={dummyRef}>x</Sidebar>);
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('forwardRef'),
      );
      warn.mockRestore();
    });
  });

  describe('Sidebar.Group', () => {
    it('renders a non-collapsible group with a static title', () => {
      render(
        <Sidebar>
          <Sidebar.Group title='Workspace'>
            <Sidebar.Item>Dashboard</Sidebar.Item>
          </Sidebar.Group>
        </Sidebar>,
      );
      expect(screen.getByText('Workspace')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('renders a collapsible group with an expanded body by default', () => {
      render(
        <Sidebar>
          <Sidebar.Group title='Tools' collapsible>
            <Sidebar.Item>Builder</Sidebar.Item>
          </Sidebar.Group>
        </Sidebar>,
      );
      const header = screen.getByRole('button', { name: /tools/i });
      expect(header).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Builder')).toBeInTheDocument();
    });

    it('collapses on header click and re-expands on second click', () => {
      render(
        <Sidebar>
          <Sidebar.Group title='Tools' collapsible>
            <Sidebar.Item>Builder</Sidebar.Item>
          </Sidebar.Group>
        </Sidebar>,
      );
      const header = screen.getByRole('button', { name: /tools/i });

      fireEvent.click(header);
      expect(header).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Builder')).not.toBeInTheDocument();

      fireEvent.click(header);
      expect(header).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Builder')).toBeInTheDocument();
    });

    it('honors controlled `expanded` and calls onExpandedChange', () => {
      const handleChange = jest.fn();
      const { rerender } = render(
        <Sidebar>
          <Sidebar.Group
            title='Tools'
            collapsible
            expanded={false}
            onExpandedChange={handleChange}
          >
            <Sidebar.Item>Builder</Sidebar.Item>
          </Sidebar.Group>
        </Sidebar>,
      );
      const header = screen.getByRole('button', { name: /tools/i });
      expect(header).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Builder')).not.toBeInTheDocument();

      fireEvent.click(header);
      expect(handleChange).toHaveBeenCalledWith(true);
      // Internal state should NOT have changed (controlled mode).
      expect(header).toHaveAttribute('aria-expanded', 'false');

      rerender(
        <Sidebar>
          <Sidebar.Group
            title='Tools'
            collapsible
            expanded
            onExpandedChange={handleChange}
          >
            <Sidebar.Item>Builder</Sidebar.Item>
          </Sidebar.Group>
        </Sidebar>,
      );
      expect(header).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Builder')).toBeInTheDocument();
    });
  });

  describe('Sidebar.Item', () => {
    it('renders as a button by default', () => {
      render(
        <Sidebar>
          <Sidebar.Item>Dashboard</Sidebar.Item>
        </Sidebar>,
      );
      const btn = screen.getByRole('button', { name: /dashboard/i });
      expect(btn.tagName).toBe('BUTTON');
      expect(btn).toHaveAttribute('type', 'button');
    });

    it('renders as <a> when href is provided', () => {
      render(
        <Sidebar>
          <Sidebar.Item href='/dashboard'>Dashboard</Sidebar.Item>
        </Sidebar>,
      );
      const link = screen.getByRole('link', { name: /dashboard/i });
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/dashboard');
    });

    it('respects an explicit `as` override', () => {
      render(
        <Sidebar>
          <Sidebar.Item as='a' href='/foo'>
            Foo
          </Sidebar.Item>
        </Sidebar>,
      );
      const link = screen.getByRole('link', { name: /foo/i });
      expect(link.tagName).toBe('A');
    });

    it('sets aria-current="page" when active', () => {
      render(
        <Sidebar>
          <Sidebar.Item active>Dashboard</Sidebar.Item>
        </Sidebar>,
      );
      const btn = screen.getByRole('button', { name: /dashboard/i });
      expect(btn).toHaveAttribute('aria-current', 'page');
    });

    it('fires onClick when clicked', () => {
      const handle = jest.fn();
      render(
        <Sidebar>
          <Sidebar.Item onClick={handle}>Dashboard</Sidebar.Item>
        </Sidebar>,
      );
      fireEvent.click(screen.getByRole('button', { name: /dashboard/i }));
      expect(handle).toHaveBeenCalledTimes(1);
    });

    it('does NOT fire onClick when disabled', () => {
      const handle = jest.fn();
      render(
        <Sidebar>
          <Sidebar.Item onClick={handle} disabled>
            Dashboard
          </Sidebar.Item>
        </Sidebar>,
      );
      fireEvent.click(screen.getByRole('button', { name: /dashboard/i }));
      expect(handle).not.toHaveBeenCalled();
    });

    it('renders an icon and badge when provided', () => {
      render(
        <Sidebar>
          <Sidebar.Item icon={<span data-testid='icon'>★</span>} badge='3'>
            Customers
          </Sidebar.Item>
        </Sidebar>,
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('Sidebar.Divider', () => {
    it('renders a horizontal separator', () => {
      render(
        <Sidebar>
          <Sidebar.Item>Home</Sidebar.Item>
          <Sidebar.Divider />
          <Sidebar.Item>Settings</Sidebar.Item>
        </Sidebar>,
      );
      const sep = screen.getByRole('separator');
      expect(sep).toBeInTheDocument();
      expect(sep).toHaveAttribute('aria-orientation', 'horizontal');
    });
  });
});
