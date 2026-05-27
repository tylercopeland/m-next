/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { MenuList, MenuItem } from '../src';

export default {
  component: MenuList,
  title: 'm-one/MenuList',
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
  return (
    <MenuList {...args}>
      <MenuItem style={{ textAlign: 'center' }}>All</MenuItem>
      <MenuItem style={{ textAlign: 'center' }}>Any</MenuItem>
    </MenuList>
  );
}
export const Default = Template.bind({});
Default.args = {
  open: true,
};
