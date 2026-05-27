import React from 'react';
import '../../src/app/app.css';
import FontWeightSelectorComponent from '../../src/components/addable-list/component-selectors/FontWeightSelector';

export default {
  component: FontWeightSelectorComponent,
  title: 'app-builder/common/FontWeightSelector',
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
    },
  },
};

function Template(args) {
  return <FontWeightSelectorComponent {...args} />;
}

export const DefaultFontWeight = Template.bind({});
DefaultFontWeight.args = {
  id: 'test',
  value: 'regular',
  onChange: () => {},
};
