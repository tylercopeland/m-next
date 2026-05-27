import styled from '@emotion/styled';
import { lightTheme } from '@m-next/styles';
import { colors } from '@m-next/tokens';

export const ContainerWrapper = styled.div((props) => {
  const { width, isValid, disabled } = props;

  return {
    width,
    display: 'inline-block',
    verticalAlign: 'top',
    maxWidth: '100%',
    cursor: disabled ? 'not-allowed' : null,
    position: 'relative',
    marginBottom: 0,
    border: !isValid ? colors.red.base : null,
  };
});

export const IconOption = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    alignContent: 'center',
  },
]);

export const IconHeader = styled.div(() => [
  {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
    padding: '0px 8px',
  },
]);

export const SingleOption = styled.div(() => [
  {
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    alignContent: 'center',
  },
]);
export const OptionHeader = styled.div(() => [
  {
    display: 'flex',
    gap: 16,
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
]);

export const MultiOption = styled.div(() => [
  {
    display: 'flex',
    alignContent: 'center',
    flexDirection: 'column',
  },
]);
export const ButtonOption = styled.div(() => [
  {
    display: 'flex',
    alignItems: 'right',
    alignContent: 'right',
    width: '100%',
  },
]);

export const MultiOptionIcon = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
  },
]);

export const MultiOptionLines = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
]);
export const MultiOptionIconLines = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 20,
    textAlign: 'left',
  },
]);
export const MultiOptionHeader = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
    alignContent: 'center',
    alignItems: 'center',
    fontWeight: 600,
    flex: 1,
  },
]);
export const MultiOptionLine = styled.div(() => [
  {
    fontSize: '14px',
    lineHeight: '16px',
    marginTop: 4,
  },
]);

export const DividerHeader = styled.div(() => [
  {
    borderTop: `1px solid ${lightTheme.content.border}`,
    height: 0,
    marginLeft: 8,
    marginRight: 8,
    paddingBottom: 4,
    paddingTop: 4,
  },
]);

export const SecondaryOption = styled.div(() => ({
  display: 'flex',
  gap: 16,
  justifyContent: 'space-between',
  flexGrow: 1,
  whiteSpace: 'nowrap',
}));

// #71828F sits between grey.base (#545F67) and grey.light (#BACAD0).
// Mapping to grey.base — closest token; muted-but-readable secondary label.
export const SecondaryLabel = styled.div(() => ({
  color: colors.grey.base,
}));

export const Square = styled.div(({ color, size }) => ({
  height: size,
  width: size,
  backgroundColor: color,
  borderRadius: 2,
  flexShrink: 0,
}));
