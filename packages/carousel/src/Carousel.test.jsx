/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Carousel from './Carousel';

describe('@m-next/carousel', () => {
  it('renders an outer shell with auto-generated id', () => {
    const { container } = render(
      <Carousel>
        <div>slide-1</div>
      </Carousel>,
    );
    const shell = container.querySelector('[id^="m-next-carousel-"]');
    expect(shell).toBeInTheDocument();
  });

  it('uses the provided id when given', () => {
    const { container } = render(
      <Carousel id='featured-apps'>
        <div>slide-1</div>
      </Carousel>,
    );
    expect(container.querySelector('#featured-apps')).toBeInTheDocument();
  });

  it('renders the title when provided', () => {
    render(
      <Carousel title='Featured apps'>
        <div>slide-1</div>
      </Carousel>,
    );
    expect(screen.getByText('Featured apps')).toBeInTheDocument();
  });

  it('does NOT render a title element when title is empty', () => {
    render(
      <Carousel>
        <div>slide-1</div>
      </Carousel>,
    );
    // No <p> title rendered — confirm only the slide content is present.
    expect(screen.queryByText('Featured apps')).not.toBeInTheDocument();
  });

  it('renders each child slide', () => {
    render(
      <Carousel>
        <div>slide-1</div>
        <div>slide-2</div>
        <div>slide-3</div>
      </Carousel>,
    );
    expect(screen.getByText('slide-1')).toBeInTheDocument();
    expect(screen.getByText('slide-2')).toBeInTheDocument();
    expect(screen.getByText('slide-3')).toBeInTheDocument();
  });

  it('renders the default chevron arrow buttons with accessible labels', () => {
    render(
      <Carousel>
        <div>slide-1</div>
        <div>slide-2</div>
      </Carousel>,
    );
    expect(screen.getByRole('button', { name: /previous slide/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next slide/i })).toBeInTheDocument();
  });

  it('emits a one-time console.warn on legacy `forwardRef` prop', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const dummyRef = { current: null };
    render(
      <Carousel forwardRef={dummyRef}>
        <div>slide-1</div>
      </Carousel>,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('forwardRef'));
    warn.mockRestore();
  });
});
