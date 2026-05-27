import { widgets } from '@m-next/types';
import { Guid } from '@m-next/utilities';
import createGalleryControl from './galleryControl';

describe('createGalleryControl', () => {
  beforeEach(() => {
    const spy = jest.spyOn(Guid, 'create');
    spy.mockReturnValueOnce('cf1b1149-fc76-48fe-9f33-192771b58bd5');
    spy.mockReturnValueOnce('c8ba4681-25a3-4873-88f8-314feb894a99');
  });
  it('should create a gallery control with default values', () => {
    const control = createGalleryControl();

    expect(control).toEqual({
      id: expect.any(String),
      type: widgets.GALLERY,
      typeOverride: null,
      hideCaption: true,
      caption: '',
      classes: '',
      name: 'Gallery',
      widthType: 'auto',
      width: null,
      visible: true,
      disabled: false,
      isBound: false,
      defaultValue: null,
      onClick: null,
      height: null,
      isWorking: false,
      onFocus: null,
      styles: null,
      validationError: null,
      validationRules: null,
      filterDef: [
        {
          expression: [],
          filterId: 'c8ba4681-25a3-4873-88f8-314feb894a99',
          filterName: 'DrpFilter',
          isDefault: true,
          sorting: [],
          viewName: null,
        },
      ],
      model: {
        imageField: null,
        captionField: null,
        baseTable: null,
        viewName: null,
        viewFilter: {
          expression: [],
          filterId: 'c8ba4681-25a3-4873-88f8-314feb894a99',
          filterName: 'DrpFilter',
          isDefault: true,
          sorting: [],
          viewName: null,
        },
        columns: [
          {
            caption: 'RecordID',
            fieldType: 2,
            format: { visible: false },
            name: 'RecordID',
          },
        ],
      },
    });
  });

  it('should create a gallery control with custom values', () => {
    const base = {
      id: 'test-id',
      hideCaption: false,
      caption: 'Test Gallery',
      classes: 'custom-class',
      name: 'custom-gallery',
      widthType: 'fixed',
      width: '200px',
      visible: false,
      disabled: true,
      isBound: true,
      defaultValue: 'default',
      filterDef: null,
        height: null,
 };

    const data = {
      onClick: 'handleClick',
      model: {
        imageField: 'image',
        captionField: 'caption',
        baseTable: 'products',
        viewName: 'ProductsView',
        viewFilter: { id: 'filter1' },
        columns: [
          {
            caption: 'RecordID',
            name: 'RecordID',
          },
        ],
      },
    };

    const control = createGalleryControl(base, data);

    expect(control).toEqual({
      ...base,
      type: widgets.GALLERY,
      typeOverride: null,
      onClick: data.onClick,
      model: data.model,
      isWorking: false, // Assuming isWorking is a default property
      onFocus: null,
      styles: null,
      validationError: null,
      validationRules: null,
    });
  });

  it('should handle partial model data', () => {
    const data = {
      model: {
        imageField: 'image',
        captionField: 'caption',
      },
    };

    const control = createGalleryControl(undefined, data);

    expect(control.model).toEqual({
      imageField: 'image',
      captionField: 'caption',
      baseTable: null,
      viewName: null,
      viewFilter: {
        expression: [],
        filterId: 'c8ba4681-25a3-4873-88f8-314feb894a99',
        filterName: 'DrpFilter',
        isDefault: true,
        sorting: [],
        viewName: null,
      },
      columns: [
        {
          caption: 'RecordID',
          fieldType: 2,
          format: { visible: false },
          name: 'RecordID',
        },
      ],
    });
  });
});
