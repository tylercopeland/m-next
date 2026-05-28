import styled from '@emotion/styled';
import { colors } from '@m-next/tokens';

export const ValidationMessageWrapper = styled.div({
  display: 'flex',
  alignItems: 'flex-start' /* top-align icon with first text line */,
  margin: '6px 0 10px 0',
});

export const ValidationMessage = styled.div(({ theme }) => {
  const negativeSecondary = theme && theme.negative ? theme.negative.secondary : colors.red.base;

  return {
    display: 'block',
    color: negativeSecondary,
    width: '100%',
    fontSize: '12px',
    lineHeight: '16px',
  };
});
