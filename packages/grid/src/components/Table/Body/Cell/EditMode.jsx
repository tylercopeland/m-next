import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FieldTypeIds, Tag } from '@m-next/types';
import { Checkbox } from '@m-next/checkbox';
import Input from '@m-next/input';
import InputArea from '@m-next/input-area';
import Dropdown from '@m-next/dropdown';
import { EditableImage } from '@m-next/image';
import TagWidget from '@m-next/tag-widget';
import DatePicker from '@m-next/datepicker';
import SvgIcon from '@m-next/svg-icon';
import Button from '@m-next/button';
import { colors, fontSizes } from '@m-next/styles';
import Column from '../../../../ColumnPropType';
import * as s from './Cell.styles';

const propTypes = {
  column: Column,
  error: PropTypes.string,
  handleLoseFocus: PropTypes.func,
  id: PropTypes.string,
  inputElRef: PropTypes.instanceOf(Object),
  isFocused: PropTypes.bool,
  navigateGrid: PropTypes.func,
  primaryKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rowIdx: PropTypes.number,
  onKeyUp: PropTypes.func,
  updateCellData: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool, PropTypes.instanceOf(Object)]),
  onSetEditingRow: PropTypes.func,
  setEditingCell: PropTypes.func,
  editable: PropTypes.bool,
  scrollerRef: PropTypes.instanceOf(Object),
  onShowImageEditor: PropTypes.func,
  onUploadImage: PropTypes.func,
  onDownloadImage: PropTypes.func,
  tagsList: PropTypes.arrayOf(Tag),
  tagsSuggestions: PropTypes.arrayOf(PropTypes.string),
  onDisableClickOutside: PropTypes.func,
  onErrorMessageForUser: PropTypes.func,
  enrichedData: PropTypes.instanceOf(Object),
  tooltipId: PropTypes.string,
  onManageTags: PropTypes.func,
};

