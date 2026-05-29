import React, { forwardRef, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Tag } from '@m-next/types';
import Dropdown from '@m-next/dropdown';
import { colors } from '@m-next/tokens';

// One-time deprecation warner — fires once per key, mirrors @m-next/input / @m-next/multi-select.
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

const getTagColor = (tag) => {
  if (!tag || !tag.colour) return 'blue';
  return HEX_TO_FAMILY[tag.colour.toLowerCase()] ?? 'blue';
};

const propTypes = {
  id: PropTypes.string,
  tagsList: PropTypes.arrayOf(Tag),
  value: PropTypes.arrayOf(PropTypes.string),
  suggestions: PropTypes.arrayOf(PropTypes.string),
  // Clean API
  label: PropTypes.string,
  // Deprecated — soft-shimmed
  caption: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  showManageTags: PropTypes.bool,
  onActionButtonClick: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  placeholder: PropTypes.string,
  isPortal: PropTypes.bool,
};

const EditableTagWidget = forwardRef(function EditableTagWidget(props, ref) {
  const {
    id: idProp,
    tagsList = [],
    value = [],
    suggestions = [],

    // Clean API
    label: labelProp,

    onChange,
    disabled = false,
    showManageTags = false,
    onActionButtonClick = null,
    width,
    placeholder = 'Begin typing a tag name',
    isPortal = false,

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
    internalIdRef.current = `m-next-tag-widget-${++autoIdCounter}`;
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

  // Chain external refs (forwardRef API + legacy forwardRef prop). The Dropdown
  // doesn't itself forward a ref, so we expose the container via a callback ref.
  const containerRef = useRef(null);
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') ref(containerRef.current);
      else ref.current = containerRef.current;
    }
    if (legacyForwardRef) {
      if (typeof legacyForwardRef === 'function') legacyForwardRef(containerRef.current);
      else legacyForwardRef.current = containerRef.current;
    }
  }, [ref, legacyForwardRef]);

  // ============ Data transforms ============

  const formattedTagList = useMemo(() => {
    if (!tagsList && !suggestions) return [];

    const valueSet = new Set(value.map(normalize));
    const recentSet = new Set();

    const grouped = [
      { label: 'recent', options: [] },
      { label: 'other', options: [] },
    ];

    const tagsMap = new Map();
    tagsList?.forEach((tag) => {
      tagsMap.set(normalize(tag.name), tag);
    });

    suggestions?.forEach((item) => {
      const normalizedItem = normalize(item);
      if (valueSet.has(normalizedItem)) return;

      recentSet.add(normalizedItem);
      const existingTag = tagsMap.get(normalizedItem);
      const colour = existingTag ? getTagColor(existingTag) : 'blue';

      grouped[0].options.push({
        value: item.trim(),
        label: item.trim(),
        colour,
      });
    });

    tagsList?.forEach((tag) => {
      const normalizedName = normalize(tag.name);
      if (valueSet.has(normalizedName)) return;
      if (recentSet.has(normalizedName)) return;

      grouped[1].options.push({
        value: tag.name.trim(),
        label: tag.name.trim(),
        colour: tag.colour,
      });
    });

    return grouped;
  }, [value, tagsList, suggestions]);

  const handleChange = (e) => {
    const clean = e.map((item) => item.value);
    if (onChange) onChange(clean.join(','));
  };

  const handleCreate = (e) => {
    const updated = [...value, e];
    if (onChange) onChange(updated.join(','));
  };

  const formattedValue = useMemo(() => {
    const tagsMap = new Map();
    tagsList?.forEach((tag) => {
      tagsMap.set(normalize(tag.name), tag);
    });

    return value.map((item) => {
      const existingTag = tagsMap.get(normalize(item));
      const colour = existingTag ? getTagColor(existingTag) : 'blue';

      return {
        value: item,
        label: item,
        colour,
        isFixed: disabled,
      };
    });
  }, [value, tagsList, disabled]);

  return (
    <div ref={containerRef}>
      <Dropdown
        id={`${id}-tags-value`}
        label={label}
        options={formattedTagList}
        dropdownStyle='single'
        value={formattedValue}
        isMultiSelect
        onChange={handleChange}
        onCreate={handleCreate}
        disabled={disabled}
        placeholder={placeholder}
        style={{ minWidth: 200 }}
        isCreateable
        actionButtonText={showManageTags ? 'Manage Tags' : null}
        onActionButtonClick={onActionButtonClick}
        width={width}
        isPortal={isPortal}
        aria-label={label || 'Tag input — type a tag name and press Enter to add'}
        {...rest}
      />
    </div>
  );
});

EditableTagWidget.displayName = 'EditableTagWidget';
EditableTagWidget.propTypes = propTypes;

export default EditableTagWidget;
