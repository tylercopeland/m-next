import React, { ReactElement, useMemo } from 'react';
import { Tooltip } from "react-tooltip";
import { Text } from '@m-next/typeography';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { ButtonGroupRow } from '@m-next/button-group';
import Dropdown, { DropdownOption } from '@m-next/dropdown';
import { useSelector } from 'react-redux';
import { BaseControl } from '@m-next/runtime-interface';
import { formatter } from '@m-next/utilities';
import { Z_POPUP } from '@m-next/layout-canvas';
import type { Field } from '@m-next/utilities';
import {
  selectBaseModel,
  selectControls,
  selectScreenFields,
} from '../../../../../../common/services/screenLayoutSlice';
import * as s from '../../BlockEditor.styles';
import { ControlListItem } from '@m-next/runtime-interface';

interface MappedFieldSelectorProps<C extends ControlListItem> {
  control: C;
  onChange: (updatedControl: C) => void;
  fieldTypes: string[];
  isLoading: boolean;
  unboundFallback?: ReactElement;
  customDataSourceChange?: (value: string | number | boolean) => void;
}

const MappedFieldSelector = <ControlType extends ControlListItem>({
  control,
  onChange,
  fieldTypes,
  isLoading,
  unboundFallback,
  customDataSourceChange,
}: MappedFieldSelectorProps<ControlType>) => {
  const controlList = useSelector(selectControls);
  const fieldList = useSelector(selectScreenFields) as Field[];
  const screenBaseModel = useSelector(selectBaseModel);

  const fieldListOptions = useMemo<DropdownOption[]>(() => {
    const toSortText = (option: DropdownOption) => {
      if (typeof option.label === 'string') return option.label;
      return String(option.value ?? '');
    };

    // Build a Set of field names that are currently bound to other controls
    // IMPORTANT: Only include controls where BOTH isBound is true AND the name matches a real field
    // This prevents stale mappings from blocking field selection
    const usedBoundFieldNames = new Set(
      Object.values(controlList)
        .filter((existingControl: ControlListItem) =>
          control.id !== existingControl.id &&
          existingControl.isBound &&
          fieldList?.some((field: Field) =>
            field.name.toLowerCase() === existingControl.name.toLowerCase()
          )
        )
        .map((existingControl: ControlListItem) => existingControl.name)
    );

    if (!fieldList || !screenBaseModel) return [];

    return (
      formatter
        .formatFieldList(fieldList, screenBaseModel, null, {}, {}, fieldTypes, false, false, true)
      ?? [])
      .flatMap((section) => section.options)
      .filter((option) => option.value === control.name || !usedBoundFieldNames.has(option.value))
      // copy common properties
      // FieldOption and DropdownOption also have the lines? property but types are mismatched
      .map((opt) => ({ value: opt.value, label: opt.label, icon: opt.icon }))
      .sort((a, b) =>
        toSortText(a).localeCompare(toSortText(b), undefined, {
          sensitivity: 'base',
          numeric: true,
        })
      );
  }, [fieldList, screenBaseModel, fieldTypes, controlList, control.id, control.name]);

  const selectedField = useMemo((): DropdownOption | undefined => {
    if (!fieldList) return undefined;
    // Exact match only - control name must match field name exactly
    const field = fieldList.find((x) => x.name.toLowerCase() === control.name.toLowerCase());
    if (field) {
      return { value: control.name, label: field.caption ?? field.name };
    }
    return undefined;
  }, [control, fieldList]);

  const sanitizeControlName = (name: string) => {
    const cleanedName = name.trim().replace(/ /g, '');
    const similarControls = Object.values(controlList).filter(
      (ctr: ControlListItem) => new RegExp(`^${cleanedName}(\\d+)?$`, 'i').test(ctr.name) && ctr.id !== control.id,
    );
    const similarBaseFields = fieldList
      ? fieldList.filter((field: Field) => new RegExp(`^${cleanedName}(\\d+)?$`, 'i').test(field.name))
      : [];

    const maxControlIndex =
      similarControls.length > 0
        ? Math.max(
          ...similarControls.map((ctr: ControlListItem) => {
            const match = ctr.name.match(/(\d+)$/);
            return match ? parseInt(match[1]!, 10) : 0;
          }),
        )
        : 0;

    const maxFieldIndex =
      similarBaseFields?.length > 0
        ? Math.max(
          ...similarBaseFields.map((field: Field) => {
            const match = field.name.match(/(\d+)$/);
            return match ? parseInt(match[1]!, 10) : 0;
          }),
        )
        : 0;

    if ((!similarBaseFields || similarBaseFields.length === 0) &&
      (!similarControls || similarControls.length === 0)) {
      return cleanedName;
    }

    // Increment the index by 1 to create a new unique name
    const maxIndex = Math.max(maxControlIndex, maxFieldIndex);

    return `${cleanedName}${maxIndex + 1}`;
  };

  const handlePropertyChange = (property: keyof BaseControl, value: BaseControl[typeof property]) => {
    const updatedControl = { ...control, [property]: value };
    onChange(updatedControl);
  };

  const handleDataSourceChange: ((value: string | number | boolean) => void) =
    customDataSourceChange ??
    ((value) => {
      const updatedControl = { ...control };
      updatedControl.isBound = !!value;

      if (value) {
        // When switching to "Mapped" mode, check if control name is a valid available field (exact match only)
        const isCurrentNameAValidField = fieldListOptions.some(option =>
          option.value.toString().toLowerCase() === control.name.toLowerCase()
        );

        if (isCurrentNameAValidField) {
          // Keep the current name if it's already a valid AND available field
          updatedControl.name = control.name;
        } else if (fieldListOptions.length > 0) {
          // Auto-select the first available field from the dropdown
          updatedControl.name = fieldListOptions[0]!.value as string;
        } else {
          // No fields available - keep sanitized name (edge case)
          updatedControl.name = sanitizeControlName(control.name);
        }
      } else {
        // Switching to "Manual" mode
        updatedControl.name = sanitizeControlName(control.name);
      }

      onChange(updatedControl);
    });

  const handleFieldChange = (option: DropdownOption): void => {
    handlePropertyChange('name', option.value as string);
  };

  return (
    <>
      <Tooltip id='mapped-tooltip' opacity={1} style={{ zIndex: Z_POPUP.TOOLTIP, maxWidth: '118px', wordBreak: 'break-word' }} />
      {isLoading && <LoadingSkeleton count={1} height={100} />}
      {!isLoading && (
        <s.ContentWrapper>
          <s.LineWrapper>
            <Text
              tooltip='Manual is for display only; mapped writes data to the table.'
              tooltipId='mapped-tooltip'
              tooltipHighlighting
            >
              Data source
            </Text>
            <ButtonGroupRow
              id='data-source'
              width={184}
              selected={control.isBound}
              data={[
                { value: false, label: 'Manual' },
                {
                  value: true,
                  label: 'Mapped',
                  disabled: fieldListOptions.length === 0,
                  tooltip: fieldListOptions.length === 0 ? 'No compatible fields left on the base table.' : undefined,
                },
              ]}
              onClick={(e) => handleDataSourceChange(e.value)}
              tooltipId='mapped-tooltip'
              tooltipPlace='top'
            />
          </s.LineWrapper>
          {control.isBound && (
            <>
              <s.LineWrapper>
                <Text>Table</Text>
                <Dropdown
                  id='table-list'
                  value={{ value: screenBaseModel, label: screenBaseModel }}
                  options={[]}
                  dropdownStyle='multi-icon'
                  isV4Design
                  width={184}
                  disabled
                />
              </s.LineWrapper>
              <s.LineWrapper>
                <Text>Field</Text>
                <Dropdown
                  id='field-list'
                  value={selectedField}
                  options={fieldListOptions}
                  dropdownStyle='multi-icon'
                  isV4Design
                  width={184}
                  onChange={handleFieldChange}
                />
              </s.LineWrapper>
            </>
          )}
          {!control.isBound && unboundFallback}
        </s.ContentWrapper>
      )}
    </>
  );
};

export default MappedFieldSelector;
