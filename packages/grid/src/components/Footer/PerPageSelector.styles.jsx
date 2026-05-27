import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  color: ${colors['grey-dark']};
  font-size: 14px;
  font-weight: normal;
  height: 32px;
  line-height: 32px;
`;

export const Selector = styled.select`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 16px;
  height: 32px;
  width: 56px;
  padding: 0px;
  padding-right: 24px;
  box-sizing: border-box;
  margin: 0px;
  margin-left: 6px;
  text-align: center;
  background-color: transparent;
  appearance: none;
  background: none !important;
  font-weight: 600 !important;
  &:focus {
    outline: none;
    background-color: transparent;
    border: none;
  }

  &:hover {
    cursor: pointer;
    border-color: ${colors.grey};
    background-color: transparent;
  }
`;

export const Caret = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    bottom: 0;
    right: 16px;
    width: 8px;
    pointer-events: none;
    color: grey;

    > svg {
        fill: {currentColor};
        width: 8px;
        height: 8px;
    }
    
    &:hover {
        cursor: pointer;
    }
`;
