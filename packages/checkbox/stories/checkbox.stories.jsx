import React from 'react';
import Checkbox from '../src';

export default {
  component: Checkbox,
  title: 'm-one/Checkbox',
  argTypes: {},
  parameters: {
    cssresources: [
      {
        id: `Method Styles`,
        code: `<link rel="stylesheet" type="text/css" href="https://alocetsystem.method.me/apps/public/styles/styles.min.css"></link>`,
        picked: true,
      },
    ],
  },
};

function Template(args) {
  return <Checkbox {...args} />;
}
export const Desktop = Template.bind({});
Desktop.args = {
  id: 'test',
  label: 'This is Only a Button',
  checked: true,
  isMobile: false,
};
export const Mobile = Template.bind({});
Mobile.args = {
  id: 'test',
  label: 'This is Only a Button',
  checked: true,
  isMobile: true,
};
