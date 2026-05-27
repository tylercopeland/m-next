import React from 'react';
import PropTypes from 'prop-types';
import Container from '@m-next/container';
import ListItem from './ListItem';

const propTypes = {
  searchedList: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
  optionKey: PropTypes.string.isRequired,
  optionCaption: PropTypes.string.isRequired,
  optionsIcon: PropTypes.string,
  onAdd: PropTypes.func.isRequired,
  searchText: PropTypes.string,
  selectedField: PropTypes.number,
};

const OptionsList = ({ searchedList, optionKey, optionCaption, optionsIcon, onAdd, searchText, selectedField }) => (
  <Container scrollable style={{ gap: 8, padding: 0 }} maxHeight={300}>
    {searchedList.map((item, index) => (
      <ListItem
        id={`item-${item[optionKey]}`}
        key={`item-${item[optionKey]}`}
        label={item[optionCaption]}
        value={item[optionKey]}
        icon={item[optionsIcon]}
        showCheckbox={false}
        onClick={() => onAdd(item)}
        searchText={searchText}
        selected={selectedField === index}
      />
    ))}
  </Container>
);

OptionsList.propTypes = propTypes;
export default OptionsList;
