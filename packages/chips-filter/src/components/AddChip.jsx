import React from 'react';
import PropTypes from 'prop-types';
import Pill from '@m-next/pill';
import SvgIcon from '@m-next/svg-icon';

const propTypes = {
  id: PropTypes.string,
  onClick: PropTypes.func,
  showLabel: PropTypes.bool,
  forwardRef: PropTypes.instanceOf(Object),
  isVisible: PropTypes.bool,
};

function AddChip({ id, onClick, showLabel = true, forwardRef, isVisible }) {
  return showLabel ? (
    <Pill
      id={id}
      onClick={onClick}
      colorScheme='transparent'
      variant='ghost'
      bold={false}
      trailIcon={{
        name: 'plus',
        size: 12,
      }}
      fontSize={14}
      maxWidth={showLabel ? 100 : 20}
      forwardRef={forwardRef}
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      {showLabel ? 'Add filter' : null}
    </Pill>
  ) : (
    <SvgIcon
      id={id}
      name='plus'
      isRound
      size={12}
      border
      style={{ width: 22, visibility: isVisible ? 'visible' : 'hidden' }}
      onClick={onClick}
      isV4Design
      forwardRef={forwardRef}
      tooltip='Add filter'
      tooltipId={`${id}-chips-tooltip`}
    />
  );
}

AddChip.propTypes = propTypes;
export default AddChip;
