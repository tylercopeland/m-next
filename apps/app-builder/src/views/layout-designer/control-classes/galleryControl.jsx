import { widgets, FieldTypeIds } from '@m-next/types';
import { createBaseControl, createBaseFilter } from '@m-next/runtime-interface';

export const createGalleryControl = (
  base = {
    id: null,
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
  },
  data = {
    onClick: null,
    filterDef: null,
    model: {
      imageField: null,
      captionField: null,
      baseTable: null,
      viewName: null,
      viewFilter: null,
      columns: [],
    },
  },
) => {
  const defaultControl = {
    ...createBaseControl(base),
    type: widgets.GALLERY,
    onClick: data.onClick || null,
    filterDef: data.filterDef || null,
    model: {
      imageField: data.model?.imageField || null,
      captionField: data.model?.captionField || null,
      baseTable: data.model?.baseTable || null,
      viewName: data.model?.viewName || null,
      viewFilter: data.model?.viewFilter || null,
      columns: data.model?.columns || [],
    },
  };

  if (!defaultControl.model.viewFilter) {
    const filter = createBaseFilter({ filterName: 'DrpFilter', viewName: data?.viewName });
    defaultControl.model.viewFilter = filter;
    defaultControl.filterDef = [filter];
  }

  if (defaultControl.model.columns.length === 0) {
    defaultControl.model.columns = [{ name: 'RecordID', caption: 'RecordID', fieldType: FieldTypeIds.Integer, format: { visible: false } }];
  }
  return defaultControl;
};

export const migrateGalleryControl = (control) => {
  let migrated = false;
  const update = { ...control };
  if (!update.model) {
    update.model = {
      imageField: null,
      captionField: null,
      baseTable: null,
      viewName: null,
      viewFilter: null,
      columns: [],
    };
    migrated = true;
  }

  if (!update.model.viewFilter) {
    const filter = createBaseFilter({ filterName: 'DrpFilter', viewName: 'Contacts' });
    update.model.viewFilter = filter;
    update.filterDef = [filter];
  }

  if (!update.model.columns || update.model.columns.length === 0) {
    update.model.columns = [{ name: 'RecordID', caption: 'RecordID', fieldType: FieldTypeIds.Integer, format: { visible: false } }];
  }

  return migrated ? update : null;
};

export const resetGalleryControl = (id, name, caption, viewName, existingControl) => {

  const updated = createGalleryControl();
  updated.id = id;
  updated.caption = caption || 'Gallery';
  updated.model.viewName = viewName || '';
  updated.name = name || 'Gallery';

  // 🔧 FIX: Preserve dimensions and other layout properties from existing control
  if (existingControl) {
    updated.width = existingControl.width;
    updated.height = existingControl.height;
    updated.x = existingControl.x;
    updated.y = existingControl.y;
    updated.widthType = existingControl.widthType;
  }

  return updated;
};

export default createGalleryControl;
