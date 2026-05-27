/* eslint-disable import/prefer-default-export */
import styled from '@emotion/styled';

export const ColumnWrapper = styled.div((props) => {
  const getGap = () => {
    if (props.hideEmptyFields) return 0;
    return props.size === 'small' ? 4 : 8;
  };

  return {
    display: 'flex',
    flexDirection: 'column',
    gap: getGap(),
    padding: props.hideEmptyFields ? '8px 0px 4px' : '8px',
    justifyContent: 'center',
    flexGrow: 1,
    flexBasis: '50%',
    overflow: 'hidden',
  };
});
