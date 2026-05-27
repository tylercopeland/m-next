import React from 'react';
import Container from '../src';

export default {
  component: Container,
  title: 'm-one/Container',
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
  return <Container {...args} />;
}
export const MessageOnly = Template.bind({});
MessageOnly.args = {
  children: <div>Hi</div>,
  isVisible: true,
  isLoading: false,
};
