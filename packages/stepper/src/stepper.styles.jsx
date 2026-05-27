/* eslint-disable no-nested-ternary */
import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const StepperWrapper = styled.div`
  width: 100%;

  /* label styles */
  .MuiStepLabel-label {
    font-family: inherit;
    font-size: 14px;
    font-weight: 400;
    color: ${colors['grey-light']};
  }
  .MuiStepLabel-label.MuiStepLabel-alternativeLabel {
    margin-top: 6px;
  }
  .MuiStepLabel-label.Mui-active,
  .MuiStepLabel-label.Mui-completed {
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    color: ${colors['blue']};
  }

  /* connector line styles */
  .MuiStepConnector-line {
    display: none;
  }
  .MuiStepConnector-root {
    border-top: 1px dashed ${colors['grey-light']};
  }
  .MuiStepConnector-root.Mui-active,
  .MuiStepConnector-root.Mui-completed {
    border-top: 1px solid ${colors['blue']};
  }
  .MuiStepConnector-root.MuiStepConnector-alternativeLabel {
    top: 15px;
  }

  /* step styles */
  .MuiStep-root {
    padding-left: 6px;
    padding-right: 6px;
  }
`;

export const StepIcon = styled.div`
  /* icon text styles */
  .MuiStepIcon-text {
    font-family: inherit;
    font-size: 12px;
    font-weight: 600;
  }

  /* icon styles */
  .MuiStepIcon-root {
    color: ${colors['white']};
    border: 1px solid ${colors['grey-light']};
    border-radius: 50%;
    width: 24px;
    height: 24px;
    transform: ${(p) => (p.alternativeLabel ? 'translateY(2px)' : '')};

    & text {
      fill: ${colors['grey']};
    }
  }
  .MuiStepIcon-root.Mui-active {
    width: 30px;
    height: 30px;
    border: 1px solid ${colors['blue']};
    color: ${colors['blue']};
    padding: 2px;
    transform: ${(p) => (p.alternativeLabel ? 'translateY(0px)' : '')};

    & text {
      fill: ${colors['white']};
    }
  }
  .MuiStepLabel-iconContainer {
    padding-right: ${(p) => (!p.displayLabel ? '0' : !p.alternativeLabel ? '6px' : '0')};
  }
`;

export const CustomStepIconWrapper = styled.div`
  width: 24px;
  height: 24px;
  background-color: ${colors['blue']};
  border-radius: 50%;
  transform: ${(p) => (p.alternativeLabel ? 'translateY(2px)' : '')};

  .custom-completed-icon {
    transform: translateY(65%);
  }
`;
