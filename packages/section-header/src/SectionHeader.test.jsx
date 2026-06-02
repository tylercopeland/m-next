/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SectionHeader from './SectionHeader';

describe('@m-next/section-header', () => {
  it('renders the title as an <h3> when provided', () => {
    render(<SectionHeader title='Billing details' />);
    const heading = screen.getByRole('heading', { level: 3, name: /billing details/i });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H3');
  });

  it('renders the subTitle as a <p> when provided', () => {
    render(<SectionHeader subTitle='Used for invoicing.' />);
    const subtitle = screen.getByText(/used for invoicing\./i);
    expect(subtitle).toBeInTheDocument();
    expect(subtitle.tagName).toBe('P');
  });

  it('renders both title and subtitle when both are provided', () => {
    render(<SectionHeader title='Billing details' subTitle='Used for invoicing.' />);
    expect(screen.getByRole('heading', { level: 3, name: /billing details/i })).toBeInTheDocument();
    expect(screen.getByText(/used for invoicing\./i)).toBeInTheDocument();
  });

  it('omits the title when not provided', () => {
    render(<SectionHeader subTitle='Subtitle only' />);
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
  });

  it('omits the subtitle when not provided', () => {
    const { container } = render(<SectionHeader title='Title only' />);
    expect(container.querySelector('p')).not.toBeInTheDocument();
  });

  it('renders nothing inside the wrapper when neither prop is provided', () => {
    const { container } = render(<SectionHeader />);
    const wrapper = container.firstChild;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper.children.length).toBe(0);
  });

  it('accepts ReactNode children for title (not just strings)', () => {
    render(<SectionHeader title={<span data-testid='custom-title'>Custom</span>} />);
    expect(screen.getByTestId('custom-title')).toBeInTheDocument();
  });

  it('auto-generates an id when none is provided', () => {
    const { container } = render(<SectionHeader title='x' />);
    const wrapper = container.firstChild;
    expect(wrapper.id).toMatch(/^m-next-section-header-\d+$/);
  });

  it('uses the provided id when given', () => {
    const { container } = render(<SectionHeader id='billing-section' title='x' />);
    expect(container.firstChild.id).toBe('billing-section');
  });

  it('emits a one-time console.warn on legacy `forwardRef` prop', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const dummyRef = { current: null };
    render(<SectionHeader forwardRef={dummyRef} title='x' />);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('forwardRef'));
    warn.mockRestore();
  });

  it('passes the modern ref to the root wrapper', () => {
    const ref = React.createRef();
    render(<SectionHeader ref={ref} title='x' />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current.tagName).toBe('DIV');
  });
});
