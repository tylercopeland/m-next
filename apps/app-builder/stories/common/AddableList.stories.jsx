import React from 'react';
import '../../src/app/app.css';
import AddableListComponent from '../../src/components/addable-list/AddableList';

export default {
  component: AddableListComponent,
  title: 'app-builder/common/AddableList',
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
    },
  },
};

function Template(args) {
  return (
    <div style={{ width: 380 }}>
      {' '}
      <AddableListComponent {...args} />
    </div>
  );
}

export const Empty = Template.bind({});
Empty.args = {
  id: 'test',
  caption: 'Style',
  onChange: () => {},
};
