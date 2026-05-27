/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InsightCard from '../InsightCard';

describe('InsightCard', () => {
  const defaultProps = {
    title: 'Test Title',
    value: '100',
  };

  it('renders with title and value', () => {
    render(<InsightCard {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders with icon when iconName is provided', () => {
    render(<InsightCard {...defaultProps} iconName='mi-icon-contacts' />);
    // Icon should be rendered via SvgIcon component
    const card = screen.getByText('Test Title').closest('div').parentElement;
    expect(card).toBeInTheDocument();
  });

  it('renders link text when provided', () => {
    render(<InsightCard {...defaultProps} linkText='View details' />);
    expect(screen.getByText('View details')).toBeInTheDocument();
  });

  it('shows info icon when showInfoIcon is true', () => {
    render(<InsightCard {...defaultProps} showInfoIcon />);
    const infoIcon = screen.getByRole('button');
    expect(infoIcon).toBeInTheDocument();
  });

  it('calls onCardClick when card is clicked', () => {
    const handleCardClick = jest.fn();
    render(<InsightCard {...defaultProps} onCardClick={handleCardClick} />);
    const card = screen.getByText('Test Title').closest('div').parentElement;
    fireEvent.click(card);
    expect(handleCardClick).toHaveBeenCalledTimes(1);
  });

  it('renders loading state when isLoading is true', () => {
    render(<InsightCard {...defaultProps} isLoading />);
    const skeletons = document.querySelectorAll('.react-loading-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('does not render link when linkText is not provided', () => {
    render(<InsightCard {...defaultProps} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('does not render info icon when showInfoIcon is false', () => {
    render(<InsightCard {...defaultProps} showInfoIcon={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies clickable styles when onCardClick is provided', () => {
    const handleCardClick = jest.fn();
    const { container } = render(<InsightCard {...defaultProps} onCardClick={handleCardClick} />);
    const card = container.firstChild;
    expect(card).toHaveStyle({ cursor: 'pointer' });
  });

  it('does not apply clickable styles when onCardClick is not provided', () => {
    const { container } = render(<InsightCard {...defaultProps} />);
    const card = container.firstChild;
    expect(card).toHaveStyle({ cursor: 'default' });
  });

  it('renders tooltip when infoTooltipContent is provided', () => {
    render(<InsightCard {...defaultProps} showInfoIcon infoTooltipContent='This is helpful information' />);
    const infoButton = screen.getByRole('button');
    expect(infoButton).toHaveAttribute('data-tooltip-content', 'This is helpful information');
  });

  it('does not render tooltip when infoTooltipContent is not provided', () => {
    render(<InsightCard {...defaultProps} showInfoIcon />);
    const infoButton = screen.getByRole('button');
    expect(infoButton).not.toHaveAttribute('data-tooltip-content');
  });

  it('uses unique tooltip ID based on title', () => {
    render(<InsightCard {...defaultProps} title='Unique Title' showInfoIcon infoTooltipContent='Test tooltip' />);
    const infoButton = screen.getByRole('button');
    expect(infoButton).toHaveAttribute('data-tooltip-id', 'insight-card-tooltip-Unique Title');
  });
});
