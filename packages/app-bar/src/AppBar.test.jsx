/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppBar from './AppBar';

describe('@m-next/app-bar', () => {
  describe('AppBar root', () => {
    it('renders a <header> landmark with a default aria-label', () => {
      render(<AppBar>x</AppBar>);
      const header = screen.getByRole('banner', { name: /top navigation/i });
      expect(header).toBeInTheDocument();
    });

    it('honors a custom ariaLabel', () => {
      render(<AppBar ariaLabel='Workspace top bar'>x</AppBar>);
      expect(
        screen.getByRole('banner', { name: /workspace top bar/i }),
      ).toBeInTheDocument();
    });

    it('auto-generates an id when none is provided', () => {
      const { container } = render(<AppBar>x</AppBar>);
      const header = container.querySelector('header');
      expect(header.id).toMatch(/^m-next-app-bar-\d+$/);
    });

    it('uses the provided id when given', () => {
      const { container } = render(<AppBar id='top'>x</AppBar>);
      expect(container.querySelector('header').id).toBe('top');
    });

    it('emits a one-time console.warn on legacy `forwardRef` prop', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      render(<AppBar forwardRef={{ current: null }}>x</AppBar>);
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('forwardRef'),
      );
      warn.mockRestore();
    });
  });

  describe('AppBar slots', () => {
    it('renders Start / Center / End children', () => {
      render(
        <AppBar>
          <AppBar.Start>
            <span data-testid='start-child'>S</span>
          </AppBar.Start>
          <AppBar.Center>
            <span data-testid='center-child'>C</span>
          </AppBar.Center>
          <AppBar.End>
            <span data-testid='end-child'>E</span>
          </AppBar.End>
        </AppBar>,
      );
      expect(screen.getByTestId('start-child')).toBeInTheDocument();
      expect(screen.getByTestId('center-child')).toBeInTheDocument();
      expect(screen.getByTestId('end-child')).toBeInTheDocument();
    });

    it('does not require any slot to be present', () => {
      // Just End slot, no Start or Center.
      render(
        <AppBar>
          <AppBar.End>
            <span data-testid='only-end'>just end</span>
          </AppBar.End>
        </AppBar>,
      );
      expect(screen.getByTestId('only-end')).toBeInTheDocument();
    });
  });
});
