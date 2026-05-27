import { widgets, complexValueTypes } from '@m-next/types';
import { Guid } from '@m-next/utilities';
import { ValidationRuleTypes } from '@m-next/runtime-interface';
import createDropdownControl, { migrateDropdownControl } from './dropdownControl';

describe('createDropdownControl', () => {
  it('should create a dropdown control with default values', () => {
    const spy = jest.spyOn(Guid, 'create');
    spy.mockReturnValueOnce('cf1b1149-fc76-48fe-9f33-192771b58bd5');
    spy.mockReturnValueOnce('c8ba4681-25a3-4873-88f8-314feb894a99');

    const control = createDropdownControl();

    expect(control).toEqual({
      id: 'cf1b1149-fc76-48fe-9f33-192771b58bd5',
      hideCaption: true,
      caption: '',
      classes: '',
      name: 'dropdown',
      widthType: 'full',
      width: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      styles: null,
      validationError: null,
      onClick: null,
      onFocus: null,
      model: {
        columns: [],
        viewName: null,
        distinct: false,
        paging: { pageNumber: 1, pageSize: 50 },
        viewFilter: {
          filterName: 'DrpFilter',
          viewName: null,
          filterId: 'c8ba4681-25a3-4873-88f8-314feb894a99',
          expression: [],
          isDefault: true,
          sorting: [],
        },
      },
      type: widgets.DROPDOWN,
      typeOverride: null,
      placeholder: null,
      onBlur: null,
      onLoseFocus: null,
      onCustomRowClick: null,
      onChange: null,
      customRowText: null,
      validationRules: [{ rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false }],
      height: null,
      isWorking: false,
    });
  });

  it('should create a dropdown control with provided base values', () => {
    const spy = jest.spyOn(Guid, 'create');
    spy.mockReturnValueOnce('cf1b1149-fc76-48fe-9f33-192771b58bd5');
    spy.mockReturnValueOnce('c8ba4681-25a3-4873-88f8-314feb894a99');
    const base = {
      id: 'cf1b1149-fc76-48fe-9f33-192771b58bd5',
      hideCaption: false,
      caption: 'Test Caption',
      classes: 'test-class',
      name: 'test-dropdown',
      widthType: 'fixed',
      width: 100,
      visible: false,
      disabled: true,
      isBound: true,
      defaultValue: 'test-value',
    };

    const control = createDropdownControl(base);

    expect(control).toMatchObject({
      id: 'cf1b1149-fc76-48fe-9f33-192771b58bd5',
      hideCaption: false,
      caption: 'Test Caption',
      classes: 'test-class',
      name: 'test-dropdown',
      widthType: 'fixed',
      width: 100,
      visible: false,
      disabled: true,
      isBound: true,
      type: widgets.DROPDOWN,
      placeholder: null,
      onBlur: null,
      onLoseFocus: null,
      onCustomRowClick: null,
      onChange: null,
      customRowText: null,
      validationRules: [{ rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false }],
      height: null,
    });
  });

  it('should create a dropdown control with provided data values', () => {
    const spy = jest.spyOn(Guid, 'create');
    spy.mockReturnValueOnce('cf1b1149-fc76-48fe-9f33-192771b58bd5');
    spy.mockReturnValueOnce('c8ba4681-25a3-4873-88f8-314feb894a99');
    spy.mockReturnValueOnce('d8ba4681-25a3-4873-88f8-314feb894a99');
    spy.mockReturnValueOnce('e8ba4681-25a3-4873-88f8-314feb894a99');
    const data = {
      placeholder: 'Select an option',
      model: {
        columns: ['col1', 'col2'],
        viewName: 'testView',
        distinct: true,
        paging: { pageNumber: 2, pageSize: 20 },
        viewFilter: { filterName: 'CustomFilter', viewName: 'testView' },
      },
      validationRules: [{ rule: ValidationRuleTypes.Required, value: true, canDelete: false }],
      onBlur: null,
      onLoseFocus: null,
      onCustomRowClick: 'e8ba4681-25a3-4873-88f8-314feb894a99',
      onChange: 'd8ba4681-25a3-4873-88f8-314feb894a99',
      customRowText: 'Custom Row',
    };

    const control = createDropdownControl({}, data);

    expect(control).toMatchObject({
      id: 'c8ba4681-25a3-4873-88f8-314feb894a99',
      hideCaption: true,
      caption: '',
      classes: '',
      name: 'dropdown',
      widthType: 'auto',
      width: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      model: {
        columns: ['col1', 'col2'],
        viewName: 'testView',
        distinct: true,
        paging: { pageNumber: 2, pageSize: 20 },
        viewFilter: { filterName: 'CustomFilter', viewName: 'testView' },
      },
      type: widgets.DROPDOWN,
      placeholder: 'Select an option',
      validationRules: [
        { rule: ValidationRuleTypes.Required, value: true, canDelete: false },
        { rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false },
      ],
      onBlur: null,
      onLoseFocus: null,
      onCustomRowClick: 'e8ba4681-25a3-4873-88f8-314feb894a99',
      onChange: 'd8ba4681-25a3-4873-88f8-314feb894a99',
      customRowText: 'Custom Row',
      height: null,
    });
  });

  describe('migrateDropdownControl', () => {
    it('should return null if the control version matches the current version', () => {
      const oldControl = {
        version: '2.0.1',
        defaultValue: null,
      };

      const result = migrateDropdownControl(oldControl);

      expect(result).toBeNull();
    });

    it('should update the version and transform defaultValue if it is a string', () => {
      const oldControl = {
        version: '1.0.0',
        defaultValue: 'test-value',
      };

      const result = migrateDropdownControl(oldControl);

      expect(result).toEqual({
        version: '2.0.1',
        defaultValue: {
          value: 'test-value',
          valueType: complexValueTypes.Text,
        },
        validationRules: [{ rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false }],
      });
    });

    it('should update the version without modifying defaultValue if it is not a string', () => {
      const oldControl = {
        version: '1.0.0',
        defaultValue: { value: 'test-value', valueType: complexValueTypes.Text },
      };

      const result = migrateDropdownControl(oldControl);

      expect(result).toEqual({
        version: '2.0.1',
        defaultValue: { value: 'test-value', valueType: complexValueTypes.Text },
        validationRules: [{ rule: ValidationRuleTypes.MaliciousValues, value: true, canDelete: false }],
      });
    });
  });
});
