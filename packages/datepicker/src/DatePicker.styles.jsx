import styled from '@emotion/styled';
import { colors } from '@m-next/styles';
import 'react-datepicker/dist/react-datepicker.min.css';

export const HeaderContainer = styled.div`
  height: 21px;
`;
export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;
export const DateWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const SelectorWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: baseline;
  padding-left: ${(p) => p.lPadding || '0'};
  padding-right: ${(p) => p.rPadding || '0'};

  label {
    padding-right: 3px;
  }
`;

export const DropdownWrapper = styled.div`
  transform: translate3d(25px, -8px, 0px);
  will-change: transform;
  position: fixed;
  background-color: #fff;
  width: ${(p) => (p.showTime ? '50%' : '75%')};
  border: 1px solid #eef5f7;
  border-radius: 4px;
  box-shadow: 0px 0px 2px 0px #eef5f7;
  z-index: 1;

  display: ${(p) => (p.visible ? 'block' : 'none')};
  ul {
    list-style: none;
    list-style-type: none;
    max-height: 150px;
    overflow: auto;
    padding: 10px;
    margin: 0;
    text-align: left;

    li {
      padding: 5px;
    }

    li:hover,
    li.active {
      color: ${colors['blue']};
      background-color: ${colors['grey-lightest']};
    }
  }
`;

export const Wrapper = styled.div((props) => {
  const { isV4Design, isValid, compactStyle, disabled } = props;

  return [
    {
      display: props.block ? 'block' : 'inline-block',
      maxWidth: '100%',
      width: props.width ? props.width : 'auto',
      backgroundColor: 'transparent',
      opacity: disabled ? 0.5 : undefined,
      border: !isValid ? colors.red : null,
    },
    isV4Design &&
      compactStyle && {
        position: 'relative',
      },

    isV4Design &&
      !compactStyle && {
        position: 'relative',
        marginBottom: 18,
      },
  ];
});

export const ChevronWrapper = styled.div`
  padding: 5px;
  padding-right: ${(p) => (p.rPadding ? p.rPadding : '5px')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: ${(p) => (p.disabled ? 'default' : 'pointer')};
  width: 32px;
  height: ${(p) => (p.isV4Design ? '28px' : null)};
`;

export const IconHolder = styled.div`
  display: flex;
  flex: 0 1 32px;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.color || colors['grey-light']};
  width: 32px;
  padding: 8px 0; /* reduce by 2 due to wrapper border */

  svg {
    fill: currentColor;
  }
`;

export const MobileTrigger = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 32px;
  height: 32px;
  z-index: 1;
`;

export const ContainerWrapper = styled.div((props) => {
  const { marginless } = props;

  return [
    {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: 0,
      verticalAlign: 'top',
      maxWidth: '100%',
    },
    !marginless && {
      marginBottom: 14, // Apply spacing here instead of Container
    },
  ];
});

