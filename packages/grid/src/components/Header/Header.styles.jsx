import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const TR = styled.tr`
  height: 32px;
  border: 1px solid ${colors['grey-light']};
  opacity: ${(p) => (p.dragging ? 0 : 1)};
  margin-top: 8px;
`;

export const TH = styled.th`
  display: table-cell;
  text-align: center;
`;

export const ActionColumn = styled(TH)`
  width: ${(p) => (p.hasCardColumnsMobile ? '1%' : '50px')};
`;

export const Select = styled(TH)`
  background-color: ${(p) => (p.selected ? 'rgba(93, 157, 213, 0.1)' : 'white')};
  border-right: 1px solid ${colors['grey-light']};
  padding-left: 16px;
  padding-right: 16px;
`;
