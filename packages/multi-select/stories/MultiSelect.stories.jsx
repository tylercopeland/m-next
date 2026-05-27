import React from 'react';
import MultiSelect from '../src/MultiSelect';

export default {
  component: MultiSelect,
  title: 'm-one/MultiSelect',
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
  return <MultiSelect {...args} />;
}

export const Default = Template.bind({});
Default.args = {
  className: 'default',
  placeholder: 'Enter values here...',
  options: [],
  inputType: 'text',
  fullSize: true,
};

export const DefaultMobile = Template.bind({});
DefaultMobile.args = {
  className: 'default-small',
  placeholder: 'Enter values here...',
  options: [],
  inputType: 'text',
  fullSize: false,
  isMobile: true,
};

export const Email = Template.bind({});
Email.args = {
  className: 'existing-values',
  placeholder: 'first.last@mail.com, first.last@mail.com, first.last@mail.com',
  options: ['a.smith@method.me', 'j.biden@method.me', 'k.mann@method.me'],
  inputType: 'email',
  fullSize: true,
};

export const DefaultDropdown = Template.bind({});
DefaultDropdown.args = {
  className: 'default-dropdown',
  placeholder: '',
  options: ['Current account tenant'],
  inputType: 'text',
  isDropdown: true,
  height: 'fit-content',
  dropdownOptions: ['Tenant 2', 'Tenant 3', 'Tenant 4', 'Tenant 5', 'Tenant 6'],
};