function EditMode({
  column,
  error = null,
  handleLoseFocus,
  id,
  inputElRef,
  isFocused = false,
  navigateGrid,
  primaryKey,
  rowIdx,
  onKeyUp = null,
  updateCellData,
  value,
  onSetEditingRow,
  setEditingCell,
  editable,
  scrollerRef,
  onShowImageEditor,
  onUploadImage,
  onDownloadImage,
  tagsList,
  tagsSuggestions,
  onDisableClickOutside,
  onErrorMessageForUser,
  enrichedData,
  tooltipId,
  onManageTags,
}) {
  // Remove Legacy Color handling once grids are all migrated to new builder
  const getFontSize = (size) => {
    switch (size) {
      case 'mi-button-small':
        return fontSizes.legacy.button.small;
      case 'mi-button-large':
        return fontSizes.legacy.button.large;
      case 'mi-button-xlarge':
        return fontSizes.legacy.button.xlarge;
      case 'mi-button-xxlarge':
        return fontSizes.legacy.button.xxlarge;
      case 'mi-button-xxxlarge':
        return fontSizes.legacy.button.xxxlarge;
      default:
        return size;
    }
  };

  // Remove Legacy Color handling once grids are all migrated to new builder
  const getTextColor = (txtColor, bgColor) => {
    if (txtColor === null || txtColor === '') {
      switch (bgColor) {
        case 'button-primary':
        case 'button-grey':
        case 'button-navigation':
        case 'button-caution':
        case 'button-success':
        case 'button-gunmetal':
        case 'button-black':
        case 'button-alert':
          return colors.white;
        case 'button-silver':
          return colors.black;
        case 'button-secondary':
        case 'button-transparent':
        case 'button-pink':
        case 'button-purple':
        case 'button-aqua':
        case 'button-yellow':
        case 'button-white':
        default:
          return colors.blue;
      }
    }

    switch (txtColor) {
      case 'mi-color-alert':
        return colors.red;
      case 'mi-color-primary':
        return colors.blue;
      case 'mi-color-navigation':
        return colors['blue-darker'];
      case 'mi-color-caution':
        return colors.yellow;
      case 'mi-color-success':
        return colors.green;
      case 'mi-color-pink':
        return colors.fuchsia;
      case 'mi-color-purple':
        return colors.purple;
      case 'mi-color-aqua':
        return colors.teal;
      case 'mi-color-yellow':
        return colors.yellow;
      case 'mi-color-grey':
        return colors['grey-light'];
      case 'mi-color-gunmetal':
        return colors['grey-dark'];
      case 'mi-color-silver':
        return colors['grey-light'];
      case 'mi-color-black':
        return colors.black;
      case 'mi-color-white':
        return colors.white;
      default:
        return txtColor;
    }
  };

  // Remove Legacy Color handling once grids are all migrated to new builder
  const getBackgroundColor = (bgColor) => {
    switch (bgColor) {
      case 'button-alert':
        return colors.red;
      case 'button-primary':
        return colors.blue;
      case 'button-secondary':
        return colors.white;
      case 'button-grey':
        return colors.grey;
      case 'button-navigation':
        return colors.grey;
      case 'button-caution':
        return colors.orange;
      case 'button-success':
        return colors.green;
      case 'button-pink':
        return colors.fuchsia;
      case 'button-purple':
        return colors.purple;
      case 'button-aqua':
        return colors.teal;
      case 'button-yellow':
        return colors.yellow;
      case 'button-gunmetal':
        return colors['grey-dark'];
      case 'button-silver':
        return colors['grey-lighter'];
      case 'button-black':
        return colors.black;
      case 'button-white':
        return colors.white;
      case 'button-transparent':
        return 'transparent';
      default:
        return bgColor;
    }
  };

  // Remove Legacy Color handling once grids are all migrated to new builder
  const buttonStyling = useMemo(() => {
    if (column.fieldType !== FieldTypeIds.Button) return null;
    const styles = {
      backgroundColor: 'transparent',
      color: colors.blue,
      fontSize: '14px',
      borderColor: colors.blue,
    };
    if (column.formatStyle) {
      if (column.formatStyle.backgroundColor) {
        styles.backgroundColor = getBackgroundColor(column.formatStyle.backgroundColor);
      }

      if (column.formatStyle.fontSize) {
        styles.fontSize = getFontSize(column.formatStyle.fontSize);
      }
      styles.color = getTextColor(column.formatStyle.textColor, column.formatStyle.backgroundColor);
      if (
        !column.formatStyle.backgroundColor ||
        column.formatStyle.backgroundColor === 'white' ||
        column.formatStyle.backgroundColor === 'grey-light' ||
        column.formatStyle.backgroundColor === 'grey-lighter' ||
        column.formatStyle.backgroundColor === 'transparent' ||
        column.formatStyle.backgroundColor === 'button-white' ||
        column.formatStyle.backgroundColor === 'button-transparent' ||
        column.formatStyle.backgroundColor === 'button-silver' ||
        column.formatStyle.backgroundColor === 'button-secondary'
      ) {
        styles.borderColor = styles.color;
      } else {
        styles.borderColor = styles.backgroundColor;
      }
    }

    return styles;
  }, [column.fieldType, column.formatStyle]);

  const handleOnChange = (val) => updateCellData(val);

  const handleKeyUp = (e) => onKeyUp && onKeyUp(e);

  const handleCheckboxChange = (val) => {
    updateCellData(val);
    if (column.onChange) column.onChange(column.name, val, column, rowIdx, primaryKey);
  };

  const handleImageChange = (val) => {
    updateCellData(val);
    if (column.onChange) column.onChange(column.name, val, column, rowIdx, primaryKey);
  };

  const handleEditImageClick = () => {
    onShowImageEditor(column, value, rowIdx);
    onDisableClickOutside(true);
  };

  const getColor = (color) => {
    if (!color) return colors.grey;
    return color.startsWith('#') ? color : colors[color];
  };

  // Return Dropdown or DateTimePicker
  if (column.renderEditAs) {
    return column.renderEditAs({
      id,
      column,
      value,
      error,
      inputElRef,
      rowIdx,
      primaryKey,
      isFocused,
      scrollerRef,
    });
  }

  if (column.displayAs === 'icon' && column.fieldType === FieldTypeIds.YesNo) {
    const icon = value ? column.displayOptions.trueIcon.name : column.displayOptions.falseIcon.name;
    const color = value
      ? getColor(column.displayOptions.trueIcon.color)
      : getColor(column.displayOptions.falseIcon.color);
    return (
      <SvgIcon
        id={`${id}-${column.name}`}
        testId={`${id}-${column.name}-icon`}
        name={icon}
        color={color}
        size={18}
        onClick={column.editable ? () => handleCheckboxChange(!value) : null}
        disabled={!column.editable}
        tooltipId={tooltipId}
        tooltip={value ? column.displayOptions.trueTooltip : column.displayOptions.falseTooltip}
        hoverColor={column.displayOptions.hoverColor}
      />
    );
  }

  if (column.displayAs === 'icon' && column.fieldType === FieldTypeIds.Button) {
    return (
      <SvgIcon
        id={`${id}-${column.name}`}
        testId={`${id}-${column.name}-icon`}
        name={column.displayOptions.icon.name}
        color={getColor(column.displayOptions.icon.color)}
        size={18}
        onClick={() => {
          column.onClick(column.name, null, column, rowIdx, primaryKey);
          onSetEditingRow(null);
          setEditingCell(null);
        }}
        disabled={column.formatStyle?.disabled}
      />
    );
  }

  if (column.name === 'TagList') {
    return (
      <TagWidget
        id={`${id}-${column.name}`}
        isEditable
        tagsList={tagsList}
        value={value ? value.split(',') : []}
        size='narrow'
        suggestions={tagsSuggestions}
        onChange={handleOnChange}
        onCreate={handleOnChange}
        onActionButtonClick={onManageTags}
        showManageTags={!!onManageTags}
        isPortal
      />
    );
  }
  // Return other fields
  switch (column.fieldType) {
    case FieldTypeIds.Button:
      return (
        <Button
          id={`${id}-${column.name}`}
          size='small'
          disabled={column.formatStyle?.disabled}
          value={column.buttonLabel}
          buttonStyle={column.formatType?.type === 'link' ? 'link' : 'primary'}
          onClick={() => {
            column.onClick(column.name, null, column, rowIdx, primaryKey);
            onSetEditingRow(null);
            setEditingCell(null);
          }}
          backgroundColor={buttonStyling.backgroundColor}
          color={buttonStyling.color}
          fontSize={buttonStyling.fontSize}
          borderColor={buttonStyling.borderColor}
          icon={
            column.displayOptions?.icon
              ? { name: column.displayOptions.icon.name, color: getColor(column.displayOptions.icon.color), size: 16 }
              : null
          }
          widthType={column.width === 'fixed' ? 'fixed' : 'auto'}
        />
      );

    case FieldTypeIds.YesNo:
      return (
        <Checkbox
          autoFocus={isFocused}
          checked={value && value !== 'False'}
          disabled={!column.editable}
          id={`${id}-${column.name}`}
          forwardRef={inputElRef}
          onChange={(checked) => handleCheckboxChange(checked)}
          hideCaption
          narrow
          align='center'
        />
      );

    case FieldTypeIds.Decimal:
    case FieldTypeIds.Integer:
    case FieldTypeIds.Money:
      return (
        <Input
          inputStyle={{ textAlign: column.columnAlign, marginBottom: 0 }}
          id={`${id}-${column.name}`}
          selectOnFocus={editable}
          onBlur={handleLoseFocus}
          onChange={(e) => handleOnChange(e.currentTarget.value)}
          onKeyUp={handleKeyUp}
          forwardRef={inputElRef}
          type='text'
          value={value}
          isV4Design
          compactStyle
        />
      );
    case FieldTypeIds.DropDown:
      return (
        <Dropdown
          hasFocus={isFocused}
          disabled={!column.editable}
          id={`${id}-${column.name}`}
          onChange={handleOnChange}
          hideCaption
          value={value}
          options={column.options || []}
          isV4Design
          isPortal
          width='100%'
        />
      );
    case FieldTypeIds.DateTime:
      return (
        <DatePicker
          id={`${id}-${column.name}`}
          marginless
          value={value}
          isV4Design
          block
          formatType={column.format}
          compactStyle
          onChange={handleOnChange}
          usePortal
          onFocus={() => onDisableClickOutside(true)}
          onBlur={() => onDisableClickOutside(false)}
        />
      );

    case FieldTypeIds.Picture:
      return (
        <s.EditImageWrapper>
          <EditableImage
            caption={column.caption}
            disabled={!column.editable}
            id={`${id}-${column.name}`}
            value={value}
            width={32}
            height={32}
            circle={column.name === 'ProfileImage'}
            unsetImage='landscape'
            onClick={handleEditImageClick}
            onFileReadSuccess={(e) => onUploadImage(e, column.name, rowIdx, primaryKey)}
            onDownloadImage={
              onDownloadImage ? (imageUrl) => onDownloadImage(imageUrl, column.name, primaryKey) : undefined
            }
            onDelete={() => handleImageChange(null)}
            onClose={() => onDisableClickOutside(false)}
            onErrorMessageForUser={onErrorMessageForUser}
            showSetImage
            uploadProgress={
              enrichedData && enrichedData[rowIdx] && enrichedData[rowIdx][column.name]
                ? enrichedData[rowIdx][column.name].progress
                : 0
            }
            uploading={
              enrichedData && enrichedData[rowIdx] && enrichedData[rowIdx][column.name]
                ? enrichedData[rowIdx][column.name].uploading
                : false
            }
            uploadingFile={
              enrichedData && enrichedData[rowIdx] && enrichedData[rowIdx][column.name]
                ? enrichedData[rowIdx][column.name].filename
                : ''
            }
          />
        </s.EditImageWrapper>
      );
    default:
      if (column.singleLine) {
        return (
          <Input
            inputStyle={{ textAlign: column.columnAlign, marginBottom: 0 }}
            id={`${id}-${column.name}`}
            selectOnFocus={editable}
            onBlur={handleLoseFocus}
            onChange={(e) => handleOnChange(e.currentTarget.value)}
            onKeyUp={handleKeyUp}
            forwardRef={inputElRef}
            type='text'
            value={value}
            isV4Design
            compactStyle
            maxLength={column.maxLength || undefined}
            infoLevel={column.infoLevel || ''}
          />
        );
      }
      return (
        <InputArea
          autoGrow
          disableResize
          id={`${id}-${column.name}`}
          initialHeight={34}
          selectOnFocus={editable}
          isV4Design={false}
          forwardRef={inputElRef}
          name={column.name}
          navigateGrid={navigateGrid}
          onBlur={handleLoseFocus}
          onChange={(input) => handleOnChange(input)}
          onKeyUp={handleKeyUp}
          isBlurOnSubmit={column.isBlurOnSubmit}
          rows={1}
          style={{ textAlign: column.columnAlign, alignItems: 'flex-end', marginBottom: 0, borderRadius: 4 }}
          value={value}
        />
      );
  }
}

export default EditMode;

EditMode.propTypes = propTypes;
