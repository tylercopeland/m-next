import React from 'react';
import Container from '@m-next/container';
import SvgIcon from '@m-next/svg-icon';
import { lightTheme } from '@m-next/styles';
import * as s from './controlPanel.styles';

const propTypes = {};

function ControlPanel() {
  return (
    <Container
      id='control-panel'
      isRound={false}
      style={{ minHeight: 'calc(100vh - 60px)', padding: 0, overflowX: 'hidden' }}
      width='100%'
      borderless
      scrollable
    >
      <s.Header>Blocks</s.Header>
      <Container
        id='control-panel-data'
        isRound={false}
        width='100%'
        borderless
        style={{ flexWrap: 'wrap', gap: 8, flexDirection: 'row' }}
      >
        <s.ControlWrapper>
          <SvgIcon name='dropdown' size={24} color={lightTheme.content.primary} />
          <span>Fields</span>
        </s.ControlWrapper>
        <s.ControlWrapper>
          <SvgIcon name='integers' size={24} color={lightTheme.content.primary} />
          <span>Metric</span>
        </s.ControlWrapper>
        <s.ControlWrapper>
          <SvgIcon name='bar-chart' size={24} color={lightTheme.content.primary} />
          <span>Chart</span>
        </s.ControlWrapper>
      </Container>
    </Container>
  );
}

ControlPanel.propTypes = propTypes;
export default ControlPanel;
