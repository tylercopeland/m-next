import React from 'react';
import { ButtonRadioGroup } from '../src';

export default {
  component: ButtonRadioGroup,
  title: 'm-one/RadioGroup/ButtonRadioGroup',
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
  return <ButtonRadioGroup {...args} />;
}

export const Default = Template.bind({});
Default.args = {
  options: [
    {
      value: 2,
      label: 'Sum',
    },
    {
      value: 3,
      label: 'Average',
    },
    {
      value: 4,
      label: 'Max',
    },
    {
      value: 5,
      label: 'Min',
    },
  ],
};
