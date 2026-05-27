import React from 'react';
import { Text } from '@m-next/typeography';
import { FieldTypeIds, basicOperationId } from '@m-next/types';
import Chip from '../src/components/Chip';
import fieldList from '../testing/data/fieldListContacts.json';

export default {
  component: Chip,
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

export function ChipVariants() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
      <div>
        <Text bold style={{ width: 80, display: 'inline-block' }}>
          Chip
        </Text>
        <Chip
          id='chip'
          first={{
            value: 'FullName',
          }}
          operation={basicOperationId.Is}
          second={{
            type: FieldTypeIds.Text,
            value: 'Bruce Wayne',
          }}
          onDelete={() => {}}
          onClick={() => {}}
          fieldList={fieldList}
        />
      </div>
      <div>
        <Text bold style={{ width: 80, display: 'inline-block' }}>
          Chip mobile
        </Text>
        <Chip
          id='chip'
          first={{
            value: 'FullName',
          }}
          operation={basicOperationId.Is}
          second={{
            type: FieldTypeIds.Text,
            value: 'Bruce Wayne',
          }}
          isMobile
          onDelete={() => {}}
          onClick={() => {}}
          fieldList={fieldList}
        />
      </div>
      <div>
        <Text bold style={{ width: 80, display: 'inline-block' }}>
          Chip active
        </Text>
        <Chip
          id='chip'
          first={{
            value: 'FullName',
          }}
          operation={basicOperationId.Is}
          second={{
            type: FieldTypeIds.Text,
            value: 'Bruce Wayne',
          }}
          isActive
          onDelete={() => {}}
          onClick={() => {}}
          fieldList={fieldList}
        />
      </div>
      <div>
        <Text bold style={{ width: 80, display: 'inline-block' }}>
          Chip open
        </Text>
        <Chip
          id='chip'
          first={{
            value: 'FullName',
          }}
          operation={basicOperationId.Is}
          second={{
            type: FieldTypeIds.Text,
            value: 'Bruce Wayne',
          }}
          isActive
          isOpen
          onDelete={() => {}}
          onClick={() => {}}
          fieldList={fieldList}
        />
      </div>
      <div>
        <Text bold style={{ width: 80, display: 'inline-block' }}>
          Long chip
        </Text>
        <Chip
          id='chip'
          first={{
            value: 'AssignedToRecordID',
          }}
          operation={basicOperationId.DoesNotContain}
          second={{
            type: FieldTypeIds.Text,
            value: 'One two three four five',
          }}
          isActive
          onDelete={() => {}}
          onClick={() => {}}
          fieldList={fieldList}
        />
      </div>
    </div>
  );
}
