import React from 'react';
import Image from '../src';

export default {
  component: Image,
  title: 'm-one/Image',
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
  return <Image {...args} />;
}
export const DisplayOnly = Template.bind({});
DisplayOnly.args = {
  id: 'test',
  width: 128,
  height: 128,
  imgType: 'Fixed',
  value: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juvenile_Ragdoll.jpg/1024px-Juvenile_Ragdoll.jpg',
  circle: false,
};

export const Round = Template.bind({});
Round.args = {
  ...DisplayOnly.args,
  circle: true,
};

export const Avatar = Template.bind({});
Avatar.args = {
  id: 'test',
  width: 128,
  height: 128,
  imgType: 'Fixed',
  value: 'NR-3.mci{{w=48}}',
  circle: true,
};
