import * as React from 'react';
import PropTypes from 'prop-types';
import { Field, Tag } from '@m-next/types';
import { useState } from 'react';
import FieldBlock from '../src';

// types
const propTypes = {
  id: PropTypes.string,
  fields: PropTypes.arrayOf(Field),
  collapseEmpty: PropTypes.bool,
  isLoading: PropTypes.bool,
  style: PropTypes.instanceOf(Object),
  data: PropTypes.instanceOf(Object),
  error: PropTypes.string,
  onRefetch: PropTypes.func,
  forceOpen: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  displayPreferences: PropTypes.instanceOf(Object),
  tagsList: PropTypes.arrayOf(Tag),
  onMoreClick: PropTypes.func,
  showMoreRef: PropTypes.instanceOf(Object),
  onSelect: PropTypes.func,
  selectedField: PropTypes.string,
  mode: PropTypes.number,
  showSave: PropTypes.bool,
  showClearAndNew: PropTypes.bool,
  showEdit: PropTypes.bool,
  saveLabel: PropTypes.string,
  clearLabel: PropTypes.string,
  onSaveClick: PropTypes.func,
  onClearClick: PropTypes.func,
};

/**
 * Wrapper component around
 */
function FieldBlockStoryWrapper({
  id = '',
  fields,
  collapseEmpty = false,
  isLoading = false,
  style = {},
  data = {},
  error,
  onRefetch,
  forceOpen = false,
  width,
  displayPreferences,
  tagsList,
  onMoreClick = null,
  showMoreRef = null,
  onSelect = null,
  selectedField = null,
  mode = 0,
  showSave = false,
  showClearAndNew = false,
  showEdit = false,
  saveLabel = 'Save',
  clearLabel = 'Clear and new',
  onSaveClick,
  onClearClick,
}) {
  const [currentValue, setCurrentValue] = useState(data);
  const [currentTagsList, setCurrentTagsList] = useState(tagsList);

  return (
    <FieldBlock
      id={id}
      fields={fields}
      collapseEmpty={collapseEmpty}
      isLoading={isLoading}
      style={style}
      data={currentValue}
      error={error}
      onRefetch={onRefetch}
      forceOpen={forceOpen}
      width={width}
      displayPreferences={displayPreferences}
      tagsList={tagsList}
      onMoreClick={onMoreClick}
      showMoreRef={showMoreRef}
      onSelect={onSelect}
      selectedField={selectedField}
      mode={mode}
      showSave={showSave}
      showClearAndNew={showClearAndNew}
      showEdit={showEdit}
      saveLabel={saveLabel}
      clearLabel={clearLabel}
      onSaveClick={onSaveClick}
      onClearClick={onClearClick}
    />
  );
}

FieldBlockStoryWrapper.propTypes = propTypes;
export default FieldBlockStoryWrapper;
