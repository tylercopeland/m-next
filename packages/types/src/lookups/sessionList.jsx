import { FieldTypeIds, FieldTypeNames } from './fieldTypes';
import { fieldTypeIcons } from './iconLookup';

export const sessionLookup = {
  emailcontactrecordid: 'Contact Id',
  emailentityrecordid: 'Entity Id',
  contactrecordid: 'Contact Id',
  entityfullname: 'Entity name',
  entityrecordid: 'Entity Id',
  activerecordid: 'Current record Id',
  sharedlistentity: 'Entity Id',
  sharedlistsalesrep: 'Sales Rep Id',
  sharedlistuser: 'User Id',
  currentdatetime: 'Current date/time',
  userrecordid: 'Record ID',
  companyaccountcurrency: 'Company Account Currency',
  username: 'UserName',
  accountingsoftware: 'Accounting Software',
  masteradminuserrecordid: 'Master Admin Record ID',
  hasadminpermissions: 'Has Admin Permissions',
  usersalesrepinitial: 'Sales Rep Initial',
  useremailsignature: 'Email Signature',
  clientipaddress: 'IP Address',
  usertype: 'Type',
  accountname: 'Account Name',
  ispaymentconnected: 'Has Payments Setup',
  quickbookssyncregion: 'QuickBooks Sync Region',
  methodidemail: 'Method Identity Email',
  methodidname: 'Method Identity Name',
  smstier: 'SMS Pricing Tier',
  smsremaining: 'Remaining SMS',
  companyemailprovider: 'Email Provider',
  smsenabled: 'SMS Enabled',
  methodremainingemails: 'Remaining Emails',
  emailtier: 'Email Pricing Tier',
};

