import React from 'react';
import { Badge } from '../src';

export default {
  title: 'm-next/Components/Badge',
  component: Badge,
  parameters: { layout: 'padded' },
};

const fontFamily = "'Source Sans Pro', Helvetica, Arial, sans-serif";

const SCHEMES = ['neutral', 'blue', 'green', 'yellow', 'red'];
const VARIANTS = ['solid', 'subtle', 'outline'];

const Cell = ({ children, width = 120 }) => (
  <div style={{ width, display: 'flex', alignItems: 'center' }}>{children}</div>
);

const HeaderCell = ({ children, width = 120 }) => (
  <div
    style={{
      width,
      fontFamily: 'monospace',
      fontSize: 12,
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    }}
  >
    {children}
  </div>
);

export const AllVariants = () => (
  <div style={{ fontFamily }}>
    <div style={{ display: 'flex', gap: 16, paddingBottom: 8, borderBottom: '1px solid #e5e7eb' }}>
      <HeaderCell>scheme \ variant</HeaderCell>
      {VARIANTS.map((v) => (
        <HeaderCell key={v}>{v}</HeaderCell>
      ))}
    </div>
    {SCHEMES.map((scheme) => (
      <div
        key={scheme}
        style={{
          display: 'flex',
          gap: 16,
          padding: '12px 0',
          borderBottom: '1px solid #f3f4f6',
          alignItems: 'center',
        }}
      >
        <HeaderCell>{scheme}</HeaderCell>
        {VARIANTS.map((variant) => (
          <Cell key={variant}>
            <Badge variant={variant} colorScheme={scheme}>
              {scheme}
            </Badge>
          </Cell>
        ))}
      </div>
    ))}
  </div>
);

export const Sizes = () => (
  <div style={{ fontFamily }}>
    <div
      style={{
        display: 'flex',
        gap: 24,
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid #f3f4f6',
      }}
    >
      <HeaderCell width={80}>sm</HeaderCell>
      <Badge size="sm">neutral</Badge>
      <Badge size="sm" colorScheme="blue">
        blue
      </Badge>
      <Badge size="sm" variant="subtle" colorScheme="green">
        green subtle
      </Badge>
      <Badge size="sm" variant="outline" colorScheme="red">
        red outline
      </Badge>
    </div>
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', padding: '12px 0' }}>
      <HeaderCell width={80}>md</HeaderCell>
      <Badge size="md">neutral</Badge>
      <Badge size="md" colorScheme="blue">
        blue
      </Badge>
      <Badge size="md" variant="subtle" colorScheme="green">
        green subtle
      </Badge>
      <Badge size="md" variant="outline" colorScheme="red">
        red outline
      </Badge>
    </div>
  </div>
);

export const WithDot = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily }}>
    {SCHEMES.map((scheme) => (
      <div key={scheme} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <HeaderCell>{scheme}</HeaderCell>
        <Badge dot colorScheme={scheme}>
          {scheme === 'green'
            ? 'Online'
            : scheme === 'yellow'
              ? 'Away'
              : scheme === 'red'
                ? 'Offline'
                : scheme === 'blue'
                  ? 'Syncing'
                  : 'Unknown'}
        </Badge>
        <Badge dot variant="subtle" colorScheme={scheme}>
          subtle dot
        </Badge>
        <Badge dot variant="outline" colorScheme={scheme}>
          outline dot
        </Badge>
      </div>
    ))}
  </div>
);

const TableRow = ({ name, email, status, scheme }) => (
  <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
    <td style={{ padding: '10px 12px' }}>{name}</td>
    <td style={{ padding: '10px 12px', color: '#6b7280' }}>{email}</td>
    <td style={{ padding: '10px 12px' }}>
      <Badge variant="subtle" colorScheme={scheme} dot>
        {status}
      </Badge>
    </td>
  </tr>
);

export const InContext = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontFamily, maxWidth: 720 }}>
    {/* Notification count next to nav item */}
    <div>
      <HeaderCell width={200}>Nav with unread count</HeaderCell>
      <div
        style={{
          marginTop: 8,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          background: '#f9fafb',
          borderRadius: 6,
          color: '#111827',
          fontWeight: 600,
        }}
      >
        <span>Inbox</span>
        <Badge size="sm" colorScheme="blue">
          3
        </Badge>
      </div>
    </div>

    {/* Status badge in a table */}
    <div>
      <HeaderCell width={200}>Status in a table</HeaderCell>
      <table
        style={{
          marginTop: 8,
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 14,
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        <thead style={{ background: '#f9fafb' }}>
          <tr>
            <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 600, color: '#374151' }}>Name</th>
            <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 600, color: '#374151' }}>Email</th>
            <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 600, color: '#374151' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          <TableRow name="Alex Chen" email="alex@example.com" status="Active" scheme="green" />
          <TableRow name="Sam Patel" email="sam@example.com" status="Pending" scheme="yellow" />
          <TableRow name="Jordan Lee" email="jordan@example.com" status="Suspended" scheme="red" />
          <TableRow name="Riley Park" email="riley@example.com" status="Invited" scheme="blue" />
        </tbody>
      </table>
    </div>

    {/* Tags in a card header */}
    <div>
      <HeaderCell width={200}>Tags in a card header</HeaderCell>
      <div
        style={{
          marginTop: 8,
          padding: 16,
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          maxWidth: 420,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ fontWeight: 600, color: '#111827' }}>Q3 Marketing Plan</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <Badge size="sm" variant="subtle" colorScheme="blue">
              Draft
            </Badge>
            <Badge size="sm" variant="outline" colorScheme="neutral">
              Internal
            </Badge>
          </div>
        </div>
        <div style={{ marginTop: 8, color: '#6b7280', fontSize: 14 }}>
          Strategy, channel mix, and budget allocation for Q3.
        </div>
      </div>
    </div>
  </div>
);
