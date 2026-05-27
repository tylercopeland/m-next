import React from 'react';
import '../../../src/app/app.css';
import InteractionsTabWrapper from './InteractionsTabWrapper';

export default {
  component: InteractionsTabWrapper,
  title: 'app-builder/editors/ChartBlockEditor',
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
    },
  },
};

function Template(args) {
  return <InteractionsTabWrapper {...args} />;
}
export const InteractionsTab = Template.bind({});
InteractionsTab.args = {
  isLoading: false,
  hasClickEvent: false,
};
