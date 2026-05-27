import React from 'react';
import PropTypes from 'prop-types';

// components
import MUIStepper from '@mui/material/Stepper';
import MUIStep from '@mui/material/Step';
import MUIStepLabel from '@mui/material/StepLabel';

import SvgIcon from '@m-next/svg-icon';

// styles
import * as s from './stepper.styles';

export function Stepper({
  id,
  steps,
  activeStep,
  displayLabel,
  alternativeLabel,
  iconName, // labels
}) {
  const icon = iconName === undefined ? 'completed-check' : iconName;

  // eslint-disable-next-line react/no-unstable-nested-components
  function CustomCompletedStepIcon() {
    return (
      <s.CustomStepIconWrapper className='custom-completed-icon-wrapper' alternativeLabel={alternativeLabel}>
        <SvgIcon className='custom-completed-icon' id='completed-step-icon' name={icon} size={10} color='white' />
      </s.CustomStepIconWrapper>
    );
  }

  return (
    <s.StepperWrapper id={`${id}-mui-stepper-section-wrapper`} className='mui-stepper-section-wrapper'>
      <MUIStepper
        className='mui-stepper-item'
        activeStep={activeStep}
        orientation='horizontal'
        alternativeLabel={alternativeLabel}
      >
        {[...Array(steps)].map((label, index) => (
          /* eslint-disable-next-line react/no-array-index-key */
          <MUIStep key={`${label}${index}`} className={`mui-stepper-step-${index}`}>
            <s.StepIcon
              className='mui-stepper-icon-wrapper'
              displayLabel={displayLabel}
              alternativeLabel={alternativeLabel}
            >
              <MUIStepLabel
                StepIconComponent={index < activeStep ? CustomCompletedStepIcon : undefined}
                className='mui-stepper-label'
              >
                {displayLabel ? `Step ${index + 1}` : ''}
              </MUIStepLabel>
            </s.StepIcon>
          </MUIStep>
        ))}
      </MUIStepper>
    </s.StepperWrapper>
  );
}

Stepper.propTypes = {
  id: PropTypes.string,
  steps: PropTypes.number.isRequired,
  activeStep: PropTypes.number,
  displayLabel: PropTypes.bool,
  alternativeLabel: PropTypes.bool,
  iconName: PropTypes.string,
  // labels: PropTypes.arrayOf([PropTypes.string]),
};

export default Stepper;
