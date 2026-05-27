import React from 'react';
import { colors } from '@m-next/styles';
import '../../src/app/app.css';
import Component from '../../src/views/layout-designer/editors/common/components/styles-list/StylesList';

export default {
  component: Component,
  title: 'app-builder/common/AddableList',
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
    },
  },
};

function Template(args) {
  return (
    <div style={{ width: 380 }}>
      <Component {...args} />
    </div>
  );
}

export const StylesList = Template.bind({});
StylesList.args = {
  id: 'test',
  onChange: () => {},
  standardOptions: ['caption', 'border', 'font-color', 'font-size', 'background-color'],

  values: [
    {
      id: 'border-right-color',
      value: colors.red,
    },
    {
      id: 'border-right-size',
      value: '2px',
    },
    {
      id: 'border-right-style',
      value: 'solid',
    },
    {
      id: 'caption-size',
      value: 'large',
    },
    {
      id: 'caption-alignment',
      value: 'right',
    },
    {
      id: 'caption-weight',
      value: 'bold',
    },
  ],
};
