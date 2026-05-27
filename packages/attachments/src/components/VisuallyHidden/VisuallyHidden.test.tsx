import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden', () => {
  it('renders children content', () => {
    render(<VisuallyHidden>Hidden content</VisuallyHidden>);

    expect(screen.getByText('Hidden content')).toBeInTheDocument();
  });

  it('applies correct CSS styles for visual hiding', () => {
    render(<VisuallyHidden>Hidden content</VisuallyHidden>);

    const element = screen.getByText('Hidden content');
    expect(element).toHaveStyle({
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: '0',
    });
  });

  it('applies default className', () => {
    render(<VisuallyHidden>Hidden content</VisuallyHidden>);

    const element = screen.getByText('Hidden content');
    expect(element).toHaveClass('visually-hidden');
  });

  it('applies custom className', () => {
    render(<VisuallyHidden className='custom-class'>Hidden content</VisuallyHidden>);

    const element = screen.getByText('Hidden content');
    expect(element).toHaveClass('visually-hidden', 'custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<VisuallyHidden ref={ref}>Hidden content</VisuallyHidden>);

    expect(ref.current).toBeInTheDocument();
    expect(ref.current).toHaveTextContent('Hidden content');
  });

  it('forwards additional props', () => {
    render(
      <VisuallyHidden data-testid='test-element' aria-label='Test label'>
        Hidden content
      </VisuallyHidden>,
    );

    const element = screen.getByTestId('test-element');
    expect(element).toHaveAttribute('aria-label', 'Test label');
  });

  it('handles complex children', () => {
    render(
      <VisuallyHidden>
        <span>Complex</span>
        <span>content</span>
      </VisuallyHidden>,
    );

    expect(screen.getByText('Complex')).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('has correct displayName', () => {
    expect(VisuallyHidden.displayName).toBe('VisuallyHidden');
  });

  it('maintains style object reference', () => {
    const { rerender } = render(<VisuallyHidden>Hidden content</VisuallyHidden>);

    const element = screen.getByText('Hidden content');
    const initialStyle = element.style;

    rerender(<VisuallyHidden>Hidden content</VisuallyHidden>);

    expect(element.style).toBe(initialStyle);
  });
});
