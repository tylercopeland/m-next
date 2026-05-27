import React from 'react';
import { IconRadioGroup } from '../src';

export default {
  component: IconRadioGroup,
  title: 'm-one/RadioGroup/IconRadioGroup',
  argTypes: {},
  parameters: {
    cssresources: [
      {
        id: `Method Styles`,
        code: `<link rel="stylesheet" type="text/css" href="https://alocetsystem.method.me/apps/public/styles/styles.min.css"></link>`,
        picked: true,
      },
    ],
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/xnh6ZMW6oZ1pwWgKzfROqJ/Version-Managment?node-id=11%3A4',
    },
  },
};

function Template(args) {
  return <IconRadioGroup {...args} />;
}

export const Default = Template.bind({});
Default.args = {
  options: [
    {
      value: 1,
      icon: 'mi-icon-bar-chart',
      label: 'Column',
    },
    {
      value: 0,
      icon: 'mi-icon-graph-bar-1',
      label: 'Bar',
    },
    {
      value: 3,
      icon: 'mi-icon-graph-line-2',
      label: 'Line',
    },
    {
      value: 6,
      icon: 'mi-icon-graph-line-4',
      label: 'Area',
    },
    {
      value: 4,
      icon: 'mi-icon-pie-chart',
      label: 'Pie',
    },

    {
      value: 7,
      icon: 'mi-icon-doughnut-chart',
      label: 'Donut',
    },
  ],
};
