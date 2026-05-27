import React, { useEffect, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { lightTheme } from '@m-next/styles';
import BannerContent from './bannerContent';
import * as s from './banner.styles';

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

// Legacy `severity` values that need to be translated to the new `status` set.
// New canonical set matches Alert: 'info' | 'success' | 'warning' | 'error'.
const translateStatus = (status) => {
  switch (status) {
    case 'informational':
      return 'info';
    case 'clear':
    case 'loading':
      // Both legacy values were really "neutral / informational" — fold them
      // into 'info' so the new theming pipeline has a real bucket.
      return 'info';
    default:
      return status;
  }
};

let autoIdCounter = 0;

const Banner = forwardRef(function Banner(props, ref) {
  const {
    id: idProp,
    children,
    primaryButton = null,
    onPrimaryButtonClick = null,
    secondaryButton = null,
    onSecondaryButtonClick = null,
    hasClose = false,
    onClose = null,
    icon = null,

    // Clean API
    status: statusProp,
    variant: variantProp,

    // Soft-shimmed legacy props
    message: legacyMessage,
    severity: legacySeverity,
    bannerStyle: legacyBannerStyle,
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,

    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-banner-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  // children replaces `message`. If consumer passed `message` but no children,
  // adopt it.
  let resolvedChildren = children;
  if (resolvedChildren == null && legacyMessage != null && legacyMessage !== '') {
    warnOnce(
      'banner-message',
      '@m-next/banner: `message` is deprecated. Pass content as `children` instead.',
    );
    resolvedChildren = legacyMessage;
  }

  // status replaces `severity`.
  let status = statusProp;
  if (status == null && legacySeverity != null) {
    warnOnce(
      'banner-severity',
      "@m-next/banner: `severity` is deprecated. Use `status` ('info' | 'success' | 'warning' | 'error').",
    );
    status = translateStatus(legacySeverity);
  }
  if (status == null) status = 'info';
  // Belt-and-suspenders: if a consumer passes a legacy value directly to
  // `status`, translate silently (no warn — they did the right thing,
  // they just used the old vocabulary).
  status = translateStatus(status);

  // variant replaces `bannerStyle`.
  let variant = variantProp;
  if (variant == null && legacyBannerStyle != null) {
    warnOnce(
      'banner-bannerStyle',
      "@m-next/banner: `bannerStyle` is deprecated. Use `variant` ('full' | 'trailing').",
    );
    variant = legacyBannerStyle;
  }
  if (variant == null) variant = 'full';

  if (legacyForwardRef) {
    warnOnce(
      'banner-forwardRef-prop',
      '@m-next/banner: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // ============ Ref forwarding ============

  const rootRef = useRef(null);
  useEffect(() => {
    const targetRef = ref ?? legacyForwardRef;
    if (!targetRef) return;
    if (typeof targetRef === 'function') {
      targetRef(rootRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      targetRef.current = rootRef.current;
    }
  }, [ref, legacyForwardRef]);

  return (
    <s.BannerRoot
      ref={rootRef}
      id={`banner-${id}`}
      status={status}
      role={status === 'error' || status === 'warning' ? 'alert' : 'status'}
      {...rest}
    >
      <BannerContent
        id={id}
        variant={variant}
        status={status}
        secondaryAction={
          secondaryButton ? (
            <s.BannerActionButton
              status={status}
              type='button'
              id={`banner-content-secondary-button-${id}`}
              onClick={onSecondaryButtonClick}
            >
              {secondaryButton}
            </s.BannerActionButton>
          ) : null
        }
        primaryAction={
          primaryButton ? (
            <s.BannerActionButton
              status={status}
              type='button'
              id={`banner-content-primary-button-${id}`}
              onClick={onPrimaryButtonClick}
            >
              {primaryButton}
            </s.BannerActionButton>
          ) : null
        }
        icon={icon}
      >
        {resolvedChildren}
      </BannerContent>
      {hasClose && (
        <s.BannerCloseButton
          type='button'
          id={`banner-content-close-${id}`}
          onClick={onClose}
          aria-label='Close'
        >
          <SvgIcon
            name='close-V4'
            size={16}
            color={lightTheme.content.subtle}
          />
        </s.BannerCloseButton>
      )}
    </s.BannerRoot>
  );
});

Banner.displayName = 'Banner';

Banner.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  primaryButton: PropTypes.string,
  onPrimaryButtonClick: PropTypes.func,
  secondaryButton: PropTypes.string,
  onSecondaryButtonClick: PropTypes.func,
  hasClose: PropTypes.bool,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['full', 'trailing']),
  status: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  icon: PropTypes.string,
  // Soft-shimmed legacy:
  message: PropTypes.node,
  severity: PropTypes.string,
  bannerStyle: PropTypes.string,
  forwardRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  // Silently ignored:
  isV4Design: PropTypes.bool,
  isMobile: PropTypes.bool,
  legacyClass: PropTypes.string,
};

export default Banner;
