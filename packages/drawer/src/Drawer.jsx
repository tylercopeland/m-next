import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { colors } from '@m-next/tokens';

const KEYFRAMES_ID = 'm-next-drawer-keyframes';
const KEYFRAMES_CSS = `
@keyframes m-next-drawer-backdrop-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes m-next-drawer-backdrop-out { from { opacity: 1; } to { opacity: 0; } }
@keyframes m-next-drawer-slide-in-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes m-next-drawer-slide-out-right { from { transform: translateX(0); } to { transform: translateX(100%); } }
@keyframes m-next-drawer-slide-in-left { from { transform: translateX(-100%); } to { transform: translateX(0); } }
@keyframes m-next-drawer-slide-out-left { from { transform: translateX(0); } to { transform: translateX(-100%); } }
@keyframes m-next-drawer-slide-in-top { from { transform: translateY(-100%); } to { transform: translateY(0); } }
@keyframes m-next-drawer-slide-out-top { from { transform: translateY(0); } to { transform: translateY(-100%); } }
@keyframes m-next-drawer-slide-in-bottom { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes m-next-drawer-slide-out-bottom { from { transform: translateY(0); } to { transform: translateY(100%); } }
`;

const ensureKeyframes = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById(KEYFRAMES_ID)) return;
  const style = document.createElement('style');
  style.id = KEYFRAMES_ID;
  style.textContent = KEYFRAMES_CSS;
  document.head.appendChild(style);
};

// Stable, unique id without depending on React 18's useId.
let drawerIdCounter = 0;
const nextDrawerId = () => {
  drawerIdCounter += 1;
  return `m-next-drawer-${drawerIdCounter}`;
};

const ANIMATION_DURATION_MS = 220;
const BACKDROP_DURATION_MS = 200;

const SIZE_PX = { sm: 320, md: 480, lg: 720 };
const SIZE_PX_BLOCK = { sm: 240, md: 360, lg: 480 };

// Module-level counter so nested/stacked drawers don't fight over body overflow.
let bodyScrollLockCount = 0;
let previousBodyOverflow = '';
const lockBodyScroll = () => {
  if (typeof document === 'undefined') return;
  if (bodyScrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  bodyScrollLockCount += 1;
};
const unlockBodyScroll = () => {
  if (typeof document === 'undefined') return;
  if (bodyScrollLockCount === 0) return;
  bodyScrollLockCount -= 1;
  if (bodyScrollLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
    previousBodyOverflow = '';
  }
};

const isHorizontal = (placement) => placement === 'left' || placement === 'right';

const resolveSize = (size, placement) => {
  if (size === 'full') return isHorizontal(placement) ? '100vw' : '100vh';
  if (typeof size === 'number') return `${size}px`;
  if (typeof size === 'string' && !(size in SIZE_PX)) return size; // pass through arbitrary strings
  const table = isHorizontal(placement) ? SIZE_PX : SIZE_PX_BLOCK;
  return `${table[size] ?? table.md}px`;
};

const panelPositionStyle = (placement) => {
  switch (placement) {
    case 'left':
      return { top: 0, bottom: 0, left: 0, height: '100vh' };
    case 'top':
      return { top: 0, left: 0, right: 0, width: '100vw' };
    case 'bottom':
      return { bottom: 0, left: 0, right: 0, width: '100vw' };
    case 'right':
    default:
      return { top: 0, bottom: 0, right: 0, height: '100vh' };
  }
};

const panelShadowFor = (placement) => {
  switch (placement) {
    case 'left':
      return '8px 0 24px rgba(0,0,0,0.15)';
    case 'top':
      return '0 8px 24px rgba(0,0,0,0.15)';
    case 'bottom':
      return '0 -8px 24px rgba(0,0,0,0.15)';
    case 'right':
    default:
      return '-8px 0 24px rgba(0,0,0,0.15)';
  }
};

const slideAnimationFor = (placement, exiting) =>
  exiting
    ? `m-next-drawer-slide-out-${placement} ${ANIMATION_DURATION_MS}ms ease-out forwards`
    : `m-next-drawer-slide-in-${placement} ${ANIMATION_DURATION_MS}ms ease-out`;

// Match any focusable element inside the drawer. Used for trap + initial focus fallback.
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

const collectFocusable = (root) => {
  if (!root) return [];
  return Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => {
    if (el.hasAttribute('disabled')) return false;
    if (el.getAttribute('aria-hidden') === 'true') return false;
    // offsetParent === null means hidden via display:none (good enough for our purposes).
    if (el.offsetParent === null && el.tagName !== 'BODY') return false;
    return true;
  });
};

