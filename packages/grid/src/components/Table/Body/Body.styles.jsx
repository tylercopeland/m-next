import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const NoResults = styled.td`
  text-align: center;
  font-size: 16px;
  color: ${colors['grey-darker']};
  font-weight: 600;
  height: 60px;
  letter-spacing: 1px;
  border: 1px solid ${colors['grey-light']};
`;

export const LoaderCell = styled.td`
  ${(_) => (_.loaderTopPadding ? `padding-top: ${_.loaderTopPadding}px !important;` : '')}
  padding: 32px 0px;
`;

export const LoaderRow = styled.tr`
  opacity: 1;
  background-color: transparent;
  ${(_) => (_.borderlessLoader ? '' : 'border-width: 0 1px 1px 1px;')}
  border-style: solid;
  border-color: ${colors['grey-light']};
  box-sizing: border-box;
  transition: background-color 0.25s ease-in-out;
`;

export const Tbody = styled.tbody`
  background-color: ${(p) => (p.isLoading ? 'transparent' : (p.tableBodyBackgroundColor ?? 'white'))};
  ${(p) => (!p.showHeader ? 'border-top-width: 1px; border-top-color: rgb(211,222,230);' : '')}
`;

export const NoResultsWrapper = styled.div(() => ({
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 24,
}));

export const NoResultsInnerWrapper = styled.div(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 4,
  textAlign: 'center',
}));
