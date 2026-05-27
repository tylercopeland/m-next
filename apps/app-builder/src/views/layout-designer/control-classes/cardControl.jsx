import { widgets } from '@m-next/types';
import { createBaseControl } from '@m-next/runtime-interface';


export const createCardControl = (
  base = {
    id: null,
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
  },
  data = {
    onClick: null,
    avatar: null,
    field1: null,
    field2: null,
    field3: null,
    field4: null,
    field5: null,
    field6: null,
  },
) => ({
  ...createBaseControl(base),
  type: widgets.CARD,
  onClick: data.onClick || null,
  avatar: data.avatar || null,
  field1: data.field1 || null,
  field2: data.field2 || null,
  field3: data.field3 || null,
  field4: data.field4 || null,
  field5: data.field5 || null,
  field6: data.field6 || null,
});

export default createCardControl;
