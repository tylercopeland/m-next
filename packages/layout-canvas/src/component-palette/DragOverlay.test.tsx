/**
 * Tests for DragOverlay component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('@m-next/styles', () => ({
  colors: {
    white: '#ffffff',
    blue: '#007bff',
    'grey-light': '#e0e0e0',
    'grey-darker': '#333333',
    'blue-lighter': '#e3f2fd',
  },
}));

jest.mock('@m-next/svg-icon', () => ({
  __esModule: true,
  default: ({ name, size, color }: { name: string; size: number; color: string }) => (
    <span data-testid='svg-icon' data-name={name} data-size={size} data-color={color}>
      {name}
    </span>
  ),
}));

jest.mock('@m-next/typeography', () => ({
  Header: ({ children, variant, bold }: { children: React.ReactNode; variant: string; bold: boolean }) => (
    <h6 data-testid='header' data-variant={variant} data-bold={bold}>
      {children}
    </h6>
  ),
}));

import { DragOverlay } from './DragOverlay';
import { SvgIconName } from '@m-next/svg-icon';

describe('DragOverlay', () => {
  const mockItem = {
    iconName: 'button-v4' as SvgIconName,
    name: 'Button',
    x: 100,
    y: 200,
    type: 'BTN',
  };

  describe('Rendering', () => {
    it('renders nothing when item is null', () => {
      const { container } = render(<DragOverlay item={null} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders overlay with icon and name when item is provided', () => {
      render(<DragOverlay item={mockItem} />);
      expect(screen.getByText('Button')).toBeInTheDocument();
      expect(screen.getByTestId('svg-icon')).toBeInTheDocument();
    });
  });

  describe('Header variant prop', () => {
    it('passes lowercase "h6" variant to Header (not uppercase "H6")', () => {
      render(<DragOverlay item={mockItem} />);
      const header = screen.getByTestId('header');
      expect(header.getAttribute('data-variant')).toBe('h6');
    });

    it('passes bold prop to Header', () => {
      render(<DragOverlay item={mockItem} />);
      const header = screen.getByTestId('header');
      expect(header.getAttribute('data-bold')).toBe('true');
    });
  });

  describe('Styling', () => {
    it('applies correct base styles to overlay container', () => {
      const { container } = render(<DragOverlay item={mockItem} />);
      const overlay = container.firstChild as HTMLElement;
      expect(overlay.style.position).toBe('fixed');
      expect(overlay.style.width).toBe('240px');
      expect(overlay.style.borderRadius).toBe('8px');
      expect(overlay.style.zIndex).toBe('300');
    });

    it('applies correct background color', () => {
      const { container } = render(<DragOverlay item={mockItem} />);
      const overlay = container.firstChild as HTMLElement;
      expect(overlay.style.backgroundColor).toBe('rgb(255, 255, 255)');
    });

    it('icon container has correct background color', () => {
      const { container } = render(<DragOverlay item={mockItem} />);
      const iconContainer = container.querySelector('[data-testid="svg-icon"]')?.parentElement as HTMLElement;
      expect(iconContainer.style.backgroundColor).toBe('rgb(227, 242, 253)');
    });
  });

  describe('Icon props', () => {
    it('passes correct icon name and color', () => {
      render(<DragOverlay item={mockItem} />);
      const icon = screen.getByTestId('svg-icon');
      expect(icon.getAttribute('data-name')).toBe('button-v4');
      expect(icon.getAttribute('data-color')).toBe('#007bff');
      expect(icon.getAttribute('data-size')).toBe('16');
    });
  });
});