export const sessionValues = [
  {
    label: 'Email gadget',
    options: [
      {
        value: 'emailcontactrecordid',
        label: 'Contact Id',
        fieldType: FieldTypeIds.Integer,
        icon: fieldTypeIcons.Integer,
      },
      {
        value: 'emailentityrecordid',
        label: 'Entity Id',
        fieldType: FieldTypeIds.Integer,
        icon: fieldTypeIcons.Integer,
      },
    ],
  },
  {
    label: 'Portal page',
    options: [
      { value: 'contactrecordid', label: 'Contact Id', fieldType: FieldTypeIds.Integer, icon: fieldTypeIcons.Integer },
      { value: 'entityfullname', label: 'Entity name', fieldType: FieldTypeIds.Text, icon: fieldTypeIcons.Text },
      { value: 'entityrecordid', label: 'Entity Id', fieldType: FieldTypeIds.Integer, icon: fieldTypeIcons.Integer },
    ],
  },
  {
    label: 'Screen',
    options: [
      {
        value: 'activerecordid',
        label: 'Current record Id',
        fieldType: FieldTypeIds.Integer,
        icon: fieldTypeIcons.Integer,
      },
    ],
  },
  {
    label: 'User',
    options: [
      {
        value: 'userrecordid',
        label: 'Record ID',
        fieldType: FieldTypeIds.Integer,
        icon: fieldTypeIcons.Integer,
      },
      {
        value: 'username',
        label: 'UserName',
        fieldType: FieldTypeIds.Text,
        icon: fieldTypeIcons.Text,
      },
      {
        value: 'masteradminuserrecordid',
        label: 'Master Admin Record ID',
        fieldType: FieldTypeIds.Integer,
        icon: fieldTypeIcons.Integer,
      },
      {
        value: 'hasadminpermissions',
        label: 'Has Admin Permissions',
        fieldType: FieldTypeIds.YesNo,
        icon: fieldTypeIcons.YesNo,
      },
      {
        value: 'usersalesrepinitial',
        label: 'Sales Rep Initial',
        fieldType: FieldTypeIds.Text,
        icon: fieldTypeIcons.Text,
      },
      {
        value: 'useremailsignature',
        label: 'Email Signature',
        fieldType: FieldTypeIds.Text,
        icon: fieldTypeIcons.Text,
      },
      {
        value: 'clientipaddress',
        label: 'IP Address',
        fieldType: FieldTypeIds.Integer,
        icon: fieldTypeIcons.Integer,
      },
      {
        value: 'usertype',
        label: 'Type',
        fieldType: FieldTypeIds.Text,
        icon: fieldTypeIcons.Text,
      },
    ],
  },
  {
    label: 'Account',
    options: [
      {
        value: 'accountingsoftware',
        label: 'Accounting Software',
        fieldType: FieldTypeIds.Text,
        icon: fieldTypeIcons.Text,
      },
      {
        value: 'accountname',
        label: 'Account Name',
        fieldType: FieldTypeIds.Text,
        icon: fieldTypeIcons.Text,
      },
      {
        value: 'ispaymentconnected',
        label: 'Has Payments Setup',
        fieldType: FieldTypeIds.YesNo,
        icon: fieldTypeIcons.YesNo,
      },
      {
        value: 'quickbookssyncregion',
        label: 'QuickBooks Sync Region',
        fieldType: FieldTypeIds.Text,
        icon: fieldTypeIcons.Text,
      },
    ],
  },
  {
    label: 'Company',
    options: [
      {
        value: 'companyaccountcurrency',
        label: 'Account Currency',
        fieldType: FieldTypeIds.Text,
        icon: fieldTypeIcons.Text,
      },
      {
        value: 'smstier',
        label: 'SMS Pricing Tier',
        fieldType: FieldTypeIds.Text,
        icon: fieldTypeIcons.Text,
      },
      {
        value: 'smsremaining',
        label: 'Remaining SMS',
        fieldType: FieldTypeIds.Integer,
        icon: fieldTypeIcons.Integer,
      },
      {
        value: 'companyemailprovider',
        label: 'Email Provider',
        fieldType: FieldTypeIds.Text,
        icon: fieldTypeIcons.Text,
      },
      {
        value: 'smsenabled',
        label: 'SMS Enabled',
        fieldType: FieldTypeIds.YesNo,
        icon: fieldTypeIcons.YesNo,
      },
      {
        value: 'methodremainingemails',
        label: 'Remaining Emails',
        fieldType: FieldTypeIds.Integer,
        icon: fieldTypeIcons.Integer,
      },
      {
        value: 'emailtier',
        label: 'Email Pricing Tier',
        fieldType: FieldTypeIds.Text,
        icon: fieldTypeIcons.Text,
      },
    ],
  },
  {
    label: 'Method Identity',
    options: [
      {
        value: 'methodidemail',
        label: 'Method Identity Email',
        fieldType: FieldTypeIds.Text,
        icon: fieldTypeIcons.Text,
      },
      {
        value: 'methodidname',
        label: 'Method Identity Name',
        fieldType: FieldTypeIds.Text,
        icon: fieldTypeIcons.Text,
      },
    ],
  },
  {
    label: 'Shared users listed by',
    options: [
      { value: 'sharedlistentity', label: 'Entity Id', fieldType: FieldTypeIds.Integer, icon: fieldTypeIcons.Integer },
      {
        value: 'sharedlistsalesrep',
        label: 'Sales Rep Id',
        fieldType: FieldTypeIds.Integer,
        icon: fieldTypeIcons.Integer,
      },
      { value: 'sharedlistuser', label: 'User Id', fieldType: FieldTypeIds.Integer, icon: fieldTypeIcons.Integer },
    ],
  },
];

export const getSessionValues = (fieldType) => {
  if (fieldType === FieldTypeNames.DateTime) {
    return [
      {
        label: 'Screen',
        options: [
          {
            value: 'currentdatetime',
            label: 'Current date/time',
            fieldType: FieldTypeIds.DateTime,
            icon: fieldTypeIcons.DateTime,
          },
        ],
      },
    ];
  }

  return sessionValues;
};

export default sessionValues;
