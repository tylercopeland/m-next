import React, { useState, useEffect, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import Container from '@m-next/container';
import Button from '@m-next/button';
import { ErrorBoundary } from '@m-next/utilities';
import { Field, Tag } from '@m-next/types';
import LoadingSkeleton from '@m-next/loading-skeleton';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/tokens';
import FieldBlockLine from './fieldBlockLine';
import * as s from './fieldBlock.styles';

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
  fields: PropTypes.arrayOf(Field),
  collapseEmpty: PropTypes.bool,
  isLoading: PropTypes.bool,
  style: PropTypes.instanceOf(Object),
  data: PropTypes.instanceOf(Object),
  validationErrors: PropTypes.instanceOf(Object),
  error: PropTypes.string,
  onRefetch: PropTypes.func,
  forceOpen: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  displayPreferences: PropTypes.instanceOf(Object),
  tagsList: PropTypes.arrayOf(Tag),
  onMoreClick: PropTypes.func,
  showMoreRef: PropTypes.instanceOf(Object),
  onSelect: PropTypes.func,
  selectedField: PropTypes.string,
  mode: PropTypes.number,
  showSave: PropTypes.bool,
  showClearAndNew: PropTypes.bool,
  showEdit: PropTypes.bool,
  saveLabel: PropTypes.string,
  clearLabel: PropTypes.string,
  onSaveClick: PropTypes.func,
  onClearClick: PropTypes.func,
  onLoadDropdownData: PropTypes.func,
  isWorking: PropTypes.bool,
  dropdownLists: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  onImageUpload: PropTypes.func,
  onDownloadImage: PropTypes.func,
  metadata: PropTypes.instanceOf(Object),

  // Clean API — FormSection-style heading + description
  title: PropTypes.string,
  description: PropTypes.node,

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use `title` (FormSection heading text). */
  caption: PropTypes.string,
  /** @deprecated Use `title`. */
  heading: PropTypes.string,
  /** @deprecated Use `description`. */
  hint: PropTypes.node,
  /** @deprecated Use `description`. */
  help: PropTypes.node,
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef: PropTypes.oneOfType([PropTypes.func, PropTypes.instanceOf(Object)]),
};

