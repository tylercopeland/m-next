import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const Wrapper = styled.div((props) => {
  const { theme } = props;

  return [
    {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      backgroundColor: theme.background.page,
      fontFamily: 'Source Sans Pro", Helvetica, Arial, sans-serif',
      textRendering: 'optimizeLegibility',
    },
  ];
});

export const LegacyWrapper = styled.div((props) => {
  const { theme } = props;

  return [
    {
      position: 'absolute',
      inset: 0,
      backgroundColor: theme.background.page,
      fontFamily: 'Source Sans Pro", Helvetica, Arial, sans-serif',
      textRendering: 'optimizeLegibility',
    },
  ];
});

export const ContentWrapper = styled.div((props) => {
  const { theme } = props;

  return [
    {
      backgroundColor: theme.background.page,
    },
  ];
});

export const InnerContentWrapper = styled.div(({ flushRight }) => [
  {
    position: 'absolute',
    inset: 0,
    top: 50,
    display: 'flex',
    right: flushRight ? 0 : 16,
  },
]);

export const BannerButton = styled.button(() => [
  {
    background: 'transparent',
    border: 'none',
    color: colors.blue,
    padding: '0px 2px',
    margin: '0px 2px',
    fontSize: 14,
    minWidth: 0,
    lineHeight: 1.5,
    fontWeight: 600,
    cursor: 'pointer',
    outline: 'none',
    ':focus-visible': {
      outline: 'none',
      boxShadow: '#0d71c8 0px 0px 0px 2.5px',
      borderRadius: 4,
    },
  },
]);
