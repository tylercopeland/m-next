/* eslint-disable react/no-danger */
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import Pill from '@m-next/pill';
import { interactions } from '@m-next/utilities';
import { colors, lightTheme } from '@m-next/styles';
import { Text } from '@m-next/typeography';
import * as s from './Accordion.styles';

const propTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.number,
  onDisableDragging: PropTypes.func,
  onSelect: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  isSelected: PropTypes.bool,
  children: PropTypes.node,
  caption: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  isDragable: PropTypes.bool,
  isValid: PropTypes.bool,
  contentStyle: PropTypes.instanceOf(Object),
  tooltip: PropTypes.string,
  tooltipId: PropTypes.string,
  onAdd: PropTypes.func,
  variant: PropTypes.oneOf(['right', 'left']),
  addButtonRef: PropTypes.instanceOf(Object),
  borderless: PropTypes.bool,
  hasBetaPill: PropTypes.bool,
  allowHtml: PropTypes.bool,
  suppressSubTitleIcon: PropTypes.bool,
};

const CaptionSectionPropTypes = {
  caption: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  tooltipId: PropTypes.string,
  id: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  variant: PropTypes.oneOf(['left', 'right']),
  isOpen: PropTypes.bool,
  onAdd: PropTypes.func,
  handleToggle: PropTypes.func,
  hasBetaPill: PropTypes.bool,
  allowHtml: PropTypes.bool,
  suppressSubTitleIcon: PropTypes.bool,
};

const HeaderIcon = ({ isOpen, id, onClick }) => (
  <SvgIcon
    id={`accordion-caption-icon-${id}`}
    testId={`accordion-caption-icon-${id}`}
    name={isOpen ? 'chevron-up-V4' : 'chevron-down-V4'}
    size={12}
    color={lightTheme.content.subtle}
    onKeyUp={interactions.handleEnterKey(onClick)}
    tabIndex={0}
  />
);

const AddButton = ({ onAdd, id, tooltip, tooltipId, addButtonRef }) => {
  if (!onAdd) return null;

  const handleClick = (e) => {
    interactions.preventPropagation(e);
    onAdd(e);
  };

  return (
    <SvgIcon
      id={`accordion-caption-add-icon-${id}`}
      testId={`accordion-caption-add-icon-${id}`}
      name='plus-V4'
      size={16}
      color={lightTheme.content.subtle}
      onKeyUp={interactions.handleEnterKey(handleClick)}
      tabIndex={0}
      onClick={handleClick}
      forwardRef={addButtonRef}
      tooltip={tooltip}
      tooltipId={tooltipId}
      hoverColor={colors['grey-darker']}
    />
  );
};

const CaptionSection = ({
  caption,
  tooltip,
  tooltipId,
  id,
  subTitle,
  variant,
  isOpen,
  onAdd,
  handleToggle,
  hasBetaPill,
  allowHtml = false,
  suppressSubTitleIcon = false,
}) => {
  const subtitleRef = useRef(null);

  useEffect(() => {
    if (!subtitleRef.current) return;

    const oldRef = subtitleRef.current;
    const links = subtitleRef.current.querySelectorAll('a');
    links.forEach((link) => link.addEventListener('click', (e) => e.stopPropagation()));

    return () => {
      if (!oldRef) return; // ✅ Ensure the ref still exists before cleanup
      links.forEach((link) => link.removeEventListener('click', (e) => e.stopPropagation()));
    };
  }, [subTitle]);

  const renderHeaderIcon = variant === 'left' && (
    <HeaderIcon isOpen={isOpen} variant={variant} onAdd={onAdd} id={id} onClick={handleToggle} />
  );

  const mainCaption =
    tooltip && !onAdd ? (
      <Text
        id={`accordion-caption-${id}`}
        bold
        tooltip={tooltip}
        tooltipId={tooltipId}
        tabIndex={0}
        style={{ cursor: 'pointer' }}
      >
        {caption}
      </Text>
    ) : (
      <Text
        id={`accordion-caption-${id}`}
        style={{
          cursor: 'pointer',
        }}
        bold
        tabIndex={0}
      >
        {caption}
      </Text>
    );

  return (
    <div style={{ flexGrow: 1, lineBreak: 'anywhere' }}>
      <s.CaptionWrapper>
        {mainCaption}
        {hasBetaPill && (
          <Pill size='regular' colorScheme='grey'>
            Beta
          </Pill>
        )}
        {renderHeaderIcon}
      </s.CaptionWrapper>

      {subTitle && (
        <s.CaptionWrapper ref={subtitleRef}>
          <Text fontSize='small' color={colors.grey} bold>
            {!allowHtml && subTitle}
            {}
            {allowHtml && <span dangerouslySetInnerHTML={{ __html: subTitle }} />}
          </Text>
          {!suppressSubTitleIcon && renderHeaderIcon}
        </s.CaptionWrapper>
      )}
    </div>
  );
};

