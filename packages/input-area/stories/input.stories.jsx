import React from 'react';
import InputArea from '../src';

export default {
  component: InputArea,
  title: 'm-one/InputArea',
  argTypes: {},
  parameters: {
    cssresources: [
      {
        id: `Method Styles`,
        code: `<link rel="stylesheet" type="text/css" href=""></link>`,
        picked: true,
      },
    ],
  },
};

function Template(args) {
  return <InputArea {...args} />;
}
export const TextInput = Template.bind({});
TextInput.args = {
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
  onBlur: null,
  onChange: null,
  onFocus: null,
  onKeyDown: null,
  onKeyUp: null,
  validationMessage: null,
  displayAuto: false,
  legacyClass: null,
  isV4Design: true,
  isMobile: false,
  hidden: false,
  ['aria-describedby']: null, // eslint-disable-line
  prefixText: '',
  prefixIcon: '',
};
