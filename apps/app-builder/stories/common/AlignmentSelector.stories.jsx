import React from 'react';
import '../../src/app/app.css';
import AlignmentSelectorComponent from '../../src/components/addable-list/component-selectors/AlignmentSelector';

export default {
  component: AlignmentSelectorComponent,
  title: 'app-builder/common/AlignmentSelector',
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
    },
  },
};

function Template(args) {
  return <AlignmentSelectorComponent {...args} />;
}

export const DefaultAlignment = Template.bind({});
DefaultAlignment.args = {
  id: 'test',
  value: 'left',
  onChange: () => {},
};
