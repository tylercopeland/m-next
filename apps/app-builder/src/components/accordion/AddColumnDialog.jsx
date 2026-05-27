import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Popover from '@m-next/popover';
import SearchInput from '@m-next/search-input';
import OptionsList from './OptionsList';
import NoResults from './NoResults';

const propTypes = {
  id: PropTypes.string,
  onClose: PropTypes.func,
  onAdd: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  anchorEl: PropTypes.instanceOf(Object),
  optionKey: PropTypes.string,
  optionCaption: PropTypes.string,
  optionsIcon: PropTypes.string,
  shiftLeft: PropTypes.number,
};

const KEYS = {
  ENTER: 13,
  ARROW_UP: 38,
  ARROW_DOWN: 40,
  HOME: 35,
  END: 36,
  ESCAPE: 27,
};

const filterOption = (option, inputValue, optionKey, optionCaption) => {
  if (!inputValue) return true;
  const cleanInput = inputValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(cleanInput.trim(), 'i');
  if (!option[optionKey] && !option[optionCaption]) return false;
  const matchesKey = option[optionKey]?.toString().match(regex);
  const matchesCaption = option[optionCaption]?.toString().match(regex);
  const matches = [...new Set([matchesKey, matchesCaption].filter(Boolean))];

  return matches !== null && matches.length > 0;
};

const useKeyboardNavigation = (searchedList, selectedField, setSelectedField, onAdd, onClose) => {
  const handleKeyPress = (e) => {
    const keyPressed = e.keyCode;
    const lastIndex = searchedList.length - 1;

    switch (keyPressed) {
      case KEYS.ENTER:
        if (selectedField !== null) {
          onAdd(searchedList[selectedField]);
        }
        break;

      case KEYS.ARROW_UP:
        setSelectedField(selectedField === null || selectedField === 0 ? lastIndex : selectedField - 1);
        break;

      case KEYS.ARROW_DOWN:
        setSelectedField(selectedField === null ? 0 : selectedField === lastIndex ? 0 : selectedField + 1);
        break;

      case KEYS.HOME:
        setSelectedField(0);
        break;

      case KEYS.END:
        setSelectedField(lastIndex);
        break;

      case KEYS.ESCAPE:
        onClose();
        break;

      default:
        break;
    }
  };

  return handleKeyPress;
};

function AddColumnDialog({ id, onClose, onAdd, options, anchorEl, optionKey, optionCaption, optionsIcon, shiftLeft }) {
  const [searchText, setSearchText] = useState('');
  const [selectedField, setSelectedField] = useState(null);

  const searchedList = useMemo(
    () => options.filter((field) => filterOption(field, searchText, optionKey, optionCaption)),
    [optionCaption, optionKey, options, searchText],
  );

  const handleKeyPress = useKeyboardNavigation(searchedList, selectedField, setSelectedField, onAdd, onClose);

  const handleSearchChange = (value) => {
    setSearchText(value);
    setSelectedField(0);
  };

  return (
    <Popover
      id={`${id}-add-dialog`}
      title='Add column to grid'
      open
      onClose={onClose}
      anchorEl={anchorEl}
      shiftLeft={-96 + shiftLeft}
      marginVertical={8}
      marginHorizontal={0}
      inline
      relativeToParent
      width={240}
      shiftDown={8}
    >
      <div style={{ width: 240, padding: '8px 8px 16px 8px' }}>
        {options?.length > 8 && (
          <SearchInput
            id='field-search'
            value={searchText}
            placeholder='Search'
            onChange={handleSearchChange}
            onKeyUp={handleKeyPress}
          />
        )}
        <div style={{ height: 8 }} />

        {options?.length > 0 && (
          <OptionsList
            searchedList={searchedList}
            optionKey={optionKey}
            optionCaption={optionCaption}
            optionsIcon={optionsIcon}
            onAdd={onAdd}
            searchText={searchText}
            selectedField={selectedField}
          />
        )}

        {searchedList?.length === 0 && searchText && <NoResults />}
      </div>
    </Popover>
  );
}

AddColumnDialog.propTypes = propTypes;
export default AddColumnDialog;
