import React, { useState } from 'react';
import { colors } from '@m-one/styles';

// Raw m-one rebuild of the invoice screen. No local helpers that mimic
// kit's affordances — every label, every section header, every column,
// every spacing decision is hand-rolled inline, the way a Method engineer
// without kit would write it. Compare to AppInvoice.jsx (kit) and the
// visual + structural delta is the point.
//
// What's deliberately absent:
//   - No FormField helper — each m-one component renders its own label
//     via its native `caption` / `label` prop, with that component's own
//     baked-in label styling. Caption styling differs across components.
//   - No SectionLabel helper — section headers are written inline with
//     whatever font weight / size / color the author picked at that spot.
//   - No Stack / Box / Inline — flat <div>s with hand-picked padding/margin.
//   - No spacing scale — pixel values scattered (12, 14, 16, 18, 20, 24).
//   - No generic Card — the totals box is a plain bordered <div>.
//   - No SplitButton primitive — composed inline from @m-one/button-group.
//   - Dropdown values are full option objects (not primitives); every
//     handler does `.value` extraction inline.

import MOneButton from '@m-one/button';
import SvgIcon from '@m-one/svg-icon';
import MOneInput from '@m-one/input';
import MOneInputArea from '@m-one/input-area';
import MOneDropdown from '@m-one/dropdown';
import { DatePicker as MOneDatePicker } from '@m-one/datepicker';
import { Checkbox as MOneCheckbox } from '@m-one/checkbox';
import MOnePill from '@m-one/pill';
import { Attachments as MOneAttachments } from '@m-one/attachments';
import MOneButtonGroup from '@m-one/button-group';

const customerOptions = [
  { value: 'dwight', label: 'Dwight Schrute' },
  { value: 'michael', label: 'Michael Scott' },
  { value: 'jim', label: 'Jim Halpert' },
  { value: 'pam', label: 'Pam Beesly' },
];
const assigneeOptions = [
  { value: 'shaza', label: 'Shaza Mezian' },
  { value: 'tyler', label: 'Tyler Copeland' },
  { value: 'unassigned', label: 'Unassigned' },
];
const termsOptions = [
  { value: 'net-15', label: 'Net 15' },
  { value: 'net-30', label: 'Net 30' },
  { value: 'net-60', label: 'Net 60' },
  { value: 'due-on-receipt', label: 'Due on receipt' },
];
const tagOptions = [
  { value: 'hot-lead', label: 'Hot Lead' },
  { value: 'priority', label: 'Priority' },
  { value: 'follow-up', label: 'Needs follow-up' },
];
const locationOptions = [
  { value: 'toronto', label: 'Toronto, ON' },
  { value: 'nyc', label: 'New York, NY' },
];
const amountModeOptions = [
  { value: 'excl', label: 'Exclusive of Tax' },
  { value: 'incl', label: 'Inclusive of Tax' },
];

let idCounter = 0;
const nextId = () => `inv-m1-${++idCounter}`;
const noop = () => {};

