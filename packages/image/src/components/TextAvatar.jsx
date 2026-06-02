import React, { forwardRef, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { colors, customOffsetFocusOutline } from '@m-next/styles';
import { interactions } from '@m-next/utilities';
import styled from '@emotion/styled';

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
  initial: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired, // % or px - single value to achieve even sides
  width: PropTypes.string, // % or px - single value to achieve even sides
  height: PropTypes.string, // any valid css height value
  color: PropTypes.string.isRequired, // hex
  caption: PropTypes.string.isRequired, // aria-label for the image on screen readers
  hasClick: PropTypes.bool, // set to false if there's an onClick that does background tasks.
  round: PropTypes.bool, // cicular avatar => true
  tabIndex: PropTypes.oneOf(['0', '-1', undefined]), // set to "0" if you want the image to be part of tab order
  onClick: PropTypes.func,
  // any other prop to override or add
};

const ImageWrapper = styled.div`
  width: ${(p) => p.width};
  height: ${(p) => p.height};
  display: inline-block;
  color: ${colors['grey-darker']};
  text-align: center;
  user-select: none !important;
  line-height: ${(p) => p.size};
  font-size: ${(p) => p.cleanSize}px;
  background-color: ${(p) => p.color};
  border-radius: ${(p) => (p.round ? '50%' : '3px')};
  outline: none;
  cursor: ${(p) => (p.hasClick ? 'pointer' : 'default')};

  body.user-is-tabbing &:focus {
    ${(p) => (p.hasClick ? customOffsetFocusOutline : '')}
  }
`;

/**
 * TextAvatar — initials-based avatar used in place of an <img> when an image
 * URL resolves to an internal `.mci` token. Background color and initials
 * come from a parsed token. Soft-shim: legacy `forwardRef` prop warns once
 * and is otherwise wired alongside the modern ref.
 */
const TextAvatar = forwardRef(function TextAvatar(props, ref) {
  const {
    id: idProp = null,
    initial,
    size,
    width = '100%',
    height = 'auto',
    color,
    caption,
    hasClick = false,
    onClick = null,
    round = false,
    tabIndex = '0',

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,
    hidden: _hidden,
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-text-avatar-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'text-avatar-forwardRef-prop',
      '@m-next/image: TextAvatar `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
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

  /* RENDER ---------------- */

  const displayInitials = initial?.toUpperCase() ?? '';
  const cleanSize = useMemo(() => Math.floor(parseInt(size.replace('px', ''), 10) / 2), [size]);

  return (
    <ImageWrapper
      ref={setRef}
      id={id}
      role='img'
      aria-label={`${caption || 'Image'} with initials, ${displayInitials}`}
      tabIndex={hasClick ? tabIndex : undefined} // prevent "clickable" in screenreader
      onClick={onClick}
      onKeyUp={interactions.handleActionKey(onClick)}
      width={width}
      height={height}
      size={size}
      cleanSize={cleanSize}
      color={color}
      round={round}
      hasClick={hasClick}
    >
      {displayInitials}
    </ImageWrapper>
  );
});

TextAvatar.displayName = 'TextAvatar';

const colorsMap = [
  { method: 'blue-light' },
  { pink: 'fuchsia-light' },
  { blue: 'blue-light' },
  { aqua: 'teal-light' },
  { purple: 'purple-light' },
  { green: 'green-light' },
  { orange: 'orange-light' },
  { red: 'red-light' },
  { yellow: 'yellow-light' },
];

TextAvatar.propTypes = propTypes;

export default TextAvatar;
class TextAvatarConfig {
  width = 0;

  initial = '';

  color = '';

  _private = {
    value: '',
    token: '',
    colorsList: colorsMap.map((cm, i) => ({
      key: i,
      name: Object.keys(cm)[0],
      color: colors[Object.values(cm)[0]],
    })),
  };

  constructor(value) {
    this._private.value = value;
    this._private.token = value?.match(/\{{(.*?)\}}/);

    this.setWidth();

    if (this.bits.length <= 2) {
      this.setInitial();
      this.setColor();
    }
  }

  get bits() {
    const avatarExt = '.mci';
    const { token } = this._private;
    let { value } = this._private;

    value = this.width ? value?.replace(`{{${token[1]}}}`, '') : value; // use token value if width is set in serverside
    const index = value.indexOf(avatarExt);
    const avatar = value.substr(0, index);

    return avatar?.split('-') ?? [];
  }

  setWidth() {
    const { token } = this._private;

    if (token)
      // Check for any available size from backend in the value
      this.width = parseInt(token[1].substring(2), 10) || 0;
  }

  setInitial() {
    this.initial = this.bits[0] !== '__' ? this.bits[0] : '?';
  }

  setColor() {
    const { colorsList } = this._private;
    const defaultColor = colorsList[2].color;

    this.color =
      colorsList.find((avatarColor) => avatarColor.key === parseInt(this.bits[1], 10))?.color || defaultColor;
  }
}
/* `useTextAvatarConfig`, returns configuration necessary to render a text avatar (such as color and initials)
 * @param {string} value : imageUrl - image path */
function isTextAvatar(value) {
  const token = value?.match(/\{{(.*?)\}}/);

  if (token) {
    const index = value?.indexOf(`{{${token[1]}}}`);

    return value?.substr(index - 4, 4) === '.mci'; // 1) Make sure value has .mci in it if we have size included
  }

  return value?.substr(value.length - 4) === '.mci'; // 2) Make sure value has .mci in it (other cases)
}

export function useTextAvatarConfig(value) {
  return React.useMemo(() => isTextAvatar(value) && new TextAvatarConfig(value), [value]);
}

/* =====================================================
 * Determines whether we shown an image or a text avatar
 * There are two cases,
 * 1) when avatar has a size with format ({{W=X }}) - (Thumbnail size case)
 * 2) when it has .mci extension
 * @param {string|null} value - image path
 * @return {boolean}
 */

/* ===========================================================
 * Determine if image is an avatar based on fullname initials
 * If textAvatar > get avatar properties
 * @param {string|null} value - image path
 * @return {TextAvatar}
 *  `initial` {string} - name initial letters
 *  `width`   {number} - width save on server side
 *  `color`   {string} - one of the colors specified for avatars
 */
