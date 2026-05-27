import styled from '@emotion/styled';
import { colors, lightTheme } from '@m-next/styles';

export const Wrapper = styled.div((props) => {
  const { selected, isValid, display, shouldShowHover } = props;

  let border = `0px solid ${colors['grey-light']}`;
  if (!isValid) {
    border = `2px solid ${lightTheme.negative.secondary}`;
  }
  if (selected) {
    border = `2px solid ${colors['blue']}28`;
  }

  const hover = shouldShowHover
    ? {
        padding: 6,
        border: `2px solid ${isValid ? colors.blue : colors['red-dark']}`,
        cursor: 'pointer',
        boxShadow: `0px 0px 5px 0px ${colors.blue}`,
      }
    : {
        cursor: 'pointer',
      };

  return [
    {
      display,
      margin: 8,
      border,
      background: lightTheme.background.primary,
      boxSizing: 'border-box',
      padding: !isValid || selected ? '6px' : '8px',
      boxShadow: selected ? `0px 0px 5px 0px ${colors.blue}` : '',
      borderRadius: 4,
      '&:hover': hover,
    },
  ];
});

export const EmptyWrapper = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    background: lightTheme.background.primary,
    cursor: 'pointer',
  },
]);
