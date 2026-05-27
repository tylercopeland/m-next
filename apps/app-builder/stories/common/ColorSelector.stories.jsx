import React from 'react';
import { colors } from '@m-next/styles';
import '../../src/app/app.css';
import ColorSelectorComponent from '../../src/components/addable-list/component-selectors/ColorSelector';

export default {
  component: ColorSelectorComponent,
  title: 'app-builder/common/ColorSelector',
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
    },
  },
};

function Template(args) {
  return (
    <div>
      <ColorSelectorComponent {...args} />
      <ColorSelectorComponent
        value='#2a394a'
        customOptions={[
          { label: 'Regular', value: '#2a394a' },
          { label: 'Alert', value: '#da211e' },
          { label: 'Primary', value: '#0d71c8' },
          { label: 'Secondary', value: '#eef5f7' },
          { label: 'Navigation', value: '#022266' },
          { label: 'Caution', value: '#e05d2a' },
          { label: 'Success', value: '#007b4a' },
          { label: 'Dark Grey', value: '#545f67' },
          { label: 'Silver', value: '#eef5f7' },
          { label: 'Black', value: '#000000' },
          { label: 'White', value: '#ffffff' },
        ]}
      />
      <ColorSelectorComponent
        value='#2a394a'
        customOptions={[
          { label: 'Regular', value: '#2a394a' },
          { label: 'Alert', value: '#da211e' },
          { label: 'Primary', value: '#0d71c8' },
          { label: 'Navigation', value: '#022266' },
          { label: 'Caution', value: '#e05d2a' },
          { label: 'Success', value: '#007b4a' },
          { label: 'Grey', value: '#bacad0' },
          { label: 'Dark Grey', value: '#545f67' },
          { label: 'Silver', value: '#eef5f7' },
          { label: 'Black', value: '#000000' },
          { label: 'White', value: '#ffffff' },
        ]}
      />
      <ColorSelectorComponent
        value='#2a394a'
        customOptions={[
          { label: 'Regular', value: '#2a394a' },
          { label: 'Grey', value: '#bacad0' },
          { label: 'Dark Grey', value: '#545f67' },
          { label: 'Navigation', value: '#022266' },
          { label: 'Alert', value: '#da211e' },
          { label: 'Pink', value: '#d81f47' },
          { label: 'Purple', value: '#3b4aed' },
          { label: 'Primary', value: '#0d71c8' },
          { label: 'Aqua', value: '#2ec9e8' },
          { label: 'Success', value: '#007b4a' },
          { label: 'Yellow', value: '#fdcb2e' },
          { label: 'Caution', value: '#e05d2a' },
          { label: 'Black', value: '#000000' },
          { label: 'White', value: '#ffffff' },
        ]}
      />
      <ColorSelectorComponent
        value={colors['grey-darker']}
        customOptions={[
          { value: colors['grey-darker'], label: 'Dark Grey' },
          { value: colors['grey-light'], label: 'Grey' },
          { value: colors.red, label: 'Red' },
          { value: colors.fuchsia, label: 'Pink' },
          { value: colors.purple, label: 'Purple' },
          { value: colors.blue, label: 'Blue' },
          { value: colors.teal, label: 'Aqua' },
          { value: colors.green, label: 'Green' },
          { value: colors.yellow, label: 'Yellow' },
          { value: colors.orange, label: 'Orange' },
          { value: colors.black, label: 'Black' },
        ]}
      />
    </div>
  );
}

export const DefaultColors = Template.bind({});
DefaultColors.args = {
  id: 'test',
  value: colors['grey-darker'],
  onChange: () => {},
};
