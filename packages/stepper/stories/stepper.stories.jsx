import React from 'react';
import Stepper from '../src';

export default {
  component: Stepper,
  title: 'm-one/Stepper',
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
  return <Stepper {...args} />;
}
export const Default = Template.bind({});
Default.args = {
  steps: 4,
  activeStep: 0,
  displayLabel: true,
  alternativeLabel: false,
};
export const AlternateLabel = Template.bind({});
AlternateLabel.args = {
  steps: 4,
  activeStep: 0,
  displayLabel: true,
  alternativeLabel: true,
};
export const NoLabel = Template.bind({});
NoLabel.args = {
  steps: 4,
  activeStep: 0,
  displayLabel: false,
  alternativeLabel: true,
};
export const CustomIcon = Template.bind({});
CustomIcon.args = {
  steps: 4,
  activeStep: 0,
  displayLabel: false,
  iconName: 'user',
};
