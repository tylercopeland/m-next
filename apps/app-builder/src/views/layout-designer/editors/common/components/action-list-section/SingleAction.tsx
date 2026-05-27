 
import React, { Suspense } from 'react';
import { openActionEditor } from '@m-next/action-editor';
import Grid from '@m-next/grid';
import LoadingSkeleton from '@m-next/loading-skeleton';
import Text from '@m-next/typeography';
import Button from '@m-next/button';
import styled from '@emotion/styled';
import { colors } from '@m-next/styles';
import { FieldTypeIds } from '@m-next/runtime-interface';

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

interface ActionValue {
  value?: string;
  label?: string;
  [key: string]: unknown;
}

interface ActionOption {
  value?: string;
  label?: string;
  source?: string;
}

interface Control {
  id?: string;
  [key: string]: unknown;
}

export interface SingleActionProps {
  value?: ActionValue | null;
  control?: Control;
  emptyMessage?: string;
  addLabel?: string;
  onAddAction?: (source: string, value: string) => void;
  action?: ActionOption;
}

const SingleAction: React.FC<SingleActionProps> = ({
  value,
  control,
  emptyMessage = 'No event applied',
  addLabel = 'Add',
  onAddAction,
  action,
}) => {
  const handleAddAction = (): void => {
    onAddAction?.(action?.source || '', action?.value || '');
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditAction = (_columnName: string, _val: string, _column: any, _rowIdx: number, primaryKey: string): void => {
    console.log(primaryKey);
    openActionEditor({ options: control }, primaryKey);
  };

  return (
    value ? (
      <Suspense fallback={<LoadingSkeleton count={1} height={100} />}>
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
          columns={[
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
          ]}
          data={[value]}
          compact
          pageSize={10}
          totalRecords={value ? 1 : 0}
          pageNumber={1}
          isPageData
          canDelete={false}
          onRowClick={handleEditAction}
        />
      </Suspense>
    ) : (
      <EmptyContent>
        <Text>{emptyMessage}</Text>
        <Button
          id='action-list-section-add'
          value={addLabel}
          buttonStyle='link'
          icon={{
            name: 'plus-V4',
            size: 10,
            position: 'left',
          }}
          isV4Design
          onClick={handleAddAction}
        />
      </EmptyContent>
    )
  );
};

export default SingleAction;
