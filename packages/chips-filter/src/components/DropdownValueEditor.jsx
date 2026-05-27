import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { InfiniteScrollContainer } from '@m-next/container';
import { complexValueTypes } from '@m-next/types';
import SearchInput from '@m-next/search-input';
import { TextLine } from '@m-next/typeography';
import ListItem from './ListItem';

// types
const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string,
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  onChange: PropTypes.func,
  searchText: PropTypes.string,
  onSearch: PropTypes.func,
  field: PropTypes.string,
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

function DropdownValueEditor({ id, value, options, onChange, searchText, onSearch, field, tooltipId }) {
  const selectedValues = value ? value.trim().split(',') : [];
  const cleanOptions = useMemo(
    () =>
      options?.map((option) => ({
        value: option.value?.trim(),
        label: option.label?.trim(),
        avatar: option.avatar?.trim(),
      })),
    [options],
  );

  useEffect(() => {
    onSearch(field, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClick(selectedValue) {
    if (selectedValues.includes(selectedValue)) {
      if (selectedValues.length === 1) {
        onChange('', complexValueTypes.Text);
      } else {
        const updated = selectedValues.filter((current) => current !== selectedValue).join(',');
        const selectedLabel =
          selectedValues.length === 2
            ? cleanOptions.find((option) => option.value === updated)?.label
            : selectedValues.length - 1;

        onChange(updated, complexValueTypes.Text, selectedLabel);
      }
    } else {
      const selectedLabel = cleanOptions.find((option) => option.value === selectedValue)?.label;

      onChange(
        [...selectedValues, selectedValue].join(','),
        complexValueTypes.Text,
        selectedValues.length === 0 ? selectedLabel : selectedValues.length + 1,
      );
    }
  }

  const handleSearch = (text) => {
    onSearch(field, text);
  };

  return (
    <Wrapper tabIndex={-1}>
      <SearchInput id={`${id}-popover-search`} placeholder='Search' value={searchText} onChange={handleSearch} />
      {cleanOptions && cleanOptions.length > 0 && (
        <InfiniteScrollContainer style={{ gap: 8, maxHeight: 280 }} maxHeight='280px' tabIndex={-1}>
          {cleanOptions.map((option) => (
            <ListItem
              key={option.value}
              id={`${id}-${option.value}`}
              showCheckbox
              label={option.label}
              checked={selectedValues.includes(option.value)}
              onClick={handleClick}
              image={option.avatar}
              showImage={!!option.avatar}
              value={option.value}
              tooltipId={tooltipId}
            />
          ))}
        </InfiniteScrollContainer>
      )}
      {cleanOptions && cleanOptions.length === 0 && (
        <NoResultsWrapper>
          <TextLine bold fontSize='mediumLarge'>
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

DropdownValueEditor.propTypes = propTypes;
export default DropdownValueEditor;
