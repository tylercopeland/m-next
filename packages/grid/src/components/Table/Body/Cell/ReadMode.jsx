import React, { useRef, useState, useEffect, useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import { FieldTypeIds, Tag, DOMPurifyOptions, EnhancedDOMPurifyOptions } from '@m-next/types';
import { Checkbox } from '@m-next/checkbox';
import Image, { EditableImage } from '@m-next/image';
import TagWidget from '@m-next/tag-widget';
import Popover from '@m-next/popover';
import { colors, fontSizes } from '@m-next/styles';
import SvgIcon from '@m-next/svg-icon';
import Pill from '@m-next/pill';
import Button from '@m-next/button';
import MaliciousChecksContext from '../../../MaliciousChecksContext';
import { formatCellValue } from '../../../../utilities';
import { CardColumn, DraggableCardColumn } from '../CardColumn';
import CellBox from '../CellBox';
import ShowHideContent from '../../../../ShowHideContent';
import Skeleton from '../Skeleton';
import Column from '../../../../ColumnPropType';

// Configure DOMPurify once at module load (shared across all ReadMode instances)
const customDomSanitizer = (() => {
  const sanitizer = DOMPurify();

  // Enforce noopener and noreferrer on all target="_blank" links
  sanitizer.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName.toUpperCase() === 'A' && node.getAttribute('target') === '_blank') {
      const existingRel = node.getAttribute('rel') || '';
      const relTokens = new Set(existingRel.split(/\s+/).filter(Boolean));
      relTokens.add('noopener');
      relTokens.add('noreferrer');
      node.setAttribute('rel', Array.from(relTokens).join(' '));
    }
  });

  return sanitizer;
})();

