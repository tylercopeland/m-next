import styled from '@emotion/styled';
import { colors, customFocusOutline, customOffsetFocusOutline } from '@m-next/styles';

export const TR = styled.tr`
  display: table-row;
  opacity: ${(p) => {
    let opacity = 1;
    if (p.dragging) opacity = 0;
    if (!p.dragging && p.deleted) opacity = 0.25;
    return opacity;
  }};
  background-color: ${(p) => (p.selected ? 'rgba(93, 157, 213, 0.1)' : 'transparent')};
  border: 1px solid ${colors['grey-light']};
  box-sizing: border-box;
  transition: background-color 0.25s ease-in-out;
  box-shadow: ${(p) => (p.editing ? '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' : '')};
  min-height: 42px;
  height: 42px;

  &:hover {
    background-color: ${(p) => (p.editing || p.disabled || !p.changeColorOnHover ? 'transparent' : colors.concrete)};
    cursor: ${(p) => (p.isReadOnly && p.hasRowClick ? 'pointer' : 'auto')};
  }

  &:hover td:not(.hideOutline) {
    .hoverOutline {
      border: 1px solid ${colors['grey-light']};
      transition: border-color 0.5s ease-in;
    }
  }

  td:not(.hideOutline) {
    .hoverOutline {
      border: 1px solid transparent;
      min-height: 42px;
      height: 42px;
      display: flex;
      align-items: center;
    }
  }

  outline: none;

  body.user-is-tabbing &:focus {
    ${customOffsetFocusOutline};
    z-index: 200;
  }
`;

export const TD = styled.td`
  display: table-cell;
  text-align: center;
  flex: 1;
`;

export const ActionCell = styled(TD)`
  vertical-align: ${(p) => (p.draggable ? null : 'middle')};
  width: 48px;
`;

export const DraggableCell = styled(TD)`
  padding: 2px;
  width: 21px;
`;

export const SelectCell = styled(TD)`
  border-right: ${(p) => (p.isDragging ? null : `1px solid ${colors['grey-light']}`)};
  width: 40px;
`;

export const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 32px;
`;

export const Handle = styled.td`
  width: 5px;
  background-color: ${(p) => (p.visible ? 'yellow' : 'transparent')};
  cursor: ${(p) => (p.visible ? 'move' : 'default')};
`;

export const Button = styled.button`
  border: 0;
  border-radius: 50px;
  padding: 4px;
  width: 35px;
  margin: 0;
  color: ${colors['grey']};
  background: transparent;
  cursor: ${(p) => (p.disabled ? 'default' : 'pointer')};
  transition: 0.15s ease;
  opacity: ${(p) => (p.disabled ? 0.5 : 1)};

  body.user-is-tabbing &:focus {
    ${customFocusOutline};
    z-index: 200;
  }

  &:focus,
  &:hover {
    outline: none;
    color: ${(p) => (p.disabled ? colors['grey'] : colors['grey-darkest'])};
    background: ${colors['grey-lightest']};
  }

  > svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
`;
export const CheckContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
`;
