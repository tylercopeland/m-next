import React from 'react';
import ChipsFilter from '../src/ChipsFilter';
import FilterWrapper from '../testing/FilterWrapper';

export default {
  component: ChipsFilter,
  title: 'm-one/ChipsFilter',
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

export function Filter() {
  return <FilterWrapper id='chips' />;
}

export function FilterMobile() {
  return <FilterWrapper id='chips' isMobile />;
}

export function FilterEmpty() {
  return <FilterWrapper id='chips' isEmpty />;
}
