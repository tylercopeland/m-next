/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import Signature from '../src';

export default {
  title: 'm-one/Signature',
  component: Signature,
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    hideCancel: { control: 'boolean' },
    acceptCaption: { control: 'text' },
    cancelCaption: { control: 'text' },
    displayPreferences: { control: 'object' },
  },
};

const defaultArgs = {
  label: 'Signature',
  placeholder: '',
  disabled: false,
  isSignable: true,
  hideCancel: false,
  acceptCaption: 'Accept',
  cancelCaption: 'Cancel',
  displayPreferences: {},
};

export const Default = {
  args: {
    ...defaultArgs,
  },
};

export const Disabled = {
  args: {
    ...defaultArgs,
    disabled: true,
  },
};
