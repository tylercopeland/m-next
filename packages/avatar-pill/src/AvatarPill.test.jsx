/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AvatarPill from './AvatarPill';

describe('@m-next/avatar-pill', () => {
  it('renders the label text', () => {
    render(<AvatarPill>Tyler Copeland</AvatarPill>);
    expect(screen.getByText('Tyler Copeland')).toBeInTheDocument();
  });

  it('accepts `label` as an alternative to children', () => {
    render(<AvatarPill label='Ben Robinson' />);
    expect(screen.getByText('Ben Robinson')).toBeInTheDocument();
  });

  it('auto-generates an id when none is provided', () => {
    const { container } = render(<AvatarPill>Tyler</AvatarPill>);
    const root = container.firstChild;
    expect(root.id).toMatch(/^m-next-avatar-pill-\d+$/);
  });

  it('uses the provided id when given', () => {
    const { container } = render(<AvatarPill id='owner-chip'>Tyler</AvatarPill>);
    expect(container.firstChild.id).toBe('owner-chip');
  });

  it('renders an avatar image when avatar={{src,alt}} is provided', () => {
    render(
      <AvatarPill avatar={{ src: '/me.jpg', alt: 'Tyler' }}>
        Tyler Copeland
      </AvatarPill>,
    );
    const img = screen.getByAltText('Tyler');
    expect(img).toBeInTheDocument();
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', '/me.jpg');
  });

  it('renders explicit initials when avatar={{initials}} is provided', () => {
    render(<AvatarPill avatar={{ initials: 'TC' }}>Some Other Name</AvatarPill>);
    expect(screen.getByText('TC')).toBeInTheDocument();
  });

  it('derives initials from the label when no avatar config is given', () => {
    render(<AvatarPill>Tyler Copeland</AvatarPill>);
    // First + last initial
    expect(screen.getByText('TC')).toBeInTheDocument();
  });

  it('uses a single-word label for the first two chars', () => {
    render(<AvatarPill>Tyler</AvatarPill>);
    expect(screen.getByText('TY')).toBeInTheDocument();
  });

  it('renders a passed ReactNode avatar as-is', () => {
    render(
      <AvatarPill avatar={<span data-testid='custom-avatar'>X</span>}>
        Whatever
      </AvatarPill>,
    );
    expect(screen.getByTestId('custom-avatar')).toBeInTheDocument();
  });

  it('renders a leadingIcon when provided', () => {
    render(
      <AvatarPill leadingIcon={<span data-testid='lead'>L</span>}>Tyler</AvatarPill>,
    );
    expect(screen.getByTestId('lead')).toBeInTheDocument();
  });

  it('renders a trailingIcon (interactive) as a button with the right aria-label', () => {
    const handleRemove = jest.fn();
    render(
      <AvatarPill
        onTrailingIconClick={handleRemove}
        trailingIconLabel='Remove Tyler'
      >
        Tyler
      </AvatarPill>,
    );
    const btn = screen.getByRole('button', { name: /remove tyler/i });
    fireEvent.click(btn);
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('stops the chip onClick from firing when the trailing button is clicked', () => {
    const handleChipClick = jest.fn();
    const handleRemove = jest.fn();
    render(
      <AvatarPill
        onClick={handleChipClick}
        onTrailingIconClick={handleRemove}
        trailingIconLabel='Remove'
      >
        Tyler
      </AvatarPill>,
    );
    fireEvent.click(screen.getByRole('button', { name: /remove/i }));
    expect(handleRemove).toHaveBeenCalledTimes(1);
    expect(handleChipClick).not.toHaveBeenCalled();
  });

  it('makes the chip a button-like affordance when onClick is provided', () => {
    const handle = jest.fn();
    render(<AvatarPill onClick={handle}>Tyler</AvatarPill>);
    // Outer wrapper carries role=button and is clickable.
    const chip = screen.getByRole('button', { name: /tyler/i });
    fireEvent.click(chip);
    expect(handle).toHaveBeenCalledTimes(1);
  });

  it('emits a one-time console.warn on legacy `forwardRef` prop', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const dummyRef = { current: null };
    render(<AvatarPill forwardRef={dummyRef}>Tyler</AvatarPill>);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('forwardRef'));
    warn.mockRestore();
  });

  it('emits a one-time console.warn on legacy `leadIcon` prop', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <AvatarPill leadIcon={<span data-testid='legacy-lead'>L</span>}>
        Tyler
      </AvatarPill>,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('leadIcon'));
    // The legacy node should still be rendered (soft-shimmed).
    expect(screen.getByTestId('legacy-lead')).toBeInTheDocument();
    warn.mockRestore();
  });

  it('falls back to a valid colorScheme when an invalid one is passed', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<AvatarPill colorScheme='neon'>Tyler</AvatarPill>);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('colorScheme'));
    warn.mockRestore();
  });

  it('ignores legacy ghost props silently (no crash, no warn)', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <AvatarPill
        isV4Design
        isMobile
        legacyClass='legacy'
        displayAuto
        compactStyle
      >
        Tyler
      </AvatarPill>,
    );
    expect(warn).not.toHaveBeenCalled();
    expect(screen.getByText('Tyler')).toBeInTheDocument();
    warn.mockRestore();
  });
});
