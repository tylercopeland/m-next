import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Dropdown from '@m-next/dropdown';
import { DatePicker, TimePicker } from '@m-next/datepicker';
import RadioGroup from '@m-next/radio-button';
import {
  allowedControlType,
  allowedFieldType,
  complexControlOptions,
  complexValueTypes,
  controlIcon,
  fieldTypeIdIcons,
  sessionLookup,
  getSessionValues,
  widgets,
} from '@m-next/types';
import { DebouncedInput } from '@m-next/input';

const getControlName = (control) =>
  control.type === widgets.LABEL || !control.caption ? control.name : control.caption;

const toBooleanYesNo = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes';
  }
  return Boolean(value);
};

// types
const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fieldListOptions: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  controlList: PropTypes.instanceOf(Object),
  fieldType: PropTypes.string,
  onChange: PropTypes.func,
  complexValue: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.instanceOf(Object)]),
    valueType: PropTypes.number,
    property: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    childProperty: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  }),
  controlId: PropTypes.string,
  formatType: PropTypes.string,
};

function ValueEditor({ id, controlList, onChange, fieldListOptions, fieldType, complexValue, controlId, formatType }) {
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

  const complexValueOption = useMemo(() => {
    if (complexValue.valueType === complexValueTypes.Session) {
      const label = sessionLookup[complexValue.value];
      if (!label) return null;
      return {
        value: complexValue.value,
        label: label || complexValue.value,
      };
    }

    if (complexValue.valueType === complexValueTypes.Control) {
      const control = controlList[complexValue.value];
      if (!control && complexValue.value) {
        return { value: complexValue.value, label: 'Unknown control' };
      }
      if (!control) {
        return null;
      }

      const controlName = getControlName(control);

      if (complexValue.property && complexValue.childProperty) {
        return {
          value: complexValue.value,
          label: `${controlName} - ${complexValue.property} - ${complexValue.childProperty}`,
        };
      }

      if (complexValue.property) {
        return { value: complexValue.value, label: `${controlName} - ${complexValue.property}` };
      }

      if (childControls) {
        const parentId = childControls[complexValue.value];
        if (parentId) {
          const parentControl = controlList[parentId];
          const parentName = getControlName(parentControl);
          return {
            parentId: complexValue.value,
            parentName,
            value: `${parentId}_${control.name}`,
            label: `${parentName} - ${controlName}`,
          };
        }
      }

      return { value: complexValue.value, label: controlName };
    }

    if (complexValue.valueType === complexValueTypes.YesNo) {
      return { value: complexValue.value, label: toBooleanYesNo(complexValue.value) ? 'True' : 'False' };
    }

    return { value: complexValue.value, label: complexValue.value };
  }, [
    controlList,
    complexValue.childProperty,
    complexValue.property,
    complexValue.valueType,
    complexValue.value,
    childControls,
  ]);

  const formattedControlList = useMemo(() => {
    if (!controlList || fieldType == null || !childControls) return null;
    const grouped = [{ label: 'Screen controls', options: [] }];
    //  const grouped = [];

    if (!allowedControlType[fieldType]) return null;

    let match = false;

    let filtered = Object.values(controlList)
      .filter((x) => allowedControlType[fieldType].includes(x.type))
      .filter((x) => x.id !== controlId);
    Object.values(filtered).forEach((item) => {
      let name = getControlName(item);
      if (item.id === complexValue.value) match = true;
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
      if (item.id === complexValue.value) match = true;
      const updateInner = [];
      const name = getControlName(item);

      if (item.type === widgets.GRID) {
        const inner = item.model.columns.filter((x) => allowedFieldType[fieldType].includes(x.fieldType));
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
        const inner = item.columns.filter((x) => allowedFieldType[fieldType].includes(x.fieldType));
        inner.forEach((column) => {
          if (column.controlId !== controlId) {
            updateInner.push({
              parentId: item.controlId || item.id,
              parentName: name,
              value: `${item.id}_${column.field}`,
              label: column.header,
              property: column.field,
              icon: fieldTypeIdIcons[column.fieldType],
            });
          }
        });
      } else {
        const inner = complexControlOptions[item.type].filter((x) => allowedFieldType[fieldType].includes(x.fieldType));

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

    if (complexValue.valueType === complexValueTypes.Control && complexValue.value) {
      if (!match) {
        const control = controlList[complexValue.value];
        if (control) {
          grouped[0].options.push({
            value: complexValue.value,
            label: getControlName(control),
            icon: control ? controlIcon[control.type] : controlIcon.TXT,
          });
        } else {
          grouped[0].options.push({
            value: complexValue.value,
            label: 'Unknown control',
            icon: control ? controlIcon[control.type] : controlIcon.LBL,
          });
        }
      }
    }
    return grouped;
  }, [controlList, fieldType, childControls, complexValue.valueType, complexValue.value, controlId]);

  const handleInputChange = (e) => {
    onChange(e);
  };

  const handleYesNoChange = (e, value) => {
    const normalized = toBooleanYesNo(value) ? 'true' : 'false';
    onChange(normalized);
  };

  const render = () => {
    if (complexValue.valueType === complexValueTypes.YesNo)
      return (
        <RadioGroup
          id={`${id}-value`}
          name={`${id}-value`}
          selectedValue={toBooleanYesNo(complexValue.value) ? 'true' : 'false'}
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
          narrow
        />
      );
    if (
      complexValue.valueType === complexValueTypes.Text ||
      complexValue.valueType === complexValueTypes.Number ||
      complexValue.valueType === complexValueTypes.SharedResult
    )
      return (
        <DebouncedInput
          id={`${id}-value`}
          value={complexValue.value}
          type={complexValue.valueType === complexValueTypes.Number ? 'number' : 'text'}
          onChange={handleInputChange}
          inputStyle={{ fontSize: 13 }}
          compactStyle
          isV4Design
          placeholder='Value'
        />
      );
    if (
      complexValue.valueType === complexValueTypes.DateTime ||
      complexValue.valueType === complexValueTypes.Date ||
      complexValue.valueType === complexValueTypes.DateRange
    )
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {complexValue.valueType === complexValueTypes.DateTime && (
            <DatePicker
              id={`${id}-value`}
              value={complexValue.value}
              onChange={(date) => onChange(date)}
              isV4Design
              fontSize='13px'
              compactStyle
              marginless
              placeholder='Exact date and time'
              formatType={formatType || 'Short Date and Time'}
              inputPadding={8}
            />
          )}
          {complexValue.valueType === complexValueTypes.Date && (
            <DatePicker
              id={`${id}-value`}
              value={complexValue.value}
              onChange={(date) => onChange(date)}
              isV4Design
              fontSize='13px'
              compactStyle
              marginless
              placeholder='Exact date'
              formatType={formatType}
              inputPadding={8}
            />
          )}
        </div>
      );

    if (complexValue.valueType === complexValueTypes.Time)
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <TimePicker id={`${id}-value`} value={complexValue.value} onChange={onChange} placeholder='Exact time' />
        </div>
      );

    if (complexValue.valueType === complexValueTypes.Field)
      return (
        <Dropdown
          id={`${id}-value`}
          options={fieldListOptions}
          onChange={onChange}
          placeholder='Select a field'
          dropdownStyle='multi-icon'
          isV4Design
          value={complexValueOption}
        />
      );
    if (complexValue.valueType === complexValueTypes.Control)
      return (
        <Dropdown
          id={`${id}-value`}
          options={formattedControlList}
          onChange={onChange}
          placeholder='Control'
          dropdownStyle='multi-icon'
          isV4Design
          value={complexValueOption}
        />
      );
    if (complexValue.valueType === complexValueTypes.Session)
      return (
        <Dropdown
          id={`${id}-value`}
          options={getSessionValues(fieldType)}
          onChange={onChange}
          placeholder='Value'
          dropdownStyle='multi-icon'
          isV4Design
          value={complexValueOption}
        />
      );

    return null;
  };

  return render();
}

ValueEditor.propTypes = propTypes;
export default ValueEditor;
