import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Text, TextLine } from '@m-next/typeography';
import { ButtonGroupRow } from '@m-next/button-group';
import Dropdown from '@m-next/dropdown';
import { Tooltip } from 'react-tooltip';

import { BaseControl } from '@m-next/runtime-interface';
import { DebouncedInputArea } from '@m-next/input-area';
import { Guid } from '@m-next/utilities';
import { Z_POPUP } from '@m-next/layout-canvas';
import { RumComponentContextProvider } from '../../../../common/rum/RumComponentContext';
import Accordion from '../../../../components/accordion/Accordion';
import ActionListSection from '../common/components/action-list-section/ActionListSection';
import * as s from '../common/BlockEditor.styles';
import { selectControls, selectScreenProperties, selectBaseModel } from '../../../../common/services/screenLayoutSlice';
import { selectAccountName } from '../../../../common/services/sessionSlice';
import { useGetTablesQuery } from '../../../../common/services/tablesFieldsApi';
import TableDropdown from '../common/components/table-dropdown/TableDropdown';

interface ScreenProperties {
  appRibbonType?: number;
  screenBaseModel?: string;
  defaultFocusControl?: string;
  comments?: string;
  onLoad?: string;
  onFocus?: string;
  onActiveRecordChange?: string;
}

interface ScreenEditorProps {
  onChange: (updated: ScreenProperties) => void;
  onAddAction: (control: BaseControl | null, eventName: string) => void;
}

const actions = [
  { value: 'Load', label: 'Load', source: 'onLoad' },
  { value: 'Focus', label: 'Focus', source: 'onFocus' },
  { value: 'Active Record Change', label: 'Active record change', source: 'onActiveRecordChange' },
];

const widgetGroups = [
  { value: 'ADR', label: 'Address lookup' },
  { value: 'APR', label: 'App ribbon' },
  { value: 'BTN', label: 'Button' },
  { value: 'BGR', label: 'Button group' },
  { value: 'BGI', label: 'Button group item' },
  { value: 'CAL', label: 'Calendar' },
  { value: 'CRD', label: 'Card column' },
  { value: 'CHT', label: 'Chart' },
  { value: 'CHK', label: 'Checkbox' },
  { value: 'EDT', label: 'Grid' },
  { value: 'DTP', label: 'Date time picker' },
  { value: 'DOC', label: 'Documents widget' },
  { value: 'DRP', label: 'Dropdown' },
  { value: 'GRD', label: 'Grid' },
  { value: 'COL', label: 'Grid column' },
  { value: 'ROW', label: 'Grid row' },
  { value: 'FIL', label: 'File attachment' },
  { value: 'FLT', label: 'Filter' },
  { value: 'HLP', label: 'Help note' },
  { value: 'HTM', label: 'Html editor' },
  { value: 'ICO', label: 'Icon' },
  { value: 'LBL', label: 'Label' },
  { value: 'L-SEC', label: 'Layout section' },
  { value: 'L-ROW', label: 'Layout row' },
  { value: 'L-COL', label: 'Layout column' },
  { value: 'MAP', label: 'Map' },
  { value: 'PAY', label: 'Payment widget' },
  { value: 'PIC', label: 'Picture' },
  { value: 'PNV', label: 'Portal navigation' },
  { value: 'RAD', label: 'Radio box' },
  { value: 'REC', label: 'Recurrence' },
  { value: 'SCR', label: 'Screen runtime' },
  { value: 'SCL', label: 'Screen load' },
  { value: 'SCD', label: 'Screen design' },
  { value: 'SIG', label: 'Signature' },
  { value: 'SEC', label: 'Section' },
  { value: 'TAG', label: 'Tag list' },
  { value: 'TEM', label: 'Team widget' },
  { value: 'TXT', label: 'Text input' },
  { value: 'TMP', label: 'Template builder' },
  { value: 'TXA', label: 'Text area' },
  { value: 'TGL', label: 'Toggle' },
  { value: 'WAL', label: 'Wallet' },
  { value: 'F-BLOCK', label: 'Field block' },
  { value: 'CARD', label: 'Card' },
  { value: 'GAL', label: 'Gallery' },
];

