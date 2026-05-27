import React, { forwardRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as s from './Typeography.styles';

// types
const propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  gutterBottom: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  variant: PropTypes.oneOfType([
    PropTypes.oneOf(['body1', 'body2', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
    PropTypes.string,
  ]),
  bold: PropTypes.bool,
  fontSize: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge', 'xxlarge', 'mediumLarge']),
  style: PropTypes.instanceOf(Object),
  color: PropTypes.string,
  onClick: PropTypes.func,
  tooltip: PropTypes.string,
  tooltipId: PropTypes.string,
  tooltipPlace: PropTypes.string,
  tooltipHighlighting: PropTypes.bool,
  className: PropTypes.string,
  opacity: PropTypes.number,
  isMobile: PropTypes.bool,
  isV4: PropTypes.bool,
  ellipsis: PropTypes.bool,
};

const Typeography = forwardRef(
  (
    {
      id,
      children,
      gutterBottom = null,
      variant,
      bold = false,
      fontSize,
      style,
      color,
      onClick,
      tooltip,
      tooltipId,
      tooltipPlace,
      tooltipHighlighting,
      className,
      opacity = 1,
      isMobile = false,
      isV4 = false,
      ellipsis = false,
    },
    forwardedRef, // renamed for clarity
  ) => {
    // We combine both refs using a callback ref

    const commonProps = {
      id,
      style,
      onClick,
      gutterBottom,
      bold,
      fontSize,
      'data-tooltip-html': tooltip,
      'data-tooltip-id': tooltipId,
      'data-tooltip-place': tooltipPlace,
      'data-tooltip-position-strategy': tooltip ? 'fixed' : null,
      tooltipHighlighting,
      className,
      opacity,
      isMobile,
      isV4,
      ellipsis,
    };

    const elementRef = useRef(null);

    // Use useEffect to sync refs
    useEffect(() => {
      if (typeof forwardedRef === 'function') {
        forwardedRef(elementRef.current);
      } else if (forwardedRef) {
        // eslint-disable-next-line no-param-reassign
        forwardedRef.current = elementRef.current;
      }
    }, [forwardedRef]);

    useEffect(() => {
      if (!variant?.match(/^h[1-6]$/)) return;

      let currentElement = elementRef.current?.parentElement; // Since we are now present in DOM,
      while (currentElement) {
        // We can traverse our heritage seeking other headers.
        if (currentElement.tagName && /^H[1-6]$/.test(currentElement.tagName)) {
          // In the event that we catch somebody trying to render a header as a descendant of another header, we spit out a <div> instead.
          // eslint-disable-next-line no-console
          console.error(
            `Invalid heading structure: <${variant}> cannot be nested inside another heading element. ` +
              'Heading elements must not be nested to maintain valid HTML structure and accessibility.\n\n' +
              'Consider using a different variant like "div" or restructuring your heading hierarchy.',
          );
          return;
        }
        currentElement = currentElement.parentElement;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    switch (variant) {
      case 'body2':
        return (
          <s.Span {...commonProps} color={color} ref={elementRef}>
            {children}
          </s.Span>
        );
      case 'h1':
        return (
          <s.H1 {...commonProps} ref={elementRef}>
            {children}
          </s.H1>
        );
      case 'h2':
        return (
          <s.H2 {...commonProps} ref={elementRef}>
            {children}
          </s.H2>
        );
      case 'h3':
        return (
          <s.H3 {...commonProps} ref={elementRef}>
            {children}
          </s.H3>
        );
      case 'h4':
        return (
          <s.H4 {...commonProps} ref={elementRef}>
            {children}
          </s.H4>
        );
      case 'h5':
        return (
          <s.H5 {...commonProps} ref={elementRef}>
            {children}
          </s.H5>
        );
      case 'h6':
        return (
          <s.H6 {...commonProps} ref={elementRef}>
            {children}
          </s.H6>
        );
      case 'div':
        return (
          <s.Div {...commonProps} color={color} ref={elementRef}>
            {children}
          </s.Div>
        );
      default:
        return (
          <s.Paragraph {...commonProps} color={color} ref={elementRef}>
            {children}
          </s.Paragraph>
        );
    }
  },
);

Typeography.displayName = 'Typeography';
Typeography.propTypes = propTypes;
export default Typeography;
