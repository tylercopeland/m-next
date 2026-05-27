import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import RadioGroup from '@m-next/radio-button';
import { Field } from '@m-next/types';

// types
const selectableValue = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
});

const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.arrayOf(selectableValue),
  selectedValue: PropTypes.string,
  onChange: PropTypes.func,
  direction: PropTypes.oneOf(['row', 'column']),
  disabled: PropTypes.bool,
  field: Field,
};

const Wrapper = styled.div(() => [
  {
    display: 'flex',
    boxSizing: 'border-box',
    gap: 8,
  },
]);

const defaultOptions = [
  {
    label: 'True',
    value: 'true',
  },
  {
    label: 'False',
    value: 'false',
  },
];

function YesNoValueEditor({ id, selectedValue, onChange, direction, disabled, field }) {
  const options = useMemo(() => {
    if (field && field.displayAs === 'custom') {
      return [
        {
          label: field.displayOptions?.trueValue,
          value: 'true',
        },
        {
          label: field.displayOptions?.falseValue,
          value: 'false',
        },
      ];
    }

    return defaultOptions;
  }, [field]);

  const render = () => (
    <Wrapper>
      <RadioGroup
        id={`${id}-value`}
        name={`${id}-value`}
        selectedValue={selectedValue}
        options={options}
        onChange={onChange}
        direction={direction}
        disabled={disabled}
        wrapperStyle={{ paddingTop: '0.5rem' }}
      />
    </Wrapper>
  );

  return render();
}

YesNoValueEditor.propTypes = propTypes;
export default YesNoValueEditor;
