import React, { forwardRef, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import Pill from '@m-next/pill';
import Caption from '@m-next/caption';
import { Tag } from '@m-next/types';
import { colors } from '@m-next/tokens';
import * as s from './TagWidget.styles';

// One-time deprecation warner — fires once per key.
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

// Map of canonical hex literals (legacy `tag.colour` values) → @m-next/tokens
// color family names. Tag colours stored upstream are the family `light` shade.
const HEX_TO_FAMILY = {
  [colors.teal.light.toLowerCase()]: 'teal', // '#84F3FF'
  [colors.green.light.toLowerCase()]: 'green', // '#A9D9BF'
  [colors.fuchsia.light.toLowerCase()]: 'fuchsia', // '#FFABB5'
  [colors.grey.light.toLowerCase()]: 'grey', // '#BACAD0'
  [colors.yellow.light.toLowerCase()]: 'yellow', // '#FFEA80'
  [colors.red.light.toLowerCase()]: 'red', // '#FFACA1'
  [colors.purple.light.toLowerCase()]: 'purple', // '#91A2FF'
  [colors.orange.light.toLowerCase()]: 'orange', // '#FFCDAB'
};

const normalize = (str) => (str || '').trim().toLowerCase();

const colourToScheme = (colour) => {
  if (!colour) return 'blue';
  return HEX_TO_FAMILY[colour.toLowerCase()] ?? 'blue';
};

const propTypes = {
  id: PropTypes.string,
  tagsList: PropTypes.arrayOf(Tag),
  value: PropTypes.arrayOf(PropTypes.string),
  // Clean API
  label: PropTypes.string,
  // Deprecated — soft-shimmed
  caption: PropTypes.string,
  size: PropTypes.oneOf(['narrow', 'regular']),
};

const ReadOnlyTagWidget = forwardRef(function ReadOnlyTagWidget(props, ref) {
  const {
    id: idProp,
    tagsList = [],
    value = [],
    size = 'narrow',

    // Clean API
    label: labelProp,

    // Soft-shimmed legacy props
    caption: legacyCaption,
    forwardRef: legacyForwardRef,

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
    internalIdRef.current = `m-next-tag-widget-ro-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  let label = labelProp;
  if (legacyCaption !== undefined && label === undefined) {
    warnOnce(
      'tag-widget-caption',
      '@m-next/tag-widget: `caption` is deprecated. Use `label`.',
    );
    label = legacyCaption;
  }

  if (legacyForwardRef) {
    warnOnce(
      'tag-widget-forwardRef-prop',
      '@m-next/tag-widget: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // Chain external refs.
  const containerRef = useRef(null);
  const handleContainerRef = (node) => {
    containerRef.current = node;
    if (ref) {
      if (typeof ref === 'function') ref(node);
      else ref.current = node;
    }
    if (legacyForwardRef) {
      if (typeof legacyForwardRef === 'function') legacyForwardRef(node);
      else legacyForwardRef.current = node;
    }
  };

  const tagsMap = useMemo(() => {
    const map = new Map();
    tagsList?.forEach((tag) => {
      map.set(normalize(tag.name), tag);
    });
    return map;
  }, [tagsList]);

  const getTagColor = (tagName) => {
    const match = tagsMap.get(normalize(tagName));
    return match ? colourToScheme(match.colour) : 'blue';
  };

  return (
    <s.ReadonlyWrapper ref={handleContainerRef} {...rest}>
      {label && <Caption id={`${id}-tags`} label={label} float readOnly />}
      <s.ReadonlyTags id={`${id}-tags-value`} hasCaption={label}>
        {value.map((tag) => {
          if (tag.length === 0) return null;
          return (
            <Pill variant='solid' id={`${id}-tags-value-${tag}`} key={tag} colorScheme={getTagColor(tag)} size={size}>
              {tag}
            </Pill>
          );
        })}
      </s.ReadonlyTags>
    </s.ReadonlyWrapper>
  );
});

ReadOnlyTagWidget.displayName = 'ReadOnlyTagWidget';
ReadOnlyTagWidget.propTypes = propTypes;

export default ReadOnlyTagWidget;
