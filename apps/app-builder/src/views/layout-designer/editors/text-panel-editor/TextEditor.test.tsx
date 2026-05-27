/**
 * Unit tests for TextEditor
 *
 * Covers NCNG-582: when a Label control is mapped to a field, the stale
 * design-time value (e.g. "Label_2") must be cleared so that V4 runtime
 * shows nothing when there is no active record.
 *
 * Tests are focused on handleMappedFieldChange behaviour. The component is
 * rendered with a mocked MappedFieldSelector that exposes bind/unbind buttons
 * so we can trigger the handler directly without UI interaction on the real
 * MappedFieldSelector internals.
 */

import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { FieldTypeNames } from '@m-next/runtime-interface';
import TextEditor from './TextEditor';

// ---------------------------------------------------------------------------
// Minimal Redux store with the fields/controls TextEditor reads
// ---------------------------------------------------------------------------
const makeStore = (overrides = {}) =>
  configureStore({
    reducer: {
      screenLayout: (
        state = {
          baseModel: 'Contacts',
          isV4Screen: true,
          controls: {
            'lbl-1': { id: 'lbl-1', type: 'LBL', name: 'Label', isBound: false },
          },
          fields: [
            { name: 'CompanyName', type: FieldTypeNames.Text, caption: 'Company Name' },
            { name: 'Revenue', type: FieldTypeNames.Decimal, caption: 'Revenue' },
            { name: 'CreatedAt', type: FieldTypeNames.DateTime, caption: 'Created At' },
          ],
          ...overrides,
        },
      ) => state,
    },
  });

// ---------------------------------------------------------------------------
// Mocks — keep heavy deps out of Jest
// ---------------------------------------------------------------------------
jest.mock('../../../../common/rum/RumComponentContext', () => ({
  RumComponentContextProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='rum-provider'>{children}</div>
  ),
}));

jest.mock('../../../../components/accordion/Accordion', () =>
  function MockAccordion({ children }: { children: React.ReactNode }) {
    return <div data-testid='accordion'>{children}</div>;
  },
);

jest.mock('../common/components/action-list-section/ActionListSection', () =>
  function MockActionListSection() {
    return <div data-testid='action-list-section' />;
  },
);

jest.mock('../common/components/default-state-selector/DefaultStateSelector', () =>
  function MockDefaultStateSelector() {
    return <div data-testid='default-state-selector' />;
  },
);

jest.mock('../../../../components/addable-list/component-selectors/ColorSelector', () =>
  function MockColorSelector() {
    return <div data-testid='color-selector' />;
  },
);

jest.mock('../../../../components/complex-value/ComplexValue', () =>
  function MockComplexValue() {
    return <div data-testid='complex-value' />;
  },
);

jest.mock('../common/BlockEditor.styles', () => ({
  Wrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SettingDivider: () => <hr />,
}));

jest.mock('react-tooltip', () => ({ Tooltip: () => null }));

