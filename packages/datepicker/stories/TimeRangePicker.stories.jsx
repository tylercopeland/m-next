import React from 'react';
import { TimeRangePicker } from '../src';

export default {
  component: TimeRangePicker,
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
  return <TimeRangePicker {...args} />;
}
export const TimeRangePickerExample = Template.bind({});
TimeRangePickerExample.args = {
  id: 'test',
  formatType: 'DateTime',
  startTimeValue: '2022-11-08T13:20',
  endTimeValue: '2022-11-12T19:00',
};
