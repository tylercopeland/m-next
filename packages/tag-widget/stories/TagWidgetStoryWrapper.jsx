import * as React from 'react';
import PropTypes from 'prop-types';
import { Tag } from '@m-next/types';
import { useState } from 'react';
import TagWidget from '../src';

// types
const propTypes = {
  id: PropTypes.string,
  tagsList: PropTypes.arrayOf(Tag),
  value: PropTypes.arrayOf(PropTypes.string),
  suggestions: PropTypes.arrayOf(PropTypes.string),

  caption: PropTypes.string,
  disabled: PropTypes.bool,
  isEditable: PropTypes.bool,
  showManageTags: PropTypes.bool,
  onActionButtonClick: PropTypes.func,
};

/**
 * Wrapper component around
 */
function TagWidgetStoryWrapper({
  id = '',
  tagsList = [],
  value = [],
  caption,
  disabled = false,
  isEditable = false,
  suggestions = [],
  showManageTags,
  onActionButtonClick,
}) {
  const [currentValue, setCurrentValue] = useState(value);

  const handleOnChange = (e) => {
    setCurrentValue(e);
  };

  return (
    <TagWidget
      id={id}
      caption={caption}
      tagsList={tagsList}
      value={currentValue}
      disabled={disabled}
      isEditable={isEditable}
      suggestions={suggestions}
      onChange={handleOnChange}
      showManageTags={showManageTags}
      onActionButtonClick={onActionButtonClick}
    />
  );
}

TagWidgetStoryWrapper.propTypes = propTypes;
export default TagWidgetStoryWrapper;
