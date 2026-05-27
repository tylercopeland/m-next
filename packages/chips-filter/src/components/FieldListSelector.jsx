import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { TextLine } from '@m-next/typeography';
import { InfiniteScrollContainer } from '@m-next/container';
import { Field, Predicate, EmptyPredicate, complexValueTypes } from '@m-next/types';
import SearchInput from '@m-next/search-input';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import ListItem from './ListItem';

const propTypes = {
  id: PropTypes.string.isRequired,
  isMobile: PropTypes.bool,
  fieldList: PropTypes.arrayOf(Field),
  value: Predicate,
  onChange: PropTypes.func,
  onShowAdvancedEdit: PropTypes.func,
};

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

const AdvancedWrapper = styled.div(() => [
  {
    display: 'flex',
    boxSizing: 'border-box',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderTop: `1px solid ${colors['grey-light']}`,
    padding: '8px 8px 0px 8px',
    marginTop: 4,
  },
]);

function FieldListSelector({ id = '', isMobile = false, fieldList, value, onChange, onShowAdvancedEdit }) {
  const [searchText, setSearchText] = useState(null);

  const filterOption = (option, inputValue) => {
    if (!inputValue) return true;
    const cleanInput = inputValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(cleanInput.trim(), 'i');
    const matches = option.caption ? option.caption.match(regex) : option.name.match(regex);

    return matches !== null && matches.length > 0;
  };

  const filteredFieldList = useMemo(
    () => fieldList.filter((field) => filterOption(field, searchText)),
    [fieldList, searchText],
  );

  const handleChange = (field) => {
    const delta = { ...EmptyPredicate };
    delta.value = field.name;
    delta.type = complexValueTypes.Field;
    delta.metadata = {
      type: field.type,
    };
    onChange(delta);
  };

  return (
    <div>
      <SearchInput
        id={`${id}-field-search`}
        value={searchText}
        placeholder='Search'
        onChange={(e) => setSearchText(e)}
      />
      <div style={{ height: 8 }} />

      {filteredFieldList && filteredFieldList.length > 0 && (
        <InfiniteScrollContainer style={{ gap: 8 }} maxHeight={300}>
          {filteredFieldList.map((field) => (
            <ListItem
              id={`${id}-field-${field.name}-${field.type}`}
              key={`${id}-field-${field.name}-${field.type}`}
              label={field.caption || field.name}
              showCheckbox={false}
              bold
              isMobile={isMobile}
              selected={value?.value === field.name}
              onClick={() => handleChange(field)}
            />
          ))}
        </InfiniteScrollContainer>
      )}

      {filteredFieldList && filteredFieldList.length === 0 && searchText && (
        <NoResultsWrapper>
          <TextLine bold fontSize='mediumLarge'>
            No results found
          </TextLine>
          <TextLine style={{ textAlign: 'center' }}>
            Try changing the search terms to get the
            <br /> results you&apos;re looking for.
          </TextLine>
        </NoResultsWrapper>
      )}

      <AdvancedWrapper>
        <SvgIcon
          id={`${id}-advanced-edit`}
          name='settings'
          size={16}
          position='left'
          color={colors.grey}
          onClick={onShowAdvancedEdit}
        />
        <TextLine bold style={{ cursor: 'pointer', flexGrow: 1 }} onClick={onShowAdvancedEdit}>
          Advanced Filter
        </TextLine>
      </AdvancedWrapper>
    </div>
  );
}

FieldListSelector.propTypes = propTypes;
export default FieldListSelector;
