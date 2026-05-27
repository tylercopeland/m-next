import styled from '@emotion/styled';
import { lightTheme } from '@m-next/styles';

export const EmptyWrapper = styled.div(() => [
  {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
]);

export const Wrapper = styled.div((props) => {
  const { theme } = props;
  const { content } = theme;
  const defaultColor = content ? content.primary : lightTheme.content.primary;


  return [
    {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: 140,
      justifyContent: 'center',
      color: defaultColor,
    },
  ];
});

export const Header = styled.h2((props) => {
  const { theme } = props;
  const { content } = theme;
  const defaultColor = `${content ? content.primary : lightTheme.content.primary} !important`;

  return [
    {
      marginBottom: 36,
      color: defaultColor,
    },
  ];
});

export const BodyLabel = styled.p(() => [{}]);

export const ValueLabel = styled.p(() => [
  {
    fontWeight: 600,
    fontSize: 24,
  },
]);

export const IconBody = styled.div(() => [
  {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
]);

export const IconBodyLabel = styled.div(() => [
  {
    fontWeight: 600,
    fontSize: 24,
    margin: '0px 24px',
  },
]);
