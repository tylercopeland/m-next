import React from 'react';
import LoadingSkeleton from '../src';

export default {
  component: LoadingSkeleton,
  title: 'm-one/LoadingSkeleton',
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
  return <LoadingSkeleton {...args} />;
}
export const MessageOnly = Template.bind({});
MessageOnly.args = {
  message: 'This is Only a test',
};

export const WithButton = Template.bind({});
WithButton.args = {
  message: 'This is Only a test',
  primaryButton: 'Click Me',
};
