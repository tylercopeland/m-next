import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const Wrapper = styled.div((props) => {
  const { height, width, layout, selected, shouldShowHover } = props;
  let border = null;

  if (selected) {
    border = `2px solid ${colors['blue']}28`;
  }

  const hover = shouldShowHover
    ? {
        padding: 8,
        border: `2px solid ${colors.blue}`,
     //   cursor: 'pointer',
        boxShadow: `0px 0px 5px 0px ${colors.blue}`,
      }
    : {
   //      cursor: 'pointer',
    };

  const styling = {
    backgroundColor: colors['grey-lighter'],
    height,
    width: width ?? 'auto',
    maxWidth: '100%',
    marginBottom: '4px',
    padding: selected ? '8px' : '8px',
    border,
    outline: 'none',
    boxShadow: selected ? `0px 0px 5px 0px ${colors.blue}` : '',
    '&:hover': hover,
  };

  if (layout === 'table') {
    styling.display = 'table';
    styling.width = '100%';
  }

  if (layout === 'row') {
    styling.display = 'table-row';
  }

  if (layout === 'cell') {
    styling.display = 'table-cell';
    styling.verticalAlign = 'top';
  }

  return [styling];
});

export const h3 = styled.h3`
  color: var(--Grey-Grey-Darker, #0f1b31);
  font-feature-settings:
    'liga' off,
    'clig' off;
  font-family: 'Source Sans Pro';
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  margin-left: 5px;
  line-height: 24px;
`;
