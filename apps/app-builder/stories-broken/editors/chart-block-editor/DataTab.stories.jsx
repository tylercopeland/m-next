import React from 'react';
import '../../../src/app/app.css';
import DataTabWrapper from './DataTabWrapper';

export default {
  component: DataTabWrapper,
  title: 'app-builder/editors/ChartBlockEditor',
  argTypes: {},
  parameters: {
    jest: ['DataTab.test.jsx'],
    design: {
      type: 'figma',
    },
  },
};

function Template(args) {
  return <DataTabWrapper {...args} />;
}
export const DataTab = Template.bind({});
DataTab.args = {};
