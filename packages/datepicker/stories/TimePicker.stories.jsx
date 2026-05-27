import React from 'react';
import { TimePicker } from '../src';

export default {
  component: TimePicker,
  title: 'm-one/DatePicker',
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/xnh6ZMW6oZ1pwWgKzfROqJ/Version-Managment?node-id=11%3A4',
    },
  },
};

function Template(args) {
  return <TimePicker {...args} />;
}
export const TimePickerExample = Template.bind({});
TimePickerExample.args = {
  id: 'test',
  formatType: 'DateTime',
  value: '2022-11-08T13:20',
};
