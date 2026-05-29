import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Tag } from '@m-next/types';
import ReadOnlyTagWidget from './ReadOnlyTagWidget';
import EditableTagWidget from './EditableTagWidget';

const propTypes = {
  id: PropTypes.string,
  tagsList: PropTypes.arrayOf(Tag),
  value: PropTypes.arrayOf(PropTypes.string),
  suggestions: PropTypes.arrayOf(PropTypes.string),

  // Clean API
  label: PropTypes.string,
  // Deprecated — soft-shimmed downstream
  caption: PropTypes.string,

  disabled: PropTypes.bool,
  isEditable: PropTypes.bool,
  onChange: PropTypes.func,
  showManageTags: PropTypes.bool,
  onActionButtonClick: PropTypes.func,
  size: PropTypes.oneOf(['narrow', 'regular']),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  placeholder: PropTypes.string,
  isPortal: PropTypes.bool,
};

/**
 * Wrapper around <EditableTagWidget> / <ReadOnlyTagWidget>. Switch with
 * `isEditable`. Refs are forwarded to the active inner component.
 */
const TagWidget = forwardRef(function TagWidget(props, ref) {
  const {
    tagsList = [],
    value = [],
    suggestions = [],
    disabled = false,
    isEditable = false,
    showManageTags,
    onActionButtonClick,
    onChange,
    size = 'narrow',
    width,
    placeholder = 'Begin typing a tag name',
    isPortal = false,
    ...rest
  } = props;

  if (isEditable) {
    return (
      <EditableTagWidget
        ref={ref}
        tagsList={tagsList}
        value={value}
        suggestions={suggestions}
        onChange={onChange}
        disabled={disabled}
        showManageTags={showManageTags}
        onActionButtonClick={onActionButtonClick}
        size={size}
        width={width}
        placeholder={placeholder}
        isPortal={isPortal}
        {...rest}
      />
    );
  }

  return <ReadOnlyTagWidget ref={ref} tagsList={tagsList} value={value} size={size} {...rest} />;
});

TagWidget.displayName = 'TagWidget';
TagWidget.propTypes = propTypes;

export default TagWidget;
