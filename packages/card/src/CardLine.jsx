import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { formatter, useEllipsisDetection } from '@m-next/utilities';
import { Field, FieldTypeNames, Tag } from '@m-next/types';
import TagWidget from '@m-next/tag-widget';
import { TextDiv } from '@m-next/typeography';
import Pill from '@m-next/pill';
import Image from '@m-next/image';

// types
const propTypes = {
  id: PropTypes.string,
  field: PropTypes.oneOfType([Field, PropTypes.instanceOf(Object)]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.instanceOf(Object)]),
  displayPreferences: PropTypes.instanceOf(Object),
  tagsList: PropTypes.arrayOf(Tag),
  variation: PropTypes.oneOf(['header', 'normal', 'small', 'headerSmall', 'gridHeader', 'gridBody']),
  showLabels: PropTypes.bool,
  column: PropTypes.number,
  tooltipId: PropTypes.string,
  hideEmptyFields: PropTypes.bool,
};

const VARIATION_TYPES = {
  small: { bold: false, fontSize: 'medium', height: 16 },
  normal: { bold: false, fontSize: 'medium', height: 24 },
  headerSmall: { bold: true, fontSize: 'medium', height: 16 },
  header: { bold: true, fontSize: 'xlarge', height: 28 },
  gridHeader: { bold: true, fontSize: 'medium', height: 20 },
  gridBody: { bold: false, fontSize: 'small', height: 16 },
};

const IMAGE_SIZES = {
  small: 24,
  medium: 48,
  headerSmall: 24,
  header: 48,
};

function CardLine({
  id,
  field,
  value,
  displayPreferences,
  tagsList,
  variation = 'normal',
  showLabels,
  column,
  tooltipId,
  hideEmptyFields = false,
}) {
  const ref = useRef(null);
  const isEllipsed = useEllipsisDetection(ref);

  // Memoize formatted value to prevent unnecessary recalculations
  const formattedValue = useMemo(
    () => formatter.formatFieldValue(field?.type, field?.displayOptions, value, displayPreferences),
    [field?.type, field?.displayOptions, value, displayPreferences],
  );

  const pillColor = useMemo(() => {
    if (!field?.conditionalFormatting?.length) return 'blue';

    const formatting = field.conditionalFormatting.find((element) => element.value === value);
    return formatting?.color || 'blue';
  }, [field?.conditionalFormatting, value]);

  const renderReadOnlyText = () => (
    <TextDiv
      id={`${id}-${field.name}`}
      ref={ref}
      bold={VARIATION_TYPES[variation].bold}
      fontSize={VARIATION_TYPES[variation].fontSize}
      style={{
        height: VARIATION_TYPES[variation].height,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        minWidth: 0,
        textAlign: column === 2 ? 'end' : 'start',
        whiteSpace: 'nowrap',
      }}
      tooltip={formattedValue}
      tooltipId={isEllipsed ? tooltipId : null}
    >
      {showLabels && `${field.caption}: `} {formattedValue}
    </TextDiv>
  );

  const renderReadOnlyTags = () => (
    <TagWidget
      id={`${id}-${field.name}`}
      tagsList={tagsList}
      value={value?.trim().split(',') ?? []}
      style={{ height: VARIATION_TYPES[variation].height }}
      size='narrow'
    />
  );

  const renderReadOnlyPill = () => (
    <Pill id={`${id}-${field.name}`} colorScheme={pillColor} variant='subtle' size='narrow' leadIcon={{ name: 'dot' }}>
      {formattedValue}
    </Pill>
  );

  const renderImage = () => (
    <Image
      id={`${id}-${field.name}`}
      width={IMAGE_SIZES[variation]}
      height={IMAGE_SIZES[variation]}
      circle
      value={value}
      unsetImage='person'
      imgType='Fixed'
    />
  );

  // Original behavior: if no field at all, return empty div
  if (!field) {
    return <TextDiv id={`${id}`} style={{ height: VARIATION_TYPES[variation].height }} />;
  }

  // When hideEmptyFields is true, handle unmapped fields and empty values
  if (hideEmptyFields) {
    const isMappedField = field.name !== null && field.name !== undefined;

    // If unmapped field, return empty div for spacing
    if (!isMappedField) {
      return <TextDiv id={`${id}`} style={{ height: VARIATION_TYPES[variation].height }} />;
    }

    // If mapped but value is empty, show dash
    const isEmpty = value === null || value === undefined || value === '';
    if (isEmpty) {
      return (
        <TextDiv
          id={`${id}-${field.name}`}
          style={{
            height: VARIATION_TYPES[variation].height,
            lineHeight: `${VARIATION_TYPES[variation].height}px`,
            opacity: 0.3,
            textAlign: column === 2 ? 'end' : 'start',
          }}
        >
          —
        </TextDiv>
      );
    }
  }

  if (field.displayAs === 'pill' || field.displayAs === 'dot-pill') {
    return renderReadOnlyPill();
  }

  switch (field.type) {
    case FieldTypeNames.Tags:
      return renderReadOnlyTags();
    case FieldTypeNames.Picture:
    case FieldTypeNames.ProfileImage:
      return renderImage();
    default:
      return renderReadOnlyText();
  }
}

CardLine.propTypes = propTypes;
export default CardLine;
