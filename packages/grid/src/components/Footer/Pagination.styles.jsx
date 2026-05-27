import styled from '@emotion/styled';
import { colors, customFocusOutline, customOffsetFocusOutline } from '@m-next/styles';

export const Container = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
`;

export const Text = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: ${colors['grey-dark']};
  font-size: 14px;
  font-weight: normal;
  line-height: 20px;
  margin-right: 16px;
  margin-left: 16px;
  box-sizing: border-box;
`;

export const ManyLink = styled.div`
  color: ${(p) => (p.disabled ? 'rgb(84, 95, 103)' : '#0D71C8')};
  cursor: pointer;
  box-sizing: border-box;

  outline: none;
  body.user-is-tabbing &:focus {
    ${customFocusOutline};
  }
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-style: solid;
  border-color: ${(p) => (p.disabled ? colors['grey-light'] : '#545F67')};
  border-width: 1px 0;
  height: 32px;
  width: 40px;
  box-sizing: border-box;
  background-color: transparent;
  color: ${(p) => (p.disabled ? colors['grey-light'] : colors['grey-dark'])};
  cursor: ${(p) => (p.disabled ? 'default' : 'pointer')};
  padding: 0;

  &:first-of-type {
    border-left-width: 1px;
    border-right-width: 0.5px;
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
    border-right: none;
  }

  &:last-of-type {
    border-left-width: 0.5px;
    border-right-width: 1px;
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
    border-left: none;
  }

  &:focus {
    outline: none;
    ${customOffsetFocusOutline};
  }

  &:hover {
    border-color: ${(p) => (p.disabled ? colors['grey-light'] : colors.grey)};
  }

  > svg {
    fill: currentColor;
    width: 16px;
    height: 10px;
    transform: rotate(${(p) => (p.prev ? '90deg' : '-90deg')});
  }
`;
