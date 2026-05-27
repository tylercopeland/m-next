import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import * as s from './ButtonGroupRow.styles';

const propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
      label: PropTypes.string,
      icon: PropTypes.string,
      labelStyle: PropTypes.instanceOf(Object),
    }),
  ),
  id: PropTypes.string,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  onClick: PropTypes.func,
  tooltipId: PropTypes.string,
  tooltipPlace: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

function ButtonGroupRow({ data = [], onClick = null, id = null, selected, tooltipId, tooltipPlace, width }) {
  const [selectedItem, setSelectedItem] = useState(selected);

  useEffect(() => {
    setSelectedItem(selected);
  }, [selected]);

  return (
    <s.ButtonGroupRowWrapper id={id} width={width}>
      {data.map((item, index) => (
        <s.ButtonGroupRowButton
          id={`${id}-${index}`}
          key={item.value}
          onClick={() => {
            if (!item.disabled) {
              setSelectedItem(item.value);
              if (onClick) {
                onClick(item, index);
              }
            }
          }}
          selected={selectedItem === item.value}
          index={index}
          length={data.length}
          disabled={item.disabled}
          data-tooltip-id={tooltipId}
          data-tooltip-html={item.tooltip}
          data-tooltip-place={tooltipPlace}
          data-tooltip-position-strategy={item.tooltip ? 'fixed' : null}
        >
          {item.label && (item.labelStyle ? <span style={item.labelStyle}>{item.label}</span> : item.label)}
          {item.icon && (
            <SvgIcon
              name={item.icon}
              size={16}
              color={selectedItem === item.value ? colors.blue : colors.grey}
              hoverColor={colors.blue}
            />
          )}
        </s.ButtonGroupRowButton>
      ))}
    </s.ButtonGroupRowWrapper>
  );
}

ButtonGroupRow.propTypes = propTypes;

export default ButtonGroupRow;