const Drawer = ({
  open,
  onClose,
  placement = 'right',
  size = 'md',
  title,
  showCloseButton = true,
  closeOnEsc = true,
  closeOnOverlayClick = true,
  children,
  style,
  className,
  ...rest
}) => {
  useEffect(ensureKeyframes, []);

  // `mounted` controls whether anything is in the DOM at all. We set it true
  // when `open` flips to true, and only set it false after the exit animation.
  // `exiting` controls which animation runs.
  const [mounted, setMounted] = useState(open);
  const [exiting, setExiting] = useState(false);

  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const restoreFocusRef = useRef(null);
  const titleIdRef = useRef(null);
  if (titleIdRef.current === null) titleIdRef.current = nextDrawerId();
  const titleId = titleIdRef.current;

  // Open transitions: capture focus origin, mount, lock body scroll, focus into drawer.
  useEffect(() => {
    if (open) {
      if (typeof document !== 'undefined') {
        restoreFocusRef.current = document.activeElement;
      }
      setExiting(false);
      setMounted(true);
      lockBodyScroll();
      return () => {
        unlockBodyScroll();
      };
    }
    // open went false; if currently mounted, start the exit animation.
    if (mounted) {
      setExiting(true);
      const t = setTimeout(() => {
        setMounted(false);
        setExiting(false);
      }, ANIMATION_DURATION_MS);
      return () => clearTimeout(t);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Focus the close button (or first focusable) once mounted.
  useEffect(() => {
    if (!mounted || exiting) return;
    // Defer to next tick so the panel is in the DOM and laid out.
    const id = window.setTimeout(() => {
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
        return;
      }
      const focusables = collectFocusable(panelRef.current);
      if (focusables.length > 0) {
        focusables[0].focus();
      } else if (panelRef.current) {
        panelRef.current.focus();
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, [mounted, exiting]);

  // Restore focus to the originally-focused element on unmount.
  useEffect(() => {
    if (mounted) return undefined;
    const previous = restoreFocusRef.current;
    if (previous && typeof previous.focus === 'function') {
      previous.focus();
    }
    restoreFocusRef.current = null;
    return undefined;
  }, [mounted]);

  // Key handling — ESC + focus trap. Listen on the panel so we don't fight with
  // anything else on document. Panel needs to be focusable (tabIndex={-1}) for
  // this to keep working after focus traversal lands somewhere inside it.
  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        if (closeOnEsc) {
          event.stopPropagation();
          onClose();
        }
        return;
      }
      if (event.key !== 'Tab') return;
      const focusables = collectFocusable(panelRef.current);
      if (focusables.length === 0) {
        event.preventDefault();
        if (panelRef.current) panelRef.current.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = typeof document !== 'undefined' ? document.activeElement : null;
      if (event.shiftKey) {
        if (active === first || !panelRef.current.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [closeOnEsc, onClose]
  );

  if (typeof document === 'undefined') return null;
  if (!mounted) return null;

  const onBackdropClick = (event) => {
    // Only treat clicks that originate on the backdrop itself, not bubbled from children.
    if (event.target !== event.currentTarget) return;
    if (!closeOnOverlayClick) return;
    onClose();
  };

  const backdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1300,
    animation: exiting
      ? `m-next-drawer-backdrop-out ${BACKDROP_DURATION_MS}ms ease-out forwards`
      : `m-next-drawer-backdrop-in ${BACKDROP_DURATION_MS}ms ease-out`,
  };

  const sizeValue = resolveSize(size, placement);
  const panelStyle = {
    position: 'fixed',
    ...panelPositionStyle(placement),
    ...(isHorizontal(placement) ? { width: sizeValue } : { height: sizeValue }),
    maxWidth: '100vw',
    maxHeight: '100vh',
    background: colors.white,
    boxShadow: panelShadowFor(placement),
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1301, // sits above the backdrop, both within the modal layer
    animation: slideAnimationFor(placement, exiting),
    outline: 'none',
    boxSizing: 'border-box',
    ...style,
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    padding: '0 16px',
    borderBottom: `1px solid ${colors.grey.light}`,
    flexShrink: 0,
    gap: 12,
  };

  const titleStyle = {
    fontSize: 16,
    fontWeight: 600,
    color: colors.grey.darkest,
    margin: 0,
    fontFamily: "'Source Sans Pro', Helvetica, Arial, sans-serif",
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const closeButtonStyle = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    width: 32,
    height: 32,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    color: colors.grey.dark,
    fontSize: 20,
    lineHeight: 1,
    flexShrink: 0,
  };

  const bodyStyle = {
    flex: 1,
    overflow: 'auto',
    padding: 16,
    boxSizing: 'border-box',
  };

  const hasHeader = Boolean(title) || showCloseButton;

  const labelledByProps = title ? { 'aria-labelledby': titleId } : { 'aria-label': 'Drawer' };

  return ReactDOM.createPortal(
    <>
      <div aria-hidden="true" style={backdropStyle} onClick={onBackdropClick} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        {...labelledByProps}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className={className}
        style={panelStyle}
        {...rest}
      >
        {hasHeader && (
          <div style={headerStyle}>
            {title ? (
              <h2 id={titleId} style={titleStyle}>
                {title}
              </h2>
            ) : (
              <span />
            )}
            {showCloseButton && (
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close drawer"
                onClick={onClose}
                style={closeButtonStyle}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M3 3 L13 13 M13 3 L3 13"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
        <div style={bodyStyle}>{children}</div>
      </div>
    </>,
    document.body
  );
};

export default Drawer;
