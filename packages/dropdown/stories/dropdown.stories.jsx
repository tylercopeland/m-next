import React from 'react';
import Dropdown from '../src';

export default {
  component: Dropdown,
  title: 'm-one/Dropdown',
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
  return <Dropdown {...args} />;
}
export const Desktop = Template.bind({});
Desktop.args = {
  id: 'test',
  caption: 'Test',
  width: '120px',
  isV4Design: true,
  options: [
    { value: 1, label: 'First' },
    { value: 2, label: 'Second' },
    { value: 3, label: 'Third' },
  ],
  value: { value: 1, label: 'First' },
};

export const DesktopIcon = Template.bind({});
DesktopIcon.args = {
  id: 'test',
  caption: 'Test',
  width: '120px',
  isV4Design: true,
  dropdownStyle: 'icon',
  options: [
    { value: 1, label: 'First', icon: 'phone' },
    { value: 2, label: 'Second', icon: 'filter' },
    { value: 3, label: 'Third', icon: 'cloud' },
  ],
  value: { value: 1, label: 'First', icon: 'phone' },
};

export const DesktopCreatable = Template.bind({});
DesktopCreatable.args = {
  id: 'test',
  caption: 'Test',
  width: '120px',
  isV4Design: true,
  isCreatable: true,
  actionButtonText: 'Custom Action',
  // eslint-disable-next-line no-alert
  onActionButtonClick: () => alert('Custom Action Clicked'),
  options: [
    { value: '__action-button__', label: 'Custom Action' },
    { value: 1, label: 'First' },
    { value: 2, label: 'Second' },
    { value: 3, label: 'Third' },
  ],
  value: { value: 1, label: 'First' },
  open: true,
};

export const DesktopMulti = Template.bind({});
DesktopMulti.args = {
  id: 'test',
  caption: 'Test',
  width: '120px',
  isV4Design: true,
  dropdownStyle: 'multi',
  options: [
    { value: 1, label: 'First', lines: ['Line 1', 'Line 2'] },
    { value: 2, label: 'Second', lines: ['Line 1', 'Line 2'] },
    { value: 3, label: 'Third', lines: ['Line 1', 'Line 2'] },
  ],
  value: { value: 1, label: 'First', lines: ['Line 1', 'Line 2'] },
  open: true,
};

export const DesktopMultiIcon = Template.bind({});
DesktopMultiIcon.args = {
  id: 'test',
  caption: 'Test',
  width: '120px',
  isV4Design: true,
  dropdownStyle: 'multi-icon',
  options: [
    { value: 1, label: 'First', lines: ['Line 1', 'Line 2'], icon: 'phone' },
    { value: 2, label: 'Second', lines: ['Line 1', 'Line 2'], icon: 'filter' },
    { value: 3, label: 'Third', lines: ['Line 1', 'Line 2'], icon: 'cloud' },
  ],
  value: { value: 1, label: 'First', lines: ['Line 1', 'Line 2'], icon: 'phone' },
  open: true,
};

export const Invalid = Template.bind({});
Invalid.args = {
  id: 'test',
  caption: 'Test',
  width: '120px',
  isV4Design: true,
  required: true,
  hasValidation: true,
  validationMessage: 'Field is required.',
  options: [
    { value: 1, label: 'First' },
    { value: 2, label: 'Second' },
    { value: 3, label: 'Third' },
  ],
};

export const Loading = Template.bind({});
Loading.args = {
  id: 'test',
  caption: 'Test',
  width: '120px',
  isV4Design: true,
  required: true,
  isLoading: true,
  options: [
    { value: 1, label: 'First' },
    { value: 2, label: 'Second' },
    { value: 3, label: 'Third' },
  ],
};

export const Disabled = Template.bind({});
Disabled.args = {
  id: 'test',
  caption: 'Test',
  width: '120px',
  isV4Design: true,
  required: true,
  disabled: true,
  options: [
    { value: 1, label: 'First' },
    { value: 2, label: 'Second' },
    { value: 3, label: 'Third' },
  ],
};
