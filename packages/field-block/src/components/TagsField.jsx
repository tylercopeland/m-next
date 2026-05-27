import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Field, Tag } from '@m-next/types';
import TagWidget from '@m-next/tag-widget';

import * as s from '../fieldBlock.styles';

const propTypes = {
  id: PropTypes.string,
  field: Field,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Object)]),
  onSelect: PropTypes.func,
  selected: PropTypes.string,
  mode: PropTypes.number,
  onChange: PropTypes.func,
  tagsList: PropTypes.arrayOf(Tag),
};

function TagsField({ id, field, value, onSelect, selected, mode, onChange, tagsList }) {
  const [clicked, setClicked] = useState(false);
  const [clickTimer, setClickTimer] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      clearTimeout(clickTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetClick = useCallback(() => {
    clearTimeout(clickTimer);
    setClickTimer(
      setTimeout(() => {
        if (isMounted.current) {
          setClicked(false);
        }
      }, 100),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setClicked, isMounted]);

  const handleClick = (e) => {
    if (onSelect) {
      setClicked(true);
      resetClick();
      onSelect(e, id, field.name);
    }
  };

  useEffect(() => {
    setClicked(true);
    resetClick();
  }, [selected, resetClick]);

  const handleTagChange = (val) => {
    if (!val || val.length === 0) {
      return null;
    }

    onChange(field.name, val.join(','));
  };

  return (
    <s.ReadOnlyLine
      data-testid={`${id}-data-block-line-${field.name}`}
      selected={field.name === selected}
      initial={clicked}
      onClick={handleClick}
    >
      {mode === 0 && (
        <s.ReadonlyLabel id={`${id}-data-block-line-${field.name}-caption`}>{field.caption}</s.ReadonlyLabel>
      )}
      <TagWidget
        id={`${id}-data-block-line-${field.name}-value`}
        tagsList={tagsList}
        value={value && value.trim().length > 0 ? value.trim().split(',') : []}
        isV4Design
        isEditable={mode === 1}
        onChange={handleTagChange}
      />
    </s.ReadOnlyLine>
  );
}

TagsField.propTypes = propTypes;
export default TagsField;
