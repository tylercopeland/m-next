import React from 'react';
import TabsWrapper from './TabsWrapper';
import Tabs from '../src';

export default {
  component: Tabs,
  title: 'm-one/Tabs',
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
  return <TabsWrapper {...args} />;
}
export const Default = Template.bind({});
Default.args = {
  id: 'test',
  tabList: [
    { id: 'Data', caption: 'Data' },
    { id: 'Display', caption: 'Display' },
  ],
  selectedTab: 'Data',
  onRenderTabContent: null,
  onRenderTabHeader: null,
  onRenderTabHeaderMenuItem: null,
  onRenderTabHeaderMobile: null,
  onRenderTabHeaderRightIcon: null,
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  id: 'test',
  tabList: [
    { id: 'Data', caption: 'Data' },
    { id: 'Display', caption: 'Display' },
    { id: 'Formatting', caption: 'Formatting' },
    { id: 'Settings', caption: 'Settings' },
    { id: 'Validation', caption: 'Validation' },
    { id: 'Notes', caption: 'Notes' },
  ],
  selectedTab: 'Data',
  onRenderTabContent: null,
  onRenderTabHeader: null,
  onRenderTabHeaderMenuItem: null,
  onRenderTabHeaderMobile: null,
  onRenderTabHeaderRightIcon: null,
  fullWidthTabs: true,
};

export const More = Template.bind({});
More.args = {
  id: 'test',
  tabList: [
    { id: 'Data', caption: 'Data' },
    { id: 'Display', caption: 'Display' },
    { id: 'Formatting', caption: 'Formatting' },
    { id: 'Settings', caption: 'Settings' },
    { id: 'Validation', caption: 'Validation' },
    { id: 'Notes', caption: 'Notes' },
    { id: 'Analytics', caption: 'Analytics' },
    { id: 'Backup', caption: 'Backup' },
    { id: 'Calculation', caption: 'Calculation' },
    { id: 'Charting', caption: 'Charting' },
    { id: 'Collaboration', caption: 'Collaboration' },
    { id: 'Commentary', caption: 'Commentary' },
    { id: 'Comparison', caption: 'Comparison' },
    { id: 'Customization', caption: 'Customization' },
    { id: 'Dashboard', caption: 'Dashboard' },
    { id: 'Export', caption: 'Export' },
    { id: 'Filter', caption: 'Filter' },
    { id: 'Import', caption: 'Import' },
    { id: 'Integration', caption: 'Integration' },
    { id: 'Navigation', caption: 'Navigation' },
    { id: 'Notification', caption: 'Notification' },
    { id: 'Overview', caption: 'Overview' },
    { id: 'Performance', caption: 'Performance' },
    { id: 'Permissions', caption: 'Permissions' },
    { id: 'Preferences', caption: 'Preferences' },
    { id: 'Security', caption: 'Security' },
  ],
  selectedTab: 'Data',
  onRenderTabContent: null,
  onRenderTabHeader: null,
  onRenderTabHeaderMenuItem: null,
  onRenderTabHeaderMobile: null,
  onRenderTabHeaderRightIcon: null,
};

export const DefaultDraggable = Template.bind({});
DefaultDraggable.args = {
  id: 'test',
  tabList: [
    { id: 'Data', caption: 'Data' },
    { id: 'Display', caption: 'Display' },
  ],
  selectedTab: 'Data',
  onRenderTabContent: null,
  onRenderTabHeader: null,
  onRenderTabHeaderMenuItem: null,
  onRenderTabHeaderMobile: null,
  onRenderTabHeaderRightIcon: null,
  isDraggable: true,
};

export const MoreDraggable = Template.bind({});
MoreDraggable.args = {
  id: 'test',
  tabList: [
    { id: 'Data', caption: 'Data' },
    { id: 'Display', caption: 'Display' },
    { id: 'Formatting', caption: 'Formatting' },
    { id: 'Settings', caption: 'Settings' },
    { id: 'Validation', caption: 'Validation' },
    { id: 'Notes', caption: 'Notes' },
    { id: 'Analytics', caption: 'Analytics' },
    { id: 'Backup', caption: 'Backup' },
    { id: 'Calculation', caption: 'Calculation' },
    { id: 'Charting', caption: 'Charting' },
    { id: 'Collaboration', caption: 'Collaboration' },
    { id: 'Commentary', caption: 'Commentary' },
    { id: 'Comparison', caption: 'Comparison' },
    { id: 'Customization', caption: 'Customization' },
    { id: 'Dashboard', caption: 'Dashboard' },
    { id: 'Export', caption: 'Export' },
    { id: 'Filter', caption: 'Filter' },
    { id: 'Import', caption: 'Import' },
    { id: 'Integration', caption: 'Integration' },
    { id: 'Navigation', caption: 'Navigation' },
    { id: 'Notification', caption: 'Notification' },
    { id: 'Overview', caption: 'Overview' },
    { id: 'Performance', caption: 'Performance' },
    { id: 'Permissions', caption: 'Permissions' },
    { id: 'Preferences', caption: 'Preferences' },
    { id: 'Security', caption: 'Security' },
  ],
  selectedTab: 'Data',
  onRenderTabContent: null,
  onRenderTabHeader: null,
  onRenderTabHeaderMenuItem: null,
  onRenderTabHeaderMobile: null,
  onRenderTabHeaderRightIcon: null,
  isDraggable: true,
};
