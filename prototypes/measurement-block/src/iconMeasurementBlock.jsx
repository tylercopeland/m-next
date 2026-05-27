import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { Field } from '@m-next/types';
import { ComplexValue, expressionParser } from '@m-next/expression';

import MeasurementBlock from './measurementBlock';
import * as s from './measurementBlock.styles';

// types
const propTypes = {
  id: PropTypes.string,
  style: PropTypes.instanceOf(Object),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fields: PropTypes.arrayOf(Field),
  data: PropTypes.instanceOf(Object),
  displayPreferences: PropTypes.instanceOf(Object),
  isLoading: PropTypes.bool,
  error: PropTypes.instanceOf(Object),
  onRefetch: PropTypes.func,
  icon: PropTypes.shape({
    name: PropTypes.string,
    size: PropTypes.number,
    color: PropTypes.string,
    position: PropTypes.oneOf(['left', 'right']),
  }),
  backgroundColor: PropTypes.string,
  title: PropTypes.arrayOf(ComplexValue),
  subtitle: PropTypes.arrayOf(ComplexValue),
  value: PropTypes.arrayOf(ComplexValue),
  unit: PropTypes.string,
  subFooter: PropTypes.arrayOf(ComplexValue),
  onClick: PropTypes.func
};

function IconMeasurementBlock({
  id = '',
  fields,
  isLoading = false,
  style = {},
  data = {},
  error,
  onRefetch,
  width,
  displayPreferences,
  icon,
  backgroundColor,
  title,
  subtitle,
  value,
  unit,
  subFooter,
  onClick,
}) {
  const formatDisplayValue = () =>
    `${expressionParser.formatExpression(value, fields, data, displayPreferences, unit)}  ${unit === '$' ? '' : unit}`;

  return (
    <MeasurementBlock
      id={id}
      style={style}
      isLoading={isLoading}
      error={error}
      onRefetch={onRefetch}
      width={width}
      displayPreferences={displayPreferences}
      backgroundColor={backgroundColor}
      title={title}
      subtitle={subtitle}
      subFooter={subFooter}
      unit={unit}
      value={value}
      data={data}
      fields={fields}
      onClick={onClick}
    >
      <s.IconBody>
        {icon && icon.position !== 'right' && <SvgIcon name={icon.name} size={icon.size} color={icon.color} />}
        <s.IconBodyLabel>{formatDisplayValue()}</s.IconBodyLabel>
        {icon && icon.position === 'right' && <SvgIcon name={icon.name} size={icon.size} color={icon.color} />}
      </s.IconBody>
    </MeasurementBlock>
  );
}

IconMeasurementBlock.propTypes = propTypes;
export default IconMeasurementBlock;
