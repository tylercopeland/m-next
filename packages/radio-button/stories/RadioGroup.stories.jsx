import React from 'react';
import RadioGroup from '../src';

export default {
  component: RadioGroup,
  title: 'm-one/RadioGroup',
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
  return <RadioGroup {...args} />;
}

export const Default = Template.bind({});
Default.args = {
  caption: 'Select an Option',
  hideCaption: false,
  options: [
    {
      label: 'one',
      value: 'one',
      hint: 'help',
    },
    {
      label: 'two',
      value: 'two',
    },
    {
      label: 'three',
      value: 'three',
    },
  ],
};

export const SystemPagesWithSubtext = Template.bind({});
SystemPagesWithSubtext.args = {
  options: [
    {
      label: 'one',
      value: 'one',
      hint: 'help',
      subtext:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      label: 'two',
      value: 'two',
    },
    {
      label: 'three',
      value: 'three',
      subtext: 'The end of the subtext',
    },
  ],
};

export const RunTime = Template.bind({});
RunTime.args = {
  isV4Design: false,
  isRuntime: true,
  options: [
    {
      label: 'one',
      value: 'one',
      hint: 'help',
    },
    {
      label: 'two',
      value: 'two',
    },
    {
      label: 'three',
      value: 'three',
    },
  ],
};
