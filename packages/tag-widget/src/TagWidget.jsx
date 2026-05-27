import * as React from 'react';
import PropTypes from 'prop-types';
import { Tag } from '@m-next/types';
import ReadOnlyTagWidget from './ReadOnlyTagWidget';
import EditableTagWidget from './EditableTagWidget';

// types
const propTypes = {
  id: PropTypes.string,
  tagsList: PropTypes.arrayOf(Tag),
  value: PropTypes.arrayOf(PropTypes.string),
  suggestions: PropTypes.arrayOf(PropTypes.string),

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
 * Wrapper component around
 */
function TagWidget({
  id = '',
  tagsList = [],
  value = [],
  caption,
  disabled = false,
  isEditable = false,
  suggestions = [],
  onChange,
  showManageTags,
  onActionButtonClick,
  size = 'narrow',
  width,
  placeholder = 'Begin typing a tag name',
  isPortal = false,
}) {
  if (isEditable) {
    return (
      <EditableTagWidget
        id={id}
        caption={caption}
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
      />
    );
  }

  return <ReadOnlyTagWidget id={id} caption={caption} tagsList={tagsList} value={value} size={size} />;
}

TagWidget.propTypes = propTypes;
export default TagWidget;
