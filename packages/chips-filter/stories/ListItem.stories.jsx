import React from 'react';
import { colors } from '@m-next/styles';
import ListItem from '../src/components/ListItem';

export default {
  component: ListItem,
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

export function ListItemVariants() {
  return (
    <div
      style={{
        background: colors['grey-lightest'],
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: 16,
        width: 264,
      }}
    >
      <ListItem id='list-item' label='Label' />
      <ListItem id='list-item-with-image' label='Label and image' showImage image='AA.mci' />
      <ListItem id='list-item-with-toggle' label='Label and toggle' showToggle />
      <ListItem id='list-item-all' label='Unchecked' showImage image='AA.mci' showToggle />
      <ListItem id='list-item-all-selected' label='Checked' showImage image='AA.mci' showToggle checked />
      <ListItem id='list-item-mobile' label='Mobile' showImage image='AA.mci' showToggle checked isMobile />
    </div>
  );
}
