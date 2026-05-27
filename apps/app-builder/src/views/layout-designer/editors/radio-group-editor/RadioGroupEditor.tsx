import React, { Suspense, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Text, TextLine } from '@m-next/typeography';
import { ButtonGroupRow } from '@m-next/button-group';
import Toggle from '@m-next/toggle';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { FieldTypeIds, WIDGETS,  type RadioButtonControl } from '@m-next/runtime-interface';
import { Guid, toCamelCase } from '@m-next/utilities';
import { Z_POPUP } from '@m-next/layout-canvas';
import * as s from '../common/BlockEditor.styles';
import Accordion from '../../../../components/accordion/Accordion';
import { Tooltip } from 'react-tooltip';
import { colors } from '@m-next/styles';
import CaptionInput from '../common/components/caption-input/CaptionInput';
import SvgIcon from '@m-next/svg-icon';
import DefaultStateSelector from '../common/components/default-state-selector/DefaultStateSelector';
import ActionListSection from '../common/components/action-list-section/ActionListSection';
import { RumComponentContextProvider } from '../../../../common/rum/RumComponentContext';
import EditorInput from '../common/components/editor-input/EditorInput';
import {
  calculateVerticalHeightRows,
  calculateHorizontalHeightRows,
  calculateRequiredHorizontalColumns,
  calculateRequiredVerticalColumns,
} from '../../component-wrappers/radioGroupSizing';
import { selectIsV4Screen } from '../../../../common/services/screenLayoutSlice';


// @ts-ignore Missing type definitions for @m-next/grid component
const Grid = React.lazy(() => import('@m-next/grid'));
// Constants
const INPUT_MAX_LENGTH = 30;

interface RadioGroupEditorProps {
  rawControl: RadioButtonControl | null;
  onChange: (control: RadioButtonControl) => void;
  onAddAction: (control: RadioButtonControl, eventName: string) => void;
}

interface EventItem {
  id: string;
  value: string;
  label: string;
}

// Standard actions pattern
const actions = [{ value: 'Change', label: 'Change', source: 'onChange' }];

