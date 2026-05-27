import React from 'react';
import AddChip from '../src/components/AddChip';

export default {
  component: AddChip,
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

export function AddChipVariants() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
      <AddChip id='add-label' label='Label' onClick={() => {}} />
      <AddChip id='add-no-label' showLabel={false} onClick={() => {}} />
    </div>
  );
}
