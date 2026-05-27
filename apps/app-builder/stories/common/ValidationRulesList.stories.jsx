import React from 'react';
import '../../src/app/app.css';
import Component from '../../src/views/layout-designer/editors/common/components/validation-rules-list/ValidationRulesList';
import { ValidationRuleTypes } from '@m-next/runtime-interface';

export default {
  component: Component,
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
      <Component {...args} />
    </div>
  );
}

export const ValidationRulesList = Template.bind({});
ValidationRulesList.args = {
  id: 'test',
  onChange: () => {},
  standardOptions: [
    ValidationRuleTypes.Required,
    ValidationRuleTypes.MaliciousValues,
    ValidationRuleTypes.MaxLength,
    ValidationRuleTypes.MinLength,
  ],

  values: [
    {
      rule: 0,
      value: true,
      canDelete: false,
    },
    {
      rule: 6,
      value: true,
      canDelete: false,
    },
    {
      id: 3,
      value: 5,
    },
  ],
};