const AppInvoiceMOne = () => {
  const [customer, setCustomer] = useState(customerOptions[0]);
  const [invoiceNum, setInvoiceNum] = useState('');
  const [assignee, setAssignee] = useState(assigneeOptions[0]);
  const [date, setDate] = useState(new Date(2026, 3, 20));
  const [due, setDue] = useState(new Date(2026, 4, 20));
  const [terms, setTerms] = useState(termsOptions[1]);
  const [tag, setTag] = useState(null);
  const [location, setLocation] = useState(null);
  const [opportunity] = useState(null);
  const [proposal] = useState(null);
  const [waitForSync, setWaitForSync] = useState(false);
  const [amountMode, setAmountMode] = useState(amountModeOptions[0]);
  const [discount, setDiscount] = useState('0');
  const [shipping, setShipping] = useState('0');
  const [memo, setMemo] = useState('');
  const [customerMessage, setCustomerMessage] = useState('');
  const [files, setFiles] = useState([]);

  const handleAttachmentUpload = (accepted) => {
    if (!accepted || !accepted.length) return;
    setFiles([
      ...files,
      ...accepted.map((file, i) => ({
        id: `att-${Date.now()}-${i}`,
        filename: file.name.includes('.') ? file.name.slice(0, file.name.lastIndexOf('.')) : file.name,
        fileExtension: file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.') + 1) : '',
        size: file.size,
        url: '',
      })),
    ]);
  };
  const handleAttachmentDelete = (id) => setFiles(files.filter((f) => f.id !== id));

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh', maxWidth: 960, margin: '0 auto', fontFamily: 'Source Sans Pro, system-ui, sans-serif' }}>

      {/* Callout — what this screen demonstrates */}
      <div style={{ background: '#FFF5F5', border: '1px solid #F5C0C0', padding: 12, marginBottom: 20, fontSize: 12, color: '#5A1F1F', lineHeight: 1.5 }}>
        <strong>Raw m-one rebuild — no kit, no shared helpers.</strong>{' '}
        Every label uses the m-one component's native <code>caption</code> / <code>label</code> prop (note how each
        component styles its own label slightly differently). Layout is flat <code>&lt;div&gt;</code>s with
        hand-picked spacing — no <code>Stack</code> / <code>Box</code> / <code>Inline</code>. The totals
        box is a plain bordered <code>div</code> because <code>@m-one/card</code> is a CRM record-card,
        not a generic surface. The "Not ready to sync" pill has no leading dot because m-one's Pill
        has no <code>dot</code> prop. Every Dropdown value is the full option object (not a primitive).
      </div>

      {/* ======================== TOP BAR ======================== */}
      <div style={{ marginBottom: 6, fontSize: 13, color: colors.blue, cursor: 'pointer' }}>
        <SvgIcon id={nextId()} name="chevron-left" color={colors.blue} size={12} /> Back
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#222', margin: '0 0 6px 0' }}>Invoice</h1>
          <div style={{ display: 'inline-block', marginBottom: 8 }}>
            <MOnePill size="regular" variant="subtle" colorScheme="yellow">Not ready to sync</MOnePill>
          </div>
          <div style={{ fontSize: 13, color: '#666' }}>
            <span style={{ color: colors.blue, fontWeight: 500 }}>Dwight Schrute</span>
            {' · '}
            <span style={{ color: colors.blue, fontWeight: 500 }}>Reorder Enabled</span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: '#D81F47', lineHeight: 1 }}>$0.00</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Balance Due</div>
          <div style={{ marginTop: 8 }}>
            <MOneButton id={nextId()} value="Save" buttonStyle="link" onClick={noop} />
          </div>
        </div>
      </div>

      {/* ======================== FORM (single column, hand-rolled) ======================== */}
      <div style={{ marginBottom: 18 }}>
        <MOneDropdown
          id={nextId()}
          caption="Customer"
          required
          options={customerOptions}
          value={customer}
          onChange={(opt) => setCustomer(opt)}
          isV4Design
          hasValidation={false}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <MOneInput
          id={nextId()}
          label="Invoice #"
          value={invoiceNum}
          onChange={(e) => setInvoiceNum(e.target.value)}
          placeholder="Leave blank to auto-calculate"
        />
      </div>

      <div style={{ marginBottom: 14 }}>
        <MOneDropdown
          id={nextId()}
          caption="Assigned To"
          options={assigneeOptions}
          value={assignee}
          onChange={(opt) => setAssignee(opt)}
          isV4Design
          hasValidation={false}
        />
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <MOneDatePicker
            id={nextId()}
            caption="Date **"
            value={date}
            onChange={(_e, d) => setDate(d)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <MOneDatePicker
            id={nextId()}
            caption="Due"
            value={due}
            onChange={(_e, d) => setDue(d)}
            min={date}
          />
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <MOneDropdown
          id={nextId()}
          caption="Terms"
          options={termsOptions}
          value={terms}
          onChange={(opt) => setTerms(opt)}
          isV4Design
          hasValidation={false}
        />
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
        <div style={{ flex: 1 }}>
          <MOneDropdown
            id={nextId()}
            caption="Location"
            options={locationOptions}
            value={location}
            onChange={(opt) => setLocation(opt)}
            isV4Design
            hasValidation={false}
          />
        </div>
        <div style={{ flex: 1 }}>
          <MOneDropdown
            id={nextId()}
            caption="Tags"
            options={tagOptions}
            value={tag}
            onChange={(opt) => setTag(opt)}
            placeholder="Begin typing a tag name"
            isV4Design
            hasValidation={false}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 22 }}>
        <div style={{ flex: 1 }}>
          <MOneDropdown
            id={nextId()}
            caption="Opportunity"
            options={[]}
            value={opportunity}
            onChange={noop}
            isV4Design
            hasValidation={false}
          />
        </div>
        <div style={{ flex: 1 }}>
          <MOneDropdown
            id={nextId()}
            caption="Proposal"
            options={[]}
            value={proposal}
            onChange={noop}
            isV4Design
            hasValidation={false}
          />
        </div>
      </div>

      {/* Address sections — hand-rolled label markup, inconsistent with the
          field captions above (which come from m-one components). */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>Billing Address</span>
            <a style={{ fontSize: 13, color: colors.blue, cursor: 'pointer' }}>Edit</a>
          </div>
          <div style={{ fontSize: 13, color: '#444', lineHeight: 1.5 }}>
            Dwight Schrute<br />
            Dunder Mifflin
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>Shipping Address</span>
            <a style={{ fontSize: 13, color: colors.blue, cursor: 'pointer' }}>Edit</a>
          </div>
          <div style={{ fontSize: 13, color: '#444', lineHeight: 1.5 }}>
            Dwight Schrute<br />
            Dunder Mifflin<br />
            410 adelaide st. w<br />
            Toronto, Ontario
          </div>
        </div>
      </div>

      {/* Wait-for-sync — Checkbox renders its own label with its own typography,
          differs from the captions above and the section headers. */}
      <div style={{ marginBottom: 26 }}>
        <MOneCheckbox
          id={nextId()}
          label="Wait for sync approval?"
          checked={waitForSync}
          onChange={setWaitForSync}
        />
      </div>

      {/* ======================== AMOUNT MODE ======================== */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 240 }}>
          <MOneDropdown
            id={nextId()}
            caption="Amounts are:"
            options={amountModeOptions}
            value={amountMode}
            onChange={(opt) => setAmountMode(opt)}
            isV4Design
            hasValidation={false}
          />
        </div>
        <div style={{ padding: 8, cursor: 'pointer' }}>
          <SvgIcon id={nextId()} name="more-vertical" size={16} color="#666" />
        </div>
      </div>

      {/* ======================== LINE ITEMS TABLE ======================== */}
      <div style={{ border: '1px solid #E0E0E0', marginBottom: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1.5fr 80px 100px 100px 80px 40px', background: '#FAFAFA', borderBottom: '1px solid #E0E0E0', fontSize: 12, fontWeight: 600, color: '#666' }}>
          {['Date', 'Item', 'Desc', 'QTY', 'Rate', 'Amount', 'Tax', ''].map((h, i) => (
            <div key={i} style={{ padding: 12, textAlign: i >= 3 && i <= 6 ? 'right' : 'left' }}>{h}</div>
          ))}
        </div>
        {[0, 1, 2].map((row) => (
          <div key={row} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1.5fr 80px 100px 100px 80px 40px', borderBottom: row < 2 ? '1px solid #F0F0F0' : 'none', minHeight: 40 }}>
            {[0, 1, 2, 3, 4, 5, 6].map((c) => <div key={c} style={{ padding: 8 }} />)}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <SvgIcon id={nextId()} name="trash" size={14} color="#999" />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <MOneButton
          id={nextId()}
          value="Add lines"
          buttonStyle="ghost"
          icon={{ position: 'left', name: 'add-circle', size: 14, color: colors.blue }}
          onClick={noop}
        />
        <span style={{ fontSize: 13, color: '#666' }}>0 results</span>
      </div>

      {/* ======================== TOTALS ======================== */}
      {/* Plain bordered <div> — m-one's @m-one/card is a CRM record-card,
          not a generic content surface. Every consumer building a totals box
          reaches for raw HTML. The visual treatment here is whatever the
          author picked: 1px border, no background tint, default radius. */}
      <div style={{ border: '1px solid #E0E0E0', padding: 14, marginBottom: 18, maxWidth: 380, marginLeft: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Subtotal</span>
          <span style={{ fontSize: 13 }}>$0.00</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13 }}>Taxes</span>
          <span style={{ fontSize: 13 }}>$0.00</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Discount (%)</span>
          <div style={{ width: 90 }}>
            <MOneInput
              id={nextId()}
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              type="number"
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Shipping</span>
          <div style={{ width: 90 }}>
            <MOneInput
              id={nextId()}
              value={shipping}
              onChange={(e) => setShipping(e.target.value)}
              type="number"
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Total</span>
          <span style={{ fontSize: 13 }}>$0.00</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 13 }}>Payments / Credits</span>
          <span style={{ fontSize: 13 }}>$0.00</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid #E0E0E0', paddingTop: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>Balance Due</span>
          <span style={{ fontSize: 20, fontWeight: 700 }}>$0.00</span>
        </div>
      </div>

      {/* ======================== MEMO + CUSTOMER MESSAGE + ATTACHMENTS ======================== */}
      <div style={{ marginBottom: 14 }}>
        <MOneInputArea
          id={nextId()}
          caption="Memo (Internal)"
          value={memo}
          onChange={setMemo}
          rows={3}
        />
      </div>
      <div style={{ marginBottom: 18 }}>
        <MOneInputArea
          id={nextId()}
          caption="Customer Message"
          value={customerMessage}
          onChange={setCustomerMessage}
          rows={3}
        />
      </div>
      <div style={{ marginBottom: 24 }}>
        <MOneAttachments
          id={nextId()}
          data={files}
          caption="Attachments"
          onAttachmentUpload={handleAttachmentUpload}
          onAttachmentDelete={handleAttachmentDelete}
          onAttachmentClick={noop}
          onToggleEmailAttachment={noop}
          onUploadEnd={noop}
          allowedFileTypes={['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx']}
        />
      </div>

      {/* ======================== FOOTER ACTIONS ======================== */}
      {/* SplitButton equivalents are built from @m-one/button-group with
          isDropdown=true. Index 0 is the primary action, the rest are menu
          items. There is no first-class SplitButton primitive in m-one. */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 14, borderTop: '1px solid #E0E0E0' }}>
        <MOneButtonGroup
          id={nextId()}
          isDropdown
          buttonStyle="ghost"
          onClick={noop}
          data={[
            { value: 'more', label: 'More Actions' },
            { value: 'duplicate', label: 'Duplicate' },
            { value: 'print', label: 'Print' },
            { value: 'delete', label: 'Delete' },
          ]}
        />
        <MOneButton
          id={nextId()}
          value="Receive payment"
          buttonStyle="ghost"
          onClick={noop}
        />
        <MOneButtonGroup
          id={nextId()}
          isDropdown
          buttonStyle="ghost"
          onClick={noop}
          data={[
            { value: 'send', label: 'Send' },
            { value: 'send-email', label: 'Send by email' },
            { value: 'send-copy', label: 'Send a copy' },
          ]}
        />
        <MOneButtonGroup
          id={nextId()}
          isDropdown
          buttonStyle="primary"
          onClick={noop}
          data={[
            { value: 'save', label: 'Save' },
            { value: 'save-new', label: 'Save and new' },
            { value: 'save-close', label: 'Save and close' },
          ]}
        />
      </div>
    </div>
  );
};

export default AppInvoiceMOne;
