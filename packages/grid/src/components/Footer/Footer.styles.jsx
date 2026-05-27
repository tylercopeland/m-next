/* eslint-disable import/prefer-default-export */
import styled from '@emotion/styled';

export const TD = styled.td`
  display: ${(p) => (p.visible ? 'table-cell' : 'none')};
  padding: 8px;
  color: ${(p) => (p.title ? '#1B3047' : '#545F67')};
  font-size: 14px;
  font-weight: ${(p) => (p.title ? '600' : '400')};
  text-align: ${(p) => p.align};
  background-color: ${(p) => (p.filled ? '#EDEEF0' : 'transparent')};
  padding-left: ${(p) => (p.isEditableColumn ? '18px' : '8px')};
`;