const ScreenEditor: React.FC<ScreenEditorProps> = ({ onChange, onAddAction }) => {
  const accountName = useSelector(selectAccountName) as string;
  const controlList = useSelector(selectControls) as Record<string, BaseControl> | null;
  const screenBaseModel = useSelector(selectBaseModel) as string;
  const screenProperties = useSelector(selectScreenProperties) as ScreenProperties;
  const { appRibbonType, defaultFocusControl, comments, onLoad, onFocus, onActiveRecordChange } = screenProperties;

  const { data: tablesList } = useGetTablesQuery({ accountName });

  const screenEvents = useMemo(() => {
    const events = [];
    if (onLoad) {
      events.push({ label: 'Load', value: 'Load', id: onLoad });
    }
    if (onFocus) {
      events.push({ label: 'Focus', value: 'Focus', id: onFocus });
    }
    if (onActiveRecordChange) {
      events.push({
        label: 'Active record change',
        value: 'Active Record Change',
        id: onActiveRecordChange,
      });
    }
    return events;
  }, [onLoad, onFocus, onActiveRecordChange]);

  // Get focusable controls (inputs, buttons, etc.)
  const focusableControls = useMemo(() => {
    if (!controlList) return [];
    const groups = widgetGroups.map((group) => ({
      label: group.label,
      key: group.value,
      options: [] as { value: string; label: string }[],
    }));

    Object.values(controlList).forEach((control) => {
      const group = groups.find((g) => g.key === control.typeOverride || g.key === control.type);
      if (group) {
        group.options.push({
          value: control.name,
          label: control.caption || control.name || `${control.type} ${control.id}`,
        });
      }
    });

    // Sort options within each group
    groups.forEach((group) => {
      group.options.sort((a, b) => a.label.localeCompare(b.label));
    });
    // Sort groups by label
    groups.sort((a, b) => a.label.localeCompare(b.label));

    // remove empty groups
    groups
      .filter((group) => group.options.length > 0)
      .map((group) => ({
        label: group.label,
        options: group.options,
      }));

    // add "None" option
    return [{ label: 'None', options: [] }, ...groups];
  }, [controlList]);

  const appRibbonOptions = [
    { value: 0, label: 'None' },
    { value: 1, label: '1/3' },
    { value: 2, label: '2/3' },
  ];

  const handlePropertyChange = (property: string, value: unknown) => {
    const updated = {
      ...screenProperties,
      [property]: value,
    };

    onChange(updated);
  };

  const selectedDefaultControl = useMemo(() => {
    if (!controlList || !defaultFocusControl) return null;
    const control = Object.values(controlList).find((c) => c.name === defaultFocusControl);
    if (control) {
      return {
        value: control.name,
        label: control.caption || control.name || `${control.type} ${control.id}`,
      };
    }
    return null;
  }, [defaultFocusControl, controlList]);

  const filteredActions = useMemo(
    () =>
      actions.filter(
        (action) =>
          !(screenEvents as { value: string }[]).some((item: { value: string }) => item.value === action.value),
      ),
    [screenEvents],
  );

  const handleAddAction = (source: string, value: string): void => {
    handlePropertyChange(source, Guid.create());
    onAddAction(null, value);
  };

  return (
    <RumComponentContextProvider componentName='ScreenEditor'>
      <s.Wrapper padding={16}>
        <Tooltip id='editor-tooltip' opacity={1} style={{ zIndex: Z_POPUP.TOOLTIP, maxWidth: '240px', wordBreak: 'break-word' }} />
        <TextLine>Edit the screens overall properties</TextLine>
        {/* Table Selection */}
        <s.LineWrapper>
          <Text>Table</Text>
          <TableDropdown tableList={tablesList} selectedTableName={screenBaseModel} disabled onChange={() => {}} />
        </s.LineWrapper>

        <s.SettingDivider />

        {/* Configuration Section */}
        <Accordion id='configuration' caption='Configuration' variant='left' open borderless>
          <s.LineWrapper>
            <Text>Default control focus</Text>
            <Dropdown
              id='default-control-focus'
              isV4Design
              options={focusableControls}
              value={selectedDefaultControl || { value: '', label: 'None' }}
              width={184}
              onChange={(option) => handlePropertyChange('defaultFocusControl', option?.value || null)}
              ariaLabel='Select default control focus'
              placeholder='Select control'
              isClearable={!!defaultFocusControl}
            />
          </s.LineWrapper>

          <s.LineWrapper>
            <Text>App ribbon</Text>
            <ButtonGroupRow
              id='app-ribbon'
              width={184}
              selected={appRibbonType as number}
              data={appRibbonOptions}
              onClick={(option) => handlePropertyChange('appRibbonType', option.value)}
            />
          </s.LineWrapper>
        </Accordion>

        <s.SettingDivider />

        {/* Events Section */}
        <ActionListSection
          caption='Events'
          values={screenEvents}
          emptyMessage='No events applied'
          canAdd={filteredActions.length > 0}
          actions={filteredActions}
          addLabel='Add'
          onAddAction={handleAddAction}
          valueKey='value'
          optionKey='value'
          isScreenEvent
        />

        <s.SettingDivider />

        {/* Version Note Section */}
        <Accordion id='version-note' caption='Version note' variant='left' open borderless>
          <DebouncedInputArea
            id='version-note'
            value={comments}
            onChange={(value) => handlePropertyChange('comments', value)}
            ariaLabel='version note'
            rows={3}
            placeholder='Internal summary of changes or screen functionality...'
            disableResize
          />
        </Accordion>
      </s.Wrapper>
    </RumComponentContextProvider>
  );
};

export default ScreenEditor;
