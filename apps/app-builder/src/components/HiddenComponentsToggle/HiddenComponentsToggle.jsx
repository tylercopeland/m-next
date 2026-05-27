import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';
import SvgIcon from '@m-next/svg-icon';
import { Z_POPUP } from '@m-next/layout-canvas';
import { ToggleContainer, ToggleButton, ToggleCircle } from './HiddenComponentsToggle.styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectShowHiddenComponents,
  setShowHiddenComponents,
  controlSelected,
  selectResolution,
  selectControlResponsiveData,
} from '../../common/services/screenLayoutSlice';
import { getHiddenState } from '@m-next/layout-canvas/src/utils/currentStateHelper';
/**
 * HiddenComponentsToggle - A toggle component for showing/hiding hidden components
 * Matches the Figma design with two states and a sliding toggle circle
 *
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS class name
 * @returns {JSX.Element} The HiddenComponentsToggle component
 */
const HiddenComponentsToggle = ({ className = '' }) => {
  const dispatch = useDispatch();
  const showHidden = useSelector(selectShowHiddenComponents);
  const resolution = useSelector(selectResolution);
  const selectedControlId = useSelector((state) => state.screenLayout?.selectedControlId);
  const responsiveData = useSelector((state) => selectControlResponsiveData(state, selectedControlId));

  const handleClick = () => {
    const showHiddenNew = !showHidden;
    dispatch(setShowHiddenComponents(showHiddenNew));
    // If hiding components and currently selected control is hidden,
    // set selection to screen instead
    if (showHiddenNew === false) {
      const isHidden = getHiddenState({}, responsiveData, resolution, 'designer');
      if (isHidden) {
        dispatch(controlSelected({ controlId: null, property: null, canvasClickDisabled: false }));
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <>
      <ToggleContainer className={className}>
        <ToggleButton
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role='button'
          aria-label={showHidden ? 'Hidden components' : 'Show hidden components'}
          aria-pressed={showHidden}
          isHidden={!showHidden}
          data-tooltip-id='hidden-components-tooltip'
          data-tooltip-content='Hidden components'
          data-tooltip-place='bottom'
        >
          {/* Toggle circle that slides between positions and contains the appropriate icon */}
          <ToggleCircle isHidden={!showHidden}>
            <SvgIcon
              name={showHidden ? 'eye-open-V4' : 'eye-closed-V4'}
              size={16}
              color={showHidden ? 'white' : '#545F67'}
            />
          </ToggleCircle>
        </ToggleButton>
      </ToggleContainer>
      <Tooltip
        id='hidden-components-tooltip'
        style={{
          backgroundColor: '#0F1B31',
          color: '#FFFFFF',
          fontSize: '12px',
          fontFamily: 'Source Sans Pro, sans-serif',
          fontWeight: 600,
          lineHeight: '16px',
          padding: '4px 8px',
          borderRadius: '2px',
          zIndex: Z_POPUP.POPOVER,
        }}
      />
    </>
  );
};

HiddenComponentsToggle.propTypes = {
  className: PropTypes.string,
};

export default HiddenComponentsToggle;
