import React from 'react';
import '../../src/app/app.css';
import FontSizeSelectorComponent from '../../src/components/addable-list/component-selectors/FontSizeSelector';

export default {
  component: FontSizeSelectorComponent,
  title: 'app-builder/common/FontSizeSelector',
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
    },
  },
};

function Template(args) {
  return <FontSizeSelectorComponent {...args} />;
}

export const DefaultFontSize = Template.bind({});
DefaultFontSize.args = {
  id: 'test',
  value: 'regular',
  onChange: () => {},
};
