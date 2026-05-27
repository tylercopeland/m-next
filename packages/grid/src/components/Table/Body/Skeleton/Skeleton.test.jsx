/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import Skeleton from './Skeleton';

describe('Skeleton component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies default styles', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveStyle('height: 32px');
    expect(container.firstChild).toHaveStyle('border-radius: 4px');
    expect(container.firstChild).toHaveStyle('background-color: #eef5f7');
  });

  it('applies tall styles when tall prop is true', () => {
    const { container } = render(<Skeleton tall />);
    expect(container.firstChild).toHaveStyle('height: 32px');
    expect(container.firstChild).toHaveStyle('border-radius: 8px');
  });
});
