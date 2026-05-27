import styled from '@emotion/styled';
import { colors, lightTheme } from '@m-next/styles';

export const Wrapper = styled.div(() => [
  {
    background: lightTheme.background,
    position: 'absolute',
    inset: 0,
    backgroundColor: lightTheme.background.page,
    fontFamily: 'Source Sans Pro", Helvetica, Arial, sans-serif',
    textRendering: 'optimizeLegibility',
  },
]);

export const ContentWrapper = styled.div(() => [
  {
    backgroundColor: lightTheme.background.page,
    position: 'absolute',
    top: 58,
    bottom: 0,
    left: 0,
    right: 0,
  },
]);

export const InnerContentWrapper = styled.div(() => [
  {
    //   backgroundColor: lightTheme.background.primary,

    position: 'absolute',
    top: 48,
    bottom: 0,
    left: 98,
    right: 0,
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 30,
    marginTop: 24,
    justifyContent: 'center',
  },
]);

export const LeftNavWrapper = styled.div(() => [
  {
    position: 'absolute',
    top: 64,
    bottom: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'row',
    width: 98,
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
