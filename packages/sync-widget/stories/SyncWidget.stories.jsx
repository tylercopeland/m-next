import React, { useState } from 'react';
import SyncWidget, { SyncWidgetStatus } from '../src';

export default {
  component: SyncWidget,
  title: 'm-one/SyncWidget',
  args: {
    status: 0,
  },
  argTypes: {
    status: {
      control: 'select',
      options: [0, 1, 2, 3],
      labels: {
        0: '0 - Synced',
        1: '1 - Pending sync approval',
        2: '2 - Sync conflict',
        3: '3 - Not ready to sync',
      },
      description: 'The sync status of the record: 0 = Synced, 1 = Pending sync approval, 2 = Sync conflict, 3 = Not ready to sync',
    },
    message: {
      control: 'text',
      description: 'Optional message to display when the chevron is clicked. Supports long messages with truncation.',
    },
    fnSyncWidgetInteractionAnalytics: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    cssresources: [
      {
        id: `Method Styles`,
        code: `<link rel="stylesheet" type="text/css" href="https://alocetsystem.method.me/apps/public/styles/styles.min.css"></link>`,
        picked: true,
      },
    ],
  },
};

// Synced (Status 0)
export function Synced(args) {
  return <SyncWidget {...args} />;
}
Synced.args = {
  status: 0,
  message: 'This record has been successfully synced with your accounting software.',
};

// Without message
export function SyncedWithoutMessage(args) {
  return <SyncWidget {...args} />;
}
SyncedWithoutMessage.args = {
  status: 0,
};

// Pending Sync Approval (Status 1)
export function PendingSyncApproval(args) {
  return <SyncWidget {...args} />;
}
PendingSyncApproval.args = {
  status: 1,
  message: 'This record is pending approval before it can be synced to your accounting software.',
};

// Sync Conflict (Status 2)
export function SyncConflict(args) {
  return <SyncWidget {...args} />;
}
SyncConflict.args = {
  status: 2,
  message: 'There was an error syncing this record. The customer name already exists in QuickBooks.',
};

// Not Ready to Sync (Status 3)
export function NotReadyToSync(args) {
  return <SyncWidget {...args} />;
}
NotReadyToSync.args = {
  status: 3,
  message: 'This record is not yet ready to be synced to your accounting software.',
};

// With long message - Synced
export function LongMessageSynced(args) {
  return <SyncWidget {...args} />;
}
LongMessageSynced.args = {
  status: 0,
  message: 'This invoice has been successfully synced to QuickBooks Desktop on January 15, 2024 at 3:45 PM EST. The invoice number QB-12345 was assigned automatically by QuickBooks. All line items, taxes, and payment terms were transferred correctly.',
};

// Interactive toggle demo
export function InteractiveToggle() {
  const [currentStatus, setCurrentStatus] = useState(0);
  const statuses = [0, 1, 2, 3];
  const messages = [
    'Synced successfully to QuickBooks!',
    'Waiting for manager approval before sync',
    'Error: Duplicate customer found in QuickBooks',
    'Missing required field: Customer Name',
  ];

  const handleNext = () => {
    setCurrentStatus((prev) => (prev + 1) % 4);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SyncWidget status={statuses[currentStatus]} message={messages[currentStatus]} />
      <button onClick={handleNext} style={{ padding: '8px 16px', width: 'fit-content' }}>
        Change Status
      </button>
      <p>Current Status: {SyncWidgetStatus[statuses[currentStatus]].text}</p>
    </div>
  );
}

// In a table context (common use case)
export function InTableContext() {
  const records = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 0, message: 'Synced on 2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 1, message: 'Pending approval from manager' },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      status: 2,
      message: 'Duplicate email found in QuickBooks',
    },
    { id: 4, name: 'Alice Brown', email: '', status: 3, message: 'Email address is required' },
  ];

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
          <th style={{ padding: '12px' }}>Name</th>
          <th style={{ padding: '12px' }}>Email</th>
          <th style={{ padding: '12px' }}>Sync Status</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record) => (
          <tr key={record.id} style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '12px' }}>{record.name}</td>
            <td style={{ padding: '12px' }}>{record.email || '—'}</td>
            <td style={{ padding: '12px' }}>
              <SyncWidget status={record.status} message={record.message} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
