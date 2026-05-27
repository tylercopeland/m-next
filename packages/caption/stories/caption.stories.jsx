import React from 'react';
import Caption from '../src';

export default {
  component: Caption,
  title: 'm-one/Caption',
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
  return <Caption {...args} />;
}
export const SimpleCaption = Template.bind({});
SimpleCaption.args = {
  label: 'Free Cupcakes',
};

export const RequiredCaption = Template.bind({});
RequiredCaption.args = {
  label: 'Free Cupcakes',
  required: true,
};
