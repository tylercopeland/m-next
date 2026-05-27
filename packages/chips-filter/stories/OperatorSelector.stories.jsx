import React from 'react';
import { FieldTypeNames, basicOperationId } from '@m-next/types';
import { Text } from '@m-next/typeography';
import OperationSelector from '../src/components/OperationSelector';

export default {
  component: OperationSelector,
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

export function OperationSelectorVariants() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
        <Text bold style={{ width: 100 }}>
          Text
        </Text>
        <OperationSelector id='list' value={basicOperationId.Is} fieldType={FieldTypeNames.Text} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
        <Text bold style={{ width: 100 }}>
          Yes/No
        </Text>
        <OperationSelector id='list' value={basicOperationId.Is} fieldType={FieldTypeNames.YesNo} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
        <Text bold style={{ width: 100 }}>
          Number
        </Text>
        <OperationSelector id='list' value={basicOperationId.Is} fieldType={FieldTypeNames.Money} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
        <Text bold style={{ width: 100 }}>
          DateTime
        </Text>
        <OperationSelector id='list' value={basicOperationId.Is} fieldType={FieldTypeNames.DateTime} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
        <Text bold style={{ width: 100 }}>
          Dropdown
        </Text>
        <OperationSelector id='list' value={basicOperationId.Is} fieldType={FieldTypeNames.DropDown} />
      </div>
    </div>
  );
}
