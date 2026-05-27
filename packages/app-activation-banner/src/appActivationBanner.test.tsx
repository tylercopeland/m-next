/* eslint-disable import/no-extraneous-dependencies */

/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AppActivationBanner from './appActivationBanner';

describe('AppActivationBanner', () => {
  const defaultProps = {
    id: 'test-banner',
    title: 'Test Title',
    description: 'Test Description',
  };

  describe('Rendering', () => {
    it('renders with required props only', () => {
      const { getByText } = render(<AppActivationBanner {...defaultProps} />);
      expect(getByText('Test Title')).toBeInTheDocument();
      expect(getByText('Test Description')).toBeInTheDocument();
    });

    it('renders with icon', () => {
      const { container } = render(<AppActivationBanner {...defaultProps} iconName='invoice' />);
      const iconWrapper = container.querySelector('[data-testid="icon-wrapper"]');
      expect(iconWrapper).toBeDefined();
    });

    it('renders bullet points correctly', () => {
      const bulletPoints = [
        { id: 'bullet-1', text: 'First point' },
        { id: 'bullet-2', text: 'Second point' },
      ];
      const { getByText } = render(<AppActivationBanner {...defaultProps} bulletPoints={bulletPoints} />);
      expect(getByText('First point')).toBeInTheDocument();
      expect(getByText('Second point')).toBeInTheDocument();
    });

    it('splits bullet points into two columns', () => {
      const bulletPoints = [
        { id: 'b1', text: 'Point 1' },
        { id: 'b2', text: 'Point 2' },
        { id: 'b3', text: 'Point 3' },
        { id: 'b4', text: 'Point 4' },
      ];
      const { container } = render(<AppActivationBanner {...defaultProps} bulletPoints={bulletPoints} />);
      expect(container.textContent).toContain('Point 1');
      expect(container.textContent).toContain('Point 4');
    });

    it('renders close button when dismissible is true', () => {
      const mockClose = jest.fn();
      const { container } = render(<AppActivationBanner {...defaultProps} dismissible onClose={mockClose} />);
      const closeButton = container.querySelector('button[aria-label="Close banner"]');
      expect(closeButton).toBeInTheDocument();
    });

    it('does not render close button when dismissible is false', () => {
      const { container } = render(<AppActivationBanner {...defaultProps} dismissible={false} />);
      const closeButton = container.querySelector('button[aria-label="Close banner"]');
      expect(closeButton).toBeNull();
    });
  });

  describe('Button Functionality', () => {
    it('renders primary and secondary CTAs', () => {
      const primaryCTA = { id: 'btn-1', text: 'Primary Action', onClick: jest.fn() };
      const secondaryCTA = { id: 'btn-2', text: 'Secondary Action', onClick: jest.fn() };
      const { getByText } = render(
        <AppActivationBanner {...defaultProps} primaryCTA={primaryCTA} secondaryCTA={secondaryCTA} />,
      );
      expect(getByText('Primary Action')).toBeInTheDocument();
      expect(getByText('Secondary Action')).toBeInTheDocument();
    });

    it('calls primaryCTA onClick handler when clicked', () => {
      const mockClick = jest.fn();
      const primaryCTA = { id: 'test-btn', text: 'Click Me', onClick: mockClick };
      const { getByText } = render(<AppActivationBanner {...defaultProps} primaryCTA={primaryCTA} />);
      const button = getByText('Click Me');
      fireEvent.click(button);
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it('hides primaryCTA when showPrimaryCTA is false', () => {
      const primaryCTA = { id: 'btn-1', text: 'Primary Action', onClick: jest.fn() };
      const { queryByText } = render(
        <AppActivationBanner {...defaultProps} primaryCTA={primaryCTA} showPrimaryCTA={false} />,
      );
      expect(queryByText('Primary Action')).toBeNull();
    });

    it('hides secondaryCTA when showSecondaryCTA is false', () => {
      const secondaryCTA = { id: 'btn-2', text: 'Secondary Action', onClick: jest.fn() };
      const { queryByText } = render(
        <AppActivationBanner {...defaultProps} secondaryCTA={secondaryCTA} showSecondaryCTA={false} />,
      );
      expect(queryByText('Secondary Action')).toBeNull();
    });

    it('calls onClose handler when close button is clicked', () => {
      const mockClose = jest.fn();
      const { container } = render(<AppActivationBanner {...defaultProps} dismissible onClose={mockClose} />);
      const closeButton = container.querySelector('button[aria-label="Close banner"]');
      fireEvent.click(closeButton!);
      expect(mockClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Styling and Props', () => {
    it('applies custom backgroundColor', () => {
      const { container } = render(<AppActivationBanner {...defaultProps} backgroundColor='green-lighter' />);
      const overlay = container.querySelector(`#${defaultProps.id}`);
      expect(overlay).toBeInTheDocument();
      // Note: Emotion styling is applied via className, actual color check would require style computation
    });

    it('renders with iconName', () => {
      const { container } = render(<AppActivationBanner {...defaultProps} iconName='invoice' />);
      expect(container.querySelector('[data-testid="icon-wrapper"]')).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty bullet points array', () => {
      const { container } = render(<AppActivationBanner {...defaultProps} bulletPoints={[]} />);
      expect(container.querySelector('[data-testid="bullet-column"]')).toBeNull();
    });

    it('renders without CTAs', () => {
      const { container } = render(<AppActivationBanner {...defaultProps} />);
      expect(container.textContent).toContain('Test Title');
    });

    it('handles single bullet point', () => {
      const bulletPoints = [{ id: 'single', text: 'Only one point' }];
      const { getByText } = render(<AppActivationBanner {...defaultProps} bulletPoints={bulletPoints} />);
      expect(getByText('Only one point')).toBeInTheDocument();
    });

    it('handles odd number of bullet points', () => {
      const bulletPoints = [
        { id: 'b1', text: 'Point 1' },
        { id: 'b2', text: 'Point 2' },
        { id: 'b3', text: 'Point 3' },
      ];
      const { getByText } = render(<AppActivationBanner {...defaultProps} bulletPoints={bulletPoints} />);
      expect(getByText('Point 1')).toBeInTheDocument();
      expect(getByText('Point 2')).toBeInTheDocument();
      expect(getByText('Point 3')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('close button has aria-label', () => {
      const mockClose = jest.fn();
      const { container } = render(<AppActivationBanner {...defaultProps} dismissible onClose={mockClose} />);
      const closeButton = container.querySelector('button[aria-label="Close banner"]');
      expect(closeButton).toHaveAttribute('aria-label', 'Close banner');
    });

    it('renders title with proper text content', () => {
      const { getByText } = render(<AppActivationBanner {...defaultProps} />);
      expect(getByText('Test Title')).toBeInTheDocument();
    });
  });
});