jest.mock('@m-next/typeography', () => ({
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  TextLine: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

jest.mock('@m-next/toggle', () =>
  function MockToggle({ id, checked, onChange }: { id: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
      <input
        type='checkbox'
        data-testid={`toggle-${id}`}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    );
  },
);

jest.mock('@m-next/input-area', () =>
  function MockInputArea({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
    return (
      <input
        data-testid={`input-area-${id}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  },
);

jest.mock('@m-next/dropdown', () =>
  function MockDropdown({ id }: { id: string }) {
    return <div data-testid={`dropdown-${id}`} />;
  },
);

jest.mock('@m-next/button-group', () => ({
  ButtonGroupRow: ({ id }: { id: string }) => <div data-testid={`button-group-${id}`} />,
}));

jest.mock('@m-next/svg-icon', () => ({
  __esModule: true,
  default: () => <span data-testid='svg-icon' />,
  iconComponentMap: {},
}));

jest.mock('@m-next/styles', () => ({ colors: { grey: '#999' } }));

jest.mock('@m-next/utilities', () => ({
  Guid: { create: () => 'test-guid' },
  formatter: {
    formatFieldList: () => [],
  },
  toCamelCase: (obj: unknown) => obj,
}));

jest.mock('@m-next/runtime-interface', () => ({
  BaseControl: {},
  FieldTypeNames: {
    Text: 'Text',
    Integer: 'Integer',
    Decimal: 'Decimal',
    DateTime: 'DateTime',
    Date: 'Date',
    Money: 'Money',
    YesNo: 'YesNo',
    DropDown: 'DropDown',
    Email: 'Email',
    Phone: 'Phone',
    Address: 'Address',
    Time: 'Time',
  },
  FieldTypeIds: {
    Text: 1,
    Integer: 2,
    Decimal: 3,
    DateTime: 4,
    Date: 8,
    Money: 7,
    YesNo: 5,
    DropDown: 6,
    Email: 9,
    Phone: 10,
    Address: 11,
    Time: 12,
  },
  fieldTypeNameLookup: () => 'Text',
  fieldTypeIdLookup: (typeName: string) => {
    const map: Record<string, number> = {
      Text: 1, Integer: 2, Decimal: 3, DateTime: 4, YesNo: 5, DropDown: 6,
      Money: 7, Date: 8, Email: 9, Phone: 10, Address: 11, Time: 12,
    };
    return map[typeName] ?? 1;
  },
  WIDGETS: { LABEL: 'LBL' },
  ValidationRuleTypes: { MaliciousValues: 'maliciousValues' },
  createBaseControl: (data: Record<string, unknown>) => ({
    id: 'test-id',
    type: null,
    name: 'text',
    isBound: false,
    visible: true,
    disabled: false,
    hideCaption: true,
    caption: '',
    classes: '',
    widthType: 'auto',
    width: null,
    height: null,
    defaultValue: null,
    styles: null,
    onClick: null,
    onFocus: null,
    validationRules: null,
    validationError: null,
    isWorking: false,
    ...data,
  }),
}));

// Reproduces the real toV4FieldName ('CompanyName' → 'Company_name') so the tests
// exercise NCNG-160's V4 transformation rather than mocking it away. Without this,
// TextEditor's V4 lookup fix would silently regress.
const mockToV4FieldName = (fieldName: string): string => {
  const words = fieldName.match(/[A-Z]+(?=[A-Z][a-z])|[A-Z]?[a-z]+|[A-Z]+|\d+/g) || [fieldName];
  return words.map((w, i) => (i === 0 ? w : w.toLowerCase())).join('_');
};

jest.mock('@m-next/layout-canvas', () => ({
  calculateNameFromLabelChange: (_text: string, name: string) => name,
  toV4FieldName: (name: string) => mockToV4FieldName(name),
  Z_POPUP: { TOOLTIP: 9999 },
}));

jest.mock('../../utils/controlsToComponentsConverter', () => ({
  convertControlsToComponents: () => [],
}));

// ---------------------------------------------------------------------------
// MappedFieldSelector mock — exposes bind/unbind trigger buttons.
//
// On V4 (NCNG-160), the real MappedFieldSelector transforms the bound name via
// toV4FieldName before calling onChange (e.g. "CompanyName" → "Company_name").
// The mock mirrors that so handleMappedFieldChange's field-lookup is exercised
// against the same shape it sees in production.
// ---------------------------------------------------------------------------
jest.mock(
  '../common/components/mapped-field-selector/MappedFieldSelector',
  () =>
    function MockMappedFieldSelector({
      control,
      onChange,
    }: {
      control: Record<string, unknown>;
      onChange: (c: Record<string, unknown>) => void;
    }) {
      return (
        <div data-testid='mapped-field-selector'>
          {/* Bind to CompanyName (V4: name becomes "Company_name") */}
          <button
            type='button'
            data-testid='bind-to-CompanyName'
            onClick={() =>
              onChange({
                ...control,
                isBound: true,
                name: mockToV4FieldName('CompanyName'),
                value: control.value ?? 'Label_2', // stale design-time value
              })
            }
          >
            Bind to CompanyName
          </button>
          {/* Bind to Revenue (Decimal) */}
          <button
            type='button'
            data-testid='bind-to-Revenue'
            onClick={() =>
              onChange({
                ...control,
                isBound: true,
                name: mockToV4FieldName('Revenue'),
                value: control.value ?? 'StaleData',
              })
            }
          >
            Bind to Revenue
          </button>
          {/* Bind to CreatedAt (DateTime) */}
          <button
            type='button'
            data-testid='bind-to-CreatedAt'
            onClick={() =>
              onChange({
                ...control,
                isBound: true,
                name: mockToV4FieldName('CreatedAt'),
                value: control.value ?? 'StaleDate',
              })
            }
          >
            Bind to CreatedAt
          </button>
          {/* Unbind */}
          <button
            type='button'
            data-testid='unbind-field'
            onClick={() =>
              onChange({
                ...control,
                isBound: false,
                name: 'Label',
              })
            }
          >
            Unbind
          </button>
        </div>
      );
    },
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const defaultControl = {
  id: 'lbl-1',
  type: 'LBL',
  name: 'Label',
  caption: 'Label',
  value: 'Label',
  isBound: false,
  visible: true,
  disabled: false,
  isLocked: false,
  hideCaption: true,
  defaultValue: null,
  validationRules: [{ rule: 'maliciousValues', value: true, canDelete: false }],
  styles: { fontColor: 'grey-darker', textAlignment: 'left', fontWeight: 'regular', fontSize: 'Normal' },
  version: '1.0.0',
};

const renderEditor = (control = defaultControl, storeOverrides = {}) => {
  const store = makeStore(storeOverrides);
  const onChange = jest.fn();
  const onAddAction = jest.fn();

  render(
    <Provider store={store}>
      <TextEditor
        rawControl={control as unknown as React.ComponentProps<typeof TextEditor>['rawControl']}
        onChange={onChange}
        onAddAction={onAddAction}
      />
    </Provider>,
  );

  return { onChange, onAddAction };
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('TextEditor — NCNG-582: clear stale value when mapping Label to a field', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('clears value and content to undefined when mapping a Label with value="Label_2" to a text field', () => {
    const controlWithStaleValue = { ...defaultControl, value: 'Label_2', content: 'Label_2', name: 'Label_2' };
    const { onChange } = renderEditor(controlWithStaleValue);

    fireEvent.click(screen.getByTestId('bind-to-CompanyName'));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        isBound: true,
        // V4 (NCNG-160) — name arrives in underscore form
        name: 'Company_name',
        value: undefined,
        content: undefined,
      }),
    );
  });

  it('clears value to undefined when mapping a Label with value="StaleData" to a decimal field', () => {
    const controlWithStaleValue = { ...defaultControl, value: 'StaleData', name: 'Label' };
    const { onChange } = renderEditor(controlWithStaleValue);

    fireEvent.click(screen.getByTestId('bind-to-Revenue'));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        isBound: true,
        name: 'Revenue',
        value: undefined,
      }),
    );
  });

  it('clears defaultValue, value, and content to undefined when mapping', () => {
    const { onChange } = renderEditor();

    fireEvent.click(screen.getByTestId('bind-to-CompanyName'));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        isBound: true,
        defaultValue: undefined,
        value: undefined,
        content: undefined,
      }),
    );
  });

  it('sets baseModel to screen base table when mapping', () => {
    const { onChange } = renderEditor();

    fireEvent.click(screen.getByTestId('bind-to-CompanyName'));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        baseModel: 'Contacts',
      }),
    );
  });

  it('does NOT clear value when unmapping (isBound becomes false)', () => {
    const boundControl = {
      ...defaultControl,
      isBound: true,
      name: 'Company_name', // V4 underscore form (NCNG-160)
      value: 'Acme Corp', // active record value — should not be cleared on unbind
    };
    const { onChange } = renderEditor(boundControl);

    fireEvent.click(screen.getByTestId('unbind-field'));

    expect(onChange).toHaveBeenCalled();
    // On unbind, the control passed to onChange should NOT have value cleared to undefined;
    // handleMappedFieldChange only touches value on the isBound=true branch.
    const callArg = (onChange as jest.Mock).mock.calls[0][0];
    expect(callArg.isBound).toBe(false);
    // value is not explicitly set by the unbind branch — it comes through as-is from the
    // mock which passes control.value. The important thing: no value:undefined forced.
    expect(callArg).not.toEqual(expect.objectContaining({ value: undefined }));
  });

  it('sets fieldType correctly for a Text field when mapping', () => {
    const { onChange } = renderEditor();

    fireEvent.click(screen.getByTestId('bind-to-CompanyName'));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        isBound: true,
        // FieldTypeIds.Text = 1 per our mock
        fieldType: 1,
      }),
    );
  });

  it('sets formatType to "Short Date" when mapping to a DateTime field (V4 underscore name)', () => {
    // The default store seeds CreatedAt as DateTime; bind-to-CreatedAt sends the
    // V4-transformed name "Created_at". This is the regression that the V4 lookup
    // fix in handleMappedFieldChange protects against — without it, the field
    // lookup misses, mappedFieldType falls back to text, and formatType stays
    // undefined for mapped DateTime labels.
    const { onChange } = renderEditor();

    fireEvent.click(screen.getByTestId('bind-to-CreatedAt'));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        isBound: true,
        name: 'Created_at',
        value: undefined,
        formatType: 'Short Date',
      }),
    );
  });

  it('preserves Decimal fieldType when mapping to a Decimal field on V4 (regression — NCNG-160 lookup mismatch)', () => {
    // V4 underscore-form name must still resolve to the Revenue field so
    // fieldType is set to Decimal (3 in our mock), not the text fallback (1).
    const { onChange } = renderEditor();

    fireEvent.click(screen.getByTestId('bind-to-Revenue'));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        isBound: true,
        name: 'Revenue',
        // FieldTypeIds.Decimal = 3 per our mock
        fieldType: 3,
      }),
    );
  });

  it('restores defaultValue to empty string when unmapping', () => {
    const boundControl = { ...defaultControl, isBound: true, name: 'Company_name', value: 'Acme Corp' };
    const { onChange } = renderEditor(boundControl);

    fireEvent.click(screen.getByTestId('unbind-field'));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        isBound: false,
        defaultValue: { valueType: 9, value: '' },
      }),
    );
  });
});
