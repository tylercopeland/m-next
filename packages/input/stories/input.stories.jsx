import React from 'react';
import Input, { DebouncedInput } from '../src';

export default {
  component: Input,
  title: 'm-one/Input',
  argTypes: {},
  parameters: {
    cssresources: [
      {
        id: `Method Styles`,
        code: `<link rel="stylesheet" type="text/css" href=""></link>`,
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
  return <Input {...args} />;
}
export const TextInput = Template.bind({});
TextInput.args = {
  id: 'test',
  name: 'Text Input',
  label: 'Text Input',
  caption: 'Text Input',
  type: 'text',
  disabled: false,
  forwardRef: null,
  readonly: false,
  required: false,
  autoComplete: 'off',
  placeholder: null,
  style: null,
  tabIndex: 0,
  value: '',
  width: '100%',
  validationMessage: null,
  displayAuto: false,
  legacyClass: null,
  isV4Design: true,
  isMobile: false,
  hidden: false,
  ['aria-describedby']: null, // eslint-disable-line
  prefixText: '',
  prefixIcon: '',
  hideCaption: false,
};

function TemplateDebounced(args) {
  return <DebouncedInput {...args} />;
}

export const DebouncedTextInput = TemplateDebounced.bind({});
DebouncedTextInput.args = {
  id: 'test',
  name: 'Text Input',
  label: 'Text Input',
  caption: 'Text Input',
  type: 'text',
  disabled: false,
  forwardRef: null,
  readonly: false,
  required: false,
  autoComplete: 'off',
  placeholder: null,
  style: null,
  tabIndex: 0,
  value: '',
  width: '100%',
  validationMessage: null,
  displayAuto: false,
  legacyClass: null,
  isV4Design: true,
  isMobile: false,
  hidden: false,
  ['aria-describedby']: null, // eslint-disable-line
  prefixText: '',
  prefixIcon: '',
  hideCaption: false,
};

export const SearchIcon = TemplateDebounced.bind({});
SearchIcon.args = {
  id: 'test',
  name: 'Text Input',
  label: 'Text Input',
  type: 'text',
  disabled: false,
  forwardRef: null,
  readonly: false,
  required: false,
  autoComplete: 'off',
  placeholder: null,
  style: null,
  tabIndex: 0,
  value: '',
  width: '100%',
  validationMessage: null,
  displayAuto: false,
  legacyClass: null,
  isV4Design: true,
  isMobile: false,
  hidden: false,
  ['aria-describedby']: null, // eslint-disable-line
  prefixText: '',
  prefixIcon: 'search',
};

export const PrefixText = TemplateDebounced.bind({});
PrefixText.args = {
  id: 'test',
  name: 'Text Input',
  label: 'Text Input',
  type: 'text',
  disabled: false,
  forwardRef: null,
  readonly: false,
  required: false,
  autoComplete: 'off',
  placeholder: null,
  style: null,
  tabIndex: 0,
  value: '',
  width: '100%',
  validationMessage: null,
  displayAuto: false,
  legacyClass: null,
  isV4Design: true,
  isMobile: false,
  hidden: false,
  ['aria-describedby']: null, // eslint-disable-line
  prefixText: 'Pre text',
  prefixIcon: '',
};

export const SuffixText = TemplateDebounced.bind({});
SuffixText.args = {
  id: 'test',
  name: 'Text Input',
  label: 'Text Input',
  type: 'text',
  disabled: false,
  forwardRef: null,
  readonly: false,
  required: false,
  autoComplete: 'off',
  placeholder: null,
  style: null,
  tabIndex: 0,
  value: '100',
  width: '100%',
  validationMessage: null,
  displayAuto: false,
  legacyClass: null,
  isV4Design: true,
  isMobile: false,
  hidden: false,
  ['aria-describedby']: null, // eslint-disable-line
  suffixText: 'px',
};