const propTypes = {
  blankRow: PropTypes.bool,
  column: Column,
  error: PropTypes.string,
  id: PropTypes.string,
  primaryKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rowIdx: PropTypes.number,
  setRowAndCellToEditing: PropTypes.func,
  updateCellData: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string, PropTypes.instanceOf(Object)]),
  displayValue: PropTypes.string,
  disabled: PropTypes.bool,
  displayPreferences: PropTypes.instanceOf(Object),
  isMobile: PropTypes.bool,
  dragAndDrop: PropTypes.instanceOf(Object),
  isLoading: PropTypes.bool,
  editingRow: PropTypes.number,
  onSetEditingRow: PropTypes.func,
  setEditingCell: PropTypes.func,
  editable: PropTypes.bool,
  tagsList: PropTypes.arrayOf(Tag),
  enrichedData: PropTypes.instanceOf(Object),
  tooltipId: PropTypes.string,
  onDownloadImage: PropTypes.func,
};
function ReadMode({
  blankRow,
  column,
  error = null,
  id,
  primaryKey,
  rowIdx,
  setRowAndCellToEditing,
  value,
  displayValue,
  updateCellData,
  disabled,
  displayPreferences,
  isMobile,
  dragAndDrop,
  isLoading,
  editingRow,
  onSetEditingRow,
  setEditingCell,
  editable,
  tagsList,
  onDownloadImage,
  enrichedData,
  tooltipId,
}) {
  const imageRef = useRef();
  const [open, setOpen] = useState(false);
  const [sanitizedValue, setSanitizedValue] = useState(null);
  const [sanitizedDisplayValue, setSanitizedDisplayValue] = useState(null);
  const isEnhancedMaliciousValueChecks = useContext(MaliciousChecksContext);

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

  const sanitize = (str) => {
    if (typeof str !== 'string') return str;

    const baseConfig = isEnhancedMaliciousValueChecks ? EnhancedDOMPurifyOptions : DOMPurifyOptions;
    const sanitizeConfig = { ...baseConfig, ADD_ATTR: [...(baseConfig.ADD_ATTR || []), 'target'] };

    const cleanValue = customDomSanitizer.sanitize(str, sanitizeConfig);

    return cleanValue;
  };

  useEffect(() => {
    setSanitizedValue(sanitize(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    setSanitizedDisplayValue(sanitize(displayValue));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayValue]);

  const formatValue = (resp) => {
    let formattedValue = resp;
    if (value !== null && value !== '' && column.displayOptions?.numberFormat !== 1) {
      switch (column.fieldType) {
        case FieldTypeIds.Decimal:
        case FieldTypeIds.Integer:
        case FieldTypeIds.Money:
          formattedValue = formatCellValue(column, resp, false, displayPreferences);
          break;
        case FieldTypeIds.DateTime:
          formattedValue = formatCellValue(column, resp, false, displayPreferences);
          break;
        default:
          break;
      }
    }
    return sanitize(formattedValue);
  };

  const getCardColumn = () => {
    if (dragAndDrop) {
      return (
        <DraggableCardColumn
          key={id}
          id={id}
          isMobile={isMobile}
          fieldControl={column.formatType.type === 'structured' ? column.control : column.cardColumnFields}
          format={column.formatType.type}
          value={sanitizedValue}
          primaryKey={primaryKey}
          dragAndDrop={dragAndDrop}
          displayPreferences={displayPreferences}
        />
      );
    }
    return (
      <CardColumn
        key={id}
        id={id}
        isMobile={isMobile}
        fieldControl={column.formatType.type === 'structured' ? column.control : column.cardColumnFields}
        format={column.formatType.type}
        value={sanitizedValue}
        primaryKey={primaryKey}
        displayPreferences={displayPreferences}
      />
    );
  };

  const handleCheckboxChange = (val) => {
    if (updateCellData) {
      // 1. Update checkbox UI state
      updateCellData(val);

      // 2. Toggle event logic from GridContext
      if (column.onChange) column.onChange(column.name, val, column, rowIdx, primaryKey);

      // 3. Update UI for Row and Cell to 'Edit Mode'
      setRowAndCellToEditing();
    }
  };

  const getColor = (color) => {
    if (!color) return colors.grey;
    return color.startsWith('#') ? color : colors[color];
  };

  // Return loading skeleton
  if (isLoading) {
    return <Skeleton tall={column.formatType === 'button'} />;
  }

  // Return Dropdown or DateTimePicker
  if (column.renderAs) {
    return column.renderAs(id, value, rowIdx, error, primaryKey);
  }

  // Return other values

  if (column.displayAs === 'icon' && column.fieldType === FieldTypeIds.YesNo) {
    const icon = value ? column.displayOptions.trueIcon.name : column.displayOptions.falseIcon.name;
    const color = value
      ? getColor(column.displayOptions.trueIcon.color)
      : getColor(column.displayOptions.falseIcon.color);
    let tooltip = '';
    if (disabled && column.displayOptions.disabledTooltip) {
      tooltip = column.displayOptions.disabledTooltip;
    } else {
      tooltip = value ? column.displayOptions.trueTooltip : column.displayOptions.falseTooltip;
    }
    return (
      <SvgIcon
        id={`${id}-${column.name}`}
        testId={`${id}-${column.name}-icon`}
        name={icon}
        color={color}
        size={18}
        onClick={column.editable ? () => handleCheckboxChange(!value) : null}
        disabled={!column.editable || disabled}
        tooltipId={tooltipId}
        tooltip={tooltip}
        hoverColor={column.displayOptions.hoverColor}
      />
    );
  }

  if (column.displayAs === 'custom' && column.fieldType === FieldTypeIds.YesNo) {
    return (
      <ShowHideContent id={id} content={value ? column.displayOptions.trueValue : column.displayOptions.falseValue} />
    );
  }

  if (column.displayAs === 'pill' && column.fieldType === FieldTypeIds.YesNo) {
    return (
      <Pill id={`${id}-${column.name}`} size='narrow'>
        {value ? column.displayOptions.trueValue : column.displayOptions.falseValue}
      </Pill>
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
        disabled={disabled || column.formatStyle?.disabled}
      />
    );
  }

  let resp = value;
  if (blankRow && !(editingRow === rowIdx)) resp = '';
  else {
    if (column.name === 'TagList')
      return (
        <TagWidget
          id={`${id}-${column.name}`}
          isEditable={false}
          tagsList={tagsList}
          value={value ? value.split(',') : []}
          size='narrow'
        />
      );

    switch (column.fieldType) {
      case FieldTypeIds.Button:
        return (
          <Button
            id={`${id}-${column.name}`}
            size='small'
            disabled={disabled || column.formatStyle?.disabled}
            value={column.buttonLabel}
            buttonStyle={column.formatType?.type === 'link' ? 'link' : 'primary'}
            onClick={() => {
              column?.onClick(column.name, null, column, rowIdx, primaryKey);
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
            widthType={column.width === 'fixed' ? 'full' : 'auto'}
          />
        );
      case FieldTypeIds.YesNo:
        return (
          <Checkbox
            checked={!!value}
            disabled={!editable || !column.editable}
            id={`${id}-${column.name}`}
            testId={`${id}-${column.name}`}
            onChange={(checked) => handleCheckboxChange(checked)}
            hideCaption
            narrow
            align='center'
          />
        );
      case FieldTypeIds.Picture:
        return (
          <div ref={imageRef}>
            <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
              {enrichedData &&
                enrichedData[rowIdx] &&
                enrichedData[rowIdx][column.name] &&
                enrichedData[rowIdx][column.name].uploading && (
                  <EditableImage
                    disabled={!column.editable}
                    id={`${id}-${column.name}`}
                    value={sanitizedValue}
                    width={32}
                    height={32}
                    circle={column.name === 'ProfileImage'}
                    unsetImage='landscape'
                    showSetImage
                    uploadProgress={enrichedData[rowIdx][column.name].progress}
                    uploading={enrichedData[rowIdx][column.name].uploading}
                    uploadingFile={enrichedData[rowIdx][column.name].filename}
                    onDownloadImage={onDownloadImage}
                  />
                )}
              {(!enrichedData ||
                !enrichedData[rowIdx] ||
                !enrichedData[rowIdx][column.name] ||
                !enrichedData[rowIdx][column.name].uploading) && (
                <Image
                  disabled={disabled || column.formatStyle?.disabled}
                  id={`${id}-${column.name}`}
                  value={sanitizedValue}
                  width={32}
                  height={32}
                  circle={column.name === 'ProfileImage'}
                  unsetImage='landscape'
                />
              )}
            </div>
            <Popover
              id={`${id}-${column.name}-menu`}
              open={open && value && !value.includes('.mci')}
              anchorEl={imageRef.current}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <div style={{ border: `4px solid ${colors['grey-darker']}`, borderRadius: 4 }}>
                <Image
                  id={`${id}-${column.name}`}
                  value={sanitizedValue}
                  width={160}
                  height={160}
                  circle={column.name === 'ProfileImage'}
                  unsetImage='landscape'
                />
              </div>
            </Popover>
          </div>
        );
      case FieldTypeIds.CardColumn:
        return getCardColumn();
      case FieldTypeIds.DateTime:
        resp = formatValue(value);
        break;
      default:
        if (displayValue !== null && displayValue !== undefined) {
          resp = sanitizedDisplayValue;
        } else if (column.accessorProp) {
          resp = formatValue(value[column.accessorProp]);
        }
    }
  }

  if (column.displayAs === 'pill') {
    return (
      <Pill id={`${id}-${column.name}`} size='narrow'>
        {resp}
      </Pill>
    );
  }

  return error ? (
    <CellBox id={`${id}-CONTENT`} hasError={!!error} value={sanitize(resp?.toString()) || null} />
  ) : (
    <ShowHideContent id={id} content={sanitize(resp?.toString()) || null} />
  );
}

ReadMode.propTypes = propTypes;

export default ReadMode;
