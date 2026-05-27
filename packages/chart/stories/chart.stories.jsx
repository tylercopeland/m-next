import React from 'react';
import Chart from '../src';
// expect.extend(matchers);

export default {
  component: Chart,
  title: 'm-one/Chart',
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

const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const data = [
  {
    name: 'Tokyo',
    data: [
      123400, 71000.5, 106000.4, 129000.2, 144000.0, 176000.0, 135000.6, 148000.5, 216000.4, 194000.1, 95000.6, 54000.4,
    ],
  },
];

function Template(args) {
  return <Chart {...args} />;
}
export const Default = Template.bind({});
Default.args = {
  id: 'test',
  data,
  categories,
  chartType: 'bar',
  height: 200,
  width: 800,
  isLoading: false,
  error: null,
};
export const Loading = Template.bind({});
Loading.args = { ...Default.args, isLoading: true };

export const Error = Template.bind({});
Error.args = { ...Default.args, error: 'Error' };