const RadioGroupEditor: React.FC<RadioGroupEditorProps> = ({ rawControl, onChange, onAddAction }) => {
  const isV4Screen = useSelector(selectIsV4Screen);

  const control = useMemo((): RadioButtonControl => {
    const defaultControl: RadioButtonControl = {
      id: '',
      caption: 'Radio Group',
      hideCaption: false,
      name: '',
      visible: true,
      disabled: false,
      type: WIDGETS.RADIOBOX,
      classes: '',
      widthType: 'auto',
      width: null,
      height: null,
      isBound: false,
      defaultValue: undefined,
      radiobuttons: [],
      position: 'vertical',
      onChange: undefined,
      isWorking: false,
    };
    const merged = toCamelCase({ ...(rawControl ?? defaultControl) });
    return merged;
  }, [rawControl]);

  const radioOptions = useMemo(
    () =>
      control.radiobuttons.map((radioOption) => ({
        id: radioOption,
        name: radioOption,
        isDefault: radioOption === control.defaultValue,
      })),
    [control.defaultValue, control.radiobuttons],
  );

  const eventList = useMemo<EventItem[]>(() => {
    const events = [];
    if (control.onChange) {
      events.push({ id: control.onChange, value: 'Change', label: 'Change' });
    }
    return events;
  }, [control.onChange]);

  const filteredActions = useMemo(
    () => actions.filter((action) => !eventList.some((item) => item.value === action.value)),
    [eventList],
  );

  // Recalculate height when options change (add/edit/delete) or position changes
  // Width is NOT auto-adjusted - the wrapper will auto-collapse if content doesn't fit
  // NOTE: Only applies to V4 screens - non-V4 screens preserve their dimensions
  const recalculateDimensions = useCallback((updatedControl: RadioButtonControl): RadioButtonControl => {
    // Skip dimension recalculation for non-V4 screens
    if (!isV4Screen) {
      return updatedControl;
    }

    const isHorizontal = updatedControl.position?.toLowerCase() === 'horizontal';

    if (isHorizontal) {
      updatedControl.height = calculateHorizontalHeightRows(updatedControl);
    } else {
      updatedControl.height = calculateVerticalHeightRows(updatedControl);
    }

    return updatedControl;
  }, [isV4Screen]);

  // Handle position change
  // When switching to horizontal: calculate minimum required width based on content
  // When switching to vertical: keep current width, just adjust height
  // NOTE: Dimension overrides only apply to V4 screens - non-V4 screens preserve their dimensions
  const handlePositionChange = useCallback((newPosition: 'horizontal' | 'vertical'): void => {
    // Set both position and layout to ensure consistency
    const updated: RadioButtonControl = {
      ...control,
      position: newPosition,
      layout: newPosition
    };

    // Only apply dimension overrides for V4 screens
    if (isV4Screen) {
      if (newPosition === 'horizontal') {
        // Calculate minimum required width based on actual content
        updated.width = calculateRequiredHorizontalColumns(control) - 1 ;
        updated.height = calculateHorizontalHeightRows(control);
      } else {
        // Vertical - calculate width based on widest label
        updated.height = calculateVerticalHeightRows(control);
        updated.width = Math.max(calculateRequiredVerticalColumns(control) - 1, 2);
      }
    }

    const transformedUpdate = {
      ...updated,
      options: updated.radiobuttons.map(rb => ({ label: rb, value: rb })),
      // Only lock dimensions for V4 screens
      ...(isV4Screen && { __dimensionsLockedUntil: Date.now() + 1700 })
    };
    onChange(transformedUpdate);
  }, [control, onChange, isV4Screen]);

  const handlePropertyChange = (property: string, value: unknown): void => {
    const updated = { ...control, [property]: value };

    // Transform radiobuttons to options format and map position to layout
    const transformedUpdate = {
      ...updated,
      options: updated.radiobuttons.map(rb => ({ label: rb, value: rb })),
      layout: updated.position
    };

    onChange(transformedUpdate);
  };

  const getUniqueName = (baseValue?: string): string => {
    const baseCaption = baseValue ? baseValue : 'Value';
    let index = 1;
    let caption = `${baseCaption} ${index}`;

    // If baseValue is provided and already unique, return it immediately
    if (baseValue && !control.radiobuttons.some((rb) => (typeof rb === 'string' && rb.toLocaleLowerCase() === baseValue.toLocaleLowerCase()))) {
      return baseValue;
    }

    // Otherwise, find a unique name by appending/incrementing a number
    while (control.radiobuttons.some((rb) => (typeof rb === 'string' && rb.toLocaleLowerCase() === caption.toLocaleLowerCase()))) {
      caption = `${baseCaption} ${index}`;
      index += 1;
    }
    return caption;
  };

  const handleAddRadio = (): void => {
    if (control.radiobuttons.length >= 5) {
      return;
    }
    const updated = { ...control };
    const radioOption = getUniqueName();
    updated.radiobuttons = [...updated.radiobuttons, radioOption];

    // Set the first option as default if no default exists
    if (!updated.defaultValue || !updated.radiobuttons.includes(updated.defaultValue)) {
      updated.defaultValue = updated.radiobuttons[0];
    }

    // Recalculate dimensions after adding option
    const withDimensions = recalculateDimensions(updated);

    // Transform to expected format
    const transformedUpdate = {
      ...withDimensions,
      options: withDimensions.radiobuttons.map(rb => ({ label: rb, value: rb })),
      layout: withDimensions.position
    };

    onChange(transformedUpdate);
  };

  const handleRadioOptionEdit = (value: string, rowIndex: number, primaryKey: string): void => {
    let trimmedValue = value;

    if (value.length > INPUT_MAX_LENGTH) {
      trimmedValue = value.slice(0, INPUT_MAX_LENGTH);
    }

    if (trimmedValue === control.radiobuttons[rowIndex]) {
      return;
    }

    const previousRadios = control.radiobuttons;
    const previousDefaultValue = control.defaultValue;
    const newUniqueName = getUniqueName(trimmedValue);

    const updatedRadios = control.radiobuttons.map((rb) => (rb === primaryKey ? newUniqueName : rb));

    // Determine new defaultValue
    let newDefaultValue = previousDefaultValue;
    if (primaryKey === previousDefaultValue && trimmedValue) {
      newDefaultValue = newUniqueName;
    }

    const updatedControl = { ...control, radiobuttons: updatedRadios, defaultValue: newDefaultValue };

    // Recalculate dimensions after editing option (label length may have changed)
    const withDimensions = recalculateDimensions(updatedControl);

    // Transform to expected format
    const transformedUpdate = {
      ...withDimensions,
      options: withDimensions.radiobuttons.map(rb => ({ label: rb, value: rb })),
      layout: withDimensions.position
    };

    onChange(transformedUpdate);

    // If trimmedValue is empty, keep previous values
    if (!trimmedValue) {
      setTimeout(() => {
        const revertedControl = { ...control, radiobuttons: previousRadios, defaultValue: previousDefaultValue };
        const revertedWithDimensions = recalculateDimensions(revertedControl);
        const transformedRevert = {
          ...revertedWithDimensions,
          options: revertedWithDimensions.radiobuttons.map(rb => ({ label: rb, value: rb })),
          layout: revertedWithDimensions.position
        };
        onChange(transformedRevert);
      }, 0);
    }
  };

  const handleRadioReorder = (from: number, to: number): void => {
    const newRadioList = [...control.radiobuttons];
    const [movedItem] = newRadioList.splice(from, 1);
    newRadioList.splice(to, 0, movedItem);
    const updated = {
      ...control,
      radiobuttons: newRadioList,
    };
    
    // Transform to expected format
    const transformedUpdate = {
      ...updated,
      options: updated.radiobuttons.map(rb => ({ label: rb, value: rb })),
      layout: updated.position
    };
    
    onChange(transformedUpdate);
  };

  const handleDeleteRadio = (rowIdx: number, primaryKey: string): void => {
    const updated = { ...control };
    updated.radiobuttons = updated.radiobuttons.filter((rb) => rb !== primaryKey);

    // If we deleted the default option, set the first remaining option as default
    if (primaryKey === updated.defaultValue && updated.radiobuttons.length > 0) {
      updated.defaultValue = updated.radiobuttons[0];
    }

    // Recalculate dimensions after deleting option
    const withDimensions = recalculateDimensions(updated);

    // Transform to expected format
    const transformedUpdate = {
      ...withDimensions,
      options: withDimensions.radiobuttons.map(rb => ({ label: rb, value: rb })),
      layout: withDimensions.position
    };

    onChange(transformedUpdate);
  };

  const handleSetDefaultOption = (
    name: string,
    value: string,
    column: unknown,
    rowIndex: number,
    primaryKey: string,
  ) => {
    const updated = {
      ...control,
      defaultValue: primaryKey,
    };
    
    // Transform to expected format
    const transformedUpdate = {
      ...updated,
      options: updated.radiobuttons.map(rb => ({ label: rb, value: rb })),
      layout: updated.position
    };
    
    onChange(transformedUpdate);
  };

  const handleCaptionChange = (newCaption: string, newName: string) => {
    const updated = { ...control, caption: newCaption, name: newName };
    
    // Transform to expected format
    const transformedUpdate = {
      ...updated,
      options: updated.radiobuttons.map(rb => ({ label: rb, value: rb })),
      layout: updated.position
    };
    
    onChange(transformedUpdate);
  };

  const handleAddAction = (source: string, value: string): void => {
    const updated = { ...control, [source]: Guid.create() };
    onAddAction(updated, value);
  };

  return (
    <RumComponentContextProvider componentName='RadioGroupEditor'>
      <s.Wrapper padding={16}>
        <Tooltip id='editor-tooltip' opacity={1} style={{ zIndex: Z_POPUP.TOOLTIP, maxWidth: '240px', wordBreak: 'break-word' }} />
        <TextLine>Edit the base configuration and styles of the radio group.</TextLine>

        <s.LineWrapper>
          <Text
            tooltip='Manual is for display only; it does not save data to the table.'
            tooltipId='editor-tooltip'
            tooltipHighlighting
          >
            Data source
          </Text>
          <ButtonGroupRow id='data-source' width={184} selected={false} data={[{ value: false, label: 'Manual' }]} />
        </s.LineWrapper>
        <Accordion id='display' caption='Display' variant='left' open borderless>
          <CaptionInput
            id='label'
            label='Label'
            controlId={control.id}
            value={control.caption || ''}
            onChange={handleCaptionChange}
            maxLength={40}
          />
          <s.LineWrapper gap={8}>
            <SvgIcon name='arrow-elbow' size={12} color={colors.grey} />
            <Toggle
              id='show-label'
              checked={!control.hideCaption}
              onChange={(e) => handlePropertyChange('hideCaption', !e)}
              label='Show label'
              width='100%'
              style={{ justifyContent: 'flex-start' }}
              labelStyle={{ flexBasis: '100%' }}
            />
          </s.LineWrapper>
          <s.LineWrapper>
            <Text>Direction</Text>
            <ButtonGroupRow
              id='radio-direction'
              width={184}
              selected={(control.position || control.layout || 'vertical')?.toLowerCase()}
              data={[
                { value: 'vertical', icon: 'vertical' },
                { value: 'horizontal', icon: 'horizontal' },
              ]}
              onClick={(e) => handlePositionChange(e.value as 'horizontal' | 'vertical')}
            />
          </s.LineWrapper>
          <DefaultStateSelector control={control} onChange={(updated) => {
            // Transform to expected format
            const transformedUpdate = {
              ...updated,
              options: updated.radiobuttons.map(rb => ({ label: rb, value: rb })),
              layout: updated.position
            };
            onChange(transformedUpdate);
          }} />
        </Accordion>
        <Accordion
          id='radio-list'
          caption='Values'
          onAdd={control.radiobuttons.length < 5 ? handleAddRadio : undefined}
          variant='left'
          open
          borderless
          tooltipId='editor-tooltip'
          tooltip='Add radio value'
        >
          <Suspense fallback={<LoadingSkeleton count={1} height={100} />}>
            <Grid
              id='radiobuttons'
              hideCaption={false}
              searchable={false}
              showGoToPage={false}
              showPageSize={false}
              showReload={false}
              showHeader={false}
              addRowsEnabled={false}
              editable
              tooltipId='editor-tooltip'
              columns={[
                {
                  name: 'id',
                  primary: true,
                  caption: '',
                  visible: false,
                  editable: false,
                  singleLine: true,
                  width: 'dynamic',
                },
                {
                  name: 'isDefault',
                  caption: '',
                  visible: true,
                  editable: true,
                  singleLine: true,
                  fieldType: FieldTypeIds.YesNo,
                  displayAs: 'icon',
                  width: 'dynamic',
                  displayOptions: {
                    trueIcon: { name: 'star-filled-V4', color: colors.yellow },
                    falseIcon: { name: 'star-empty-V4' },
                    trueTooltip: 'Default view',
                    falseTooltip: 'Set as default option',
                    hoverColor: colors['grey-darker'],
                  },
                  onChange: handleSetDefaultOption,
                },
                {
                  name: 'name',
                  caption: '',
                  visible: true,
                  editable: true,
                  singleLine: true,
                  onChange: handleRadioOptionEdit,
                  width: 'dynamic',
                  renderEditAs: ({
                    value,
                    rowIdx,
                    primaryKey,
                  }: {
                    value: string;
                    rowIdx: number;
                    primaryKey: string;
                    
                  }) => (
                    <EditorInput
                      gap={0}
                      id={`radio-option-${rowIdx}`}
                      value={value}
                      onChange={(value) => handleRadioOptionEdit(String(value), rowIdx, primaryKey)}
                      width='100%'
                      controlId={`radio-option-${rowIdx}`}
                    />
                  ),
                },
              ]}
              data={radioOptions}
              draggable
              showDragOnHover
              onReorder={handleRadioReorder}
              compact
              pageSize={50}
              totalRecords={radioOptions.length}
              hideRecordCount
              pageNumber={1}
              isPageData
              canDelete={radioOptions.length > 2}
              onDelete={handleDeleteRadio}
              alwaysShowDragHandles
            />
          </Suspense>
        </Accordion>

        <ActionListSection
          caption='Events'
          values={eventList}
          emptyMessage='No events applied'
          canAdd={filteredActions.length > 0}
          actions={filteredActions}
          addLabel='Add'
          onAddAction={handleAddAction}
          control={control}
          optionKey='value'
        />
      </s.Wrapper>
    </RumComponentContextProvider>
  );
};

export default RadioGroupEditor;
