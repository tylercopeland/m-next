import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const waitlistWrapper = styled.div`
  width: 100%;
  background-color: 'transparent';
  padding: 0px 8px;
  ${(_) => (_.height ? `height: ${_.height}px;` : '')}
  &:hover {
    background-color: ${(_) => (_.eventDragging ? colors['blue-lightest'] : 'transparent')};
  }
`;

export const emptyStateText = styled.div`
  display: block;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: ${colors['grey-dark']}
  line-height: 24px;
  margin-top: 8px;`;

export const emptyStateWrapper = styled.td`
  text-align: center;
  padding-top: 64px;
  padding-bottom: 64px;
`;
