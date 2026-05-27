import React from 'react';
import '../../../src/app/app.css';
import DisplayWrapper from './DisplayWrapper';

export default {
  component: DisplayWrapper,
  title: 'app-builder/editors/ChartBlockEditor',
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
    },
  },
};

function Template(args) {
  return <DisplayWrapper {...args} />;
}
export const DisplayTab = Template.bind({});
DisplayTab.args = {};
