import React from 'react';
import SearchInput from '../src';

export default {
  component: SearchInput,
  title: 'm-one/SearchInput',
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
  return <SearchInput {...args} />;
}
export const Search = Template.bind({});
SearchInput.args = {
  id: 'test',
  name: 'Text Input',
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
