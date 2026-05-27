import React from 'react';
import DatePicker from '../src';

export default {
  component: DatePicker,
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
  return <DatePicker {...args} />;
}
export const DateTime = Template.bind({});
DateTime.args = {
  id: 'test',
  formatType: 'DateTime',
  value: '2022-11-08T13:20',
};

export const Date = Template.bind({});
Date.args = {
  id: 'test',
  formatType: 'ShortDate',
  value: '2022-11-08T13:20',
};

export const Time = Template.bind({});
Time.args = {
  id: 'test',
  formatType: 'Time',
  value: '2022-11-08T13:20',
};
