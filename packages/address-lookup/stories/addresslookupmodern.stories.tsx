import AddressLookup from '../src/AddressLookup';

export default {
  title: 'm-one/AddressLookup',
  component: AddressLookup,
  argTypes: {
    onChange: { action: 'changed' },
    width: { control: 'text' },
    caption: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    isValid: { control: 'boolean' },
    validationMessage: { control: 'text' },
  },
};

// Define the default args that all stories will use
const defaultArgs = {
  id: 'address-lookup-modern',
  caption: 'Address',
  placeholder: 'Search for an address...',
  width: 400,
  disabled: false,
  required: false,
  isValid: true,
  isV4Design: true,
};

export const Default = {
  args: {
    ...defaultArgs,
  },
};

export const Required = {
  args: {
    ...defaultArgs,
    id: 'address-lookup-modern-required',
    required: true,
  },
};

export const Invalid = {
  args: {
    ...defaultArgs,
    id: 'address-lookup-modern-invalid',
    isValid: false,
    validationMessage: 'Please enter a valid address',
  },
};

export const Disabled = {
  args: {
    ...defaultArgs,
    id: 'address-lookup-modern-disabled',
    disabled: true,
  },
};
