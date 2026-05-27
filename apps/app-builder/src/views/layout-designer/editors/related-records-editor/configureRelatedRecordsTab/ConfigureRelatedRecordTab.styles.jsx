import styled from '@emotion/styled';
import { colors } from '@m-next/styles';
import { TextLine } from '@m-next/typeography';

export const Wrapper = styled.div((props) => [
  {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    flexGrow: 1,
    minHeight: 400,
    padding: props.padding,
  },
]);

export const LineWrapper = styled.div(() => [
  {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
]);

export const IconWrapper = styled.div((props) => {
  const { selected } = props;
  const style = [
    {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      border: `1px solid ${colors['grey-light']}`,
      width: 62,
      height: 62,
      justifyContent: 'center',
      ':hover': {
        border: `2px solid ${colors.blue}`,
      },
    },
  ];
  if (selected) {
    style.push({
      border: `2px solid ${colors.blue}`,
      backgroundColor: colors.concrete,
    });
  }

  return style;
});
export const ChartTypeWrapper = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flexDirection: 'column',
  },
]);

export const AddFilterWrapper = styled.div((hasExpression) => [
  {
    display: 'flex',
    gap: 8,
    justifyContent: 'space-between',
    marginBottom: hasExpression ? 12 : 8,
  },
]);

export const AppNameWrapper = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
]);

export const Divider = styled.div(() => [
  {
    borderBottom: `1px solid ${colors['grey-light']}`,
    marginBottom: 8,
  },
]);

export const DialogContent = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    width: '100%',
  },
]);

export const LinkWrapper = styled.div(({ isStock }) => [
  {
    display: 'flex',
    position: 'relative',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: isStock ? '4px 0px' : '4px 8px',
    border: isStock ? null : `1px solid ${colors['grey-light']}`,
    cursor: isStock ? null : 'pointer',
  },
]);

export const LinkHeader = styled(TextLine)`
  position: absolute;
  top: -11px;
  background: ${colors.white};
  padding: ${(p) => (p.isStock ? 0 : '0px 4px')};
  left: ${(p) => (p.isStock ? 0 : '4px')};
`;
