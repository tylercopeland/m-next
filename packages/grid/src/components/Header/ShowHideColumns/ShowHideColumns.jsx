import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import SearchInput from '@m-next/search-input';
import { IconMenuList, MenuItem } from '@m-next/menu';
import { interactions } from '@m-next/utilities';
import Container from '@m-next/container';
import Checkbox from '@m-next/checkbox';
import Column from '../../../ColumnPropType';

const propTypes = {
  id: PropTypes.string,
  columns: PropTypes.arrayOf(Column),
  activeColumns: PropTypes.arrayOf(Column),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  returnCodeSnippet: PropTypes.bool,
  isV4Design: PropTypes.bool,
};

const KEY_CODES = {
  ENTER: 13,
  ARROW_UP: 38,
  ARROW_DOWN: 40,
  END: 35,
  HOME: 36,
};

function ShowHideColumns({
  id = '',
  columns = [],
  activeColumns = [],
  onChange = null,
  disabled,
  returnCodeSnippet = false,
  isV4Design = false,
}) {
  const [searchText, setSearchText] = useState(null);
  const [selectedField, setSelectedField] = useState(null);

  const searchedFieldList = useMemo(() => {
    const filtered = columns
      .filter((column) => column.hideable !== false)
      .filter((column) => {
        if (!searchText) return true;
        const searchLower = searchText.toLowerCase();
        return column.name.toLowerCase().includes(searchLower) || column.caption?.toLowerCase().includes(searchLower);
      });

    // Maintain active columns order
    const ordered = [];
    activeColumns.forEach((activeColumn) => {
      const matchingColumn = filtered.find((column) => column.name === activeColumn.name);
      if (matchingColumn) {
        ordered.push(matchingColumn);
      }
    });

    // Add remaining columns
    filtered.forEach((column) => {
      if (!ordered.some((orderedColumn) => orderedColumn.name === column.name)) {
        ordered.push(column);
      }
    });

    return ordered;
  }, [activeColumns, columns, searchText]);

  const handleActiveColumnChange = (e, column) => {
    interactions.preventPropagation(e);
    if (!activeColumns || activeColumns.length === 0) {
      onChange([column]);
      return;
    }
    const newColumns = activeColumns.find((x) => x.name === column.name)
      ? activeColumns.filter((x) => x.name !== column.name)
      : [...activeColumns, column];
    onChange(newColumns);
  };

  const handleKeyPress = (e) => {
    const keyPressed = e.keyCode;

    // eslint-disable-next-line default-case
    switch (keyPressed) {
      case KEY_CODES.ENTER:
        if (selectedField !== null) {
          handleActiveColumnChange(e, searchedFieldList[selectedField]);
        }
        break;

      case KEY_CODES.ARROW_UP:
        setSelectedField((prev) => (prev === null || prev === 0 ? searchedFieldList.length - 1 : prev - 1));
        break;

      case KEY_CODES.ARROW_DOWN:
        setSelectedField((prev) =>
          // eslint-disable-next-line no-nested-ternary
          prev === null ? 0 : prev === searchedFieldList.length - 1 ? 0 : prev + 1,
        );
        break;

      case KEY_CODES.HOME:
        setSelectedField(0);
        break;

      case KEY_CODES.END:
        setSelectedField(searchedFieldList.length - 1);
        break;
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e);
    setSelectedField(0);
  };

  const renderContent = () => (
    <div>
      <SearchInput
        id='field-search'
        value={searchText}
        placeholder='Search'
        onChange={handleSearchChange}
        onKeyUp={handleKeyPress}
      />
      <div style={{ height: 8 }} />
      <Container borderless padding='0px' maxHeight={340} scrollable>
        {searchedFieldList.map((column, index) => (
          <MenuItem
            key={`${id}-${column.name}`}
            id={`${id}-${column.name}`}
            onClick={(e) => handleActiveColumnChange(e, column)}
            active={selectedField === index}
            style={{ paddingRight: 16 }}
          >
            <Checkbox
              id={`${id}-${column.name}-check`}
              narrow
              checked={!!activeColumns?.find((x) => x.name === column.name)}
              label={column.caption || column.name}
              align='right'
              fullWidth
              bold
            />
          </MenuItem>
        ))}
      </Container>
    </div>
  );

  if (returnCodeSnippet) {
    return renderContent();
  }

  return (
    <IconMenuList
      id={`${id}-show-hide-menu`}
      style={{ gap: 8 }}
      marginVertical={4}
      width={280}
      maxHeight={400}
      icon='layout-three-columns-V4'
      iconBorder
      horizontalAlign='right'
      disabled={disabled}
      inline={!isV4Design}
      relativeToParent={!isV4Design}
    >
      {renderContent()}
    </IconMenuList>
  );
}

ShowHideColumns.propTypes = propTypes;
export default ShowHideColumns;
