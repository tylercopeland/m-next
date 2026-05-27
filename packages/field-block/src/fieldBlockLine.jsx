import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldTypeNames, Tag } from '@m-next/types';

import * as s from './fieldBlock.styles';
import CheckboxField from './components/CheckboxField';
import TextField from './components/TextField';
import DateTimeField from './components/DateTimeField';
import TagsField from './components/TagsField';
import TextIconField from './components/TextIconField';
import AddressField from './components/AddressField';
import ImageField from './components/ImageField';
import DropdownField from './components/DropdownField';

const propTypes = {
  id: PropTypes.string,
  field: Field,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Object)]),
  validationError: PropTypes.string,
  displayPreferences: PropTypes.instanceOf(Object),
  tagsList: PropTypes.arrayOf(Tag),
  onSelect: PropTypes.func,
  selected: PropTypes.string,
  mode: PropTypes.number,
  onChange: PropTypes.func,
  onLoadDropdownData: PropTypes.func,
  onImageUpload: PropTypes.func,
  onDownloadImage: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  metadata: PropTypes.instanceOf(Object),
};

function FieldBlockLine({
  id,
  field,
  value,
  validationError,
  displayPreferences,
  tagsList,
  onSelect,
  selected,
  mode,
  onChange,
  onLoadDropdownData,
  onImageUpload,
  onDownloadImage,
  options,
  metadata,
}) {
  const renderLine = () => {
    switch (field.type) {
      case FieldTypeNames.Picture:
      case FieldTypeNames.ProfileImage:
        return (
          <ImageField
            id={id}
            field={field}
            value={value}
            onSelect={onSelect}
            selected={selected}
            displayPreferences={displayPreferences}
            mode={mode}
            onChange={onChange}
            validationError={validationError}
            onImageUpload={onImageUpload}
            onDownloadImage={onDownloadImage}
            metadata={metadata}
          />
        );
      case FieldTypeNames.Tags:
        return (
          <TagsField
            id={id}
            field={field}
            value={value}
            onSelect={onSelect}
            selected={selected}
            displayPreferences={displayPreferences}
            mode={mode}
            onChange={onChange}
            validationError={validationError}
            tagsList={tagsList}
          />
        );
      case FieldTypeNames.Address:
        return (
          <AddressField
            id={id}
            field={field}
            value={value}
            onSelect={onSelect}
            selected={selected}
            displayPreferences={displayPreferences}
            mode={mode}
            onChange={onChange}
            validationError={validationError}
          />
        );
      case FieldTypeNames.Phone:
      case FieldTypeNames.Email:
      case FieldTypeNames.Website:
        return (
          <TextIconField
            id={id}
            field={field}
            value={value}
            onSelect={onSelect}
            selected={selected}
            displayPreferences={displayPreferences}
            mode={mode}
            onChange={onChange}
            validationError={validationError}
          />
        );
      case FieldTypeNames.YesNo:
        return (
          <CheckboxField
            id={id}
            field={field}
            value={value}
            onSelect={onSelect}
            selected={selected}
            displayPreferences={displayPreferences}
            mode={mode}
            onChange={onChange}
          />
        );
      case FieldTypeNames.DateTime:
        return (
          <DateTimeField
            id={id}
            field={field}
            value={value}
            onSelect={onSelect}
            selected={selected}
            displayPreferences={displayPreferences}
            mode={mode}
            onChange={onChange}
            validationError={validationError}
          />
        );
      case FieldTypeNames.DropDown:
      case FieldTypeNames.User:
        return (
          <DropdownField
            id={id}
            field={field}
            value={value}
            onSelect={onSelect}
            selected={selected}
            displayPreferences={displayPreferences}
            mode={mode}
            onChange={onChange}
            validationError={validationError}
            onLoadDropdownData={onLoadDropdownData}
            options={options}
          />
        );
      default:
        return (
          <TextField
            id={id}
            field={field}
            value={value}
            onSelect={onSelect}
            selected={selected}
            displayPreferences={displayPreferences}
            mode={mode}
            onChange={onChange}
            validationError={validationError}
          />
        );
    }
  };

  return <s.Line id={`${id}-data-block-line-${field.name}`}>{renderLine()}</s.Line>;
}

FieldBlockLine.propTypes = propTypes;
export default FieldBlockLine;
