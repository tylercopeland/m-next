import React from 'react';
import { colors } from '@m-next/styles';
import styled from '@emotion/styled';

function AddTemplate() {
  const Wrapper = styled.div(() => [
    {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      border: `2px solid ${colors['grey-light']}`,
      borderRadius: 4,
      padding: '12px 16px',
      paddingTop: 24,
    },
  ]);

  const Box = styled.div(() => [
    {
      border: `2px solid ${colors['grey-light']}`,
      height: 8,
      width: 80,
    },
  ]);

  const Dash = styled.div(() => [
    {
      background: colors['grey-light'],
      height: 8,
      width: 20,
      borderRadius: 8,
    },
  ]);

  const BlueDash = styled.div(() => [
    {
      background: colors.blue,
      height: 8,
      width: 80,
      borderRadius: 8,
    },
  ]);
  return (
    <Wrapper>
      <Dash />
      <Box />
      <Dash />
      <Box />
      <BlueDash />
    </Wrapper>
  );
}

export default AddTemplate;
