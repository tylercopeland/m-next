import { basicOperationId, complexValueTypes } from '@m-next/types';
import { formatter } from '@m-next/utilities';

import fieldList from '../testing/data/fieldListActivities.json';
import controlList from '../testing/data/controlList.json';
import { AdvancedEdit } from '../src';

export default {
  component: AdvancedEdit,
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

export const AdvancedEditor = {
  args: {
    id: 'advanced-edit-filter',
    fieldList: [...fieldList],
    controlList: { ...controlList },
    elementKey: 'elKey',
    anchorEl: 'body',
    fieldListOptions: formatter.formatFieldList(fieldList, 'Activity', null, {}, null),
    onConnectorChange: () => {},
    onPredicateChange: () => {},
    onPredicateDelete: () => {},
    onClose: () => {},
    onCancel: () => {},
    onAddGroup: () => {},
    onReorder: () => {},
    open: true,
    formattedExpression: [
      {
        connector: basicOperationId.And,
        expression: [
          {
            first: {
              value: 'ContactName',
              type: complexValueTypes.Field,
            },
            operation: basicOperationId.Is,
            second: { type: complexValueTypes.Text, value: 'Bruce Wayne' },
          },
          {
            first: {
              value: 'CreatedDate',
              type: complexValueTypes.Field,
            },
            operation: basicOperationId.Between,
            second: { type: complexValueTypes.Date, value: '2024-06-03T08:00' },
            third: { type: complexValueTypes.Date, value: '2024-10-03T08:00' },
          },
          {
            first: {
              value: 'ActualStartDate',
              type: complexValueTypes.Field,
            },
            operation: basicOperationId.Between,
            second: { type: complexValueTypes.Time, value: '2024-06-03T08:00' },
            third: { type: complexValueTypes.Time, value: '2024-06-03T08:10' },
          },
        ],
      },
    ],
    includeControls: false,
    includeSessionVariables: false,
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    splitValues: true,
  },
};
