import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ChipsFilter from '../src/ChipsFilter';
import fieldList from './data/fieldListActivities.json';
import expression from './data/expression.json';

const propTypes = {
  id: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  isMobile: PropTypes.bool,
  isEmpty: PropTypes.bool,
};

const options = [
  { value: '1', label: 'Alex', avatar: 'AB.mci' },
  { value: '2', label: 'Debbie', avatar: 'DD.mci' },
  { value: '3', label: " Bad'Val ", avatar: 'DD.mci' },
  { value: '4', label: 'Even Long tag name with 2024mmmmmmmmmmmmmmmmmmhhhhhhhhhhhhttttttt lol ', avatar: 'DD.mci' },
];

function FilterWrapper({ id = '', disabled = false, isMobile = false, isEmpty }) {
  const [internalExpression] = useState(isEmpty ? null : expression);
  const [searchText, setSearchText] = useState('');

  const filterOptions = useMemo(
    () => options.filter((o) => o.label.toLowerCase().includes(searchText.toLowerCase())),
    [searchText],
  );
  return (
    <ChipsFilter
      id={id}
      disabled={disabled}
      isMobile={isMobile}
      fieldList={fieldList}
      simpleChipsExpression={internalExpression?.simple}
      advancedChipsExpression={internalExpression?.advanced}
      onExpressionChange={() => {}}
      onSearch={(field, text) => {
        setSearchText(text);
      }}
      options={filterOptions}
      viewName='Activities'
      tagsList={[
        {
          colour: '#A9D9BF',
          name: 'Hot lead ',
        },
        {
          colour: '#84F3FF',
          name: "Ala'a",
        },
        {
          colour: '#BACAD0',
          name: 'Sales Con',
        },
        {
          colour: '#B3E5FF',
          name: 'Duplicate',
        },
        {
          colour: '#FFCDAB',
          name: 'Unpaid',
        },
        {
          colour: '#FFCDAB',
          name: 'Super Long tag name with 2024',
        },
        {
          colour: '#FFCDAB',
          name: 'Even Long tag name with 2024mmmmmmmmmmmmmmmmmmhhhhhhhhhhhhttttttt lol',
        },
      ]}
    />
  );
}

FilterWrapper.propTypes = propTypes;
export default FilterWrapper;
