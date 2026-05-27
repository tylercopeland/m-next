import React from 'react';
import { ValidationMessage, Validation } from '../src';

export default {
  component: ValidationMessage,
  title: 'm-one/Validation',
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
  return <ValidationMessage {...args} />;
}
export const Message = Template.bind({});
Message.args = {
  message: 'An Error has occured',
  isV4Design: false,
};

export const MessageV4 = Template.bind({});
MessageV4.args = {
  message: 'An Error has occured',
  isV4Design: true,
};

function TemplateValidation(args) {
  return <Validation {...args} />;
}
export const SimpleValidation = TemplateValidation.bind({});
SimpleValidation.args = {
  isV4Design: true,
  value: "I'm a fish",
  rules: [{ type: 'isRequired' }, { type: 'isValidEmail' }, { type: 'isValidLength', minLength: 1, maxLength: 5 }],
};
