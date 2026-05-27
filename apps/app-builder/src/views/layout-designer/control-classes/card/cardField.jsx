import { FieldTypeNames } from "@m-next/types";

export const createCardField = (
  data = {
    name: null,
    caption: null,
    type: FieldTypeNames.Text,
    formula: null,
    showCaption: false,
    displayAs: null,

    displayOptions: {},
  },
) => {
  const field = {
    name: data.name || null,
    caption: data.caption || null,
    type: data.type || FieldTypeNames.Text,
    formula: data.formula || null,
    showCaption: data.showCaption || false,
    displayAs: data.displayAs || null,

    displayOptions: data.displayOptions || {},
  };

  return field;
};

export default createCardField;
