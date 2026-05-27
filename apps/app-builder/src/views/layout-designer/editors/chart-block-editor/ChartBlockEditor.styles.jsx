import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

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

