import React from 'react';
import TabsV2Wrapper from './TabsV2Wrapper';
import TabsV2 from '../src';

export default {
  component: TabsV2,
  title: 'm-one/TabsV2',
  argTypes: {
    selectedTab: {
      control: 'text',
      description: 'ID of the currently selected tab',
    },
    fullWidthTabs: {
      control: 'boolean',
      description: 'Whether tabs should take full width of container',
    },
    isDraggable: {
      control: 'boolean',
      description: 'Enable drag and drop reordering of tabs',
    },
    borderless: {
      control: 'boolean',
      description: 'Remove border from tab panel',
    },
  },
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
    docs: {
      description: {
        component:
          'TabsV2 is an enhanced version of the original Tabs component with improved styling and additional features.',
      },
    },
  },
};

function Template(args) {
  return <TabsV2Wrapper {...args} />;
}

export const Default = Template.bind({});
Default.args = {
  id: 'tabs-v2-default',
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
  id: 'tabs-v2-fullwidth',
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

export const WithOverflow = Template.bind({});
WithOverflow.args = {
  id: 'tabs-v2-overflow',
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

export const Draggable = Template.bind({});
Draggable.args = {
  id: 'tabs-v2-draggable',
  tabList: [
    { id: 'Data', caption: 'Data' },
    { id: 'Display', caption: 'Display' },
    { id: 'Formatting', caption: 'Formatting' },
    { id: 'Settings', caption: 'Settings' },
  ],
  selectedTab: 'Data',
  onRenderTabContent: null,
  onRenderTabHeader: null,
  onRenderTabHeaderMenuItem: null,
  onRenderTabHeaderMobile: null,
  onRenderTabHeaderRightIcon: null,
  isDraggable: true,
};

export const DraggableWithOverflow = Template.bind({});
DraggableWithOverflow.args = {
  id: 'tabs-v2-draggable-overflow',
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

export const Borderless = Template.bind({});
Borderless.args = {
  id: 'tabs-v2-borderless',
  tabList: [
    { id: 'Data', caption: 'Data' },
    { id: 'Display', caption: 'Display' },
    { id: 'Formatting', caption: 'Formatting' },
  ],
  selectedTab: 'Data',
  borderless: true,
};

export const WithDisabledTabs = Template.bind({});
WithDisabledTabs.args = {
  id: 'tabs-v2-disabled',
  tabList: [
    { id: 'Data', caption: 'Data' },
    { id: 'Display', caption: 'Display', disabled: true },
    { id: 'Formatting', caption: 'Formatting' },
    { id: 'Settings', caption: 'Settings', disabled: true },
  ],
  selectedTab: 'Data',
};
