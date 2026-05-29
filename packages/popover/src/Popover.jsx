import React, { forwardRef, useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { HTMLElementType } from '@m-next/types';
import { ClickOutside, ownerDocument, ownerWindow } from '@m-next/utilities';
import Container from '@m-next/container';
import { colors } from '@m-next/tokens';

// One-time deprecation warner — fires once per key, mirrors @m-next/input / @m-next/dialog.
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

// Match any focusable element inside the popover. Used for focus trap.
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

const collectFocusable = (root) => {
  if (!root) return [];
  return Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => {
    if (el.hasAttribute('disabled')) return false;
    if (el.getAttribute('aria-hidden') === 'true') return false;
    if (el.offsetParent === null && el.tagName !== 'BODY') return false;
    return true;
  });
};

export function getOffsetTop(rect, vertical, marginVertical) {
  let offset = 0;

  if (typeof vertical === 'number') {
    offset = vertical + marginVertical;
  } else if (vertical === 'center') {
    offset = rect.height / 2 + marginVertical;
  } else if (vertical === 'bottom') {
    offset = rect.height + marginVertical;
  }

  return offset;
}

export function getOffsetLeft(rect, horizontal, marginHorizontal) {
  let offset = 0;
  if (typeof horizontal === 'number') {
    offset = horizontal + marginHorizontal;
  } else if (horizontal === 'center') {
    offset = rect.width / 2;
  } else if (horizontal === 'right') {
    offset = rect.width + marginHorizontal;
  }
  return offset;
}

function getTransformOriginValue(transformOrigin) {
  return [transformOrigin.horizontal, transformOrigin.vertical]
    .map((n) => (typeof n === 'number' ? `${n}px` : n))
    .join(' ');
}

function resolveAnchorEl(anchorEl) {
  if (typeof anchorEl === 'string') {
    return document.getElementById(anchorEl);
  }

  if (typeof anchorEl === 'function') {
    return anchorEl();
  }

  return anchorEl;
}

