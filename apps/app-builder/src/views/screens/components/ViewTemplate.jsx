import React from 'react';
import { colors } from '@m-next/styles';
import styled from '@emotion/styled';

function ViewTemplate() {
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
    },
  ]);

  const Dot = styled.div(() => [
    {
      background: colors['grey-light'],
      height: 4,
      width: 6,
      borderRadius: 4,
    },
  ]);

  const Dash = styled.div(() => [
    {
      background: colors['grey-light'],
      height: 8,
      borderRadius: 8,
      flexBasis: '25%',
    },
  ]);

  const BlueDash = styled.div(() => [
    {
      background: colors.blue,
      height: 8,
      borderRadius: 8,
      flexBasis: '25%',
    },
  ]);
  const Content = styled.div(() => [
    {
      display: 'flex',
      margin: 8,
      gap: 8,
      marginTop: 0,
    },
  ]);

  const LeftBar = styled.div(() => [
    {
      display: 'flex',
      flexDirection: 'column',
      padding: 4,
      border: `1px solid ${colors['grey-light']}`,
      gap: 6,
      borderRadius: 4,
      flexBasis: '15%',
    },
  ]);

  const ThinLine = styled.div(() => [
    {
      height: 4,
      borderRadius: 4,
      background: colors['grey-light'],
      width: '100%',
    },
  ]);

  const FirstLine = styled.div(() => [
    {
      display: 'flex',
      gap: 4,
    },
  ]);

  const TabPanel = styled.div(() => [
    {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      flexBasis: '85%',
    },
  ]);
  const TabContent = styled.div(() => [
    {
      display: 'flex',
      flexDirection: 'column',
      border: `1px solid ${colors['grey-light']}`,
      gap: 8,
      padding: 6,
      borderRadius: 4,
    },
  ]);
  const Line = styled.div(() => [
    {
      background: colors['grey-light'],
      height: 4,
      borderRadius: 8,
    },
  ]);

  const TabHeader = styled.div(() => [
    {
      display: 'flex',
      gap: 5,
    },
  ]);

  return (
    <Wrapper>
      <Header />
      <Content>
        <LeftBar>
          <FirstLine>
            <Dot /> <ThinLine />
          </FirstLine>
          <ThinLine />
          <ThinLine />
          <ThinLine />
          <ThinLine />
          <ThinLine />
          <ThinLine />
          <ThinLine />
          <ThinLine />
          <ThinLine />
        </LeftBar>
        <TabPanel>
          <TabHeader>
            <Dash />
            <Dash />
            <Dash />
            <BlueDash />
          </TabHeader>
          <TabContent>
            <Line />
            <Line />
            <Line />
            <Line />
            <Line />
            <Line />
            <Line />
          </TabContent>
        </TabPanel>
      </Content>
    </Wrapper>
  );
}

export default ViewTemplate;
