import styled from '@emotion/styled';
import { lightTheme } from '@m-next/styles';

export const ValidationMessageWrapper = styled.div(({ compactStyle, isV4Design }) => {
  let margin = ' 6px 0 14px 0';
  if (compactStyle) {
    margin = '6px 0 0px 0';
  } else {
    margin = isV4Design ? '6px 0 10px 0' : '6px 0 14px 0';
  }

  return [
    {
      display: 'flex',
      alignItems: 'flex-start' /* to top align icon */,
      margin,
    },
  ];
});

export const ValidationMessage = styled.div(({ theme }) => {
  const { negative } = theme;

  return [
    {
      display: 'block',
      color: negative ? negative.secondary : lightTheme.negative.secondary,
      width: '100%',
      fontSize: '12px',
      lineHeight: '16px',
    },
  ];
});
