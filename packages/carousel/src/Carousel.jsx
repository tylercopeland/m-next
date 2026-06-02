import React, { forwardRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import MultiCarousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import * as s from './Carousel.styles';

// One-time deprecation warner — fires once per key, mirrors @m-next/sidebar.
const warnOnce = (() => {
  const seen = new Set();
  return (key, message) => {
    if (seen.has(key) || typeof console === 'undefined') return;
    seen.add(key);
    // eslint-disable-next-line no-console
    console.warn(message);
  };
})();

let autoIdCounter = 0;

// ============================================================================
// Internal chevron arrow buttons. These are implementation detail — consumers
// override behavior by passing a fully custom `leftArrow` / `rightArrow` node.
// The SVG paths are lifted directly from the original MethodUI carousel so
// the silhouette is identical.
// ============================================================================

const LeftArrow = ({ onClick, ...rest }) => (
  <s.ArrowButton
    type='button'
    onClick={onClick}
    onKeyUp={(ev) => {
      if (ev.key === 'Enter' && onClick) onClick();
    }}
    tabIndex='0'
    aria-label='Previous slide'
    {...rest}
    style={{ left: 24, ...(rest.style || {}) }}
  >
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M14.3711 19.2695C14.1575 19.4831 13.8112 19.4831 13.5977 19.2695L5.78129 11.4531C5.67963 11.3516 5.59898 11.231 5.54395 11.0983C5.48892 10.9656 5.4606 10.8234 5.4606 10.6797C5.4606 10.536 5.48892 10.3938 5.54395 10.261C5.59898 10.1283 5.67963 10.0078 5.78129 9.90625L13.5977 2.08986C13.8112 1.8763 14.1575 1.8763 14.3711 2.08986C14.5846 2.30343 14.5846 2.64969 14.3711 2.86326L6.55465 10.6797L14.3711 18.4961C14.5846 18.7097 14.5846 19.0559 14.3711 19.2695Z'
        fill='currentColor'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  </s.ArrowButton>
);

LeftArrow.propTypes = {
  onClick: PropTypes.func,
};

const RightArrow = ({ onClick, ...rest }) => (
  <s.ArrowButton
    type='button'
    onClick={onClick}
    onKeyUp={(ev) => {
      if (ev.key === 'Enter' && onClick) onClick();
    }}
    tabIndex='0'
    aria-label='Next slide'
    {...rest}
    style={{ right: 24, ...(rest.style || {}) }}
  >
    <svg width='21' height='21' viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M6.12893 2.06447C6.34249 1.8509 6.68876 1.8509 6.90232 2.06447L14.7187 9.88086C14.8204 9.98238 14.901 10.1029 14.9561 10.2357C15.0111 10.3684 15.0394 10.5106 15.0394 10.6543C15.0394 10.798 15.0111 10.9402 14.9561 11.0729C14.901 11.2057 14.8204 11.3262 14.7187 11.4277L6.90232 19.2441C6.68876 19.4577 6.34249 19.4577 6.12893 19.2441C5.91536 19.0306 5.91536 18.6843 6.12893 18.4707L13.9454 10.6543L6.12893 2.83787C5.91536 2.6243 5.91536 2.27804 6.12893 2.06447Z'
        fill='currentColor'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  </s.ArrowButton>
);

RightArrow.propTypes = {
  onClick: PropTypes.func,
};

// ============================================================================
// Carousel — root component
// ============================================================================

const defaultResponsive = {
  desktop: {
    breakpoint: { max: 3000, min: 0 },
    items: 1,
  },
};

const responsiveItemShape = PropTypes.shape({
  breakpoint: PropTypes.shape({
    max: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
  }).isRequired,
  items: PropTypes.number.isRequired,
  partialVisibilityGutter: PropTypes.number,
});

const carouselPropTypes = {
  /** Optional. Auto-generated when not provided. */
  id: PropTypes.string,
  children: PropTypes.node,
  /** CSS width applied to the outer shell. */
  width: PropTypes.string,
  /** CSS height applied to the outer shell. */
  height: PropTypes.string,
  /** Optional title shown centered above the slides. */
  title: PropTypes.string,
  /** Horizontal margin (px) applied to each slide's content wrapper. */
  sideMarginPX: PropTypes.number,
  /** Override the default chevron left arrow. */
  leftArrow: PropTypes.node,
  /** Override the default chevron right arrow. */
  rightArrow: PropTypes.node,
  /** react-multi-carousel breakpoint config. */
  responsive: PropTypes.objectOf(responsiveItemShape),
  /** className applied to each react-multi-carousel slide item. */
  itemClass: PropTypes.string,
  /** className applied to the react-multi-carousel container. */
  containerClass: PropTypes.string,
};

/**
 * Carousel — horizontal slide carousel built on react-multi-carousel.
 *
 *   <Carousel title='Featured apps'>
 *     <Card />
 *     <Card />
 *     <Card />
 *   </Carousel>
 *
 * Each child is wrapped in a centered flex container with `sideMarginPX`
 * horizontal margin. The default `responsive` config shows one item per
 * viewport from 0–3000px wide; pass a custom `responsive` map to render
 * multiple items at a breakpoint.
 *
 * Arrows are blue (`colors.blue.base`) chevron buttons with hover and
 * keyboard-focus states. Pass `leftArrow` / `rightArrow` to replace them
 * entirely — for most consumers the defaults are correct.
 */
const Carousel = forwardRef(function Carousel(props, ref) {
  const {
    id: idProp,
    children = null,
    width = '100%',
    height = '100%',
    title = '',
    sideMarginPX = 56,
    leftArrow,
    rightArrow,
    responsive = defaultResponsive,
    itemClass = '',
    containerClass = '',

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,
    hidden: _hidden,
    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-carousel-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'carousel-forwardRef-prop',
      '@m-next/carousel: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // Chain modern ref + legacy forwardRef prop onto the rendered root.
  const internalElRef = useRef(null);
  useEffect(() => {
    const assign = (target) => {
      if (!target) return;
      if (typeof target === 'function') {
        target(internalElRef.current);
      } else {
        // eslint-disable-next-line no-param-reassign
        target.current = internalElRef.current;
      }
    };
    assign(ref);
    assign(legacyForwardRef);
  }, [ref, legacyForwardRef]);

  const setRef = (node) => {
    internalElRef.current = node;
  };

  const resolvedLeftArrow = leftArrow ?? <LeftArrow />;
  const resolvedRightArrow = rightArrow ?? <RightArrow />;

  return (
    <s.CarouselShell
      ref={setRef}
      id={id}
      style={{ width, height }}
      {...rest}
    >
      {title && <s.CarouselTitle>{title}</s.CarouselTitle>}
      <MultiCarousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        customRightArrow={resolvedRightArrow}
        customLeftArrow={resolvedLeftArrow}
        centerMode={false}
        className=''
        containerClass={containerClass}
        dotListClass=''
        itemClass={itemClass}
        draggable
        focusOnSelect={false}
        infinite={false}
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={responsive}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots={false}
        sliderClass=''
        slidesToSlide={1}
        swipeable
      >
        {React.Children.toArray(children).map((child) => (
          <s.CarouselChildWrapper key={child.key} sideMarginPX={sideMarginPX}>
            {child}
          </s.CarouselChildWrapper>
        ))}
      </MultiCarousel>
    </s.CarouselShell>
  );
});

Carousel.displayName = 'Carousel';
Carousel.propTypes = carouselPropTypes;

export default Carousel;
