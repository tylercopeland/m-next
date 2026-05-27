/* eslint-disable import/prefer-default-export */
import styled from '@emotion/styled';

export const Box = styled.div`
  display: block;
  width: 100%;
  max-width: 100%;
  min-height: 32px;
  height: auto;
  border-radius: 2px;
  border: 1px solid ${(p) => (p.error ? '#DA211E' : 'transparent')};
  color: rgb(84, 95, 103);
  font-size: 14px;
  padding: 8px;
  box-sizing: border-box;
  word-break: break-word;
`;
