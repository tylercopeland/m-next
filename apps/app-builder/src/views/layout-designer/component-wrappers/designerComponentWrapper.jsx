import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useTheme } from '@mui/material';
import SvgIcon from '@m-next/svg-icon';
import { widgets } from '@m-next/types';
import {
  selectControlById,
  selectFocusOn,
  focusOn,
  selectIsControlSelected,
  selectIsControlHovered,
  selectCanvasClickDisabled,
  controlHovered,
} from '../../../common/services/screenLayoutSlice';
import * as s from './designerWrapper.styles';

// types
const propTypes = {
  id: PropTypes.string,
  onControlClick: PropTypes.func,
  children: PropTypes.node,
  isValid: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ignoreProperties: PropTypes.bool,
  verticalAlign: PropTypes.string,
};

function DesignerComponentWrapper({
  id,
  onControlClick,
  children,
  isValid = true,
  width,
  ignoreProperties = false,
  display = 'block',
  verticalAlign = '',
}) {
  const dispatch = useDispatch();
  const { negative } = useTheme();

  // ===== PERFORMANCE OPTIMIZATION: Individual Selectors =====
  // Use individual control selector instead of selectControls(state)[id]
  // This prevents re-renders when other controls change
  const control = useSelector((state) => selectControlById(state, id), shallowEqual);

  // Use memoized selection state selectors
  const selectionState = useSelector((state) => selectIsControlSelected(state, id), shallowEqual);
  const isHovered = useSelector((state) => selectIsControlHovered(state, id));

  // Global state selectors (these are less frequent)
  const canvasClickDisabled = useSelector(selectCanvasClickDisabled);
  const focusControl = useSelector(selectFocusOn);

  const handleOnClick = useCallback(
    (e) => {
      if (onControlClick && !canvasClickDisabled && control?.id) {
        onControlClick(control.id);
        e.stopPropagation();
      }
    },
    [onControlClick, canvasClickDisabled, control?.id],
  );

  const wrapperRef = useRef();
  useEffect(() => {
    if (focusControl === id) {
      wrapperRef.current.focus();
      wrapperRef.current.click();
      // Use block: 'nearest' to prevent scrolling the header off screen
      // This ensures scrolling is minimal and constrained to the nearest scrollable parent
      wrapperRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      dispatch(focusOn(null));
    }
  }, [dispatch, focusControl, id]);

  const handleMouseEnter = useCallback(() => {
    if (control?.id) {
      dispatch(controlHovered({ controlId: control.id }));
    }
  }, [dispatch, control?.id]);

  const handleMouseLeave = useCallback(() => {
    if (control?.id && isHovered) {
      dispatch(controlHovered(null));
    }
  }, [dispatch, control?.id, isHovered]);

  const calculatedWidth = useMemo(() => {
    // broken width hack for fixed width controls
    if (
      control?.widthType === 'fixed' &&
      (!control?.width.endsWith('px') || !control?.width.endsWith('%')) &&
      control.type === widgets.BUTTON
    ) {
      return 'auto';
    }

    if (control?.widthType === 'fixed' || (control?.type === widgets.PICTURE && control.width)) {
      return control.width.endsWith('%') ? control.width : `${Number(control.width) + 16}px`;
    }
    // if (control?.widthType === 'full') return '100%';
    return typeof width === 'number' ? width - 16 : width;
  }, [width, control]);

  const calculatedHeight = useMemo(() => {
    if (control?.height && [widgets.PICTURE, widgets.CHART].includes(control?.type)) {
      return typeof control.height === 'string' && control.height.endsWith('%')
        ? control.height
        : `${Number(control.height) + 16}px`;
    }
    return 'auto';
  }, [control]);

  return (
    <s.Wrapper
      id={`${id}-component-wrapper`}
      style={{
        position: 'relative',
        width: calculatedWidth,
        ...((control?.widthType === 'auto' || control?.widthType === 'fixed') && {
          display:
            control?.widthType === 'full' || !control?.widthType || control?.type === widgets.LABEL
              ? 'block'
              : 'inline-block',
        }),
        height: calculatedHeight,
        ...(verticalAlign && {
          verticalAlign,
        }),
      }}
      onClick={handleOnClick}
      selected={ignoreProperties ? selectionState.isSelected : selectionState.isSelectedWithoutProperty}
      ref={wrapperRef}
      isValid={isValid}
      display={display}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      shouldShowHover={isHovered}
    >
      {!isValid && (
        <SvgIcon
          name='warning-sign'
          color={negative.secondary}
          size={16}
          style={{ position: 'absolute', top: 8, right: 8 }}
        />
      )}
      {children}
    </s.Wrapper>
  );
}

DesignerComponentWrapper.propTypes = propTypes;

// ===== PERFORMANCE OPTIMIZATION: React.memo =====
// Prevent re-renders when props haven't changed
// Custom comparison function to optimize re-render decisions
const arePropsEqual = (prevProps, nextProps) => {
  // Always re-render if control ID changes
  if (prevProps.id !== nextProps.id) return false;

  // Compare other props
  return (
    prevProps.isValid === nextProps.isValid &&
    prevProps.width === nextProps.width &&
    prevProps.ignoreProperties === nextProps.ignoreProperties &&
    prevProps.display === nextProps.display &&
    prevProps.verticalAlign === nextProps.verticalAlign &&
    prevProps.onControlClick === nextProps.onControlClick &&
    prevProps.children === nextProps.children
  );
};

export default React.memo(DesignerComponentWrapper, arePropsEqual);
