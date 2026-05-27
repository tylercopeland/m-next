import styled from '@emotion/styled';

export const ButtonRadioButtonWrapper = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flexDirection: 'column',
    textAlign: 'center',
  },
]);

export const ButtonRadioGroupWrapper = styled.div((props) => {
  const { isOneLine } = props;
  return [
    {
      display: 'flex',
      gap: '8px',
      flexWrap: isOneLine ? null : 'wrap',
      justifyContent: 'space-between',
    },
  ];
});
