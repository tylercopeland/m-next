import * as React from 'react';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import Pill from '@m-next/pill';
import Caption from '@m-next/caption';
import { Tag } from '@m-next/types';
import * as s from './TagWidget.styles';

// types
const propTypes = {
  id: PropTypes.string,
  tagsList: PropTypes.arrayOf(Tag),
  value: PropTypes.arrayOf(PropTypes.string),
  caption: PropTypes.string,
  size: PropTypes.oneOf(['narrow', 'regular']),
};

const normalize = (str) => (str || '').trim().toLowerCase();

const colourToScheme = (colour) => {
  switch (colour?.toLowerCase()) {
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

function ReadOnlyTagWidget({ id, tagsList = [], value = [], caption, size = 'narrow' }) {
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
    <s.ReadonlyWrapper>
      {caption && <Caption id={`${id}-tags`} label={caption} isV4Design float readOnly />}
      <s.ReadonlyTags id={`${id}-tags-value`} hasCaption={caption}>
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
}

ReadOnlyTagWidget.propTypes = propTypes;
export default ReadOnlyTagWidget;
