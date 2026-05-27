import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AIHeader } from './AIHeader';

describe('AIHeader', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders with default title', () => {
    render(<AIHeader />);
    expect(screen.getByTestId('ai-header-powered-by')).toHaveTextContent('Powered by Method AI');
  });

  it('renders with custom title', () => {
    render(<AIHeader title='Custom AI' />);
    expect(screen.getByTestId('ai-header-powered-by')).toHaveTextContent('Powered by Custom AI');
  });

  it('applies custom className', () => {
    const { container } = render(<AIHeader className='custom-class' />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders sparkles icon', () => {
    render(<AIHeader />);
    const button = screen.getByTestId('ai-header-powered-by');
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('uses custom test ID', () => {
    render(<AIHeader data-testid='custom-header' />);
    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    expect(screen.getByTestId('custom-header-powered-by')).toBeInTheDocument();
  });
});
