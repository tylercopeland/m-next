import React, { forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';
import Container from '@m-next/container';
import Image from '@m-next/image';
import { Field, Tag } from '@m-next/types';
import LoadingSkeleton from '@m-next/loading-skeleton';
import CardLine from './CardLine';
import * as s from './Card.styles';

// One-time deprecation warner — fires once per key, mirrors @m-next/input.
const warnOnce = (() => {
  const seen = new Set();
  return (key, message) => {
    if (seen.has(key) || typeof console === 'undefined') return;
    seen.add(key);
    // eslint-disable-next-line no-console
    console.warn(message);
  };
})();

let autoIdCounter = 0;

const propTypes = {
  id: PropTypes.string,
  isLoading: PropTypes.bool,
  displayPreferences: PropTypes.instanceOf(Object),
  tagsList: PropTypes.arrayOf(Tag),
  onClick: PropTypes.func,
  avatar: PropTypes.string,
  hasAvatar: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium']),
  data: PropTypes.instanceOf(Object),
  showLabels: PropTypes.bool,
  style: PropTypes.instanceOf(Object),
  field1: Field,
  field2: Field,
  field3: Field,
  field4: Field,
  field5: Field,
  field6: Field,
  tooltipId: PropTypes.string,
  hideEmptyFields: PropTypes.bool,
};

/**
 * Card — a record-display widget. Renders an optional avatar plus up to
 * two columns of formatted field/value pairs. Used in list views, search
 * results, and other compact summaries of an entity.
 */
const Card = forwardRef(function Card(props, ref) {
  const {
    id: idProp,
    isLoading,
    displayPreferences,
    tagsList,
    onClick,
    hasAvatar = false,
    avatar = null,
    size = 'medium',
    field1 = null,
    field2 = null,
    field3 = null,
    field4 = null,
    field5 = null,
    field6 = null,
    data = null,
    showLabels = false,
    style = null,
    tooltipId = null,
    hideEmptyFields = false,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,
    hidden: _hidden,
    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-card-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'card-forwardRef-prop',
      '@m-next/card: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  const imageSizes = {
    small: 56,
    medium: 88,
  };

  const computeVariation = (index) => {
    if (hideEmptyFields) return index === 0 ? 'gridHeader' : 'gridBody';
    if (index === 0) return size === 'small' ? 'headerSmall' : 'header';
    return size === 'small' ? 'small' : 'normal';
  };

  const renderColumn = (colIndex, fields) => {
    if (fields.every((f) => !f)) return null;
    if (isLoading) {
      return (
        <s.ColumnWrapper id={`${id}-card-col${colIndex}`} hideEmptyFields>
          <LoadingSkeleton count={3} height={16} />
        </s.ColumnWrapper>
      );
    }
    if (!data) {
      return <s.ColumnWrapper id={`${id}-card-col${colIndex}`} hideEmptyFields />;
    }

    return (
      <s.ColumnWrapper id={`${id}-card-col${colIndex}`} size={size} hideEmptyFields>
        {fields.map((field, index) => {
          // Skip rendering null fields only when hideEmptyFields is true
          if (hideEmptyFields && !field) return null;

          return (
            <CardLine
              key={`${id}-card-col${colIndex}-line${index + 1}`}
              id={`${id}-card-col${colIndex}-line${index + 1}`}
              displayPreferences={displayPreferences}
              tagsList={tagsList}
              field={field}
              value={data[field?.name]}
              variation={computeVariation(index)}
              showLabels={showLabels}
              column={colIndex}
              tooltipId={tooltipId}
              hideEmptyFields={hideEmptyFields}
            />
          );
        })}
      </s.ColumnWrapper>
    );
  };

  // Calculate visible fields when hideEmptyFields is true
  const getVisibleFields = () => {
    const isMapped = (field) => field && field.name;

    // Check if entire column is unmapped
    const col1HasMappedField = isMapped(field1) || isMapped(field2) || isMapped(field3);
    const col2HasMappedField = isMapped(field4) || isMapped(field5) || isMapped(field6);

    // If hideEmptyFields is false, use original behavior
    if (!hideEmptyFields) {
      return { col1: [field1, field2, field3], col2: [field4, field5, field6] };
    }

    // Find last row with mapped field
    // Only check if field is mapped, not if it has actual data
    // Mapped fields with empty values will show dash
    const hasData = (field) => isMapped(field);

    const rows = [
      { left: field1, right: field4 },
      { left: field2, right: field5 },
      { left: field3, right: field6 },
    ];

    let lastRowWithData = -1;
    for (let i = rows.length - 1; i >= 0; i--) {
      if (hasData(rows[i].left) || hasData(rows[i].right)) {
        lastRowWithData = i;
        break;
      }
    }

    const getFieldValue = (field, rowIndex, columnHasMapped) => {
      // Hide trailing rows (applies to both mapped and unmapped columns)
      if (rowIndex > lastRowWithData) return null;

      // If entire column unmapped, keep field so fields.every((f) => !f) works
      if (!columnHasMapped) return field;

      // Visible row in mapped column: use {} for spacing if unmapped
      return field || {};
    };

    return {
      col1: [
        getFieldValue(field1, 0, col1HasMappedField),
        getFieldValue(field2, 1, col1HasMappedField),
        getFieldValue(field3, 2, col1HasMappedField),
      ],
      col2: [
        getFieldValue(field4, 0, col2HasMappedField),
        getFieldValue(field5, 1, col2HasMappedField),
        getFieldValue(field6, 2, col2HasMappedField),
      ],
    };
  };

  const visibleFields = getVisibleFields();

  return (
    <Container
      id={`${id}-card`}
      isRound={false}
      forwardRef={ref ?? legacyForwardRef}
      style={{
        ...{
          flexDirection: 'row',
          alignItems: 'center',
          ...(hideEmptyFields ? { gap: '8px' } : { gap: '0px' }),
          padding: '0px',
        },
        ...style,
      }}
      hasChildLoading
      onClick={onClick}
      borderless
      {...rest}
    >
      {hasAvatar && (
        <Image
          id={`${id}-card-avatar`}
          width={imageSizes[size]}
          height={imageSizes[size]}
          circle
          value={avatar}
          unsetImage='person'
          imgType='Fixed'
          isLoading={isLoading}
          isV4Design
          centerAlign
        />
      )}
      {renderColumn(1, visibleFields.col1)}
      {renderColumn(2, visibleFields.col2)}
    </Container>
  );
});

Card.displayName = 'Card';
Card.propTypes = propTypes;

export default Card;
