import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const FadeIn = keyframes`
  70% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const ResetIcon = styled.div`
  margin-left: 18px;
  cursor: pointer;

  body.user-is-tabbing &:focus:not([disabled]),
  body.user-is-tabbing &:focus-visible:not([disabled]) {
    box-shadow:
      0 0 0 4px #fff,
      0 0 0 6px #0d71c8 !important;
    outline: none;
  }
`;

export const ResetIconDescription = styled.div`
  position: absolute;

  top: -30px;
  left: -20px;
  z-index: 2;

  display: none;
  opacity: 0;

  width: 97px;
  height: 24px;

  background-color: ${colors['method-darker']};
  border-radius: 2px;
  padding: 4px 8px;

  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;

  color: ${colors['white']};
`;

export const ResetIconContainer = styled.div`
  position: relative;

  ${ResetIcon}:hover + ${ResetIconDescription} {
    display: block;
    animation: 1s ${FadeIn};
    animation-fill-mode: forwards;
  }
`;

export const ColorPickerContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  /* margin-bottom: 14px; */

  /* Container */
  .e-split-btn-wrapper {
    position: relative;
  }

  /* 1 */
  /* To hide primary button */
  .e-colorpicker-wrapper .e-split-btn-wrapper .e-split-btn {
    padding: 0px;
    border: none;
    border-radius: 0px;
  }

  /* Primary button's Color square */
  .e-colorpicker-wrapper .e-split-btn-wrapper .e-split-colorpicker.e-split-btn .e-selected-color,
  .e-colorpicker-container .e-split-btn-wrapper .e-split-colorpicker.e-split-btn .e-selected-color {
    height: 40px;
    width: 40px;
  }

  /* Primary button's Color square inner */
  .e-colorpicker-wrapper .e-split-btn-wrapper .e-split-colorpicker.e-split-btn .e-selected-color .e-split-preview,
  .e-colorpicker-container .e-split-btn-wrapper .e-split-colorpicker.e-split-btn .e-selected-color .e-split-preview {
    border: none;
    border-radius: 0px;
  }

  /* 2 */
  /* Input element customization */
  .e-colorpicker-wrapper .e-split-btn-wrapper .e-input {
    height: 41px;
    margin: 0;
    opacity: 1;
    position: initial;
    width: 125px;
    border: none;
    border-radius: 0px;
  }

  /* Avoid highlighting when focused */
  .e-split-btn-wrapper .e-btn:focus,
  .e-input:focus:not(.e-success):not(.e-warning):not(.e-error) {
    box-shadow: none;
    border-radius: 0px;
  }

  /* 3 */
  /* Secondary button customization */
  .e-colorpicker-wrapper .e-split-btn-wrapper .e-btn.e-dropdown-btn {
    position: absolute;

    width: 100%;
    height: 100%;

    background: transparent;
    border: 1px solid ${colors['grey-light']};
    border-radius: 2px;
  }

  .e-colorpicker-wrapper .e-split-btn-wrapper .e-btn.e-dropdown-btn:focus {
    border: 1px solid ${colors.blue};
  }

  .e-colorpicker-wrapper .e-split-btn-wrapper .e-input:focus + .e-btn.e-dropdown-btn {
    border-bottom-width: 1px;
    border-bottom-color: ${colors.blue};
  }

  .e-colorpicker-wrapper .e-split-btn-wrapper .e-btn.e-dropdown-btn .e-caret {
    display: none;
    transform: rotate(0deg);
    transition: transform 200ms ease-in-out;
  }

  .e-colorpicker-wrapper .e-split-btn-wrapper .e-btn.e-dropdown-btn.e-active .e-caret {
    transform: rotate(180deg);
  }
`;

export const ColorPickerPanel = styled.div`
  position: absolute;
  top: 42px;
  ${({ alignPanelRight }) => (alignPanelRight ? 'right: 0;' : 'left: 0;')}
  z-index: 300;

  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
`;

export const ColorPickerViewer = styled.div`
  width: 166px;
  height: 32px;

  border: 1px solid ${colors['grey-light']};
  border-radius: 2px;

  display: flex;
  flex-direction: row;
  cursor: pointer;

  body.user-is-tabbing &:focus:not([disabled]),
  body.user-is-tabbing &:focus-visible:not([disabled]) {
    box-shadow:
      0 0 0 4px #fff,
      0 0 0 6px #0d71c8 !important;
    outline: none;
  }
`;

export const ColorWindow = styled.div`
  width: 40px;
  height: 31px;

  background-color: ${({ color }) => color || null};
`;

export const ColorText = styled.div`
  padding-left: 15px;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  align-self: center;

  color: ${colors['grey-dark']};
`;
