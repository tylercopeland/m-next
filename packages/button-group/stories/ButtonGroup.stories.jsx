import React from 'react';
import ButtonGroup from '../src';

export default {
  component: ButtonGroup,
  title: 'm-one/ButtonGroup',
  argTypes: {},
  parameters: {
    cssresources: [
      {
        id: `Method Styles`,
        code: `<link rel="stylesheet" type="text/css" href="https://alocetsystem.method.me/apps/public/styles/styles.min.css"></link>`,
        picked: true,
      },
    ],
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/OxikbbciwluLzZ4hTdUTWr/Design-System?type=design&node-id=21%3A86&t=9PD8SbHk2QC8A4EN-1',
    },
  },
};

export const DefaultStyles = {
  render: (args) => (
    <div>
      <ButtonGroup
        id='primary'
        buttonStyle='primary'
        data={[
          { value: 1, label: 'Primary' },
          { value: 2, label: 'Two' },
          { value: 3, label: 'One' },
        ]}
        {...args}
      />
      <ButtonGroup
        id='plain'
        buttonStyle='plain'
        data={[
          { value: 1, label: 'Plain' },
          { value: 2, label: 'Two' },
          { value: 3, label: 'One' },
        ]}
        {...args}
      />
      <ButtonGroup
        id='ghost'
        buttonStyle='ghost'
        data={[
          { value: 1, label: 'Ghost' },
          { value: 2, label: 'Two' },
          { value: 3, label: 'One' },
        ]}
        {...args}
      />
      <ButtonGroup
        id='calendarMenu'
        buttonStyle='calendarMenu'
        data={[
          { value: 1, label: 'CalendarMenu' },
          { value: 2, label: 'Two' },
          { value: 3, label: 'One' },
        ]}
        {...args}
      />
    </div>
  ),
};

export const V3Style = {
  args: {
    id: 'primary',
    data: [
      { value: 1, label: 'Primary' },
      { value: 2, label: 'Two' },
      { value: 3, label: 'One' },
    ],
    legacyClass: 'mi-button-group-primary',
  },
};
