import React, { forwardRef, useEffect, useRef } from 'react';
import { TIFFViewer } from 'react-tiff';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import * as s from './gallery.styles';

// One-time deprecation warner — fires once per key, mirrors @m-next/input.
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

const propTypes = {
  /** Optional. Auto-generated when not provided. */
  id: PropTypes.string,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  loadingItemCount: PropTypes.number,
  size: PropTypes.number,
  items: PropTypes.arrayOf(
    PropTypes.exact({
      action: PropTypes.func,
      caption: PropTypes.string,
      id: PropTypes.string.isRequired,
      imageURL: PropTypes.string,
      tooltip: PropTypes.string,
    }),
  ),
};

/**
 * Gallery — thumbnail grid with optional caption + click action per item.
 * Supports TIFF previews via react-tiff. Loading state shows fading
 * placeholder thumbnails.
 */
const Gallery = forwardRef(function Gallery(props, ref) {
  const {
    id: idProp,
    disabled = false,
    isLoading = false,
    items = [],
    loadingItemCount = 4,
    size = 192,

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
    internalIdRef.current = `m-next-gallery-${++autoIdCounter}`;
  }
  const id = idProp || internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'gallery-forwardRef-prop',
      '@m-next/gallery: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // Chain modern ref + legacy forwardRef prop onto the rendered root element.
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

  const generateOpacities = (count) =>
    Array.from({ length: count }, (_, index) => 1 - (index + 1) / (count + 1));

  const handleClick = (item) => {
    if (item.action && !disabled) item.action();
  };

  return (
    <s.Gallery id={id} ref={setRef} {...rest}>
      {isLoading && (
        <s.Items size={size} isLoading={isLoading} id={`${id}-ITEMS`}>
          {generateOpacities(loadingItemCount).map((opacity, index) => (
            <s.Thumbnail key={opacity} opacity={opacity} id={`${id}-${index}-ITEM-IMAGE-EMPTY`}>
              <s.EmptyImage>
                <SvgIcon size={32} name='picture' />
              </s.EmptyImage>
              <figcaption>Loading...</figcaption>
            </s.Thumbnail>
          ))}
        </s.Items>
      )}
      {!isLoading && !!items.length && (
        <s.Items size={size} id={`${id}-ITEMS`}>
          {items.map((item) => (
            <s.Thumbnail
              key={item.id}
              showActionCursor={!!item.action && !disabled}
              onClick={() => handleClick(item)}
              id={`${id}-ITEM-${item.id}`}
            >
              {item.imageURL &&
                (['tif', 'tiff'].includes(item.imageURL.split('.').pop().toLowerCase()) ? (
                  <s.TiffContainer ariaLabel={`image: ${item.caption}`}>
                    <TIFFViewer tabIndex='-1' title={item.tooltip} tiff={item.imageURL} />
                  </s.TiffContainer>
                ) : (
                  <img
                    src={item.imageURL}
                    title={item.tooltip}
                    alt='no description available'
                    id={`${id}-ITEM-IMAGE-${item.id}`}
                  />
                ))}
              {!item.imageURL && (
                <s.EmptyImage title={item.tooltip} id={`${id}-ITEM-IMAGE-EMPTY`}>
                  <SvgIcon size={32} name='picture' />
                </s.EmptyImage>
              )}
              {item.caption && (
                <figcaption title={item.caption} id={`${id}-ITEM-CAPTION-${item.id}`}>
                  {item.caption}
                </figcaption>
              )}
            </s.Thumbnail>
          ))}
        </s.Items>
      )}
    </s.Gallery>
  );
});

Gallery.displayName = 'Gallery';
Gallery.propTypes = propTypes;
export default Gallery;
