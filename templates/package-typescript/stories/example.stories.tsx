/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { ComponentStory } from '@storybook/react-webpack5';
import ExampleComponent from '../src';
import { ExampleComponentProps } from '../src/example';

export default {
  component: ExampleComponent,
  title: 'm-one/Prototypes/Example-TS',
  argTypes: {},
  parameters: {
    cssresources: [
      {
        id: `Method Styles`,
        code: `<link rel="stylesheet" type="text/css" href="https://alocetsystem.method.me/apps/public/styles/styles.min.css"></link>`,
        picked: true,
      },
    ],
    jest: ['example.test.jsx'],
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/xnh6ZMW6oZ1pwWgKzfROqJ/Version-Managment?node-id=11%3A4',
    },
  },
};

const Template: ComponentStory<typeof ExampleComponent> = function Template(args: ExampleComponentProps) {
  return <ExampleComponent {...args} />;
};

export const MessageOnly = Template.bind({});
MessageOnly.args = {
  message: 'This is Only a test',
};

export const WithButton = Template.bind({});
WithButton.args = {
  message: 'This is Only a test',
  primaryButton: 'Click Me',
};

