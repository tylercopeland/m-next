import React from 'react';
import Select from '../src/Select';

export default {
  component: Select,
  title: 'm-one/Select',
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
      url: 'https://www.figma.com/file/fJOkCYnLyPVhcfNghpaEvp/Users?type=design&node-id=1417-167431&mode=dev',
    },
  },
};

function Template(args) {
  return <Select {...args} />;
}

export const Default = Template.bind({});
Default.args = {
  id: 'select',
  options: [
    {
      icon: 'address-lookup',
      title: 'Explore',
      description: 'Discover new ways to manage your business',
    },
    {
      icon: 'checklist',
      title: 'Organize',
      description: 'Create and sync with accounting software',
    },
    {
      icon: 'cloud-download-V4',
      title: 'Download',
      description: 'Export millions of options exclusive to Method',
    },
  ],
};

export const NoDescription = Template.bind({});
NoDescription.args = {
  id: 'select',
  options: [
    {
      icon: 'address-lookup',
      title: 'Explore',
    },
    {
      icon: 'checklist',
      title: 'Organize',
    },
    {
      icon: 'cloud-download-V4',
      title: 'Download',
    },
  ],
};

export const NoTitle = Template.bind({});
NoTitle.args = {
  id: 'select',
  options: [
    {
      icon: 'address-lookup',
      description: 'Discover new ways to manage your business',
    },
    {
      icon: 'checklist',
      description: 'Create and sync with accounting software',
    },
    {
      icon: 'cloud-download-V4',
      description: 'Export millions of options exclusive to Method',
    },
  ],
};
