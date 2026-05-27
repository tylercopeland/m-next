/* eslint-disable no-nested-ternary */
import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const ControlContainer = styled.div`
  display: ${(p) => (p.isHidden ? 'none' : p.fullWidth ? 'flex' : 'inline-flex')};
  vertical-align: top;
  max-width: 100%;
`;

export const Wrapper = styled.label((p) => {
  let justify = 'flex-end';
  if (p.align === 'left') justify = 'flex-start';
  if (p.align === 'center') justify = 'center';

  let output = `
        display: ${p.isHidden ? 'none' : 'flex'};
        align-items: center;
        justify-content: ${justify};
        width: ${p.width};
        box-sizing: border-box;
        user-select: none;
        font-size: ${p.isMobile ? '16px' : '14px'};
        line-height: 16px;
        margin-bottom: ${p.narrow ? '0px' : '14px !important'};
        font-weight: normal;
        input ~ div:after {
            content: "";
            position: absolute;
            display: none;
        }
        input:checked ~ div,
        input:indeterminate ~ div {
            background-color: ${colors['blue']};
            border: none;
        }
        input:checked ~ div:after {
            display: block;
            border-style: solid;
            border-color: ${p.dark ? colors['black'] : colors['white']};
            border-width: 0 2px 2px 0;
            -webkit-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
        }
        input:disabled ~ div {
            opacity: 0.5;
        }
        input:indeterminate ~ div:after {
            display: block;
            top: 7px;
            left: 3px;
            width: 10px;
            height: 2px;
            background-color: ${colors['white']};
        }
    `;
  if (p.isMobile)
    output += `
        input:checked ~ div:after {
            width: 7.5px;
            height: ${p.rounded ? '9px' : '13.5px'};
            left: 8px;
            top: ${p.rounded ? '3px' : '3px'};
        }        
        `;
  else
    output += `
        input:checked ~ div:after {
            width: 5px;
            height: ${p.rounded ? '6px' : '9px'};
            left: 5px;
            top: ${p.rounded ? '3px' : '3px'};
        }        
        `;
  return output;
});

export const Input = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
  &:focus-visible ~ div {
    outline: none !important;
    --outline-offset-box-shadow-color: white;
    --outline-box-shadow-color: ${colors['blue']};
    box-shadow:
      0 0 0 2pt var(--outline-offset-box-shadow-color),
      0 0 0.75pt 3.5pt var(--outline-box-shadow-color);
  }
`;

export const Checkbox = styled.div((props) => {
  let output = `
        position: relative;
        display: block;
        border: 1px solid ${colors['grey-light']};
        box-sizing: border-box;
        border-radius: ${props.rounded ? '8px' : '4px'};
        order: ${props.align === 'left' ? 1 : 2};
        align-self: flex-start;
        box-shadow: none;
        outline: none;
        
        &:hover {
            outline: none;
            box-shadow: ${props.disabled ? 'none' : `0 0 1px 2px ${colors['blue-light']}`};
            cursor: ${props.disabled ? 'default' : 'pointer'};
        }
    `;
  if (props.isMobile)
    output += `
        width: 24px;
        height: 24px;
        min-width: 24px;
        min-height: 24px;
        max-width: 24px;
        max-height: 24px;
        `;
  else
    output += `
        width: 16px;
        height: 16px;
        min-width: 16px;
        min-height: 16px;
        max-width: 16px;
        max-height: 16px;
        `;
  return output;
});

export const Label = styled.div`
  padding-left: ${(p) => (p.align !== 'right' ? '8px' : 0)};
  padding-right: ${(p) => (p.align === 'right' ? '8px' : 0)};
  font-size: ${(p) => (p.isMobile ? '16px' : '14px')};
  line-height: 16px;
  order: ${(p) => (p.align !== 'right' ? 2 : 1)};
  opacity: ${(p) => (p.disabled && p.disableLabel ? 0.5 : 1)};
  outline: none;
  display: ${(p) => (p.hideCaption ? 'none' : null)};
  user-select: text;
  ${(p) => (p.fullWidth ? 'flex-grow: 1;' : null)};
  font-weight: ${(p) => (p.bold ? '600' : 'normal')};
`;

export const GroupContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: ${(p) => (p.align === 'vertical' ? 'column' : 'row')};
  label:not(:last-child) {
    margin-bottom: ${(p) => (p.align === 'vertical' ? '8px' : 0)};
  }
`;
