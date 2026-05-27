/* eslint-disable no-nested-ternary */
import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

const getCellLeftPadding = (p) => {
  if (p.isIcon) return '0px';
  if (p.isEditing) return '4px';
  if (p.isFirstVisible || (p.isCard && p.isMobile)) return '0px';
  return '8px';
};

export const TD = styled.td`
  ${(p) => !p.visible && 'display: none'};
  height: 40px;
  text-align: ${(p) => p.align};
  width: ${(p) => (p.fixedWidth ? p.cellWidth : 'auto')};
  box-sizing: border-box;
  font-size: 14px;
  font-weight: ${(p) => p.fontWeight || 'normal'};
  padding: ${(p) => (p.isIcon ? null : p.isEditing ? '4px' : '4px 8px')};
  ${(p) => (p.isCard && p.isMobile ? 'padding: 0px;' : '')}
  color: ${colors['grey-dark']};
  pointer-events: ${(p) => (p.disabled ? 'none' : 'auto')};
  vertical-align: middle;
  border-right: ${(p) => (p.isDragging ? null : `1px solid ${colors['grey-light']}`)};
  white-space: ${(p) => (p.isTextCell || p.isDDCell ? 'break-spaces' : 'nowrap')};
  padding-left: ${(p) => getCellLeftPadding(p)};
  transition: background-color 0.25s ease-in-out;
  background-color: ${(p) => (p.highlightColumn ? colors.concrete : 'transparent')};

  &:hover {
    cursor: ${(p) => (p.hasColumnClick ? 'pointer' : 'auto')};
  }

  & > div[method_type='DRP'] {
    label {
      display: none;
      margin: 0;
    }

    .mi-autocomplete {
      margin: 0;
      position: unset !important;
    }
  }

  body.user-is-tabbing &:focus:not(.hideOutline) {
    outline: 2px solid ${colors.blue};
    outline-offset: -2px;
    z-index: 1;
  }

  body.user-is-tabbing &:focus.hideOutline {
    outline: none;
  }
`;

export const Error = styled.div`
  display: flex;
  color: #da211e;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  text-align: left;
  margin-top: 4px;

  span {
    padding-right: 4px;
  }
`;

export const EditImageWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
