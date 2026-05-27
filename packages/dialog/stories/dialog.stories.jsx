import React from 'react';
import Dialog from '../src';

export default {
  component: Dialog,
  title: 'm-one/Dialog',
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
  return <Dialog {...args} />;
}
export const MessageOnly = Template.bind({});
MessageOnly.args = {
  title: 'Leave app builder without saving',
  children: (
    <div>
      You have not saved this screen since you last made changes to it. Leaving the app builder without saving will
      result in your changes being lost.
    </div>
  ),
  isOpen: true,
};

export const WithButtons = Template.bind({});
WithButtons.args = {
  title: 'Leave app builder without saving',
  children: (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span> You have not saved this screen since you last made changes to it. </span>
      <span>Leaving the app builder without saving will result in your changes being lost.</span>
    </div>
  ),
  footer: {
    primaryButtonLabel: "Don't save and close",
    secondaryButtonLabel: 'Cancel',
  },
  isOpen: true,
};
