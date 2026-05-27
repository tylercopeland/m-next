import { FieldTypeIds } from './fieldTypes';
import { fieldTypeIcons } from './iconLookup';

export const complexControlOptions = {
  DRP: [
    { property: 'Text', label: 'Display', fieldType: FieldTypeIds.Text, icon: fieldTypeIcons.Text },
    { property: 'Value', label: 'Id', fieldType: FieldTypeIds.Integer, icon: fieldTypeIcons.Integer },
  ],
  CAL: [
    { property: 'Title', label: 'Title', fieldType: FieldTypeIds.Text, icon: fieldTypeIcons.Text },
    { property: 'Description', label: 'Description', fieldType: FieldTypeIds.Text, icon: fieldTypeIcons.Text },
    { property: 'ActivityStatus', label: 'Status', fieldType: FieldTypeIds.Text, icon: fieldTypeIcons.Text },
    {
      property: 'Startdate',
      label: 'Start date and time',
      fieldType: FieldTypeIds.DateTime,
      icon: fieldTypeIcons.DateTime,
    },
    {
      property: 'Enddate',
      label: 'End date and time',
      fieldType: FieldTypeIds.DateTime,
      icon: fieldTypeIcons.DateTime,
    },
    { property: 'Resource', label: 'Resource', fieldType: FieldTypeIds.Integer, icon: fieldTypeIcons.Integer },
    { property: 'RecordID', label: 'Selected Id', fieldType: FieldTypeIds.Integer, icon: fieldTypeIcons.Integer },
  ],
  CHT: [
    { property: 'PrimaryAxis', label: 'Primary axis', fieldType: FieldTypeIds.Text, icon: fieldTypeIcons.Text },
    { property: 'RecordID', label: 'Selected Id', fieldType: FieldTypeIds.Integer, icon: fieldTypeIcons.Integer },
  ],
  ADR: [
    {
      property: 'StreetAddress',
      label: 'Street address',
      readOnly: true,
      fieldType: FieldTypeIds.Text,
      icon: fieldTypeIcons.Text,
    },
    { property: 'City', label: 'City', readOnly: true, fieldType: FieldTypeIds.Text, icon: fieldTypeIcons.Text },
    {
      property: 'StateProvince',
      label: 'State province',
      readOnly: true,
      fieldType: FieldTypeIds.Text,
      icon: fieldTypeIcons.Text,
    },
    {
      property: 'ZipPostalCode',
      label: 'Zip/postal code',
      readOnly: true,
      fieldType: FieldTypeIds.Text,
      icon: fieldTypeIcons.Text,
    },
    { property: 'Country', label: 'Country', readOnly: true, fieldType: FieldTypeIds.Text, icon: fieldTypeIcons.Text },
    {
      property: 'Latitude',
      label: 'Latitude',
      readOnly: true,
      fieldType: FieldTypeIds.Text,
      icon: fieldTypeIcons.Text,
    },
    {
      property: 'Longitude',
      label: 'Longitude',
      readOnly: true,
      fieldType: FieldTypeIds.Text,
      icon: fieldTypeIcons.Text,
    },
  ],
  SIG: [
    {
      property: 'SignedName',
      label: 'Signed name',
      readOnly: true,
      fieldType: FieldTypeIds.Text,
      icon: fieldTypeIcons.Text,
    },
    {
      property: 'IPAddress',
      label: 'IP address',
      readOnly: true,
      fieldType: FieldTypeIds.Text,
      icon: fieldTypeIcons.Text,
    },
    {
      property: 'SignedDateTime',
      label: 'Signed dateTime',
      readOnly: true,
      fieldType: FieldTypeIds.DateTime,
      icon: fieldTypeIcons.DateTime,
    },
    {
      property: 'SignatureUrl',
      label: 'Signature url',
      readOnly: true,
      fieldType: FieldTypeIds.Text,
      icon: fieldTypeIcons.Text,
    },
    {
      property: 'ScreenCaptureUrl',
      label: 'Screen capture url',
      readOnly: true,
      fieldType: FieldTypeIds.Text,
      icon: fieldTypeIcons.Text,
    },
  ],
  PAY: [
    {
      property: 'IsValid',
      label: 'Is valid',
      readOnly: true,
      fieldType: FieldTypeIds.YesNo,
      icon: fieldTypeIcons.YesNo,
    },
    { property: 'CardHolderName', label: 'Card holder bame', fieldType: FieldTypeIds.Text, icon: fieldTypeIcons.Text },
    {
      property: 'MaskedCreditCardNumber',
      label: 'Masked credit card number',
      readOnly: true,
      fieldType: FieldTypeIds.Text,
      icon: fieldTypeIcons.Text,
    },
    {
      property: 'ExpiryMonth',
      label: 'Expiry month',
      readOnly: true,
      fieldType: FieldTypeIds.Integer,
      icon: fieldTypeIcons.Integer,
    },
    {
      property: 'ExpiryYear',
      label: 'Expiry year',
      readOnly: true,
      fieldType: FieldTypeIds.Integer,
      icon: fieldTypeIcons.Integer,
    },
  ],
};

export default complexControlOptions;
