import React from 'react';
import { colors } from '@m-next/styles';
import styled from '@emotion/styled';

function ListTemplate() {
  const Wrapper = styled.div(() => [
    {
      height: '100%',
      width: 230,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      border: `2px solid ${colors['grey-light']}`,
      borderRadius: 4,
    },
  ]);
  const Header = styled.div(() => [
    {
      background: colors['grey-lighter'],
      height: 14,
      marginBottom: 4,
    },
  ]);
  const Line = styled.div(() => [
    {
      gap: 12,
      display: 'flex',
      justifyContent: 'center',
      padding: '0px 16px',
    },
  ]);

  const Dot = styled.div(() => [
    {
      background: colors['grey-light'],
      height: 8,
      width: 8,
      borderRadius: 8,
    },
  ]);

  const LongDash = styled.div(() => [
    {
      background: colors['grey-light'],
      height: 8,
      width: 48,
      borderRadius: 8,
    },
  ]);

  const Dash = styled.div(() => [
    {
      background: colors['grey-light'],
      height: 8,
      width: 28,
      borderRadius: 8,
    },
  ]);

  const BlueDash = styled.div(() => [
    {
      background: colors.blue,
      height: 8,
      width: 24,
      borderRadius: 8,
    },
  ]);
  return (
    <Wrapper>
      <Header />
      <Line>
        <Dot />
        <LongDash />
        <Dash />
        <Dash />
        <BlueDash />
      </Line>
      <Line>
        <Dot />
        <LongDash />
        <Dash />
        <Dash />
        <BlueDash />
      </Line>
      <Line>
        <Dot />
        <LongDash />
        <Dash />
        <Dash />
        <BlueDash />
      </Line>
      <Line>
        <Dot />
        <LongDash />
        <Dash />
        <Dash />
        <BlueDash />
      </Line>
      <Line>
        <Dot />
        <LongDash />
        <Dash />
        <Dash />
        <BlueDash />
      </Line>
      <Line>
        <Dot />
        <LongDash />
        <Dash />
        <Dash />
        <BlueDash />
      </Line>
    
    </Wrapper>
  );
}

export default ListTemplate;
