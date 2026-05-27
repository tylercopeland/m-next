import React from 'react';
import '../../src/app/app.css';
import DataModelEditorWrapper from './dataModelEditorWrapper';

export default {
  component: DataModelEditorWrapper,
  title: 'app-builder/editors/DataModelEditor',
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
    },
  },
};

function Template(args) {
  return <DataModelEditorWrapper {...args} />;
}
export const Default = Template.bind({});
Default.args = {
  id: 'test',
  controlName: 'FieldBlock',
  dataModelId: 'Contacts',
  fieldIsLoading: false,
  fieldLoadingError: null,
};

export const UpdateCaption = Template.bind({});
UpdateCaption.args = {
  id: 'test',
  controlName: 'FieldBlock',
  dataModelId: 'Contacts',
  fieldIsLoading: false,
  fieldLoadingError: null,
};

export const DeleteItem = Template.bind({});
DeleteItem.args = {
  id: 'test',
  controlName: 'FieldBlock',
  dataModelId: 'Contacts',
  fieldIsLoading: false,
  fieldLoadingError: null,
};

export const AddItem = Template.bind({});
AddItem.args = {
  id: 'test',
  controlName: 'FieldBlock',
  dataModelId: 'Contacts',
  fieldIsLoading: false,
  fieldLoadingError: null,
};
