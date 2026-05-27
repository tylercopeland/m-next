import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { InfiniteScrollContainer } from '@m-next/container';
import { Tag, complexValueTypes } from '@m-next/types';
import SearchInput from '@m-next/search-input';
import { TextLine } from '@m-next/typeography';
import ListItem from './ListItem';

// types
const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.string,
  onChange: PropTypes.func,
  tagsList: PropTypes.arrayOf(Tag),
  tooltipId: PropTypes.string,
};

const Wrapper = styled.div(() => [
  {
    display: 'flex',
    boxSizing: 'border-box',
    flexDirection: 'column',
    width: 248,
    gap: 8,
    overflow: 'hidden',
    maxHeight: 320,
  },
]);

const NoResultsWrapper = styled.div(() => [
  {
    display: 'flex',
    boxSizing: 'border-box',
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 0px',
  },
]);

function TagsValueEditor({ id, value, onChange, tagsList, tooltipId }) {
  const [searchText, setSearchText] = useState(null);
  const selectedValues = value ? value.trim().split(',') : [];
  const filteredTagsList = searchText
    ? tagsList.filter((tag) => tag.name.toLowerCase().includes(searchText))
    : tagsList;

  function handleClick(val) {
    const selectedValue = val.trim();

    if (selectedValues.includes(selectedValue)) {
      if (selectedValues.length === 1) {
        onChange('', complexValueTypes.Text);
      } else {
        const updated = selectedValues.filter((current) => current !== selectedValue).join(',');
        const selectedLabel = selectedValues.length === 2 ? updated : selectedValues.length - 1;

        onChange(updated, complexValueTypes.Text, selectedLabel);
      }
    } else {
      onChange(
        [...selectedValues, selectedValue].join(','),
        complexValueTypes.Text,
        selectedValues.length === 0 ? selectedValue : selectedValues.length + 1,
      );
    }
  }
  return (
    <Wrapper tabIndex={-1}>
      <SearchInput
        id={`${id}-popover-search`}
        placeholder='Search'
        value={searchText}
        onChange={(e) => {
          setSearchText(e.toLowerCase());
        }}
      />
      {filteredTagsList && filteredTagsList.length > 0 && (
        <InfiniteScrollContainer style={{ gap: 8, maxHeight: 280 }} maxHeight='280px' tabIndex={-1}>
          {filteredTagsList.map((option) => {
            const optionValue = option?.name.trim();

            return (
              <ListItem
                key={option.name}
                id={`${id}-${option.name}`}
                showCheckbox
                label={option.name}
                checked={selectedValues.includes(optionValue)}
                onClick={handleClick}
                value={option.name}
                showLabel={false}
                showPill
                tagsList={tagsList}
                tooltipId={tooltipId}
              />
            );
          })}
        </InfiniteScrollContainer>
      )}
      {filteredTagsList && filteredTagsList.length === 0 && searchText && (
        <NoResultsWrapper>
          <TextLine bold fontSize='large'>
            No results found
          </TextLine>
          <TextLine style={{ textAlign: 'center' }}>
            Try changing the search terms to get the results you&apos;re looking for.
          </TextLine>
        </NoResultsWrapper>
      )}
    </Wrapper>
  );
}

TagsValueEditor.propTypes = propTypes;
export default TagsValueEditor;
