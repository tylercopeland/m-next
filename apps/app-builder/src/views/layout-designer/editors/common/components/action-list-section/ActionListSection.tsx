 
import React, { Suspense } from 'react';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { openActionEditor } from '@m-next/action-editor';
import Grid from '@m-next/grid';
import Button from '@m-next/button';
import { Text } from '@m-next/typeography';
import styled from '@emotion/styled';
import { colors } from '@m-next/styles';
import { BaseControl, FieldTypeIds } from '@m-next/runtime-interface';
import AddableAccordion from '../../../../../../components/accordion/AddableAccordion';

interface ActionValue {
  actionId?: string;
  value?: string;
  label?: string;
}

interface ActionOption {
  value?: string;
  label?: string;
  source?: string;
}

export interface ActionListSectionProps {
  caption?: string;
  emptyMessage?: string;
  addLabel?: string;
  canAdd?: boolean;
  values?: ActionValue[];
  actions?: ActionOption[];
  control?: BaseControl;
  onAddAction?: (source: string, value: string) => void;
  isEmpty?: boolean;
  valueKey?: string;
  optionKey?: string;
  singleActionVariant?: boolean;
  isScreenEvent?: boolean;
}

export const EmptyContent = styled.div(() => ({
  padding: 16,
  width: '100%',
  textAlign: 'center' as const,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: 4,
  border: `1px solid ${colors['grey-lighter']}`,
  background: colors.white,
}));

const gridColumns = [
  {
    name: 'value',
    primary: true,
    caption: '',
    visible: false,
    editable: false,
    singleLine: true,
    fieldType: FieldTypeIds.Text,
    width: 'dynamic',
  },
  {
    name: 'label',
    caption: '',
    visible: true,
    editable: false,
    singleLine: true,
    fieldType: FieldTypeIds.Text,
    width: 'dynamic',
  },
];

interface ActionGridProps {
  values: ActionValue[];
  onRowClick: (columnName: string, val: string, column: unknown, rowIdx: number, primaryKey: string) => void;
}

const ActionGrid: React.FC<ActionGridProps> = ({ values, onRowClick }) => (
  <Grid
    id='action-grid'
    hideCaption={false}
    searchable={false}
    showPagination={false}
    showGoToPage={false}
    showPageSize={false}
    showReload={false}
    showHeader={false}
    addRowsEnabled={false}
    editable={false}
    columns={gridColumns}
    data={values}
    compact
    pageSize={10}
    totalRecords={values.length}
    pageNumber={1}
    isPageData
    canDelete={false}
    onRowClick={onRowClick}
  />
);

const ActionListSection: React.FC<ActionListSectionProps> = ({
  caption,
  emptyMessage,
  canAdd,
  values = [],
  actions,
  addLabel = 'Add',
  control,
  onAddAction,
  isEmpty = values.length === 0,
  valueKey = 'actionId',
  optionKey = 'id',
  singleActionVariant = false,
  isScreenEvent = false,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditAction = (_columnName: string, _val: string, _column: any, _rowIdx: number, primaryKey: string): void => {
    openActionEditor(isScreenEvent ? 'Screen' : { options: control }, primaryKey);
  };

  const handleAddAction = (option: ActionOption): void => {
    onAddAction?.(option.source || '', option.value || '');
  };

  return singleActionVariant ? (
    values.length === 0 ? (
      <EmptyContent>
        <Text>{emptyMessage}</Text>
        <Button
          id="action-grid-add"
          value={addLabel}
          buttonStyle='link'
          icon={{
            name: 'plus-V4',
            size: 10,
            position: 'left',
          }}
          isV4Design
          onClick={actions && actions[0] ? () => handleAddAction(actions[0]!) : undefined}
        />
      </EmptyContent>
    ) : (
      <Suspense fallback={<LoadingSkeleton count={1} height={100} />}>
        <ActionGrid values={values} onRowClick={handleEditAction} />
      </Suspense>
    )
  ) : (
    <AddableAccordion
      id='action-list-section'
      caption={caption}
      emptyMessage={emptyMessage}
      canAdd={canAdd}
      onAdd={handleAddAction}
      options={actions}
      optionCaption='label'
      values={values}
      valueKey={valueKey}
      optionKey={optionKey}
      isEmpty={isEmpty}
      addLabel={addLabel}
      tooltip='Add event'
      tooltipId='editor-tooltip'
    >
      <Suspense fallback={<LoadingSkeleton count={1} height={100} />}>
        <ActionGrid values={values} onRowClick={handleEditAction} />
      </Suspense>
    </AddableAccordion>
  );
};

export default ActionListSection;
