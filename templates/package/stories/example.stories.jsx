import React from 'react';
import ExampleComponent from '../src';

export default {
  component: ExampleComponent,
  title: 'm-one/Prototypes/Example',
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
  return <ExampleComponent {...args} />;
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

