import styled from '@emotion/styled';
import { colors } from '@m-next/tokens';

export const IconWrapper = styled.div((props) => {
  const { selected } = props;
  const style = [
    {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      border: `1px solid ${colors.grey.light}`,
      width: 72,
      height: 72,
      justifyContent: 'center',
      borderRadius: 2,
      ':hover': {
        border: `2px solid ${colors.blue.base}`,
      },
    },
  ];
  if (selected) {
    style.push({
      border: `2px solid ${colors.blue.base}`,
      backgroundColor: colors.concrete,
    });
  }

  return style;
});
export const IconRadioButtonWrapper = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flexDirection: 'column',
    width: 72,
    textAlign: 'center',
  },
]);

export const IconRadioGroupWrapper = styled.div(() => [
  {
    display: 'flex',
    gap: '24px 29px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
]);