CaptionSection.propTypes = CaptionSectionPropTypes;

const Accordion = ({
  id,
  index,
  onDisableDragging,
  onSelect,
  onClose,
  open = false,
  isSelected = false,
  children,
  caption,
  isDragable = false,
  subTitle,
  isValid = true,
  contentStyle,
  tooltip,
  tooltipId,
  onAdd,
  variant = 'right',
  addButtonRef,
  borderless = false,
  hasBetaPill = false,
  allowHtml = false,
  suppressSubTitleIcon = false,
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const [ignoreScroll, setIgnoreScroll] = useState(false);
  const headerRef = useRef();

  // Handle initial open state
  useEffect(() => {
    if (open) setIsOpen(true);
  }, [open]);

  // Handle scroll into view when selected
  useEffect(() => {
    if (isSelected && !ignoreScroll) {
      headerRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setIgnoreScroll(false);
  }, [ignoreScroll, isSelected]);

  // Event handlers
  const handleSelect = () => {
    onSelect?.();
    setIgnoreScroll(true);
  };

  const handleToggle = (e) => {
    setIsOpen((prev) => !prev);
    if (isOpen && onClose) {
      onClose();
      e.stopPropagation();
    }
  };

  const handleDragEnter = () => onDisableDragging?.(index);
  const handleDragLeave = () => onDisableDragging?.(null);

  return (
    <s.Wrapper
      isOpen={isOpen}
      id={`accordion-${id}`}
      data-testid={`accordion-${id}`}
      tabIndex={-1}
      isSelected={isSelected}
      onClick={handleSelect}
      isValid={isValid}
      borderless={borderless}
      role='region'
      aria-expanded={isOpen}
    >
      <s.Header
        id={`accordion-header-${id}`}
        data-testid={`accordion-header-${id}`}
        onClick={handleToggle}
        onKeyUp={interactions.handleEnterKey(handleToggle)}
        isOpen={isOpen}
        ref={headerRef}
        role='button'
        height={borderless ? null : 32}
      >
        {isDragable && (
          <SvgIcon
            id={`accordion-drag-${id}`}
            name='drag'
            size={16}
            color={lightTheme.content.primary}
            style={{ cursor: 'grab' }}
          />
        )}

        <CaptionSection
          caption={caption}
          tooltip={tooltip}
          tooltipId={tooltipId}
          id={id}
          subTitle={subTitle}
          variant={variant}
          isOpen={isOpen}
          onAdd={onAdd}
          handleToggle={handleToggle}
          hasBetaPill={hasBetaPill}
          allowHtml={allowHtml}
          suppressSubTitleIcon={suppressSubTitleIcon}
        />

        {!isValid && <SvgIcon name='warning-sign' color={lightTheme.negative.secondary} size={16} />}

        <AddButton onAdd={onAdd} id={id} tooltip={tooltip} tooltipId={tooltipId} addButtonRef={addButtonRef} />

        {variant === 'right' && (
          <HeaderIcon isOpen={isOpen} variant={variant} onAdd={onAdd} id={id} onClick={handleToggle} />
        )}
      </s.Header>

      <s.Content
        isOpen={isOpen}
        id={`accordion-content-${id}`}
        data-testid={`accordion-content-${id}`}
        onMouseEnter={handleDragEnter}
        onMouseLeave={handleDragLeave}
        style={contentStyle}
        role='region'
        aria-labelledby={`accordion-header-${id}`}
      >
        <s.Spacer />
        {children}
      </s.Content>
    </s.Wrapper>
  );
};

Accordion.propTypes = propTypes;

export default Accordion;
