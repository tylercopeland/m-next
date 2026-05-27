import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

// eslint-disable-next-line import/prefer-default-export
export const Table = styled.table`
  border-spacing: 0;
  border-collapse: collapse;
  table-layout: fixed;
  min-width: 100%;
  height: 100%;
  margin-top: 0px;

  border: 1px solid ${colors['grey-light']};
  border-radius: 4px;

  /* Apply a border to the right of all but the last column 
th:not(:last-child),
td:not(:last-child) {
 border-right: 1px solid ${colors['grey-light']};
}

thead>tr:not(:last-child)>th,
thead>tr:not(:last-child)>td,
tbody>tr:not(:last-child)>th,
tbody>tr:not(:last-child)>td,
tfoot>tr:not(:last-child)>th,
tfoot>tr:not(:last-child)>td,
tr:not(:last-child)>td,
tr:not(:last-child)>th,
thead:not(:last-child),
tbody:not(:last-child),
tfoot:not(:last-child),
th,
{
 border-bottom: 1px solid ${colors['grey-light']};
}
*/
`;
