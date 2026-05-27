/* eslint-disable no-nested-ternary */
import styled from '@emotion/styled';
import { colors } from '@m-next/tokens';

export const SelectOptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${(props) => (props.size === 'lg' ? '24px 16px' : '16px')};
  border-radius: 16px;
  cursor: pointer;
  width: fit-content;
  border: ${(props) =>
    props.selected
      ? `2px solid ${colors.blue.base}`
      : `2px solid ${colors.grey.light}`};
  background-color: ${(props) => (props.selected ? colors.blue.lighter : colors.white)};

  &:hover,
  body.user-is-tabbing &:focus-within {
    outline: none;
    cursor: pointer;
    box-shadow: 0px 0px 14px rgba(44, 143, 229, 0.25);
    border: 2px solid rgba(13, 113, 200, 0.5);
  }
`;

export const SelectIcon = styled.div`
  background-color: ${(props) => (props.selected ? colors.blue.light : colors.blue.lighter)};
  width: ${(props) => (props.size === 'lg' ? '80px' : '40px')};
  height: ${(props) => (props.size === 'lg' ? '80px' : '40px')};
  border-radius: 100px;
  align-items: center;
  justify-content: center;
`;

export const ContentContainer = styled.div`
  width: 160px;

  h3 {
    font-size: ${(props) => (props.size === 'lg' ? '20px !important' : '14px !important')};
  }

  p {
    font-size: ${(props) => (props.size === 'lg' ? '14px !important' : '12px !important')};
    line-height: 16px;
    font-weight: 400;
  }
`;

export const SelectWrapper = styled.div`
  display: flex;
  gap: 16px;
`;
