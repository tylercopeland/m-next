/**
 * Toggle component tests following SOLID:
 * - Single responsibility: each describe tests one concern (display, interaction, accessibility, snapshots).
 * - Dependency inversion: callbacks (onChange, onBlur, onFocus) are mocked; tests verify interface contract.
 */
import React from 'react';
import { matchers } from '@emotion/jest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Toggle from '../Toggle';
import type { ToggleProps } from '../types';

expect.extend(matchers);

const defaultProps: Pick<ToggleProps, 'id'> & Partial<ToggleProps> = {
  id: 'test',
  label: 'Passed',
};

function renderToggle(props: Partial<ToggleProps> = {}) {
  return render(<Toggle {...defaultProps} {...props} />);
}

describe('Toggle', () => {
  describe('Display (interface contract)', () => {
    it('displays label when provided', () => {
      renderToggle();
      expect(screen.getByText('Passed')).toBeInTheDocument();
    });

    it('renders with design-time wrapper and correct test id', () => {
      renderToggle();
      expect(screen.getByTestId('test-Toggle-wrapper')).toBeInTheDocument();
    });

    it('renders input with role switch and correct test id', () => {
      renderToggle();
      const input = screen.getByRole('switch', { name: '' });
      expect(input).toBe(screen.getByTestId('test-Toggle-input'));
      expect(input).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('Interaction (dependency inversion: mock callbacks)', () => {
    it('calls onChange with toggled value when clicked', () => {
      const onChange = jest.fn();
      renderToggle({ onChange });
      const input = screen.getByRole('switch', { name: '' });
      fireEvent.click(input);
      expect(onChange).toHaveBeenCalledWith(true);
      fireEvent.click(input);
      expect(onChange).toHaveBeenCalledWith(false);
    });

    it('calls onFocus when input receives focus', () => {
      const onFocus = jest.fn();
      renderToggle({ onFocus });
      const input = screen.getByTestId('test-Toggle-input');
      fireEvent.focus(input);
      expect(onFocus).toHaveBeenCalled();
    });

    it('calls onBlur when input loses focus', () => {
      const onBlur = jest.fn();
      renderToggle({ onBlur });
      const input = screen.getByTestId('test-Toggle-input');
      fireEvent.focus(input);
      fireEvent.blur(input);
      expect(onBlur).toHaveBeenCalled();
    });

    it('reflects controlled checked prop', () => {
      const { rerender } = renderToggle({ checked: false });
      expect(screen.getByTestId('test-Toggle-input')).toHaveAttribute('aria-checked', 'false');
      rerender(<Toggle {...defaultProps} checked />);
      expect(screen.getByTestId('test-Toggle-input')).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Accessibility and state', () => {
    it('applies disabled state to input', () => {
      renderToggle({ disabled: true });
      expect(screen.getByRole('switch', { name: '' })).toBeDisabled();
    });
  });

  describe('Visual state (style assertions)', () => {
    it('Circle has translateX(0px) when unchecked', () => {
      renderToggle({ checked: false });
      const input = screen.getByTestId('test-Toggle-input');
      const track = input.nextElementSibling;
      const circle = track!.querySelector('div');
      expect(circle).toHaveStyleRule('transform', 'translateX(0px)');
    });

    it('Circle has translateX(20px) when checked (medium)', () => {
      renderToggle({ checked: true, size: 'medium' });
      const input = screen.getByTestId('test-Toggle-input');
      const track = input.nextElementSibling;
      const circle = track!.querySelector('div');
      expect(circle).toHaveStyleRule('transform', 'translateX(20px)');
    });

    it('Circle has translateX(32px) when checked in runtime', () => {
      renderToggle({ checked: true, isRuntime: true });
      const input = screen.getByTestId('test-Toggle-input');
      const track = input.nextElementSibling;
      const circle = track!.querySelector('div');
      expect(circle).toHaveStyleRule('transform', 'translateX(32px)');
    });

    it('Circle background-color is #545F67 when unchecked and #0D71C8 when checked', () => {
      const { rerender } = renderToggle({ checked: false });
      const input = screen.getByTestId('test-Toggle-input');
      const track = input.nextElementSibling;
      const circle = track!.querySelector('div');
      expect(circle).toHaveStyleRule('background-color', '#545F67');

      rerender(<Toggle {...defaultProps} checked />);
      const inputAfter = screen.getByTestId('test-Toggle-input');
      const trackAfter = inputAfter.nextElementSibling;
      const circleAfter = trackAfter!.querySelector('div');
      expect(circleAfter).toHaveStyleRule('background-color', '#0D71C8');
    });

    it('Track background-color is #BACAD0 when unchecked and rgba(93,157,213,0.3) when checked', () => {
      const { rerender } = renderToggle({ checked: false });
      const input = screen.getByTestId('test-Toggle-input');
      const track = input.nextElementSibling;
      expect(track).toHaveStyleRule('background-color', '#BACAD0');

      rerender(<Toggle {...defaultProps} checked />);
      const inputAfter = screen.getByTestId('test-Toggle-input');
      const trackAfter = inputAfter.nextElementSibling;
      expect(trackAfter).toHaveStyleRule('background-color', 'rgba(93, 157, 213, 0.3)');
    });

    it('visual state updates after click interaction', () => {
      renderToggle({ checked: false });
      const input = screen.getByTestId('test-Toggle-input');
      const track = input.nextElementSibling;
      const circle = track!.querySelector('div');

      // Verify unchecked state
      expect(circle).toHaveStyleRule('transform', 'translateX(0px)');
      expect(circle).toHaveStyleRule('background-color', '#545F67');
      expect(track).toHaveStyleRule('background-color', '#BACAD0');

      // Click to toggle on
      fireEvent.click(input);

      // Re-query after state change triggers re-render
      const inputAfter = screen.getByTestId('test-Toggle-input');
      const trackAfter = inputAfter.nextElementSibling;
      const circleAfter = trackAfter!.querySelector('div');

      expect(circleAfter).toHaveStyleRule('transform', 'translateX(20px)');
      expect(circleAfter).toHaveStyleRule('background-color', '#0D71C8');
      expect(trackAfter).toHaveStyleRule('background-color', 'rgba(93, 157, 213, 0.3)');
    });
  });

  describe('Snapshots (visual regression)', () => {
    it('default and small size', () => {
      expect(render(<Toggle id='test' />).container).toMatchSnapshot();
      expect(render(<Toggle id='test' size='small' />).container).toMatchSnapshot();
    });

    it('checked variants', () => {
      expect(renderToggle({ checked: true }).container).toMatchSnapshot();
      expect(renderToggle({ checked: true, size: 'small' }).container).toMatchSnapshot();
      expect(renderToggle({ checked: true, isRuntime: true }).container).toMatchSnapshot();
    });

    it('disabled variants', () => {
      expect(renderToggle({ disabled: true }).container).toMatchSnapshot();
      expect(renderToggle({ disabled: true, size: 'small' }).container).toMatchSnapshot();
      expect(renderToggle({ disabled: true, isRuntime: true }).container).toMatchSnapshot();
    });

    it('bold variants', () => {
      expect(renderToggle({ bold: true }).container).toMatchSnapshot();
      expect(renderToggle({ bold: true, size: 'large' }).container).toMatchSnapshot();
      expect(renderToggle({ bold: true, isRuntime: true }).container).toMatchSnapshot();
    });

    it('textOpt runtime variants', () => {
      expect(renderToggle({ textOpt: 'Yes/No', checked: true, isRuntime: true }).container).toMatchSnapshot();
      expect(renderToggle({ textOpt: 'Yes/No', checked: false, isRuntime: true }).container).toMatchSnapshot();
      expect(renderToggle({ textOpt: 'On/Off', checked: true, isRuntime: true }).container).toMatchSnapshot();
      expect(renderToggle({ textOpt: 'On/Off', checked: false, isRuntime: true }).container).toMatchSnapshot();
    });
  });
});
