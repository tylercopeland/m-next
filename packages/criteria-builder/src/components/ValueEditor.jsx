import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Dropdown from '@m-next/dropdown';
import Input from '@m-next/input';
import { DatePicker, TimePicker, TimeRangePicker } from '@m-next/datepicker';
import styled from '@emotion/styled';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import RadioGroup from '@m-next/radio-button';
import { MenuItem, MenuList } from '@m-next/menu';
import {
  FieldTypeNames,
  Predicate,
  allowedControlType,
  allowedFieldType,
  basicOperationId,
  complexControlOptions,
  complexValueTypes,
  controlIcon,
  dateRanges,
  fieldTypeIdIcons,
  sessionLookup,
  sessionValues,
  widgets,
} from '@m-next/types';

const getControlName = (control) =>
  control.type === widgets.LABEL || !control.caption ? control.name : control.caption;

// types
const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fieldListOptions: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  controlList: PropTypes.instanceOf(Object),
  first: Predicate,
  operation: PropTypes.number,
  second: Predicate,
  third: Predicate,
  advanced: PropTypes.bool,
  dateField: PropTypes.number,
  firstFieldType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onThirdChange: PropTypes.func,
  onDateFieldChange: PropTypes.func,
  onDisableClickOutside: PropTypes.func,
  forcedTimeZone: PropTypes.string,
};

const BetweenDateWrapper = styled.div(({ advanced }) => [
  {
    display: advanced ? 'flex' : null,
    gap: 8,
    minWidth: advanced ? 343 : null,
  },
]);

