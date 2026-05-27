/* eslint-disable import/prefer-default-export */
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  width: 48px;

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }
`;
