/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ContentCard from './ContentCard';

expect.extend(matchers);

describe('ContentCard', () => {
  it('renders title and description', () => {
    render(<ContentCard id='test-card' title='Test Title' description='Test Description' buttonText='Click Me' />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('renders thumbnail image if provided', () => {
    render(
      <ContentCard
        id='test-card'
        title='Test Title'
        description='Test Description'
        thumbnail='https://example.com/image.jpg'
      />,
    );
    expect(screen.getByAltText('Test Title')).toBeInTheDocument();
  });
});