function ValueEditor({
  id,
  first,
  operation,
  second,
  third,
  dateField,
  controlList,
  onChange,
  onDateFieldChange,
  fieldListOptions,
  advanced,
  firstFieldType,
  onDisableClickOutside,
  onThirdChange,
  forcedTimeZone,
}) {
  const [showDateComparePicker, setShowDateComparePicker] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const childControls = useMemo(() => {
    const children = {};
    if (controlList) {
      Object.values(controlList).forEach((item) => {
        if (item.type === widgets.DATATABLE) {
          item.columns.forEach((inner) => {
            if (inner.controlId) {
              children[inner.controlId] = item.id;
            }
          });
        }
      });
    }
    return children;
  }, [controlList]);

  const secondOption = useMemo(() => {
    if (second.type === complexValueTypes.Session) {
      const lookupKey = second.value != null ? String(second.value).toLowerCase() : second.value;
      const label = sessionLookup[lookupKey];
      if (!label) return null;
      return {
        value: lookupKey,
        label: label || second.value,
      };
    }

    if (second.type === complexValueTypes.Control) {
      const control = controlList[second.value];
      if (!control && second.value) {
        return { value: second.value, label: 'Unkown control' };
      }
      if (!control) {
        return null;
      }

      const controlName = getControlName(control);

      if (second.property && second.childProperty) {
        return {
          value: second.value,
          label: `${controlName} - ${second.property} - ${second.childProperty}`,
        };
      }

      if (second.property) {
        return { value: second.value, label: `${controlName} - ${second.property}` };
      }

      if (childControls) {
        const parentId = childControls[second.value];
        if (parentId) {
          const parentControl = controlList[parentId];
          const parentName = getControlName(parentControl);
          return {
            parentId: second.value,
            parentName,
            value: `${parentId}_${control.name}`,
            label: `${parentName} - ${controlName}`,
          };
        }
      }

      return { value: second.value, label: controlName };
    }

    if (second.type === complexValueTypes.YesNo) {
      return { value: second.value, label: second.value ? 'True' : 'False' };
    }

    return { value: second.value, label: second.value };
  }, [controlList, second.childProperty, second.property, second.type, second.value, childControls]);

  const formattedControlList = useMemo(() => {
    if (!controlList || firstFieldType == null || !childControls) return null;
    const grouped = [{ label: 'Screen controls', options: [] }];
    //  const grouped = [];

    if (!allowedControlType[firstFieldType]) return null;

    let match = false;

    let filtered = Object.values(controlList).filter((x) => allowedControlType[firstFieldType].includes(x.type));
    Object.values(filtered).forEach((item) => {
      let name = getControlName(item);
      if (item.id === second.value) match = true;
      if (!name) {
        name = item.name;
      }
      if (!childControls[item.id]) {
        grouped[0].options.push({
          value: item.id,
          label: name,
          icon: controlIcon[item.type],
        });
      }
    });

    const complexTypes = [
      widgets.CALENDAR,
      widgets.CHART,
      widgets.DROPDOWN,
      widgets.ADDRESSLOOKUP,
      widgets.PAYMENTWIDGET,
      widgets.SIGNATURE,
      widgets.GRID,
      widgets.DATATABLE,
    ];

    filtered = Object.values(controlList).filter((x) => complexTypes.includes(x.type));
    Object.values(filtered).forEach((item) => {
      if (item.id === second.value) match = true;
      const updateInner = [];
      const name = getControlName(item);

      if (item.type === widgets.GRID) {
        const inner = item.model.columns.filter((x) => allowedFieldType[firstFieldType].includes(x.fieldType));
        inner.forEach((column) => {
          updateInner.push({
            parentId: item.id,
            parentName: name,
            value: `${item.id}_${column.name}`,
            label: column.caption,
            property: column.name,
            icon: fieldTypeIdIcons[column.fieldType],
          });
        });
      } else if (item.type === widgets.DATATABLE) {
        const inner = item.columns.filter((x) => allowedFieldType[firstFieldType].includes(x.fieldType));
        inner.forEach((column) => {
          updateInner.push({
            parentId: item.controlId || item.id,
            parentName: name,
            value: `${item.id}_${column.field}`,
            label: column.header,
            property: column.field,
            icon: fieldTypeIdIcons[column.fieldType],
          });
        });
      } else {
        const inner = complexControlOptions[item.type].filter((x) =>
          allowedFieldType[firstFieldType].includes(x.fieldType),
        );

        inner.forEach((element) => {
          updateInner.push({
            parentId: item.id,
            parentName: name,
            value: `${item.id}_${element.property}`,
            label: element.label,
            property: element.property,
            icon: element.icon,
          });
        });
      }
      grouped.push({ label: name, options: updateInner, icon: controlIcon[item.type] });
    });

    if (second.type === complexValueTypes.Control && second.value) {
      if (!match) {
        const control = controlList[second.value];
        if (control) {
          grouped[0].options.push({
            value: second.value,
            label: getControlName(control),
            icon: control ? controlIcon[control.type] : controlIcon.TXT,
          });
        } else {
          grouped[0].options.push({
            value: second.value,
            label: 'Unkown control',
            icon: control ? controlIcon[control.type] : controlIcon.LBL,
          });
        }
      }
    }
    return grouped;
  }, [controlList, firstFieldType, childControls, second.value, second.type]);

  const selectedDateRange = useMemo(() => {
    if (second.type === complexValueTypes.Date) {
      return { value: -1, label: 'Exact date' };
    }
    if (second.type === complexValueTypes.DateTime) {
      return { value: -1, label: 'Exact date and time' };
    }
    if (second.value === undefined || second.value === null) return null;
    if (second.type === complexValueTypes.DateRange) {
      return { value: second.value, label: dateRanges[second.value] };
    }
  }, [second.value, second.type]);

  const dateRangeOptions = useMemo(() => {
    if (operation === basicOperationId.Is || operation === basicOperationId.IsNot) {
      return [
        {
          label: '',
          options: [
            { value: -1, label: 'Exact date' },
            { value: -2, label: 'Exact date and time' },
            { value: 10, label: 'Yesterday' },
            { value: 9, label: 'Today' },
            { value: 11, label: 'Tomorrow' },
          ],
        },
        {
          label: '',
          options: [
            { value: 13, label: 'Last week' },
            { value: 12, label: 'This week' },
            { value: 14, label: 'Next week' },
          ],
        },
        {
          label: '',
          options: [
            { value: 2, label: 'Last month' },
            { value: 1, label: 'This month' },
            { value: 3, label: 'Next month' },
          ],
        },
        {
          label: '',
          options: [
            { value: 6, label: 'Last year' },
            { value: 5, label: 'This year' },
            { value: 7, label: 'Next year' },
            { value: 8, label: 'Year to date' },
          ],
        },
      ];
    }
    if (
      operation === basicOperationId.Less ||
      operation === basicOperationId.LessEqual ||
      operation === basicOperationId.Greater ||
      operation === basicOperationId.GreaterEqual
    ) {
      return [
        { value: -1, label: 'Exact date' },
        { value: -2, label: 'Exact date and time' },
        { value: 9, label: 'Today' },
      ];
    }
    return [
      { value: -1, label: 'Exact date' },
      { value: -2, label: 'Exact date and time' },
    ];
  }, [operation]);

  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  const handleSetDateRange = (item) => {
    if (item.value === -2) {
      onChange(item.value, complexValueTypes.DateTime);
    } else if (item.value === -1) {
      onChange(item.value, complexValueTypes.Date);
    } else {
      onChange(item.value, complexValueTypes.DateRange);
    }
  };

  const handleOpenDateComparePicker = (event) => {
    setShowDateComparePicker(!showDateComparePicker);
    setAnchorEl(showDateComparePicker ? null : event.currentTarget);
    onDisableClickOutside(!showDateComparePicker);
  };

  const handleCloseDateComparePicker = () => {
    setShowDateComparePicker(false);
    setAnchorEl(null);
    onDisableClickOutside(false);
  };

  const handleDateCompareDateClick = () => {
    onDateFieldChange(dateField === 1 ? null : 1);
    setShowDateComparePicker(false);
    onDisableClickOutside(!showDateComparePicker);
  };
  const handleDateCompareDateTimeClick = () => {
    onDateFieldChange(dateField === 0 ? null : 0);
    setShowDateComparePicker(false);
    onDisableClickOutside(!showDateComparePicker);
  };

  const handleYesNoChange = (e, value) => {
    onChange(value);
  };

  const render = () => {
    if (
      operation === basicOperationId.IsEmpty ||
      operation === basicOperationId.IsNotEmpty ||
      operation === basicOperationId.IsTrue ||
      operation === basicOperationId.IsFalse
    )
      return null;
    if (second.type === complexValueTypes.YesNo)
      return (
        <RadioGroup
          id={`${id}-value`}
          name={`${id}-value`}
          selectedValue={second.value}
          options={[
            {
              label: 'Yes',
              value: 'true',
            },
            {
              label: 'No',
              value: 'false',
            },
          ]}
          onChange={handleYesNoChange}
          direction='row'
          isV4Design
          disabled={first.value === null || first.value === undefined}
          wrapperStyle={{ flexBasis: advanced ? '100%' : null, justifyContent: 'flex-start', paddingRight: 0 }}
          narrow
        />
      );
    if (
      second.type === complexValueTypes.Text ||
      second.type === complexValueTypes.Number ||
      second.type === complexValueTypes.SharedResult
    )
      return (
        <Input
          id={`${id}-value`}
          value={second.value}
          type={second.type === complexValueTypes.Number ? 'number' : 'text'}
          onChange={handleInputChange}
          style={{ flexBasis: advanced ? '100%' : null, backgroundColor: colors.white }}
          inputStyle={{ fontSize: 13 }}
          compactStyle
          disabled={first.value === null || first.value === undefined}
          isV4Design
          placeholder='Value'
        />
      );
    if (
      second.type === complexValueTypes.DateTime ||
      second.type === complexValueTypes.Date ||
      second.type === complexValueTypes.DateRange
    )
      return (
        <div
          style={{
            flexBasis: advanced ? '100%' : null,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {operation !== basicOperationId.Between && (
            <Dropdown
              id={`${id}-date-range`}
              options={dateRangeOptions}
              onChange={handleSetDateRange}
              placeholder='Choose date'
              dropdownStyle='single'
              isV4Design
              value={selectedDateRange}
              style={{ flexBasis: advanced ? '100%' : null }}
              required
              listHeight={advanced ? 100 : null}
              isPortal={advanced}
              hasDividersInsteadOfHeaders
            />
          )}
          {second.type === complexValueTypes.DateTime && (
            <DatePicker
              id={`${id}-value`}
              value={second.value}
              onChange={(date) => onChange(date)}
              containerStyle={{
                flexBasis: advanced ? '100%' : null,
                maxWidth: advanced ? 173 : null,
              }}
              disabled={first.value === null || first.value === undefined}
              isV4Design
              fontSize='13px'
              compactStyle
              marginless
              placeholder='Exact date and time'
              anchorEl={advanced ? 'advanced-edit-filter-advanced-editor-container' : null}
              usePortal={!!advanced}
              formatType='Short Date and Time'
              forcedTimeZone={forcedTimeZone}
              inputPadding={8}
            />
          )}
          {second.type === complexValueTypes.Date && operation !== basicOperationId.Between && (
            <DatePicker
              id={`${id}-value`}
              value={second.value}
              onChange={(date) => onChange(date)}
              containerStyle={{
                flexBasis: advanced ? '100%' : null,
                maxWidth: advanced ? 173 : null,
              }}
              disabled={first.value === null || first.value === undefined}
              isV4Design
              fontSize='13px'
              compactStyle
              marginless
              placeholder='Exact date'
              anchorEl={advanced ? 'advanced-edit-filter-advanced-editor-container' : null}
              usePortal={!!advanced}
              forcedTimeZone={forcedTimeZone}
              inputPadding={8}
            />
          )}

          {second.type === complexValueTypes.Date && operation === basicOperationId.Between && (
            <BetweenDateWrapper advanced={advanced}>
              <DatePicker
                id={`${id}-minimum-value`}
                value={second.value}
                onChange={(date) => onChange(date)}
                containerStyle={{
                  flexBasis: advanced ? '100%' : null,
                  maxWidth: advanced ? 173 : null,
                }}
                disabled={first.value === null || first.value === undefined}
                isV4Design
                fontSize='13px'
                compactStyle
                marginless
                placeholder='Start date'
                anchorEl={advanced ? 'advanced-edit-filter-advanced-editor-container' : null}
                usePortal={!!advanced}
                forcedTimeZone={forcedTimeZone}
              />
              <DatePicker
                id={`${id}-maximum-value`}
                value={third?.value}
                onChange={(date) => onThirdChange(date)}
                containerStyle={{
                  flexBasis: advanced ? '100%' : null,
                  maxWidth: advanced ? 173 : null,
                }}
                disabled={first.value === null || first.value === undefined}
                isV4Design
                fontSize='13px'
                compactStyle
                marginless
                placeholder='End date'
                anchorEl={advanced ? 'advanced-edit-filter-advanced-editor-container' : null}
                usePortal={!!advanced}
                forcedTimeZone={forcedTimeZone}
              />
            </BetweenDateWrapper>
          )}
        </div>
      );

    if (second.type === complexValueTypes.Time && operation !== basicOperationId.Between)
      return (
        <div
          style={{
            flexBasis: advanced ? '100%' : null,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <TimePicker
            id={`${id}-value`}
            value={second.value}
            onChange={onChange}
            containerStyle={{
              flexBasis: advanced ? '100%' : null,
              maxWidth: advanced ? 173 : null,
            }}
            disabled={first.value === null || first.value === undefined}
            placeholder='Exact time'
            anchorEl={advanced ? 'advanced-edit-filter-advanced-editor-container' : null}
            usePortal={!!advanced}
            forcedTimeZone={forcedTimeZone}
          />
        </div>
      );
    if (second.type === complexValueTypes.Time && operation === basicOperationId.Between)
      return (
        <div
          style={{
            flexBasis: advanced ? '100%' : null,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <TimeRangePicker
            id={`${id}-value`}
            startTimeValue={second.value}
            endTimeValue={third.value}
            onEndTimeChange={onThirdChange}
            onStartTimeChange={onChange}
            wrapperStyle={{
              flexBasis: advanced ? '100%' : null,
              minWidth: advanced ? 343 : null,
            }}
            rowStyle={{
              flexBasis: advanced ? '100%' : null,
              maxWidth: advanced ? 335 : null,
            }}
            disabled={first.value === null || first.value === undefined}
            placeholder='Time'
            hideCaption
            anchorEl={advanced ? 'advanced-edit-filter-advanced-editor-container' : null}
            usePortal={!!advanced}
            forcedTimeZone={forcedTimeZone}
          />
        </div>
      );
    if (second.type === complexValueTypes.Field)
      return (
        <Dropdown
          id={`${id}-value`}
          options={fieldListOptions}
          onChange={onChange}
          placeholder='Select a field'
          dropdownStyle='multi-icon'
          isV4Design
          value={secondOption}
          style={{ flexBasis: advanced ? '100%' : null }}
          disabled={first.value === null || first.value === undefined}
          listHeight={advanced ? 100 : null}
          isPortal={advanced}
        />
      );
    if (second.type === complexValueTypes.Control)
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexBasis: advanced ? '100%' : null }}>
          <Dropdown
            id={`${id}-value`}
            options={formattedControlList}
            onChange={onChange}
            placeholder='Control'
            dropdownStyle='multi-icon'
            isV4Design
            value={secondOption}
            style={{ flexBasis: advanced ? '100%' : null, flexGrow: 1 }}
            disabled={first.value === null || first.value === undefined}
            listHeight={advanced ? 100 : null}
            isPortal={advanced}
          />
          {firstFieldType === FieldTypeNames.DateTime && (
            <SvgIcon
              size={16}
              name='compare'
              color={dateField === null || dateField === undefined ? colors.grey : colors.blue}
              onClick={handleOpenDateComparePicker}
              tooltip={
                dateField === null || dateField === undefined
                  ? 'Compare dates as'
                  : `Compare as ${dateField === 0 ? 'date & time' : 'date'}`
              }
              tooltipId='popover-tooltip'
            />
          )}
          {showDateComparePicker && (
            <MenuList
              id={`${id}-date-compare`}
              anchorEl={anchorEl}
              open={showDateComparePicker}
              onClose={handleCloseDateComparePicker}
              header='Compare as'
              horizontalAlign='right'
              popoverStyle={{ zIndex: 10000 }}
            >
              <MenuItem id={`${id}-date-compare-date`} onClick={handleDateCompareDateClick} selected={dateField === 1}>
                Date
              </MenuItem>
              <MenuItem
                id={`${id}-date-compate-datetime`}
                onClick={handleDateCompareDateTimeClick}
                selected={dateField === 0}
              >
                Date and time
              </MenuItem>
            </MenuList>
          )}
        </div>
      );
    if (second.type === complexValueTypes.Session)
      return (
        <Dropdown
          id={`${id}-value`}
          options={sessionValues}
          onChange={onChange}
          placeholder='Value'
          dropdownStyle='multi-icon'
          isV4Design
          value={secondOption}
          style={{ flexBasis: advanced ? '100%' : null }}
          disabled={first.value === null || first.value === undefined}
          listHeight={advanced ? 100 : null}
          isPortal={advanced}
        />
      );

    return null;
  };

  return render();
}

ValueEditor.propTypes = propTypes;
export default ValueEditor;
