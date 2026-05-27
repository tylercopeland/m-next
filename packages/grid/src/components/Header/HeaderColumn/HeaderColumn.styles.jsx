import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const TH = styled.th`
  ${(p) => !p.visible && 'display: none'};
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  height: 32px;
  opacity: ${(p) => (p.dragging ? 0 : 1)};
  color: rgb(84, 95, 103);
  padding: 0 8px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  cursor: ${(p) => (p.hasSorting ? 'pointer' : 'default')};
  background: ${(p) => (p.highlightColumn ? colors.concrete : colors.white)};
  border-right: 1px solid ${colors['grey-light']};
  transition: background-color 0.25s ease-in-out;
  ${(p) => (p.hideLeftBorder ? '' : ` border-left: 1px solid ${colors['grey-light']}`)};

  ${(p) => (p.isDragVisible ? `padding-left: 2px;` : '')}
  ${(p) => (p.isAColumnDragging ? `cursor: grab;` : '')}
`;

export const HeaderContent = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // gap: 8,
  },
]);

export const HeaderContentInternal = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    //  gap: 8,
    flexGrow: 1,
  },
]);

export const HeaderContentLabel = styled.span(() => [
  {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
]);
