import React from 'react';
import { DateRangePicker } from '../src';
import DateRangePickerWrapper from './DateRangePickerWrapper';

export default {
  component: DateRangePicker,
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
  return <DateRangePickerWrapper {...args} />;
}
export const DateRangePickerExample = Template.bind({});
