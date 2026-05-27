import React, { useCallback, useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useResizeDetector } from 'react-resize-detector';
import { TIFFViewer } from 'react-tiff';
import { interactions } from '@m-next/utilities';
import Caption from '@m-next/caption';
import LoadingSkeleton from '@m-next/loading-skeleton';
import SvgIcon from '@m-next/svg-icon';
// utils & consts
import { IMAGE_TYPES } from './constants';
// components
import * as s from './ImageWidget.styles';
import TextAvatar, { useTextAvatarConfig } from './components/TextAvatar';
import RoundImage from './components/RoundImage';

const TYPES = {
  id: PropTypes.string.isRequired,
  caption: PropTypes.string, // used as "alt" or additional description for screen readers
  imgType: PropTypes.oneOf(['Fixed', 'Responsive', 'Background', 'Dynamic', 'Fit']), // oneOf [ "Fixed", "Responsive", "Background" ]
  value: PropTypes.string, // image url
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // image width px,%
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // image height px,%
  minWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // image min-Width px,%
  minWidthTablet: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // image min-Width Tablet px,%
  minWidthMobile: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // image min-Width Mobile px,%
  maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // image max-Width px,%
  maxWidthTablet: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // image max-Width Tablet px,%
  maxWidthMobile: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // image max-Width Mobile px,%
  disabled: PropTypes.bool, // disabled html state
  tabIndex: PropTypes.string, // html tab order
  originalName: PropTypes.string, // specified name used in messages etc, instead of one parse out of url
  unsetImage: PropTypes.oneOf(['person', 'document', 'landscape', 'loader', 'runtimeLandscape']), // placeholder oneOf [ "person", "document", "landscape", "loader", "runtimeLandscape" ]
  circle: PropTypes.bool, // masks the image in a circle
  onClick: PropTypes.func, // cb invoked when image area is clicked
  className: PropTypes.string,
  style: PropTypes.instanceOf(Object), // Add additional top level style.
  hideCaption: PropTypes.bool,
  isMobile: PropTypes.bool,
  isLoading: PropTypes.bool,
  fitToContainer: PropTypes.bool, // when true, constrains image to fit within container bounds (width and height)
  centerAlign: PropTypes.bool,
  placeholderIcon: PropTypes.string, // SvgIcon name to render as placeholder (V4) instead of inline SVG data URI
  isV4: PropTypes.bool, // V4 mode flag for new behavior (no object-fit, shrink-wrap to content)
  cornerAction: PropTypes.node, // React element to render at top-right corner of visible image/placeholder
};

