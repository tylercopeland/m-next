/* eslint-disable react/no-danger */
import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { FieldTypeIds } from '@m-next/types';
import { formatDate } from '@m-next/utilities/src/formatter';
import Card from '@m-next/card';
import { TextAvatar, useTextAvatarConfig } from '@m-next/image';
import { formatCellValue } from '../../../../utilities';
import * as s from './CardColumn.styles';

const propTypes = {
  fieldControl: PropTypes.instanceOf(Object),
  format: PropTypes.string,
  id: PropTypes.string.isRequired,
  isMobile: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.instanceOf(Object), PropTypes.string]),
  displayPreferences: PropTypes.instanceOf(Object),
  onClick: PropTypes.func,
};

function CardColumn({
  fieldControl = null,
  format = 'avatar-2-cols',
  id,
  isMobile = false,
  value = '',
  displayPreferences,
  onClick,
}) {
  const [data, setData] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [avatarCaption, setAvatarCaption] = useState(null);
  const textAvatar = useTextAvatarConfig(avatar);

  const hasAvatar = useMemo(() => {
    if (format === 'structured') return !!fieldControl?.avatar;
    if (!format) return false; // Don't show avatar when format is null/undefined
    return !format.startsWith('no-avatar');
  }, [format, fieldControl]);

  const constructDataArr = () => {
    if (format === 'structured') return;
    const newDataArr = [];
    const fieldsArr = value?.split('||');
    const avatarIndex = fieldControl.findIndex((f) => f.fldTypeId === FieldTypeIds.Picture);
    if (avatarIndex !== -1) {
      // This means we found a field type useable as the avatar. Here is where things get complicated.
      // Regardless of how many data fields are present in `fieldControl` (usually 7 regardless of card design),
      // The meaningful URLs (image filename and thumbnail URL path, when available) are ALWAYS in the final two
      // positions of `fieldsArr` even when it has fewer entries than 7, for instance 4 entries for a 1-column CardColumn.
      // ...So, as counter-intuitive as it is, the logic needs to work like this:
      const avatarImgSrc =
        fieldsArr[fieldsArr.length - 1] !== '' // Is the final value (thumbnail URL) populated?
          ? fieldsArr[fieldsArr.length - 1] // Use the final value (thumbnail URL). Or else,
          : fieldsArr[fieldsArr.length - 2]; // Fall back to image filename only.
      // This fallback behaviour is most especially relevant for so-called "Text Initials" avatars, since the
      // image filename will populate as "JS.mci" for Jane Smith, etc, which logic is handled in `useTextAvatarConfig.`
      if (avatarImgSrc) setAvatar(avatarImgSrc);
      // Regardless of those shenanigans, we can at least caption the image with the field name for accessibility:
      setAvatarCaption(fieldControl[avatarIndex]?.value);
    }
    // Now we need to format the data the way CardColumn intends to show it.
    // Track separate index for fieldsArr since unmapped fields don't have data in fieldsArr
    let fieldsArrIndex = 0;
    fieldControl.forEach((f, i) => {
      if (i === avatarIndex) {
        fieldsArrIndex += 1; // Avatar takes up a position in fieldsArr
        return; // Disregard the row containing the avatar info, because it's handled already
      }
      if (f.value) {
        // Again, smaller card designs still have 7 `fieldControl` entries, but values can be blank.
        let val = fieldsArr[fieldsArrIndex];
        if (typeof val === 'string' && val.startsWith('__datetime__:')) {
          val = val.slice(13);
          const dateTimeFormat = f.format.dateType;
          val = formatDate(dateTimeFormat, val, displayPreferences);
        } else {
          val = formatCellValue(f, fieldsArr[fieldsArrIndex], false, displayPreferences);
        }
        // Check if mapped field has empty data
        if (!val || val === '' || val === null || val === undefined) {
          newDataArr.push('__EMPTY_MAPPED__'); // Mapped but empty - show dash
        } else {
          newDataArr.push(val);
        }
        fieldsArrIndex += 1; // Increment only when field is mapped
      } else if (f.value === null) {
        newDataArr.push('__UNMAPPED__'); // Unmapped field - can be hidden
      }
    });
    // for 1-column formats, arbitrarily truncate array at 3 members.
    if (format?.endsWith('1-col')) newDataArr.splice(3);

    // Apply trailing empty rows logic
    const filterTrailingEmptyRows = (dataArr) => {
      const hasTwoColumns = dataArr.length >= 6;
      const numRows = 3; // Always 3 rows based on grid-template-rows

      // Helper to check if value has data (only check if mapped, not if has actual data)
      const hasData = (val) => {
        // Mapped but empty fields count as having data (will show dash)
        if (val === '__EMPTY_MAPPED__') return true;
        // Unmapped fields don't count as having data (can be hidden)
        if (val === '__UNMAPPED__') return false;
        return val !== null && val !== undefined && val !== '';
      };

      // Find last row with data (from bottom to top)
      let lastRowWithData = -1;
      for (let row = numRows - 1; row >= 0; row--) {
        const leftIndex = row; // Column 1
        const rightIndex = hasTwoColumns ? row + numRows : -1; // Column 2 (if exists)

        if (hasData(dataArr[leftIndex]) || (rightIndex !== -1 && hasData(dataArr[rightIndex]))) {
          lastRowWithData = row;
          break;
        }
      }

      // If no rows have data, return empty array
      if (lastRowWithData === -1) return [];

      // Build filtered array - include only rows up to lastRowWithData
      // Must maintain column-flow order: all left column items first, then right column items
      const filteredArr = [];

      // Add left column items (rows 0 to lastRowWithData)
      for (let row = 0; row <= lastRowWithData; row++) {
        const val = dataArr[row];
        // Keep unmapped fields in non-trailing rows for spacing
        filteredArr.push(val);
      }

      // Add right column items if two columns (rows 0 to lastRowWithData)
      if (hasTwoColumns) {
        for (let row = 0; row <= lastRowWithData; row++) {
          if (dataArr[row + numRows] !== undefined) {
            const val = dataArr[row + numRows];
            // Keep unmapped fields in non-trailing rows for spacing
            filteredArr.push(val);
          }
        }
      }

      return filteredArr;
    };

    const filteredData = filterTrailingEmptyRows(newDataArr);
    setData(filteredData);
  };

  useEffect(() => {
    if (value?.length && fieldControl?.length) constructDataArr();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, fieldControl?.length]);

  const renderAvatar = () => {
    if (!hasAvatar) return null;
    if (textAvatar)
      return (
        <TextAvatar
          id={id ? `${id}-TextAvatar` : null}
          initial={textAvatar.initial}
          size='40px'
          width='40px'
          height='40px'
          color={textAvatar.color}
          round
          caption={avatarCaption}
        />
      );
    if (avatar) return <s.Avatar src={avatar} />;
    return <SvgIcon name='mi-icon-user-male' size={40} color='#788a96' />;
  };

  // Fallback: If format is null/undefined and fieldControl is null/undefined,
  // this CardColumn is likely being rendered for a non-card column (e.g., dropdown).
  // In this case, render the value as simple text.
  if (!format && !fieldControl) {
    // Handle object values (e.g., dropdown { text, value } format)
    const displayText = typeof value === 'object' && value !== null ? value.text : value;
    if (displayText) {
      return (
        <s.CardColumnWrapper id={`${id}-CARD-COLUMN`} tabIndex='0' onClick={onClick}>
          <s.ContentWrapper>
            <s.ContentItem id={`${id}-CARD-COLUMN-FIELD-0`}>
              <span>{displayText}</span>
            </s.ContentItem>
          </s.ContentWrapper>
        </s.CardColumnWrapper>
      );
    }
    return null;
  }

  if (format === 'structured')
    return (
      <Card
        id={`${id}-CARD-COLUMN`}
        avatar={value && value !== '' ? value['__avatar__'] : null}
        hasAvatar={hasAvatar}
        field1={fieldControl?.field1}
        field2={fieldControl?.field2}
        field3={fieldControl?.field3}
        field4={fieldControl?.field4}
        field5={fieldControl?.field5}
        field6={fieldControl?.field6}
        data={value && value !== '' ? value : null}
        tagsList={fieldControl?.tagsList}
        size='small'
        displayPreferences={displayPreferences}
        style={{ backgroundColor: 'transparent' }}
        onClick={onClick}
        hideEmptyFields
        isMobile={isMobile}
      />
    );

  // Render Calendar Card Column, temporary until we build expressions into the backend
  if (fieldControl?.[0]?.format?.hasExpression && value) {
    const key = `${id}-CARD-COLUMN-FIELD-`;
    return (
      <s.CardColumnWrapper
        hasAvatar={hasAvatar}
        id={`${id}-CARD-COLUMN`}
        tabIndex='0'
        onClick={onClick}
        style={{ minHeight: 106 }}
      >
        <s.CalendarCardColumnContentWrapper>
          <s.CalendarCardColumnContent
            style={{ marginTop: 0, paddingBottom: '2px' }} // padding so text is not cut off
            key={`${key}1`}
            dangerouslySetInnerHTML={{ __html: value.title }}
          />
          <s.CalendarCardColumnContent key={`${key}2`} dangerouslySetInnerHTML={{ __html: value.description }} />
        </s.CalendarCardColumnContentWrapper>
      </s.CardColumnWrapper>
    );
  }

  // Determine if format is 2-column based on format string, not data length
  const hasTwoColumnsCalc = !format?.endsWith('1-col') && format !== 'structured';
  const numRowsCalc = hasTwoColumnsCalc ? Math.ceil(data.length / 2) : data.length;

  return (
    <s.CardColumnWrapper
      hasAvatar={hasAvatar}
      id={`${id}-CARD-COLUMN`}
      isMobile={isMobile}
      tabIndex='0'
      onClick={onClick}
      numRows={numRowsCalc}
    >
      {renderAvatar()}
      <s.ContentWrapper hasTwoColumns={hasTwoColumnsCalc} numRows={numRowsCalc}>
        {data.map((item, index) => {
          const key = `${id}-CARD-COLUMN-FIELD-${index}`;
          // Handle special markers
          if (item === '__UNMAPPED__') {
            // Render empty space for unmapped fields (maintains grid position)
            return <s.ContentItem isMobile={isMobile} key={key} id={`${id}-CARD-COLUMN-FIELD-${index}-unmapped`} />;
          }
          if (item === '__EMPTY_MAPPED__') {
            // Render dash for mapped but empty fields
            return (
              <s.ContentItem isMobile={isMobile} key={key} id={`${id}-CARD-COLUMN-FIELD-${index}`}>
                <span style={{ opacity: 0.3 }}>—</span>
              </s.ContentItem>
            );
          }
          return (
            <s.ContentItem isMobile={isMobile} key={key} id={`${id}-CARD-COLUMN-FIELD-${index}`}>
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </s.ContentItem>
          );
        })}
      </s.ContentWrapper>
    </s.CardColumnWrapper>
  );
}

export default CardColumn;

CardColumn.propTypes = propTypes;
