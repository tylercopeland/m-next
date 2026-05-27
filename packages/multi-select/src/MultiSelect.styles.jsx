/* eslint-disable no-nested-ternary */
import styled from '@emotion/styled';
import { colors } from '@m-next/styles';
import SvgIcon from '@m-next/svg-icon';

export const MultiSelectParentWrapper = styled.div`
  display: flex;
  flex-flow: wrap;
  width: calc(100% - 30px);
  margin: 2px 4px;
  ${(props) => (props.isMobile || props.rowIdx) && `padding-right: 20px;`}
`;

export const SingleChipWrapper = styled.span`
  background-color: ${(p) => (p ? p.color : '#5d18ceff')};
  color: ${colors.white};
  font-size: 12px;
  font-weight: 100;
  min-height: 24px;
  margin: 2px 3px 2px 0;
  padding: 0 8px;
  border-radius: 16px;
  display: flex;
  align-items: center;
`;

export const ChipName = styled.span`
  color: ${colors['grey-darker']};
  font-weight: 600;
  word-wrap: break-word;
  width: max-content;
`;

export const MultiSelectCloseIconWrapper = styled.div`
  padding-left: 6px;
  cursor: pointer;
  outline: none;
`;

/* Styled SvgIcon with ::before for circular hover background - like IconButton */
export const CloseIcon = styled(SvgIcon)`
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  outline: none;

  &&& {
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.9);
      border-radius: 50%;
      height: ${(props) => props.bgCircleDiameter || '16px'};
      width: ${(props) => props.bgCircleDiameter || '16px'};
      background-color: #b3e5ff;
      opacity: 0;
      transition: all 150ms ease-out;
    }

    &:hover::before {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

export const MultiSelectWrapper = styled.div`
  ${(props) =>
    props.isDropdown &&
    `
      position: relative;
      padding-bottom: ${!props.isMobile ? '24px' : '0'};
    `};
`;

export const OptionsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  border: 1px solid ${colors['grey-light']};
  border-radius: 2px;
  height: ${(props) => props.height};
  padding: ${(props) => (props.isDropdown ? '8px 4px' : '8px')};
  overflow-y: auto;

  &:focus-within {
    border: 1px solid ${colors.blue};
  }

  input:placeholder-shown,
  input::placeholder {
    text-overflow: ellipsis;
  }

  ${(props) =>
    props.isDropdown &&
    `
    width: ${props.isMobile ? '100%' : '360px'};
    gap: 8px 0px;
    position: relative;
  `};
`;

export const PillWrapper = styled.div`
  margin-right: 4px;
  margin-bottom: ${(props) => (!props.isDropdown ? '8px' : '0')};

  .pill-text {
    font-size: ${(props) => (props.isDropdown && !props.isMobile ? '12px' : props.isMobile ? '16px' : '14px')};
    font-weight: ${(props) => (props.isDropdown ? '600' : '400')};

    ${(props) =>
      props.isDropdown &&
      `
      padding: 0;
    `};
  }

  &:hover {
    .pill-text {
      cursor: default;
    }

    #input-pill {
      cursor: default;
    }
  }
`;

export const MultiSelectInput = styled.input`
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: ${(props) => (props.isDropdown ? '64px' : '200px')};
  height: ${(props) => (props.isMobile ? '32px !important' : '24px !important')};
  font-size: ${(props) => (props.isMobile ? '16px !important' : '14px !important')};
  margin: 0px !important;
  padding: ${(props) => (props.isDropdown ? '0px 28px 0px 0px !important' : '0px !important')};
  border: none !important;
  outline: none !important;
`;

export const DropdownCaret = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: ${(props) => (props.isMobile ? '12px' : '8px')};
  right: 8px;
  padding: 8px;
  cursor: pointer;
`;

export const DropdownWrapper = styled.div`
  display: flex;
  position: absolute;
  padding: 8px;
  flex-direction: column;
  justify-content: flex-start;
  gap: 8px;
  z-index: 1;
  align-self: stretch;
  width: ${(props) => (props.isMobile ? '100%' : '360px')};
  border-radius: 4px;
  background: ${colors['white']};
  ${(props) =>
    !props.hasOptions &&
    `
    align-items: center;
  `};
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  max-height: calc(280px + 8px);
  overflow-y: auto;
`;

export const DropdownOption = styled.div`
  font-size: 14px;
  line-height: 16px;
  font-weight: 400;
  padding: 8px;

  ${(props) =>
    props.hasOptions &&
    `
    &:hover {
      background-color: ${colors['grey-lighter']};
      color: ${colors['blue']};
      cursor: pointer;
    }
  `};

  ${(props) =>
    props.selected &&
    props.hasOptions &&
    `
    color: ${colors['blue']};
    background: ${colors['grey-lighter']};
  `};
`;
