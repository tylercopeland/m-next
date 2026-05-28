import React, { forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '@m-next/button';
import Pill from '@m-next/pill';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/tokens';
import * as s from './ContentCard.styles';

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
  id: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  timeToComplete: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  buttonText: PropTypes.string,
  onClick: PropTypes.func,
  isComplete: PropTypes.bool,
  thumbnail: PropTypes.string,
  icon: PropTypes.string,
  iconColor: PropTypes.string,
  iconSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

/**
 * ActionCard — an actionable card. Title + description + a primary action,
 * with optional thumbnail, completion badge, and time-to-complete pill.
 *
 * Exported as both `ActionCard` (canonical) and `ContentCard` (legacy alias).
 * The package name remains `@m-next/content-card`.
 */
const ContentCard = forwardRef(function ContentCard(props, ref) {
  const {
    id: idProp,
    title,
    description,
    timeToComplete,
    buttonText = 'Launch Demo',
    onClick,
    isComplete = false,
    icon,
    iconColor,
    iconSize,
    thumbnail,
    style,

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
    internalIdRef.current = `m-next-content-card-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'content-card-forwardRef-prop',
      '@m-next/content-card: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // Merge external refs (forwardRef API + legacy prop) onto the wrapper element.
  const wrapperRef = useRef(null);
  const setWrapperRef = (node) => {
    wrapperRef.current = node;
    const targets = [ref, legacyForwardRef].filter(Boolean);
    targets.forEach((target) => {
      if (typeof target === 'function') {
        target(node);
      } else {
        // eslint-disable-next-line no-param-reassign
        target.current = node;
      }
    });
  };

  return (
    <s.ContentCardWrapper
      id={id}
      ref={setWrapperRef}
      style={{ position: 'relative', ...style }}
      {...rest}
    >
      {isComplete && icon && (
        <s.CompletionIcon>
          <SvgIcon
            id={`${id}-svg-icon`}
            name={icon}
            size={iconSize || 16}
            color={iconColor || colors.green.base}
          />
        </s.CompletionIcon>
      )}
      {thumbnail ? (
        <s.ThumbnailImage src={thumbnail} alt={title || 'thumbnail'} />
      ) : (
        <s.Thumbnail />
      )}
      <s.BottomSection>
        <s.HeaderText>{title}</s.HeaderText>
        <s.Description>{description}</s.Description>
        <s.CTAContainer>
          <Button
            id={`${id}-button`}
            buttonStyle='ghost'
            isV4Design
            value={buttonText}
            onClick={onClick}
          />
          {timeToComplete && (
            <Pill size='narrow' colorScheme='grey'>
              ~{timeToComplete}min
            </Pill>
          )}
        </s.CTAContainer>
      </s.BottomSection>
    </s.ContentCardWrapper>
  );
});

ContentCard.displayName = 'ContentCard';
ContentCard.propTypes = propTypes;

export default ContentCard;
