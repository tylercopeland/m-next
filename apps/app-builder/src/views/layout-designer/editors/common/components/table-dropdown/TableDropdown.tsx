import React, { useMemo, useState } from 'react';
import Dropdown, { DropdownOption } from '@m-next/dropdown';
import LoadingSkeleton from '@m-next/loading-skeleton';
import Dialog from '@m-next/dialog';
import Container from '@m-next/container';
import { TextLine } from '@m-next/typeography';

interface TableItem {
  name: string;
  caption?: string;
  displayName?: string;
}

interface TableDropdownProps {
  tableList?: TableItem[] | null;
  selectedTableName?: string | null;
  onChange: (tableName: string) => void;
  loading?: boolean;
  placeholder?: string;
  validationMessage?: string;
  width?: string;
  includeEmailsSent?: boolean;
  warningLabel?: string;
  warningSubLabel?: string;
  showWarning?: boolean;
  disabled?: boolean;
}

const defaultProps: Partial<TableDropdownProps> = {
  tableList: null,
  selectedTableName: null,
  loading: false,
  placeholder: 'Search table',
  validationMessage: '',
  width: '184px',
  includeEmailsSent: false,
  warningLabel: '',
  warningSubLabel: '',
  showWarning: true,
  disabled: false,
};

function TableDropdown({
  tableList = defaultProps.tableList,
  selectedTableName = defaultProps.selectedTableName,
  onChange,
  loading = defaultProps.loading,
  placeholder = defaultProps.placeholder,
  validationMessage = defaultProps.validationMessage,
  width = defaultProps.width,
  includeEmailsSent = defaultProps.includeEmailsSent,
  warningLabel = defaultProps.warningLabel,
  warningSubLabel = defaultProps.warningSubLabel,
  showWarning = defaultProps.showWarning,
  disabled = defaultProps.disabled,
}: TableDropdownProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [newTable, setNewTable] = useState<DropdownOption | null>(null);

  const formattedTableList = useMemo((): DropdownOption[] | [] => {
    if (!tableList) return [];

    const cleaned: DropdownOption[] = [];
    tableList.forEach((item) => {
      const label = item.caption || item.name;
      cleaned.push({ value: item.name, label });
    });

    if (includeEmailsSent) {
      cleaned.push({ value: 'EmailsSent', label: 'Emails sent' });
    }

    return cleaned.sort((a, b) => a.label.localeCompare(b.label));
  }, [tableList, includeEmailsSent]);

  const selectedTable = (): DropdownOption | null => {
    if (!selectedTableName) return null;

    const column: DropdownOption = {
      value: selectedTableName,
      label: selectedTableName,
    };

    if (tableList) {
      const searchList = [...tableList];

      if (includeEmailsSent) {
        searchList.push({ name: 'EmailsSent', caption: 'Emails sent', displayName: 'Emails sent' });
      }

      const match = searchList.find((x) => x.name === column.value);
      if (match) {
        column.label = match.caption || match.name;
      }
    }

    return column;
  };

  const handleTableChange = (table?: DropdownOption) => {
    setDialogOpen(false);
    if (table && table.value !== selectedTableName) {
      onChange(table.value as string);
    }
    if (newTable && newTable.value !== selectedTableName) {
      onChange(newTable.value as string);
    }
  };

  const handleCancelTableChange = () => {
    setDialogOpen(false);
  };

  if (loading || !tableList || tableList.length === 0) {
    return <LoadingSkeleton count={1} width={width} height='36px' />;
  }

  return (
    <>
      <Dropdown
        id='table'
        options={formattedTableList}
        value={selectedTable()}
        onChange={(table: DropdownOption) => {
          if (table.value === selectedTableName) {
            return;
          }

          if (showWarning) {
            setDialogOpen(true);
            setNewTable(table);
          } else {
            setNewTable(table);
            handleTableChange(table);
          }
        }}
        width={width}
        placeholder={placeholder}
        validationMessage={validationMessage}
        isV4Design
        disabled={disabled}
      />
      <Dialog
        title='Change table - Reset properties'
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onDismiss={handleCancelTableChange}
        footer={{
          primaryButtonLabel: 'Change table',
          onPrimaryButtonClick: handleTableChange,
          secondaryButtonLabel: 'Cancel',
          onSecondaryButtonClick: handleCancelTableChange,
        }}
      >
        <Container style={{ gap: 16, padding: 0 }}>
          <TextLine>{warningLabel}</TextLine>
          <TextLine>{warningSubLabel}</TextLine>
        </Container>
      </Dialog>
    </>
  );
}

export default TableDropdown;
