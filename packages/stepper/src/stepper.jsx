import React, { forwardRef, useEffect, useRef } from 'react';

// components
import MUIStepper from '@mui/material/Stepper';
import MUIStep from '@mui/material/Step';
import MUIStepLabel from '@mui/material/StepLabel';

import SvgIcon from '@m-next/svg-icon';

// styles
import * as s from './stepper.styles';

// One-time deprecation warner — fires once per key, mirrors @m-next/input.
const warnOnce = (() => {
  const seen = new Set();
  return (key, message) => {
    if (seen.has(key) || typeof console === 'undefined') return;
    seen.add(key);
    // eslint-disable-next-line no-console
    console.warn(message);
  };
})();

let autoIdCounter = 0;

const Stepper = forwardRef(function Stepper(props, ref) {
  const {
    id: idProp,
    steps,
    activeStep = 0,
    iconName,

    // Clean API
    showLabels: showLabelsProp,
    orientation = 'horizontal',
    onStepClick,

    // Standard ARIA pass-through
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,
    displayLabel: legacyDisplayLabel,
    alternativeLabel,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,

    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-stepper-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  let showLabels = showLabelsProp;
  if (legacyDisplayLabel !== undefined && showLabels === undefined) {
    warnOnce(
      'stepper-displayLabel',
      '@m-next/stepper: `displayLabel` is deprecated. Use `showLabels`.',
    );
    showLabels = legacyDisplayLabel;
  }

  if (legacyForwardRef) {
    warnOnce(
      'stepper-forwardRef-prop',
      '@m-next/stepper: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // ============ Refs ============
  const wrapperRef = useRef(null);

  // Merge external ref (forwardRef API + legacy forwardRef prop) with internal.
  useEffect(() => {
    const targetRef = ref ?? legacyForwardRef;
    if (!targetRef) return;
    if (typeof targetRef === 'function') {
      targetRef(wrapperRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      targetRef.current = wrapperRef.current;
    }
  }, [ref, legacyForwardRef]);

  // ============ Step normalization ============
  // `steps` can be a number (count) or an array of step descriptors.
  const stepList = Array.isArray(steps)
    ? steps
    : [...Array(steps || 0)].map((_, i) => ({ label: `Step ${i + 1}` }));

  const icon = iconName === undefined ? 'completed-check' : iconName;

  // eslint-disable-next-line react/no-unstable-nested-components
  function CustomCompletedStepIcon() {
    return (
      <s.CustomStepIconWrapper className='custom-completed-icon-wrapper' alternativeLabel={alternativeLabel}>
        <SvgIcon className='custom-completed-icon' id='completed-step-icon' name={icon} size={10} color='white' />
      </s.CustomStepIconWrapper>
    );
  }

  // Accessible name for the stepper region. If neither aria-label nor aria-labelledby
  // is supplied, fall back to a sensible default so screen readers still announce it.
  const regionAriaLabel = ariaLabel || (ariaLabelledby ? undefined : 'Progress');

  return (
    <s.StepperWrapper
      {...rest}
      ref={wrapperRef}
      id={`${id}-mui-stepper-section-wrapper`}
      className='mui-stepper-section-wrapper'
      role='group'
      aria-label={regionAriaLabel}
      aria-labelledby={ariaLabelledby}
    >
      <MUIStepper
        className='mui-stepper-item'
        activeStep={activeStep}
        orientation={orientation}
        alternativeLabel={alternativeLabel}
      >
        {stepList.map((stepDef, index) => {
          const stepLabel =
            typeof stepDef === 'string'
              ? stepDef
              : (stepDef && stepDef.label) ?? `Step ${index + 1}`;
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          const isFuture = index > activeStep;
          const clickable = typeof onStepClick === 'function' && !isFuture;

          const handleClick = clickable
            ? (e) => onStepClick(index, stepDef, e)
            : undefined;
          const handleKeyDown = clickable
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onStepClick(index, stepDef, e);
                }
              }
            : undefined;

          let ariaCurrent;
          if (isActive) ariaCurrent = 'step';

          return (
            <MUIStep
              /* eslint-disable-next-line react/no-array-index-key */
              key={`${id}-step-${index}`}
              className={`mui-stepper-step-${index}`}
            >
              <s.StepIcon
                className='mui-stepper-icon-wrapper'
                displayLabel={showLabels}
                alternativeLabel={alternativeLabel}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? 0 : undefined}
                aria-current={ariaCurrent}
                aria-disabled={isFuture || undefined}
                aria-label={`${stepLabel}${isActive ? ' (current step)' : ''}${isCompleted ? ' (completed)' : ''}`}
                clickable={clickable}
              >
                <MUIStepLabel
                  StepIconComponent={isCompleted ? CustomCompletedStepIcon : undefined}
                  className='mui-stepper-label'
                >
                  {showLabels ? stepLabel : ''}
                </MUIStepLabel>
              </s.StepIcon>
            </MUIStep>
          );
        })}
      </MUIStepper>
    </s.StepperWrapper>
  );
});

Stepper.displayName = 'Stepper';

export default Stepper;
export { Stepper };
