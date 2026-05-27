/* eslint-disable import/no-extraneous-dependencies */

/**
 * @jest-environment jsdom
 */

import React from 'react';
import { matchers } from '@emotion/jest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import matchMediaPolyfill from 'mq-polyfill';
import AppActivationOverlay, { type AppActivationOverlayProps } from './appActivationOverlay';

expect.extend(matchers);

const setUp = (props?: Partial<AppActivationOverlayProps>) => {
  const defaultProps: AppActivationOverlayProps = {
    title: 'Test Title',
    description: 'Test Description',
  };
  const utils = render(<AppActivationOverlay {...{ ...defaultProps, ...props }} />);
  const tree = utils.container;
  return {
    tree,
    ...utils,
  };
};

describe('AppActivationOverlay Component', () => {
  beforeEach(() => {
    delete window.ResizeObserver;
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));

    matchMediaPolyfill(window);
    window.resizeTo = function resizeTo(width, height) {
      Object.assign(this, {
        innerWidth: width,
        innerHeight: height,
        outerWidth: width,
        outerHeight: height,
      }).dispatchEvent(new this.Event('resize'));
    };
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    act(() => {
      window.resizeTo(1000, 1000);
    });
    jest.restoreAllMocks();
  });

  it('should render with default props', () => {
    setUp();
    expect(screen.getByTestId('overlay-backdrop')).toBeInTheDocument();
    expect(screen.getByTestId('banner-card')).toBeInTheDocument();
  });

  it('should render title and description', () => {
    setUp({
      title: 'Custom Title',
      description: 'Custom Description',
    });

    expect(screen.getByTestId('title')).toHaveTextContent('Custom Title');
    expect(screen.getByTestId('description')).toHaveTextContent('Custom Description');
  });

  it('should render icon when iconName is provided', () => {
    setUp({ iconName: 'check-V4' });
    expect(screen.getByTestId('icon-wrapper')).toBeInTheDocument();
  });

  it('should render section title when provided', () => {
    setUp({ sectionTitle: 'Why use this feature?' });
    expect(screen.getByTestId('section-title')).toHaveTextContent('Why use this feature?');
  });

  it('should render bullet points', () => {
    const bulletPoints = [
      { id: '1', text: 'First bullet point' },
      { id: '2', text: 'Second bullet point' },
    ];
    setUp({ bulletPoints });

    expect(screen.getByTestId('bullet-points')).toBeInTheDocument();
    expect(screen.getByText('First bullet point')).toBeInTheDocument();
    expect(screen.getByText('Second bullet point')).toBeInTheDocument();
  });

  it('should render primary CTA button and handle click', () => {
    const handleClick = jest.fn();
    const primaryCTA = {
      id: 'primary-btn',
      text: 'Primary Button',
      onClick: handleClick,
    };
    setUp({ primaryCTA, showPrimaryCTA: true });

    expect(screen.getByTestId('buttons-container')).toBeInTheDocument();
    const button = screen.getByText('Primary Button');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should render secondary CTA button and handle click', () => {
    const handleClick = jest.fn();
    const secondaryCTA = {
      id: 'secondary-btn',
      text: 'Secondary Button',
      onClick: handleClick,
    };
    setUp({ secondaryCTA, showSecondaryCTA: true });

    const button = screen.getByText('Secondary Button');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should render both CTAs when both are provided', () => {
    const primaryCTA = {
      id: 'primary-btn',
      text: 'Primary',
      onClick: jest.fn(),
    };
    const secondaryCTA = {
      id: 'secondary-btn',
      text: 'Secondary',
      onClick: jest.fn(),
    };
    setUp({ primaryCTA, secondaryCTA, showPrimaryCTA: true, showSecondaryCTA: true });

    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
  });

  it('should not render CTA button when showPrimaryCTA is false', () => {
    const primaryCTA = {
      id: 'primary-btn',
      text: 'Primary Button',
      onClick: jest.fn(),
    };
    setUp({ primaryCTA, showPrimaryCTA: false });

    expect(screen.queryByText('Primary Button')).not.toBeInTheDocument();
  });

  it('should render close button when dismissible is true and onClose is provided', () => {
    const handleClose = jest.fn();
    setUp({ dismissible: true, onClose: handleClose });

    const closeButton = screen.getByTestId('close-button');
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should not render close button when dismissible is false', () => {
    setUp({ dismissible: false, onClose: jest.fn() });
    expect(screen.queryByTestId('close-button')).not.toBeInTheDocument();
  });

  it('should not render close button when onClose is not provided', () => {
    setUp({ dismissible: true, onClose: undefined });
    expect(screen.queryByTestId('close-button')).not.toBeInTheDocument();
  });

  it('should render image element when provided', () => {
    const mockup = <div data-testid='custom-mockup'>Custom Mockup</div>;
    setUp({ image: mockup });

    expect(screen.getByTestId('mockup-content')).toBeInTheDocument();
    expect(screen.getByTestId('custom-mockup')).toHaveTextContent('Custom Mockup');
  });

  it('should have correct aria-label on close button', () => {
    setUp({ dismissible: true, onClose: jest.fn() });
    const closeButton = screen.getByTestId('close-button');
    expect(closeButton).toHaveAttribute('aria-label', 'Close overlay');
  });

  it('should use custom id when provided', () => {
    setUp({ id: 'custom-overlay' });
    expect(document.getElementById('custom-overlay')).toBeInTheDocument();
  });

  it('should not render secondary CTA when showSecondaryCTA is false', () => {
    const secondaryCTA = {
      id: 'secondary-btn',
      text: 'Secondary Button',
      onClick: jest.fn(),
    };
    setUp({ secondaryCTA, showSecondaryCTA: false });
    expect(screen.queryByText('Secondary Button')).not.toBeInTheDocument();
  });

  it('should apply mobile styles when viewport is narrow', () => {
    window.resizeTo(400, 800);
    const primaryCTA = { id: 'primary-btn', text: 'Mobile Button', onClick: jest.fn() };
    setUp({ primaryCTA, showPrimaryCTA: true });
    expect(screen.getByText('Mobile Button')).toBeInTheDocument();
  });

  it('should read platform-nav width for left offset', () => {
    const nav = document.createElement('div');
    nav.id = 'platform-nav';
    Object.defineProperty(nav, 'offsetWidth', { value: 240, configurable: true });
    document.body.appendChild(nav);

    setUp();
    const backdrop = screen.getByTestId('overlay-backdrop');
    expect(backdrop).toBeInTheDocument();

    document.body.removeChild(nav);
  });

  it('should not trap focus for non-Tab keys', () => {
    const onClose = jest.fn();
    setUp({ dismissible: true, onClose });
    const closeButton = screen.getByTestId('close-button');
    closeButton.focus();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.activeElement).toBe(closeButton);
  });

  it('should restore aria-hidden on the parent element when unmounted', () => {
    const nav = document.createElement('div');
    nav.id = 'platform-nav';
    const parent = document.createElement('div');
    parent.setAttribute('aria-hidden', 'true');
    parent.appendChild(nav);
    document.body.appendChild(parent);

    const { unmount } = setUp();
    unmount();

    expect(parent.getAttribute('aria-hidden')).toBe('true');
    document.body.removeChild(parent);
  });
});
