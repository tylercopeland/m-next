import React from 'react';
import Toggle from '../src';

export default {
  component: Toggle,
  title: 'm-one/Toggle',
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
  return <Toggle {...args} />;
}
export const MessageOnly = Template.bind({});
MessageOnly.args = {
  id: 'test',
  disabled: false,
  checked: false,
  alignRight: false,
  isRuntime: false,
  textOpt: 'Toggle',
  label: 'Caption',
};