const FieldBlock = forwardRef(function FieldBlock(props, ref) {
  const {
    id: idProp,
    fields,
    collapseEmpty = false,
    isLoading = false,
    style = {},
    data,
    validationErrors = null,
    error,
    onRefetch,
    forceOpen = false,
    width,
    displayPreferences,
    tagsList,
    onMoreClick = null,
    showMoreRef = null,
    onSelect = null,
    selectedField = null,
    mode = 0,
    showSave = false,
    showClearAndNew = false,
    showEdit = false,
    saveLabel = 'Save',
    clearLabel = 'Clear and new',
    onSaveClick,
    onClearClick,
    isWorking = false,
    onLoadDropdownData,
    dropdownLists,
    onImageUpload,
    onDownloadImage,
    metadata,

    // Clean API — FormSection heading + description.
    title: titleProp,
    description: descriptionProp,

    // Soft-shimmed legacy props
    caption: legacyCaption,
    heading: legacyHeading,
    hint: legacyHint,
    help: legacyHelp,
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-field-block-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  let title = titleProp;
  if (legacyHeading != null && title == null) {
    warnOnce(
      'field-block-heading',
      '@m-next/field-block: `heading` is deprecated. Use `title`.',
    );
    title = legacyHeading;
  }
  if (legacyCaption != null && title == null) {
    warnOnce(
      'field-block-caption',
      '@m-next/field-block: `caption` is deprecated. Use `title`.',
    );
    title = legacyCaption;
  }

  let description = descriptionProp;
  if (legacyHint != null && description == null) {
    warnOnce(
      'field-block-hint',
      '@m-next/field-block: `hint` is deprecated. Use `description`.',
    );
    description = legacyHint;
  }
  if (legacyHelp != null && description == null) {
    warnOnce(
      'field-block-help',
      '@m-next/field-block: `help` is deprecated. Use `description`.',
    );
    description = legacyHelp;
  }

  if (legacyForwardRef) {
    warnOnce(
      'field-block-forwardRef-prop',
      '@m-next/field-block: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // Merge external ref (forwardRef API + legacy forwardRef prop) — only a no-op
  // for compatibility, since the underlying Container doesn't currently accept a ref.
  // Held here so consumers can adopt the standard `ref={}` shape ahead of internal plumbing.
  const internalContainerRef = useRef(null);
  useEffect(() => {
    const targetRef = ref ?? legacyForwardRef;
    if (!targetRef) return;
    if (typeof targetRef === 'function') {
      targetRef(internalContainerRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      targetRef.current = internalContainerRef.current;
    }
  }, [ref, legacyForwardRef]);

  // ============ State ============

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [enableEditMode, setEnableEditMode] = useState(false);
  const [internalMode, setInternalMode] = useState(mode);
  const [internalData, setInternalData] = useState(data);

  useEffect(() => {
    setInternalMode(mode);
  }, [mode]);

  useEffect(() => {
    setInternalData(data);
  }, [data]);

  useEffect(() => {
    if (forceOpen) {
      setIsCollapsed(false);
    }
  }, [forceOpen]);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (onMoreClick) onMoreClick(!isCollapsed);
  };

  const handleToggleEditMode = () => {
    setInternalMode(enableEditMode ? 0 : 1);
    setEnableEditMode(!enableEditMode);
  };

  const handleSave = () => {
    if (onSaveClick) onSaveClick(internalData);
  };
  const handleClear = () => {
    if (onClearClick) onClearClick(internalData);
  };

  const fieldIsVisible = (field) => {
    if (field.name === selectedField) return true;
    if (!data) return false;
    const value = data[field.name];

    if (value === null || value === undefined) return false;

    if (typeof field === 'object') {
      let match = false;
      Object.keys(value).forEach((element) => {
        if (value[element] !== null && value[element] !== undefined && value[element] !== '') {
          match = true;
        }
      });

      if (match) return true;
    } else if (value !== '') {
      return true;
    }

    return false;
  };

  const getVisibleFields = () => {
    const visibleFields = [];
    fields.forEach((field) => {
      if (isCollapsed && collapseEmpty && field.isVisible) {
        if (fieldIsVisible(field)) {
          visibleFields.push(field);
        }
      } else if (field.isVisible) {
        visibleFields.push(field);
      }
    });
    return visibleFields;
  };

  const hasHiddenFields = () => {
    const hiddenFields = [];
    fields.forEach((field) => {
      if (collapseEmpty && field.isVisible) {
        if (!fieldIsVisible(field)) {
          hiddenFields.push(field);
        }
      }
    });
    return hiddenFields.length > 0;
  };

  const handleChange = (fieldName, value) => {
    const update = { ...internalData };
    update[fieldName] = value;
    setInternalData(update);
  };

  // ============ Render ============

  const titleId = title ? `${id}-field-block-title` : undefined;

  const renderContent = () => {
    if (!fields || fields.length === 0) {
      return (
        <s.EmptyWrapper>
          <strong>No fields added</strong>
        </s.EmptyWrapper>
      );
    }

    if (error) {
      return (
        <s.EmptyWrapper>
          <strong>Unable to load fields</strong>
          <Button id={`${id}-field-block-refetch`} value='Try again' onClick={onRefetch} buttonStyle='link' />
        </s.EmptyWrapper>
      );
    }

    if (isLoading) {
      return <LoadingSkeleton count={fields.length} height={40} style={{ marginBottom: 8 }} />;
    }

    return (
      <>
        {showEdit && (
          <s.ButtonFooter>
            <SvgIcon
              id={`${id}-edit`}
              testId={`${id}-edit`}
              size={16}
              name='edit'
              color={colors.blue.base}
              onClick={handleToggleEditMode}
              disabled={isWorking}
            />
          </s.ButtonFooter>
        )}
        {getVisibleFields().map((field) => (
          <FieldBlockLine
            id={id}
            key={field.name}
            field={field}
            value={internalData ? internalData[field.name] : null}
            metadata={metadata ? metadata[field.name] : null}
            displayPreferences={displayPreferences}
            tagsList={tagsList}
            onSelect={onSelect}
            selected={selectedField}
            mode={field.isReadOnly ? 0 : internalMode}
            validationError={validationErrors ? validationErrors[field.name] : null}
            onChange={handleChange}
            onLoadDropdownData={onLoadDropdownData}
            options={dropdownLists && dropdownLists[field.name] ? dropdownLists[field.name] : null}
            onImageUpload={onImageUpload}
            onDownloadImage={onDownloadImage}
          />
        ))}
        {collapseEmpty && hasHiddenFields() && (
          <s.CollapseEmptyButton>
            <Button
              forwardRef={showMoreRef}
              id={`${id}-field-block-collapse`}
              buttonStyle='link'
              onClick={handleCollapse}
              value={isCollapsed ? 'Show more' : 'Show less'}
            />
          </s.CollapseEmptyButton>
        )}
        {internalMode === 1 && (
          <s.ButtonFooter>
            {showClearAndNew && (
              <Button
                id={`${id}-clear`}
                value={clearLabel || 'Save and new'}
                onClick={handleClear}
                buttonStyle={showSave ? 'ghost' : 'primary'}
                disabled={isWorking}
              />
            )}
            {(showSave || enableEditMode) && (
              <Button id={`${id}-save`} value={saveLabel || 'Save'} onClick={handleSave} disabled={isWorking} />
            )}
          </s.ButtonFooter>
        )}
      </>
    );
  };

  const errorFallback = () => (
    <s.EmptyWrapper>
      <strong>Unable to load field block</strong>
    </s.EmptyWrapper>
  );

  return (
    <ErrorBoundary fallback={errorFallback()}>
      <Container
        id={`${id}-field-block`}
        style={{ ...style }}
        isRound={false}
        borderless
        width={width}
        padding={8}
        role='region'
        aria-labelledby={titleId}
      >
        {title && (
          <s.SectionHeader id={titleId}>{title}</s.SectionHeader>
        )}
        {description && (
          <s.SectionDescription id={`${id}-field-block-description`}>{description}</s.SectionDescription>
        )}
        {renderContent()}
      </Container>
    </ErrorBoundary>
  );
});

FieldBlock.displayName = 'FieldBlock';
FieldBlock.propTypes = propTypes;

export default FieldBlock;
