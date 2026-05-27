import React from 'react';
import { FieldTypeIds } from '@m-next/types';
import '../../../src/app/app.css';
import Component from '../../../src/views/layout-designer/editors/grid-block-editor/ColumnSettings';
import { createGridColumn, ValidationRuleTypes } from '../../../src/views/layout-designer/control-classes';

export default {
  component: Component,
  title: 'app-builder/editors/GridBlockEditor',
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
    },
  },
};

function Template(args) {
  return (
    <div style={{ maxWidth: 384, maxHeight: 500, overflowY: 'scroll' }}>
      <Component {...args} />
    </div>
  );
}

export const TextColumn = Template.bind({});
TextColumn.args = {
  column: createGridColumn({
    field: 'FullName',
    header: 'Full name',
    visible: true,
    fieldType: FieldTypeIds.Text,

    validationRules: [
      { rule: ValidationRuleTypes.Required, value: true, canDelete: false },
      { rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false },
    ],
  }),
  onChange: () => {},
};

export const MoneyColumn = Template.bind({});
MoneyColumn.args = {
  column: createGridColumn({
    field: 'Balance',
    header: 'Balance',
    visible: true,
    fieldType: FieldTypeIds.Money,
  }),
  onChange: () => {},
};

export const YesNoColumn = Template.bind({});
YesNoColumn.args = {
  column: createGridColumn({
    field: 'IsActive',
    header: 'Is Active',
    visible: true,
    fieldType: FieldTypeIds.YesNo,
  }),
  onChange: () => {},
};

export const DateTimeColumn = Template.bind({});
DateTimeColumn.args = {
  column: createGridColumn({
    field: 'LastActivityCompletedDate',
    header: 'Last activity completed date',
    visible: true,
    fieldType: FieldTypeIds.DateTime,
  }),
  onChange: () => {},
};

export const IntegerColumn = Template.bind({});
IntegerColumn.args = {
  column: createGridColumn({
    field: 'RecordID',
    header: 'Record id',
    visible: true,
    fieldType: FieldTypeIds.Integer,
  }),
  onChange: () => {},
};

export const DropdownColumn = Template.bind({});
DropdownColumn.args = {
  column: createGridColumn({
    field: 'Entity',
    header: 'Entity',
    visible: true,
    fieldType: FieldTypeIds.DropDown,
  }),
  onChange: () => {},
};

export const DecimalColumn = Template.bind({});
DecimalColumn.args = {
  column: createGridColumn({
    field: 'CPEPerYear',
    header: 'CPEPerYear',
    visible: true,
    fieldType: FieldTypeIds.Decimal,
  }),
  onChange: () => {},
};
