import { DateFormatTypes, FieldTypeNames } from '@m-next/types';
import { Guid } from '@m-next/utilities';

const getDefaultDrilldownColumns = (tableName) => {
  switch (tableName) {
    case 'Item':
      return [
        {
          name: 'FullName',
          caption: 'Full name',
          type:  FieldTypeNames.Text,
        },
        {
          name: 'SalesDesc',
          caption: 'Sales desc',
          type: FieldTypeNames.Text,
        },
        {
          name: 'ItemType',
          caption: 'Item type',
          type: FieldTypeNames.Text,
        },
        {
          name: 'QuantityOnHand',
          caption: 'Quantity on hand',
          type: FieldTypeNames.Decimal,
        },
        {
          name: 'QuantityOnSalesOrder',
          caption: 'Quantity on sales order',
          type: FieldTypeNames.Decimal,
        },
        {
          name: 'QuantityOnOrder',
          caption: 'Quantity on order',
          type: FieldTypeNames.Decimal,
        },
        {
          name: 'SalesPrice',
          caption: 'Sales price',
          type: FieldTypeNames.Decimal,
        },
        {
          name: 'UnitOfMeasureSet',
          caption: 'Unit of measure set',
          type: FieldTypeNames.DropDown,
        },
      ];

    case 'Invoice':
      return [
        {
          name: 'TxnDate',
          caption: 'Txn date',
          type: FieldTypeNames.DateTime,
          displayOptions: { dateFormat: DateFormatTypes.ShortDate },
        },
        {
          name: 'Customer',
          caption: 'Customer',
          type: FieldTypeNames.DropDown,
        },
        {
          name: 'RefNumber',
          caption: 'Ref number',
          type: FieldTypeNames.Text,
        },
        {
          name: 'Memo',
          caption: 'Memo',
          type: FieldTypeNames.Text,
        },
        {
          name: 'Amount',
          caption: 'Amount',
          type: FieldTypeNames.Money,
          displayOptions: { decimalRounding: 2 },
        },
        {
          name: 'BalanceRemaining',
          caption: 'Balance remaining',
          type: FieldTypeNames.Money,
          displayOptions: { decimalRounding: 2 },
        },
        {
          name: 'Currency',
          caption: 'Currency',
          type: FieldTypeNames.DropDown,
        },
        {
          name: 'TagList',
          caption: 'Tag list',
          type: FieldTypeNames.Tags,
        },
      ];
    case 'SalesReceipt':
    case 'Estimate':
    case 'SalesOrder':
    case 'ReceivePayment':
      return [
        {
          name: 'TxnDate',
          caption: 'Txn date',
          type: FieldTypeNames.DateTime,
          displayOptions: { dateFormat: DateFormatTypes.ShortDate },
        },
        {
          name: 'Customer',
          caption: 'Customer',
          type: FieldTypeNames.DropDown,
        },
        {
          name: 'RefNumber',
          caption: 'Ref number',
          type: FieldTypeNames.Text,
        },
        {
          name: 'Memo',
          caption: 'Memo',
          type: FieldTypeNames.Text,
        },
        {
          name: 'TotalAmount',
          caption: 'Total amount',
          type: FieldTypeNames.Money,
          displayOptions: { decimalRounding: 2 },
        },
        {
          name: 'Currency',
          caption: 'Currency',
          type: FieldTypeNames.DropDown,
        },
        {
          name: 'TagList',
          caption: 'Tag list',
          type: FieldTypeNames.Tags,
        },
      ];
    case 'Activity':
      return [
        {
          name: 'DueDateStart',
          caption: 'Due date start',
          type: FieldTypeNames.DateTime,
        },
        {
          name: 'ContactsName',
          caption: 'Contacts name',
          type: FieldTypeNames.Text,
        },
        {
          name: 'ActivityType',
          caption: 'Activity type',
          type: FieldTypeNames.DropDown,
        },
        {
          name: 'Comments',
          caption: 'Comments',
          type: FieldTypeNames.Text,
        },
        {
          name: 'FollowUpFromActivityComments',
          caption: 'Follow up from activity comments',
          type: FieldTypeNames.Text,
        },
        {
          name: 'TagList',
          caption: 'Tag list',
          type: FieldTypeNames.Tags,
        },
      ];
    case 'Opportunity':
      return [
        {
          name: 'CloseDate',
          caption: 'Close date',
          type: FieldTypeNames.DateTime,
        },
        {
          name: 'AssignedTo',
          caption: 'Assigned to',
          type: FieldTypeNames.DropDown,
        },
        {
          name: 'ContactName',
          caption: 'Contact name',
          type: FieldTypeNames.Text,
        },
        {
          name: 'OpportunityStage',
          caption: 'Opportunity stage',
          type: FieldTypeNames.DropDown,
        },
        {
          name: 'Amount',
          caption: 'Amount',
          type: FieldTypeNames.Money,
          displayOptions: { decimalRounding: 2 },
        },
        {
          name: 'ExpectedRevenue',
          caption: 'Expected revenue',
          type: FieldTypeNames.Money,
          displayOptions: { decimalRounding: 2 },
        },
        {
          name: 'LastActivityCompletedDate',
          caption: 'Last activity completed date',
          type: FieldTypeNames.DateTime,
        },
        {
          name: 'NextActivityDueDate',
          caption: 'Next activity due date',
          type: FieldTypeNames.DateTime,
        },
      ];
    case 'Proposal':
      return [
        {
          name: 'AssignedTo',
          caption: 'Assigned to',
          type: FieldTypeNames.DropDown,
        },
        {
          name: 'ContactsName',
          caption: 'Contacts name',
          type: FieldTypeNames.Text,
        },
        {
          name: 'ProposalName',
          caption: 'Proposal name',
          type: FieldTypeNames.Text,
        },
        {
          name: 'StartDate',
          caption: 'Start date',
          type: FieldTypeNames.DateTime,
        },
        {
          name: 'EndDate',
          caption: 'End date',
          type: FieldTypeNames.DateTime,
        },
        {
          name: 'TotalAmount',
          caption: 'Total amount',
          type: FieldTypeNames.Money,
          displayOptions: { decimalRounding: 2 },
        },
        {
          name: 'TagList',
          caption: 'Tag list',
          type: FieldTypeNames.Tags,
        },
      ];
    case 'TimeTracking':
      return [
        {
          name: 'TxnDate',
          caption: 'Txn date',
          type: FieldTypeNames.DateTime,
          displayOptions: { dateFormat: DateFormatTypes.ShortDate },
        },
        {
          name: 'Entity',
          caption: 'Entity',
          type: FieldTypeNames.DropDown,
        },
        {
          name: 'Customer',
          caption: 'Customer',
          type: FieldTypeNames.DropDown,
        },
        {
          name: 'Item',
          caption: 'Item',
          type: FieldTypeNames.Text,
        },
        {
          name: 'DurationHours',
          caption: 'Duration hours',
          type: FieldTypeNames.Decimal,
        },
        {
          name: 'DurationMinutes',
          caption: 'Duration minutes',
          type: FieldTypeNames.Decimal,
        },
      ];
    case 'PurchaseOrder':
      return [
        {
          name: 'TxnDate',
          caption: 'Txn date',
          type: FieldTypeNames.DateTime,
          displayOptions: { dateFormat: DateFormatTypes.ShortDate },
        },
        {
          name: 'Vendor',
          caption: 'Vendor',
          type: FieldTypeNames.DropDown,
        },
        {
          name: 'RefNumber',
          caption: 'Ref Number',
          type: FieldTypeNames.Text,
        },
        {
          name: 'Memo',
          caption: 'Memo',
          type: FieldTypeNames.Text,
        },
        {
          name: 'TotalAmount',
          caption: 'Total amount',
          type: FieldTypeNames.Money,
          displayOptions: { decimalRounding: 2 },
        },
        {
          name: 'Currency',
          caption: 'Currency',
          type: FieldTypeNames.DropDown,
        },
        {
          name: 'TagList',
          caption: 'Tag list',
          type: FieldTypeNames.Tags,
        },
      ];
    case 'Bill':
      return [
        {
          name: 'TxnDate',
          caption: 'Txn date',
          type: FieldTypeNames.DateTime,
          displayOptions: { dateFormat: DateFormatTypes.ShortDate },
        },
        {
          name: 'Vendor',
          caption: 'Vendor',
          type: FieldTypeNames.DropDown,
        },
        {
          name: 'RefNumber',
          caption: 'Ref Number',
          type: FieldTypeNames.Text,
        },
        {
          name: 'Memo',
          caption: 'Memo',
          type: FieldTypeNames.Text,
        },
        {
          name: 'AmountDue',
          caption: 'Amount due',
          type: FieldTypeNames.Money,
          displayOptions: { decimalRounding: 2 },
        },
        {
          name: 'TagList',
          caption: 'Tag list',
          type: FieldTypeNames.Tags,
        },
      ];
    default:
      return null;
  }
};

const getDefaultDrilldownSorting = (tableName) => {
  switch (tableName) {
    case 'Item':
      return { sortField: 'FullName', sortType: 1 };
    case 'Invoice':
    case 'SalesReceipt':
    case 'Estimate':
    case 'SalesOrder':
    case 'ReceivePayment':
    case 'TimeTracking':
    case 'PurchaseOrder':
    case 'Bill':
      return { sortField: 'TxnDate', sortType: 1 };
    case 'Activity':
      return { sortField: 'DueDateStart', sortType: 1 };
    case 'Opportunity':
      return { sortField: 'CloseDate', sortType: 1 };
    case 'Proposal':
      return { sortField: 'StartDate', sortType: 1 };
    default:
      return null;
  }
};
const getDefaultProjection = (tableName) => {
  const fields = getDefaultDrilldownColumns(tableName);
  const sorting = getDefaultDrilldownSorting(tableName);
  if (fields !== null)
    return {
      id: Guid.create(),
      fields,
      sorting: [sorting],
    };

  return null;
};

export default getDefaultProjection;
