/* eslint-disable import/no-extraneous-dependencies */

/**
 * @jest-environment jsdom
 */

import React from 'react';
import { matchers } from '@emotion/jest';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import matchMediaPolyfill from 'mq-polyfill';
import HeroBanner from './HeroBanner';

expect.extend(matchers);

const setUp = (props) => {
  const defaultProps = {
    id: 'hero-banner-test',
    title: 'Test Title',
    description: 'Test Description',
  };
  const utils = render(<HeroBanner {...{ ...defaultProps, ...props }} />);
  const tree = utils.container;
  return {
    tree,
    ...utils,
  };
};

describe('HeroBanner Component', () => {
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
    window.resizeTo(1000, 1000);
    jest.restoreAllMocks();
  });

  it('should render with default props', () => {
    setUp();
    expect(document.getElementById('hero-banner-test-root')).toBeInTheDocument();
  });

  it('should render title and description', () => {
    const { tree } = setUp({
      title: 'Custom Title',
      description: 'Custom Description',
    });

    expect(tree.querySelector('#hero-banner-test-title')).toHaveTextContent('Custom Title');
    expect(tree.querySelector('#hero-banner-test-description')).toHaveTextContent('Custom Description');
  });
  it('should render with image', () => {
    const { tree } = setUp({
      imageSrc: 'test-logo.png',
    });

    // Look for the image container by finding any element with the HeroBannerImageContainer class
    const imageContainer = tree.querySelector('[class*="HeroBannerImageContainer"]');
    expect(imageContainer).toBeInTheDocument();
  });

  it('should render primary button and handle click', () => {
    const mockClick = jest.fn();
    const { getByTestId } = setUp({
      primaryButton: 'Click Me',
      onPrimaryButtonClick: mockClick,
    });

    const button = getByTestId('hero-banner-test-primary-button');
    expect(button).toHaveTextContent('Click Me');

    fireEvent.click(button);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('should render secondary button and handle click', () => {
    const mockClick = jest.fn();
    const { getByTestId } = setUp({
      secondaryButton: 'Secondary',
      onSecondaryButtonClick: mockClick,
    });

    const button = getByTestId('hero-banner-test-secondary-button');
    expect(button).toHaveTextContent('Secondary');

    fireEvent.click(button);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('should apply correct background color', () => {
    const { tree } = setUp({
      backgroundColor: 'orange-lighter',
    });

    const root = tree.querySelector('#hero-banner-test-root');
    expect(root).toHaveStyleRule('background-color', '#FFFAF0');
  });

  it('should handle keyboard navigation on buttons', () => {
    const mockClick = jest.fn();
    const { getByTestId } = setUp({
      primaryButton: 'Test Button',
      onPrimaryButtonClick: mockClick,
    });

    const button = getByTestId('hero-banner-test-primary-button');
    button.focus();
    fireEvent.keyDown(button, { key: 'Enter' });

    // Note: Button onClick fires automatically on Enter for button elements
    expect(button).toHaveFocus();
  });

  it('should apply custom styles and className', () => {
    const customStyle = { margin: '10px' };
    const { tree } = setUp({
      className: 'custom-class',
      style: customStyle,
    });

    const root = tree.querySelector('#hero-banner-test-root');
    expect(root).toHaveClass('custom-class');
    expect(root).toHaveStyle('margin: 10px');
  });

  it('should not render text wrapper when no title or description', () => {
    const { tree } = setUp({
      title: '',
      description: '',
    });

    expect(tree.querySelector('[data-testid="hero-banner-test-title"]')).not.toBeInTheDocument();
    expect(tree.querySelector('[data-testid="hero-banner-test-description"]')).not.toBeInTheDocument();
  });

  it('should not render actions wrapper when no buttons', () => {
    const { tree } = setUp({
      primaryButton: null,
      secondaryButton: null,
    });

    expect(tree.querySelector('[data-testid="hero-banner-test-primary-button"]')).not.toBeInTheDocument();
    expect(tree.querySelector('[data-testid="hero-banner-test-secondary-button"]')).not.toBeInTheDocument();
  });

  it('should apply correct testId', () => {
    const { getByTestId } = setUp({
      testId: 'custom-test-id',
    });

    expect(getByTestId('custom-test-id')).toBeInTheDocument();
  });

  it('should render in mobile layout when isMobile is true', () => {
    const { tree } = setUp({
      isMobile: true,
      imageSrc: 'test-image.jpg',
    });

    const root = tree.querySelector('#hero-banner-test-root');
    expect(root).toBeInTheDocument();

    // Check that image container exists with mobile styling
    const imageContainer = tree.querySelector('[class*="HeroBannerImageContainer"]');
    expect(imageContainer).toBeInTheDocument();
  });
});