export function Image({
  id,
  caption = '',
  imgType = IMAGE_TYPES.FIXED,
  value = '',
  width = '',
  height = '',
  minWidth = '',
  minWidthTablet = '',
  minWidthMobile = '',
  maxWidth = '',
  maxWidthTablet = '',
  maxWidthMobile = '',
  disabled = false,
  tabIndex = '0',
  originalName = '',
  unsetImage = 'landscape',
  circle = false, // new v4 property
  onClick = null,
  className = '',
  style = null,
  hideCaption = true,
  isMobile,
  isLoading = false,
  alignTop = false,
  fitToContainer = false,
  centerAlign = false,
  placeholderIcon = '',
  isV4 = false,
  cornerAction = null,
}) {
  const { width: containerWidth, height: containerHeight, ref: containerRef } = useResizeDetector();
  const textAvatar = useTextAvatarConfig(value);

  /* =========================================
   * @param {string} type - unsetImage type
   * @return {string}
   */
  function getPlaceholderSvg(type) {
    const DEFAULT_COLOR = '#BACAD0';

    const PATHS = {
      pixel: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      loader:
        'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnIHg9JzBweCcgeT0nMHB4JyB3aWR0aD0nMzBweCcgaGVpZ2h0PSczMHB4JyB2aWV3Qm94PScwIDAgNDAgNDAnIGVuYWJsZS1iYWNrZ3JvdW5kPSduZXcgMCAwIDQwIDQwJyB4bWw6c3BhY2U9J3ByZXNlcnZlJz4KPHBhdGggb3BhY2l0eT0nMC4yJyBmaWxsPScjOURBMUE1JyBkPSdNMjAuMjAxLDUuMTY5Yy04LjI1NCwwLTE0Ljk0Niw2LjY5Mi0xNC45NDYsMTQuOTQ2YzAsOC4yNTUsNi42OTIsMTQuOTQ2LDE0Ljk0NiwxNC45NDYgczE0Ljk0Ni02LjY5MSwxNC45NDYtMTQuOTQ2QzM1LjE0NiwxMS44NjEsMjguNDU1LDUuMTY5LDIwLjIwMSw1LjE2OXogTTIwLjIwMSwzMS43NDljLTYuNDI1LDAtMTEuNjM0LTUuMjA4LTExLjYzNC0xMS42MzQgYzAtNi40MjUsNS4yMDktMTEuNjM0LDExLjYzNC0xMS42MzRjNi40MjUsMCwxMS42MzMsNS4yMDksMTEuNjMzLDExLjYzNEMzMS44MzQsMjYuNTQxLDI2LjYyNiwzMS43NDksMjAuMjAxLDMxLjc0OXonLz4KPHBhdGggZmlsbD0nIzNFQTRFRicgZD0nTTI2LjAxMywxMC4wNDdsMS42NTQtMi44NjZjLTIuMTk4LTEuMjcyLTQuNzQzLTIuMDEyLTcuNDY2LTIuMDEyaDB2My4zMTJoMCBDMjIuMzIsOC40ODEsMjQuMzAxLDkuMDU3LDI2LjAxMywxMC4wNDd6Jz4KPGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlVHlwZT0neG1sJyBhdHRyaWJ1dGVOYW1lPSd0cmFuc2Zvcm0nIHR5cGU9J3JvdGF0ZScgZnJvbT0nMCAyMCAyMCcgdG89JzM2MCAyMCAyMCcgZHVyPScxLjI1cycgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnLz4KPC9wYXRoPjwvc3ZnPg==',
      landscape: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 17 17" fill="none"><g fill-rule="evenodd" clip-rule="evenodd" fill="${DEFAULT_COLOR}"><path d="M15.1788 11.4414L11.0333 8.47168C11.0234 8.46463 11.0133 8.45794 11.004 8.4502C10.9911 8.4395 10.9748 8.43359 10.9581 8.43359C10.9422 8.43369 10.9266 8.43844 10.9141 8.44824L3.50885 15.4287H14.5352C14.7057 15.4287 14.8697 15.3608 14.9903 15.2402C15.1109 15.1197 15.1788 14.9557 15.1788 14.7852V11.4414ZM6.60748 5.64258C6.60745 5.32058 6.47873 5.01187 6.25104 4.78418C6.02333 4.55654 5.71462 4.42871 5.39264 4.42871C5.07064 4.42875 4.76193 4.55649 4.53424 4.78418C4.30655 5.01187 4.17881 5.32058 4.17877 5.64258C4.17877 5.96456 4.30661 6.27327 4.53424 6.50098C4.76193 6.72867 5.07064 6.85738 5.39264 6.85742L5.51276 6.85059C5.79073 6.82298 6.05178 6.70023 6.25104 6.50098C6.47876 6.27325 6.60748 5.96463 6.60748 5.64258ZM15.1788 2.21387C15.1787 2.04354 15.1107 1.88025 14.9903 1.75977C14.8697 1.63921 14.7057 1.57129 14.5352 1.57129H1.96393C1.79353 1.57136 1.63032 1.63927 1.50983 1.75977C1.38933 1.88026 1.32142 2.04347 1.32135 2.21387V14.7852C1.32135 14.9557 1.38927 15.1197 1.50983 15.2402C1.63031 15.3606 1.7936 15.4286 1.96393 15.4287H2.05084L10.2501 7.70215L10.2725 7.68164L10.3477 7.625C10.5264 7.50092 10.7391 7.43368 10.9581 7.43359C11.1962 7.43359 11.4267 7.51365 11.6143 7.65918H11.6153L15.1788 10.2119V2.21387ZM7.60748 5.64258C7.60748 6.22984 7.37333 6.79275 6.95807 7.20801C6.59467 7.57141 6.11836 7.79541 5.61139 7.8457L5.39264 7.85742C4.80542 7.85738 4.24244 7.62323 3.82721 7.20801C3.41204 6.79276 3.17877 6.22978 3.17877 5.64258C3.17881 5.05536 3.41198 4.49237 3.82721 4.07715C4.24244 3.66192 4.80542 3.42875 5.39264 3.42871C5.97984 3.42871 6.54282 3.66198 6.95807 4.07715C7.3733 4.49237 7.60745 5.05536 7.60748 5.64258ZM16.1788 14.7852C16.1788 15.2209 16.0054 15.6392 15.6973 15.9473C15.3892 16.2554 14.9709 16.4287 14.5352 16.4287H1.96393C1.52838 16.4286 1.11081 16.2552 0.802795 15.9473C0.4947 15.6392 0.32135 15.2209 0.32135 14.7852V2.21387C0.321424 1.77825 0.494766 1.36076 0.802795 1.05273C1.11083 0.744705 1.52832 0.571363 1.96393 0.571289H14.5352C14.9709 0.571289 15.3892 0.744639 15.6973 1.05273C16.0053 1.36075 16.1787 1.77832 16.1788 2.21387V14.7852Z"/></g></svg>`,
      appBuilderLandscape: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 17 17" fill="none"><g fill-rule="evenodd" clip-rule="evenodd" fill="${DEFAULT_COLOR}"><path d="M15.1788 11.4414L11.0333 8.47168C11.0234 8.46463 11.0133 8.45794 11.004 8.4502C10.9911 8.4395 10.9748 8.43359 10.9581 8.43359C10.9422 8.43369 10.9266 8.43844 10.9141 8.44824L3.50885 15.4287H14.5352C14.7057 15.4287 14.8697 15.3608 14.9903 15.2402C15.1109 15.1197 15.1788 14.9557 15.1788 14.7852V11.4414ZM6.60748 5.64258C6.60745 5.32058 6.47873 5.01187 6.25104 4.78418C6.02333 4.55654 5.71462 4.42871 5.39264 4.42871C5.07064 4.42875 4.76193 4.55649 4.53424 4.78418C4.30655 5.01187 4.17881 5.32058 4.17877 5.64258C4.17877 5.96456 4.30661 6.27327 4.53424 6.50098C4.76193 6.72867 5.07064 6.85738 5.39264 6.85742L5.51276 6.85059C5.79073 6.82298 6.05178 6.70023 6.25104 6.50098C6.47876 6.27325 6.60748 5.96463 6.60748 5.64258ZM15.1788 2.21387C15.1787 2.04354 15.1107 1.88025 14.9903 1.75977C14.8697 1.63921 14.7057 1.57129 14.5352 1.57129H1.96393C1.79353 1.57136 1.63032 1.63927 1.50983 1.75977C1.38933 1.88026 1.32142 2.04347 1.32135 2.21387V14.7852C1.32135 14.9557 1.38927 15.1197 1.50983 15.2402C1.63031 15.3606 1.7936 15.4286 1.96393 15.4287H2.05084L10.2501 7.70215L10.2725 7.68164L10.3477 7.625C10.5264 7.50092 10.7391 7.43368 10.9581 7.43359C11.1962 7.43359 11.4267 7.51365 11.6143 7.65918H11.6153L15.1788 10.2119V2.21387ZM7.60748 5.64258C7.60748 6.22984 7.37333 6.79275 6.95807 7.20801C6.59467 7.57141 6.11836 7.79541 5.61139 7.8457L5.39264 7.85742C4.80542 7.85738 4.24244 7.62323 3.82721 7.20801C3.41204 6.79276 3.17877 6.22978 3.17877 5.64258C3.17881 5.05536 3.41198 4.49237 3.82721 4.07715C4.24244 3.66192 4.80542 3.42875 5.39264 3.42871C5.97984 3.42871 6.54282 3.66198 6.95807 4.07715C7.3733 4.49237 7.60745 5.05536 7.60748 5.64258ZM16.1788 14.7852C16.1788 15.2209 16.0054 15.6392 15.6973 15.9473C15.3892 16.2554 14.9709 16.4287 14.5352 16.4287H1.96393C1.52838 16.4286 1.11081 16.2552 0.802795 15.9473C0.4947 15.6392 0.32135 15.2209 0.32135 14.7852V2.21387C0.321424 1.77825 0.494766 1.36076 0.802795 1.05273C1.11083 0.744705 1.52832 0.571363 1.96393 0.571289H14.5352C14.9709 0.571289 15.3892 0.744639 15.6973 1.05273C16.0053 1.36075 16.1787 1.77832 16.1788 2.21387V14.7852Z"/></g></svg>`,
      person: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 17 17" fill="none"><circle cx="8.5" cy="8.5" r="7.5" stroke="${DEFAULT_COLOR}" stroke-width="0.8" fill="none"/><circle cx="8.5" cy="6.2" r="2.3" fill="${DEFAULT_COLOR}"/><path d="M4.2 15.2C4.2 12.0 6.1 9.5 8.5 9.5C10.9 9.5 12.8 12.0 12.8 15.2" fill="${DEFAULT_COLOR}"/></svg>`,
      document: `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><g stroke="${DEFAULT_COLOR}" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" fill="none"><path d="M21.5 23.5h-19v-23h13l6 6zM15.5.5v6h6M7.5 7.5h4.5M7.5 10.5h9M7.5 13.5h3M7.5 16.5h3M7.5 19.5h3M12.5 14.5v-1h4v1M14.5 13.5v6M13 19.5h3"/></g></svg>`,
    };

    const targetSvgPath = PATHS[type] || PATHS.document;

    return ['pixel', 'loader'].includes(type)
      ? targetSvgPath
      : `data:image/svg+xml;base64,${window.btoa(targetSvgPath)}`;
  }

  const placeholder = useMemo(() => {
    if (!value || value.indexOf('data:image') > -1) return getPlaceholderSvg(unsetImage);
    // Bare words without path separators or file extensions (e.g. "Image_2") are not valid image URLs
    if (!value.includes('/') && !value.includes('.')) return getPlaceholderSvg(unsetImage);
    return '';
  }, [unsetImage, value]);

  const [imageSrc, setImageSrc] = useState(placeholder || value);
  const [isTiff, setIsTiff] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);

    // .mci URLs are virtual text avatars, not real images — skip preloading
    // to avoid 404 network errors
    if (textAvatar) return;

    if (placeholder) {
      setImageSrc(placeholder);
      if (value) {
        const fileExtension = value.split('.').pop().toLowerCase();
        if (['tif', 'tiff'].includes(fileExtension)) setIsTiff(true);
      }
      return;
    }

    if (!value) return;

    const fileExtension = value.split('.').pop().toLowerCase();
    if (['tif', 'tiff'].includes(fileExtension)) {
      setIsTiff(true);
      setImageSrc(value);
      return;
    }

    // Preload URL offscreen to avoid broken-image flash in the DOM
    const img = new window.Image();
    img.src = value;

    if (img.complete) {
      if (img.naturalWidth > 0) {
        setImageSrc(value);
      } else {
        setImageError(true);
        setImageSrc(getPlaceholderSvg(unsetImage));
      }
      return;
    }

    img.onload = () => setImageSrc(value);
    img.onerror = () => {
      setImageError(true);
      setImageSrc(getPlaceholderSvg(unsetImage));
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [value, placeholder, unsetImage, textAvatar]);

  const getFixedSizes = () => ({
    width: width || '100%',
    height: height || 'auto',
    maxMidth: width || '100%',
    minWidth: 0,
  });

  const getResponsiveSizes = () => {
    let currentminWidth = '';
    let currentmaxWidth = '';

    if (window.innerWidth > 768) {
      currentminWidth = minWidth;
      currentmaxWidth = maxWidth;
    } else if (window.innerWidth >= 569) {
      currentminWidth = minWidthTablet || ''; // legacy logic
      currentmaxWidth = maxWidthTablet;
    } else {
      currentminWidth = minWidthMobile;
      currentmaxWidth = maxWidthMobile;
    }
    return {
      width: width || '100%',
      height: height || 'auto',
      minMidth: currentminWidth || '0',
      maxMidth: currentmaxWidth || width || '100%',
    };
  };

  const getAvatarSize = (isResponsive) => {
    let length = width || '0';

    if (isResponsive) {
      let responsiveWidth = 0;
      // If there is a minimum width set in the backend then use that
      const savedWidth = textAvatar?.width ? `${textAvatar.width}px` : '0';

      if (window.innerWidth >= 569) {
        const minWT = parseInt(minWidthTablet, 10) ? minWidthTablet : 0;
        const maxWT = parseInt(maxWidthTablet, 10) ? maxWidthTablet : 0;
        responsiveWidth = minWT || maxWT || '0';
      } else {
        const minWM = parseInt(minWidthMobile, 10) ? minWidthMobile : 0;
        const maxWM = parseInt(maxWidthMobile, 10) ? maxWidthMobile : 0;
        responsiveWidth = minWM || maxWM || '0';
      }
      // If in case the actual size is smaller that thumbnail specified in backend
      if (responsiveWidth) {
        length = parseInt(savedWidth, 10) > parseInt(responsiveWidth, 10) ? responsiveWidth : savedWidth;
      }
    }

    if (parseInt(length, 10) < 1) {
      length = '48px';
    }

    return {
      width: width || '100%',
      height: height || 'auto',
      maxMidth: width || '100%',
      minWidth: 0,
    };
  };

  const imgSize = useMemo(() => {
    switch (imgType) {
      case IMAGE_TYPES.BACKGROUND:
      case IMAGE_TYPES.DYNAMIC:
      case IMAGE_TYPES.FIT:
        return {
          width: null,
          height: null,
          maxWidth: '100%',
          minWidth: 0,
        };
      case IMAGE_TYPES.RESPONSIVE:
        return textAvatar ? getAvatarSize(true) : getResponsiveSizes();
      case IMAGE_TYPES.FIXED:
      default:
        return textAvatar ? getAvatarSize(false) : getFixedSizes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    imgType,
    textAvatar,
    width,
    height,
    minWidth,
    minWidthTablet,
    minWidthMobile,
    maxWidth,
    maxWidthTablet,
    maxWidthMobile,
  ]);

  const hasClick = Boolean(onClick) && !disabled;

  const isRound = circle && !placeholder && !imageError;

  const handleClick = (e) => {
    e.preventDefault();

    if (onClick && !disabled) {
      onClick(e);
    }
  };

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageSrc(getPlaceholderSvg(unsetImage));
  }, [unsetImage]);

  /* RENDER ---------------------------------*/

  const renderImage = () => {
    if (isLoading) {
      return <LoadingSkeleton circle={isRound} count={1} height='100%' width='100%' />;
    }
    // Text avatar (.mci) must be checked before placeholderIcon so that
    // virtual avatars render as initials instead of falling through to the
    // generic placeholder after the preloader fails to load the .mci URL.
    if (textAvatar) {
      return (
        <>
          <TextAvatar
            initial={textAvatar.initial}
            color={textAvatar.color}
            size={`${containerWidth}px`} // even sides
            caption={caption}
            round={isRound}
            tabIndex={tabIndex}
            hasClick={hasClick}
            onClick={handleClick}
            onKeyUp={interactions.handleActionKey(handleClick)}
          />
          {cornerAction}
        </>
      );
    }
    if (placeholderIcon && (placeholder || imageError)) {
      // V4: Scale to greatest dimension, max 80px, min 24px (per designer spec)
      // V3: Scale proportionally (30% of min dimension, clamped 24-64px)
      const containerMin =
        containerWidth && containerHeight
          ? Math.min(containerWidth, containerHeight)
          : containerWidth || containerHeight;
      let iconSize;
      if (isV4) {
        iconSize = Math.max(24, Math.min(80, containerWidth || 80, containerHeight || 80));
      } else {
        iconSize = containerMin ? Math.min(64, Math.max(24, Math.floor(containerMin * 0.3))) : 48;
      }
      const placeholderColor = isV4 ? '#545F67' : '#BACAD0';

      return (
        <div
          style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: '100%', height: '100%' }}
        >
          {cornerAction ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <SvgIcon name={placeholderIcon} size={iconSize} color={placeholderColor} />
              {cornerAction}
            </div>
          ) : (
            <SvgIcon name={placeholderIcon} size={iconSize} color={placeholderColor} />
          )}
        </div>
      );
    }

    if (isRound) {
      return (
        <RoundImage
          width='100%'
          height={`${containerWidth}px`}
          imageUrl={imageSrc}
          caption={caption}
          tabIndex={tabIndex}
          hasClick={hasClick}
          onClick={handleClick}
          onKeyUp={interactions.handleActionKey(handleClick)}
          style={style?.imgStyle}
        />
      );
    }

    const imageContent = isTiff ? (
      <s.TiffContainer ariaLabel={`image: ${caption}`}>
        <TIFFViewer tabIndex='-1' title={originalName} tiff={imageSrc} style={style?.imgStyle} />
      </s.TiffContainer>
    ) : (
      <s.Image
        alt={`image: ${caption}`}
        tabIndex='-1'
        title={originalName}
        src={imageSrc}
        hasClick={hasClick}
        {...(fitToContainer && { fitToContainer })}
        {...(isV4 && { isV4 })}
        style={style?.imgStyle}
        onError={handleImageError}
      />
    );

    return (
      <s.ImageWrapper
        hasClick={hasClick}
        tabIndex={hasClick ? tabIndex : undefined} // prevent "clickable" in screenreader
        onClick={handleClick}
        onKeyUp={interactions.handleActionKey(handleClick)}
        alignTop={alignTop}
        {...(fitToContainer && { fitToContainer })}
        style={{ ...style?.wrapperStyle, ...(isV4 && cornerAction ? { overflow: 'visible' } : {}) }}
      >
        {isV4 && cornerAction ? (
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              maxWidth: '100%',
              maxHeight: '100%',
              height: '100%',
            }}
          >
            {imageContent}
            {cornerAction}
          </div>
        ) : (
          imageContent
        )}
      </s.ImageWrapper>
    );
  };

  const render = () => {
    if (caption && !hideCaption)
      return (
        <s.ImageContainer {...(fitToContainer && { fitToContainer })}>
          <Caption id={id} align='left' isMobile={isMobile} label={caption} />
          <s.ImageWidgetWrapper
            className={className}
            style={style}
            isRound={isRound}
            size={imgSize}
            centerAlign={centerAlign}
            disabled={disabled}
            {...(fitToContainer && { fitToContainer })}
            ref={containerRef}
            id={`${id}-ImageWidget`}
            tabIndex={-1}
          >
            {renderImage()}
          </s.ImageWidgetWrapper>
        </s.ImageContainer>
      );

    return (
      <s.ImageWidgetWrapper
        className={className}
        style={style}
        isRound={isRound}
        size={imgSize}
        centerAlign={centerAlign}
        disabled={disabled}
        {...(fitToContainer && { fitToContainer })}
        ref={containerRef}
        id={`${id}-ImageWidget`}
        tabIndex={-1}
      >
        {renderImage()}
      </s.ImageWidgetWrapper>
    );
  };

  return render();
}

Image.propTypes = TYPES;
export default Image;
