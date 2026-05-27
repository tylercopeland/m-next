import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import AddableList from '../../../../../../components/addable-list/AddableList';


const standardStyles = {
  'font-color': [{ label: 'Font color', value: 'font-color', type: 'font-color' }],
  'background-color': [{ label: 'Background color', value: 'background-color', type: 'fill-color' }],
  'font-size': [{ label: 'Font size', value: 'font-size', type: 'font-size' }],
  caption: [
    { label: 'Caption color', value: 'caption-color', type: 'font-color' },
    { label: 'Caption size', value: 'caption-size', type: 'font-size' },
    { label: 'Caption alignment', value: 'caption-alignment', type: 'alignment' },
    { label: 'Caption font weight', value: 'caption-weight', type: 'font-weight' },
  ],
  border: [
    //  { label: 'Right border size', value: 'border-right-size', type: 'border-size' },
    { label: 'Right border color', value: 'border-right-color', type: 'color' },
    //   { label: 'Right border style', value: 'border-right-style', type: 'border-style' },
    //  { label: 'Left border size', value: 'border-left-size', type: 'border-size' },
    { label: 'Left border color', value: 'border-left-color', type: 'color' },
    //  { label: 'Left border style', value: 'border-left-style', type: 'border-style' },
    //   { label: 'Top border size', value: 'border-top-size', type: 'border-size' },
    { label: 'Top border color', value: 'border-top-color', type: 'color' },
    //  { label: 'Top border style', value: 'border-top-style', type: 'border-style' },
    //  { label: 'Bottom border size', value: 'border-bottom-size', type: 'border-size' },
    { label: 'Bottom border color', value: 'border-bottom-color', type: 'color' },
    //  { label: 'Bottom border style', value: 'border-bottom-style', type: 'border-style' },
  ],
};

const propTypes = {
  onChange: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
      readOnly: PropTypes.bool,
    }),
  ),
  standardOptions: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(standardStyles))),
};

const StylesList = ({ onChange, values, standardOptions }) => {
  const options = useMemo(() => standardOptions.map((option) => standardStyles[option]).flat(), [standardOptions]);
  return (
    <AddableList
      id='styles-list'
      data-testid='styles-list'
      caption='Style'
      clearable
      onChange={onChange}
      values={values}
      mode='removable'
      options={options}
    />
  );
};

StylesList.propTypes = propTypes;
export default StylesList;