// types
const propTypes = {
  id: PropTypes.string,
  anchorOrigin: PropTypes.shape({
    vertical: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    horizontal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  anchorPosition: PropTypes.string,
  anchorReference: PropTypes.string,
  anchorEl: PropTypes.oneOfType([HTMLElementType, PropTypes.object, PropTypes.func, PropTypes.string]),
  relativeToParent: PropTypes.bool,
  children: PropTypes.node,
  open: PropTypes.bool,
  transformOrigin: PropTypes.shape({
    vertical: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    horizontal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  marginThreshold: PropTypes.number,
  style: PropTypes.instanceOf(Object),
  className: PropTypes.string,
  height: PropTypes.number,
  onClose: PropTypes.func,
  marginHorizontal: PropTypes.number,
  marginVertical: PropTypes.number,
  inline: PropTypes.bool,
  disableClickOutside: PropTypes.bool,
  shiftLeft: PropTypes.number,
  shiftDown: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  skipShifting: PropTypes.bool,
  closeOnEsc: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  trapFocus: PropTypes.bool,
  modal: PropTypes.bool,
};

const Popover = forwardRef(function Popover(props, ref) {
  const {
    id: idProp,
    anchorOrigin = {
      vertical: 'top',
      horizontal: 'left',
    },
    anchorPosition,
    anchorReference = 'anchorEl',
    anchorEl,
    relativeToParent,
    children,
    className,
    open,
    transformOrigin = {
      vertical: 'top',
      horizontal: 'left',
    },
    marginThreshold = 16,
    style = null,
    height,
    onClose,
    marginVertical = 0,
    marginHorizontal = 0,
    inline = false,
    disableClickOutside,
    shiftLeft = 0,
    shiftDown = 0,
    width = 'auto',
    skipShifting = false,

    // Clean modal / a11y API additions (opt-in, default off for back-compat).
    closeOnEsc = true,
    closeOnOverlayClick: closeOnOverlayClickProp,
    trapFocus = false,
    modal = false,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,
    triggerRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,

    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-popover-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  if (legacyForwardRef) {
    warnOnce(
      'popover-forwardRef-prop',
      '@m-next/popover: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // `triggerRef` was an alias some callsites used for `anchorEl`. If anchorEl
  // is missing but triggerRef is supplied, treat the ref's current as anchor.
  let effectiveAnchorEl = anchorEl;
  if (!effectiveAnchorEl && triggerRef) {
    warnOnce(
      'popover-triggerRef-prop',
      '@m-next/popover: `triggerRef` is deprecated. Pass the element (or a ref/string) via `anchorEl`.',
    );
    effectiveAnchorEl = triggerRef.current ?? triggerRef;
  }

  // disableClickOutside is the inverse of closeOnOverlayClick — newer API.
  const closeOnOverlayClick =
    closeOnOverlayClickProp !== undefined ? closeOnOverlayClickProp : !disableClickOutside;

  const paperRef = useRef();

  // Expose paperRef to forwarded ref (React forwardRef API + legacy forwardRef prop).
  useEffect(() => {
    const targetRef = ref ?? legacyForwardRef;
    if (!targetRef) return;
    if (typeof targetRef === 'function') {
      targetRef(paperRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      targetRef.current = paperRef.current;
    }
  }, [ref, legacyForwardRef, open]);

  // Returns the top/left offset of the position
  // to attach to on the anchor element (or body if none is provided)
  const getAnchorOffset = useCallback(() => {
    if (anchorReference === 'anchorPosition') {
      if (process.env.NODE_ENV !== 'production') {
        if (!anchorPosition) {
          // eslint-disable-next-line no-console
          console.error(
            'You need to provide a `anchorPosition` prop when using <Popover anchorReference="anchorPosition" />.',
          );
        }
      }
      return anchorPosition;
    }

    const resolvedAnchorEl = resolveAnchorEl(effectiveAnchorEl);
    // If an anchor element wasn't provided, just use the parent body element of this Popover
    const anchorElement =
      resolvedAnchorEl && resolvedAnchorEl.nodeType === 1 ? resolvedAnchorEl : ownerDocument(paperRef.current).body;
    const anchorRect = anchorElement?.getBoundingClientRect();

    if (relativeToParent && inline && anchorElement && anchorElement.offsetParent) {
      const parentBox = anchorElement.offsetParent.getBoundingClientRect();
      return {
        top: anchorRect.top - parentBox.top + getOffsetTop(anchorRect, anchorOrigin.vertical, marginVertical, inline),
        left:
          anchorRect.left -
          parentBox.left +
          getOffsetLeft(anchorRect, anchorOrigin.horizontal, marginHorizontal, inline) +
          marginHorizontal,
      };
    }
    return {
      top: anchorRect.top + getOffsetTop(anchorRect, anchorOrigin.vertical, marginVertical, inline),
      left:
        anchorRect.left +
        getOffsetLeft(anchorRect, anchorOrigin.horizontal, marginHorizontal, inline) +
        marginHorizontal,
    };
  }, [
    anchorReference,
    effectiveAnchorEl,
    relativeToParent,
    inline,
    anchorOrigin.vertical,
    anchorOrigin.horizontal,
    marginVertical,
    marginHorizontal,
    anchorPosition,
  ]);

  // Returns the base transform origin using the element
  const getTransformOrigin = useCallback(
    (elemRect) => ({
      vertical: getOffsetTop(elemRect, transformOrigin.vertical, marginVertical, inline),
      horizontal: getOffsetLeft(elemRect, transformOrigin.horizontal, marginHorizontal, inline),
    }),
    [transformOrigin.vertical, transformOrigin.horizontal, marginVertical, marginHorizontal, inline],
  );

  const getPositioningStyle = useCallback(
    (element) => {
      const elemRect = {
        width: element.offsetWidth,
        height: element.offsetHeight,
      };

      // Get the transform origin point on the element itself
      const elemTransformOrigin = getTransformOrigin(elemRect);

      if (anchorReference === 'none') {
        return {
          top: null,
          left: null,
          transformOrigin: getTransformOriginValue(elemTransformOrigin),
        };
      }

      // Get the offset of the anchoring element
      const anchorOffset = getAnchorOffset();

      // Calculate element positioning
      let top = anchorOffset.top - elemTransformOrigin.vertical;
      let left = anchorOffset.left - elemTransformOrigin.horizontal;
      const bottom = top + elemRect.height;
      const right = left + elemRect.width;

      // Use the parent window of the anchorEl if provided
      const containerWindow = ownerWindow(resolveAnchorEl(effectiveAnchorEl));

      // Window thresholds taking required margin into account
      const heightThreshold = containerWindow.innerHeight - marginThreshold;
      const widthThreshold = containerWindow.innerWidth - marginThreshold;

      // Check if the vertical axis needs shifting
      if (!skipShifting) {
        if (top < marginThreshold) {
          const diff = top - marginThreshold;
          top -= diff;
          elemTransformOrigin.vertical += diff;
        } else if (bottom > heightThreshold) {
          const diff = bottom - heightThreshold;
          top -= diff;
          elemTransformOrigin.vertical += diff;
        }
      }

      if (process.env.NODE_ENV !== 'production') {
        if (elemRect.height > heightThreshold && elemRect.height && heightThreshold) {
          // eslint-disable-next-line no-console
          console.error(
            [
              'MUI: The popover component is too tall.',
              `Some part of it can not be seen on the screen (${elemRect.height - heightThreshold}px).`,
              'Please consider adding a `max-height` to improve the user-experience.',
            ].join('\n'),
          );
        }
      }

      // Check if the horizontal axis needs shifting
      if (left < marginThreshold) {
        const diff = left - marginThreshold;
        left -= diff;
        elemTransformOrigin.horizontal += diff;
      } else if (right > widthThreshold) {
        const diff = right - widthThreshold;
        left -= diff;
        elemTransformOrigin.horizontal += diff;
      }

      left -= shiftLeft; // shift left by the given amount
      top += shiftDown; // shift down by the given amount

      return {
        top: `${Math.round(top)}px`,
        left: `${Math.round(left)}px`,
        transformOrigin: getTransformOriginValue(elemTransformOrigin),
      };
    },
    [
      effectiveAnchorEl,
      anchorReference,
      getAnchorOffset,
      getTransformOrigin,
      marginThreshold,
      shiftLeft,
      shiftDown,
      skipShifting,
    ],
  );

  const [, setIsPositioned] = useState(open);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleTimeout, setIsVisibleTimeout] = useState(null);

  const setPositioningStyles = useCallback(() => {
    const element = paperRef.current;

    if (!element) {
      return;
    }

    const positioning = getPositioningStyle(element);

    if (positioning.top !== null) {
      element.style.top = positioning.top;
    }
    if (positioning.left !== null) {
      element.style.left = positioning.left;
    }
    element.style.transformOrigin = positioning.transformOrigin;
    setIsPositioned(true);
  }, [getPositioningStyle]);

  useEffect(() => {
    if (open) {
      setPositioningStyles();
    }
  });

  useEffect(() => {
    if (!open) {
      setIsPositioned(false);
      return undefined;
    }

    const containerWindow = ownerWindow(effectiveAnchorEl);
    containerWindow.addEventListener('resize', setPositioningStyles());
    return () => {
      setPositioningStyles();
      containerWindow.removeEventListener('resize', setPositioningStyles());
    };
  }, [effectiveAnchorEl, open, setPositioningStyles]);

  useEffect(() => {
    if (open) {
      setIsVisibleTimeout(
        setTimeout(() => {
          setIsVisible(true);
        }, 50),
      );
    } else {
      setIsVisible(false);
    }
    return () => {
      clearTimeout(isVisibleTimeout);
      setIsVisibleTimeout(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ESC-to-close and optional focus trap. Kept opt-in via `closeOnEsc` / `trapFocus`
  // so existing callsites (which rely solely on ClickOutside) keep their behaviour.
  const handleKeyDown = useCallback(
    (event) => {
      if (!open) return;
      if ((event.key === 'Escape' || event.key === 'Esc') && closeOnEsc) {
        event.stopPropagation();
        if (onClose) onClose(event);
        return;
      }
      if (!trapFocus || event.key !== 'Tab') return;
      const focusables = collectFocusable(paperRef.current);
      if (focusables.length === 0) {
        event.preventDefault();
        if (paperRef.current) paperRef.current.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = typeof document !== 'undefined' ? document.activeElement : null;
      if (event.shiftKey) {
        if (active === first || !paperRef.current.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [open, closeOnEsc, trapFocus, onClose],
  );

  const handleClose = (e) => {
    if (effectiveAnchorEl !== null && effectiveAnchorEl !== undefined) {
      const anchorId = effectiveAnchorEl.id;
      if (anchorId && (e?.srcElement?.id === anchorId || e?.srcElement?.parentElement?.id === anchorId)) return;
    }
    if (closeOnOverlayClick && onClose) onClose(e);
  };

  const baseStyle = {
    position: 'absolute',
    border: `1px solid ${colors.grey.light}`,
    zIndex: '1000',
    padding: 0,
    width: open ? width : 0,
    height: open ? 'auto' : 0,
    maxHeight: height,
    visibility: isVisible ? 'visible' : 'hidden',
    transition: 'all 0.3s ease-in-out',
    outline: 'none',
  };

  // A11y: focused floating panel. role="dialog" + aria-modal only when consumer
  // opted into modal semantics. Otherwise no explicit role — it's just a
  // positioned panel and the consumer owns labelling of its content.
  const a11yProps = modal
    ? { role: 'dialog', 'aria-modal': 'true', tabIndex: -1 }
    : { tabIndex: trapFocus ? -1 : undefined };

  return open ? (
    <>
      {inline && (
        <Container
          id={id}
          className={className}
          style={{ ...baseStyle, ...style }}
          ref={paperRef}
          onKeyDown={handleKeyDown}
          {...a11yProps}
          {...rest}
        >
          <ClickOutside id={id} parentRef={paperRef} onClickOutsideHandler={handleClose}>
            {children}
          </ClickOutside>
        </Container>
      )}
      {!inline &&
        createPortal(
          <Container
            id={id}
            className={className}
            style={{ ...baseStyle, ...style }}
            ref={paperRef}
            width={width}
            onKeyDown={handleKeyDown}
            {...a11yProps}
            {...rest}
          >
            <ClickOutside parentRef={paperRef} onClickOutsideHandler={handleClose}>
              {children}
            </ClickOutside>
          </Container>,
          document.body,
        )}
    </>
  ) : null;
});

Popover.displayName = 'Popover';
Popover.propTypes = propTypes;

export default Popover;