export const Container = styled.div`
  display: flex;
  font-size: 14px;
  border: 1px solid ${(p) => (p.isValid ? colors['grey-light'] : colors['red'])};
  border-radius: ${(p) => (p.isV4Design ? '4px' : '1px')};
  color: ${colors['grey-dark']};
  width: 100%;
  max-width: 100%;
  margin: 0;
  background-clip: padding-box;
  background-color: ${(p) => {
    let backgroundColor = p.backgroundColor || colors.white;
    if (p.disabled) backgroundColor = colors.concrete;
    return backgroundColor;
  }};
  overflow: auto;

  &:hover {
    border-color: ${(p) => {
      if (p.disabled) return colors['grey-light'];
      if (!p.isValid) return colors['red'];
      return colors['grey-dark'];
    }};
  }

  &:focus-within {
    border-color: ${(p) => {
      if (!p.isValid) return colors['red'];
      return colors['blue'];
    }};
  }

  input {
    flex: 1;
    font-size: ${(p) => p.size || '1em'};
    color: ${(p) => p.color || colors['grey-dark']};
    border: none;
    margin-bottom: 0;
    background-color: ${(p) => {
      let backgroundColor = p.backgroundColor || colors.white;
      if (p.disabled) backgroundColor = colors.concrete;
      return backgroundColor;
    }};
    max-width: 100%;
    background-clip: padding-box;
    height: 30px; /* reduce by 2 due to wrapper border */
    box-sizing: border-box;
    min-width: 0;
    padding-left: ${(p) => `${p.inputPadding}px` || null};

    &:hover {
      color: ${(p) => p.color || colors['grey-dark']};
      border: ${(p) => (p.disabled ? colors['grey-lighter'] : 'none')};
      background-color: ${(p) => {
        let backgroundColor = p.backgroundColor || colors.white;
        if (p.disabled) backgroundColor = colors.concrete;
        return backgroundColor;
      }};
    }

    &:focus {
      color: ${(p) => p.color || colors['grey-dark']};
      border: none;
      background-color: ${(p) => p.backgroundColor || colors.white};
      outline: none;
    }

    &::placeholder {
      color: ${colors['grey-dark']};
      opacity: 0.6;
    }
  }

  .react-datepicker-popper {
    z-index: 1000;
  }

  .react-datepicker__month-container .react-datepicker__header {
    border-bottom-color: transparent;
  }

  .react-datepicker__current-month {
    padding: 0 0 8px 0;
  }

  .react-datepicker__day-names {
    border-top-color: #eef5f7;
    border-top-width: 1px;
  }

  .react-datepicker-wrapper {
    overflow: hidden;
    padding-left: 0px;
  }

  .react-datepicker-wrapper,
  .react-datepicker__input-container {
    flex: 1;
    display: flex;
  }

  .react-datepicker__day--keyboard-selected,
  .react-datepicker__month-text--keyboard-selected,
  .react-datepicker__quarter-text--keyboard-selected {
    border-radius: 9999px;
    background-color: ${colors['blue-dark']};
    color: ${colors['white']};
  }
  .react-datepicker-popper {
    width: ${(p) => {
      let width = '212px';
      if (p.mode === 'DateTime') width = '303px';
      if (p.mode === 'Time' && !p.largeStyle) width = '90px';
      if (p.mode === 'Time' && p.largeStyle) width = '100%';
      return width;
    }};
  }

  .react-datepicker__navigation--previous {
    left: 5px;
  }

  .react-datepicker__navigation--next--with-time:not(.react-datepicker__navigation--next--with-today-button) {
    right: 98px;
  }

  react-datepicker__day--keyboard-selected,
  react-datepicker__day--today {
    border-radius: 9999px;
    background-color: ${colors['blue-dark']};
    color: ${colors['white']};
  }

  .react-datepicker__day--today:not(.react-datepicker__day--keyboard-selected):not(.react-datepicker__day--selected),
  .react-datepicker__month-text--today {
    background-color: ${colors['grey-lighter']};
    color: ${colors['black']};
    border-radius: 9999px;
  }

  .react-datepicker__month-text--today.react-datepicker__month-text--selected {
    color: ${colors['white']};
  }

  .react-datepicker {
    max-width: 303px;
    width: 100%;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
    overflow: hidden;
  }

  .react-datepicker__close-icon {
    position: relative;
    right: 0;
    top: 0;
    width: 21px;
    height: 30px; /* reduce by 2 due to wrapper border */

    &:after {
      background: transparent;
      color: ${(p) => p.color || colors['grey-dark']};
      padding: 0;
      width: 0;
      border-radius: 0;
      content: '';
      height: 11px;
      border-left: 1px solid ${(p) => p.color || colors['grey-dark']};
      position: absolute;
      transform: rotate(45deg);
      top: 11px;
      left: 8px;
    }

    &:before {
      content: '';
      height: 11px;
      border-left: 1px solid ${(p) => p.color || colors['grey-dark']};
      position: absolute;
      transform: rotate(-45deg);
      top: 11px;
      left: 8px;
    }
  }

  .react-datepicker,
  .react-datepicker__header,
  .react-datepicker__time-container,
  .react-datepicker__time-container--with-today-button {
    border-color: ${colors['grey-lighter']};
  }

  .react-datepicker__time-container,
  .react-datepicker__time,
  .react-datepicker__time-box,
  .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box {
    width: ${(p) => (p.largeStyle ? '100%' : '90px')};
    text-align: ${(p) => (p.largeStyle ? 'start' : '')};
    padding-left: ${(p) => (p.largeStyle ? '4px' : '')};
  }

  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item {
    height: 20px;
    padding: 5px 5px;
    line-height: 20px;
  }

  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item:hover {
    background-color: ${colors['blue-dark']};
    color: ${colors['white']};
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range,
  .react-datepicker__month-text--selected,
  .react-datepicker__month-text--in-selecting-range,
  .react-datepicker__month-text--in-range {
    background-color: ${colors.blue};
    border-radius: 9999px;
  }

  .react-datepicker__day:hover,
  .react-datepicker__month-text:hover {
    background-color: ${colors['blue-dark']};
    border-radius: 9999px;
    color: ${colors['white']};
    margin-left: 0.166rem;
    margin-right: 0.166rem;
    padding-left: 0;
    padding-right: 0;
  }

  .react-datepicker__day--outside-month {
    color: ${colors['grey-light']};
  }

  .react-datepicker__day--outside-month:hover {
    color: ${colors.white};
  }

  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item--selected {
    background-color: ${colors.blue};
  }

  .react-datepicker__header {
    background-color: ${colors.white};
  }

  .react-datepicker__day-name {
    font-weight: 600;
  }

  .react-datepicker_header {
    background-color: ${colors['grey-lighter']};
  }

  .react-datepicker__triangle {
    display: none;
  }

  .react-datepicker-popper[data-placement^='bottom'] {
    margin-top: ${(p) => (p.largeStyle ? '-4px' : '8px')};
  }

  .react-datepicker-popper[data-placement^='top'] {
    margin-bottom: 8px;
  }

  .react-datepicker-popper[data-placement^='right'] {
    margin-left: 8px;
  }

  .react-datepicker-popper[data-placement^='left'] {
    margin-right: 8px;
  }

  .react-datepicker__header--time--only {
    display: none !important;
  }

  .react-datepicker--time-only .react-datepicker__time-container,
  .react-datepicker--time-only .react-datepicker__time-box {
    width: 100% !important;
  }
`;
