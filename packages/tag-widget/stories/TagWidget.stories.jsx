import React from 'react';
import TagWidgetStoryWrapper from './TagWidgetStoryWrapper';

export default {
  component: TagWidgetStoryWrapper,
  title: 'm-one/TagWidget',
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

const tagsList = [
  {
    name: 'aaa',
    colour: '#84f3ff',
  },
  {
    name: 'bbb',
    colour: '#A9d9bf',
  },
  {
    name: 'ccc',
    colour: '#ffabb5',
  },
  {
    name: 'ddd',
    colour: '#bacad0',
  },
  {
    name: 'eee',
    colour: '#ffea80',
  },
  {
    name: 'fff',
    colour: '#ffaca1',
  },
  {
    name: 'ggg',
    colour: '#91a2ff',
  },
  {
    name: 'hhh',
    colour: '#ffcdab',
  },
  {
    name: 'iii',
    colour: '',
  },
];
function Template(args) {
  return <TagWidgetStoryWrapper {...args} />;
}
export const ReadOnly = Template.bind({});
ReadOnly.args = {
  id: 'test',
  tagsList,
  caption: 'Tag List',
  value: ['aaa', 'bbb', 'ccc', 'ddd', 'eee', 'fff', 'ggg', 'hhh', 'iii', 'jjj'],
  disabled: false,
  isEditable: false,
};
export const Editable = Template.bind({});
Editable.args = {
  id: 'test',
  tagsList,
  suggestions: ['eee', 'ggg'],
  caption: 'Tag List',
  value: ['aaa', 'bbb', 'ccc'],
  disabled: false,
  isEditable: true,
};
