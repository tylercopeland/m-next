import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PillTab from './PillTab';
import { PillTabOption } from './types';

const mockOptions: PillTabOption[] = [
  { value: 'plan', label: 'Plan' },
  { value: 'build', label: 'Build' },
];

describe('PillTab', () => {
  it('renders all options', () => {
    const handleChange = jest.fn();
    render(<PillTab options={mockOptions} value="plan" onChange={handleChange} />);
    
    expect(screen.getByText('Plan')).toBeInTheDocument();
    expect(screen.getByText('Build')).toBeInTheDocument();
  });

  it('highlights the selected option', () => {
    const handleChange = jest.fn();
    render(<PillTab options={mockOptions} value="plan" onChange={handleChange} />);
    
    const planButton = screen.getByTestId('pill-tab-option-plan');
    const buildButton = screen.getByTestId('pill-tab-option-build');
    
    expect(planButton).toHaveAttribute('aria-selected', 'true');
    expect(buildButton).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onChange when clicking an option', () => {
    const handleChange = jest.fn();
    render(<PillTab options={mockOptions} value="plan" onChange={handleChange} />);
    
    const buildButton = screen.getByText('Build');
    fireEvent.click(buildButton);
    
    expect(handleChange).toHaveBeenCalledWith('build');
  });

  it('does not call onChange when clicking a disabled option', () => {
    const disabledOptions: PillTabOption[] = [
      { value: 'plan', label: 'Plan' },
      { value: 'build', label: 'Build', disabled: true },
    ];
    
    const handleChange = jest.fn();
    render(<PillTab options={disabledOptions} value="plan" onChange={handleChange} />);
    
    const buildButton = screen.getByText('Build');
    fireEvent.click(buildButton);
    
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('renders with custom className and style', () => {
    const handleChange = jest.fn();
    render(
      <PillTab
        options={mockOptions}
        value="plan"
        onChange={handleChange}
        className="custom-class"
        style={{ marginTop: '10px' }}
        data-testid="custom-pill-tab"
      />
    );
    
    const container = screen.getByTestId('custom-pill-tab');
    expect(container).toHaveClass('custom-class');
    expect(container).toHaveStyle({ marginTop: '10px' });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      const handleChange = jest.fn();
      render(<PillTab options={mockOptions} value="plan" onChange={handleChange} />);
      
      const planButton = screen.getByTestId('pill-tab-option-plan');
      const buildButton = screen.getByTestId('pill-tab-option-build');
      
      expect(planButton).toHaveAttribute('role', 'tab');
      expect(planButton).toHaveAttribute('aria-selected', 'true');
      expect(buildButton).toHaveAttribute('role', 'tab');
      expect(buildButton).toHaveAttribute('aria-selected', 'false');
    });

    it('buttons are keyboard accessible', () => {
      const handleChange = jest.fn();
      render(<PillTab options={mockOptions} value="plan" onChange={handleChange} />);
      
      const buildButton = screen.getByText('Build');
      expect(buildButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Link functionality', () => {
    const linkOptions: PillTabOption[] = [
      { value: 'home', label: 'Home', href: '/home' },
      { value: 'about', label: 'About', href: '/about' },
    ];

    it('renders as anchor tag when href is provided', () => {
      const handleChange = jest.fn();
      render(<PillTab options={linkOptions} value="home" onChange={handleChange} />);
      
      const homeLink = screen.getByText('Home');
      expect(homeLink.tagName).toBe('A');
      expect(homeLink).toHaveAttribute('href', '/home');
    });

    it('renders with target and rel attributes', () => {
      const externalOptions: PillTabOption[] = [
        { 
          value: 'docs', 
          label: 'Docs', 
          href: 'https://example.com', 
          target: '_blank',
          rel: 'noopener noreferrer'
        },
      ];
      
      const handleChange = jest.fn();
      render(<PillTab options={externalOptions} value="docs" onChange={handleChange} />);
      
      const docsLink = screen.getByText('Docs');
      expect(docsLink).toHaveAttribute('target', '_blank');
      expect(docsLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('does not call onChange when link is clicked', () => {
      const handleChange = jest.fn();
      render(<PillTab options={linkOptions} value="home" onChange={handleChange} />);
      
      const aboutLink = screen.getByText('About');
      fireEvent.click(aboutLink);
      
      // onChange should not be called for links - browser handles navigation
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('supports mixed links and buttons', () => {
      const mixedOptions: PillTabOption[] = [
        { value: 'link', label: 'Link', href: '/link' },
        { value: 'button', label: 'Button' },
      ];
      
      const handleChange = jest.fn();
      render(<PillTab options={mixedOptions} value="link" onChange={handleChange} />);
      
      const link = screen.getByText('Link');
      const button = screen.getByText('Button');
      
      expect(link.tagName).toBe('A');
      expect(button.tagName).toBe('BUTTON');
    });

    it('disables link interaction when disabled', () => {
      const disabledLinkOptions: PillTabOption[] = [
        { value: 'home', label: 'Home', href: '/home', disabled: true },
      ];
      
      const handleChange = jest.fn();
      render(<PillTab options={disabledLinkOptions} value="home" onChange={handleChange} />);
      
      const homeLink = screen.getByText('Home');
      expect(homeLink).toHaveAttribute('aria-disabled', 'true');
    });
  });
});
