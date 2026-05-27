import * as React from 'react';
import PropTypes from 'prop-types';
import { Tag } from '@m-next/types';
import Dropdown from '@m-next/dropdown';
import { useMemo } from 'react';

// types
const propTypes = {
  id: PropTypes.string,
  tagsList: PropTypes.arrayOf(Tag),
  value: PropTypes.arrayOf(PropTypes.string),
  suggestions: PropTypes.arrayOf(PropTypes.string),
  caption: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  showManageTags: PropTypes.bool,
  onActionButtonClick: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  placeholder: PropTypes.string,
  isPortal: PropTypes.bool,
};

const normalize = (str) => (str || '').trim().toLowerCase();

const getTagColor = (tag) => {
  switch (tag.colour.toLowerCase()) {
    case '#84f3ff':
      return 'teal';
    case '#a9d9bf':
      return 'green';
    case '#ffabb5':
      return 'fuchsia';
    case '#bacad0':
      return 'grey';
    case '#ffea80':
      return 'yellow';
    case '#ffaca1':
      return 'red';
    case '#91a2ff':
      return 'purple';
    case '#ffcdab':
      return 'orange';
    default:
      return 'blue';
  }
};

function EditableTagWidget({
  id,
  tagsList = [],
  value = [],
  caption,
  suggestions = [],
  onChange,
  disabled = false,
  showManageTags = false,
  onActionButtonClick = null,
  width,
  placeholder = 'Begin typing a tag name',
  isPortal = false,
}) {
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
    <Dropdown
      id={`${id}-tags-value`}
      caption={caption}
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
      isV4Design
      width={width}
      isPortal={isPortal}
    />
  );
}

EditableTagWidget.propTypes = propTypes;
export default EditableTagWidget;
