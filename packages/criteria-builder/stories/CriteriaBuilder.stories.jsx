import { basicOperationId, complexValueTypes } from '@m-next/types';
import { formatter } from '@m-next/utilities';
import QuickEdit from '../src/components/QuickEdit';

import fieldList from '../testing/data/fieldListActivities.json';
import controlList from '../testing/data/controlList.json';

export default {
  component: QuickEdit,
  title: 'm-one/CriteriaBuilder',
  argTypes: {},
  parameters: {
    cssresources: [
      {
        id: `Method Styles`,
        code: `<link rel="stylesheet" type="text/css" href="https://alocetsystem.method.me/apps/public/styles/styles.min.css"></link>`,
        picked: true,
      },
    ],
  },
};

export const QuickEditor = {
  args: {
    id: 'quick-edit-filter',
    fieldList: [...fieldList],
    controlList: { ...controlList },
    elementKey: 'elKey',
    anchorEl: 'body',
    fieldListOptions: formatter.formatFieldList(fieldList, 'Activity', null, {}, null),
    first: {
      value: 'Comments',
      type: complexValueTypes.Field,
      property: null,
      childProperty: null,
    },
    second: {
      value: 'Dog',
      type: complexValueTypes.Text,
      property: null,
      childProperty: null,
    },
    operation: basicOperationId.Contains,
    index: 0,
    set: 0,
    ghost: false,
    open: true,
  },
};
