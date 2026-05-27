import { ButtonGroupRow } from '../src';

export default {
  component: ButtonGroupRow,
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

export const TwoButtonRowText = {
  args: {
    id: 'primary',
    data: [
      { value: 1, label: 'Primary' },
      { value: 2, label: 'Two' },
    ],
    selected: 1,
  },
};

export const TwoButtonRowIcon = {
  args: {
    id: 'primary',
    data: [
      { value: 2, icon: 'tabs-condensed-V4' },
      { value: 1, icon: 'tabs-V4' },
    ],
    selected: 1,
  },
};
export const ThreeButtonRowText = {
  args: {
    id: 'primary',
    data: [
      { value: 1, label: 'Primary' },
      { value: 2, label: 'Two' },
      { value: 3, label: 'Three' },
    ],
    selected: 1,
  },
};
