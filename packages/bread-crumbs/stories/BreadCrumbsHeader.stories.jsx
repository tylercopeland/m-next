import React from 'react';
import BreadCrumbsHeader from '../src';

export default {
  component: BreadCrumbsHeader,
  title: 'm-one/BreadCrumbsHeader',
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
      url: 'https://www.figma.com/file/OxikbbciwluLzZ4hTdUTWr/Design-System?type=design&node-id=21%3A86&t=9PD8SbHk2QC8A4EN-1',
    },
  },
};

// Sample onClick function for menu items and crumbs

// Sample menu items
const menuItems = [
  { id: 'menu-1', label: 'Item 1', onClick: () => {} },
  { id: 'menu-2', label: 'Item 2', onClick: () => {} },
  { id: 'menu-3', label: 'Item 3', onClick: () => {} },
];

// Sample breadcrumbs
const crumbs = [
  { id: 'home', label: 'Home', onClick: () => {}, tooltip: 'Go to Home' },
  { id: 'section', label: 'Section', onClick: () => {}, tooltip: 'Go to Section' },
  { id: 'current', label: 'Current Page', onClick: () => {}, tooltip: 'You are here' },
];

const Template = (args) => <BreadCrumbsHeader {...args} />;

export const Default = Template.bind({});
Default.args = {
  id: 'breadcrumb-header-default',
  showMenu: false,
  menuItems: [],
  crumbs,
  tooltipId: 'default-tooltip',
};

export const WithMenu = Template.bind({});
WithMenu.args = {
  id: 'breadcrumb-header-with-menu',
  showMenu: true,
  menuItems,
  crumbs,
  tooltipId: 'menu-tooltip',
};

export const OnlyMenu = Template.bind({});
OnlyMenu.args = {
  id: 'breadcrumb-header-only-menu',
  showMenu: true,
  menuItems,
  crumbs: [],
  tooltipId: 'only-menu-tooltip',
};

export const NoCrumbsOrMenu = Template.bind({});
NoCrumbsOrMenu.args = {
  id: 'breadcrumb-header-no-crumbs-menu',
  showMenu: false,
  menuItems: [],
  crumbs: [],
  tooltipId: 'no-crumbs-menu-tooltip',
};
