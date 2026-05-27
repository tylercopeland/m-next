import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { interactions } from '@m-next/utilities';
import { colors, lightTheme } from '@m-next/styles';
import { TextLine } from '@m-next/typeography';

import * as s from './Accordion.styles';
// types
const propTypes = {
  index: PropTypes.number,
  id: PropTypes.string,
  onDisableDragging: PropTypes.func,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  isSelected: PropTypes.bool,
  children: PropTypes.node,
  caption: PropTypes.string,
  subTitle: PropTypes.string,
  isDragable: PropTypes.bool,
};

function Accordion({
  id,
  index,
  onDisableDragging,
  onSelect,
  open,
  isSelected,
  children,
  caption,
  isDragable,
  subTitle,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [ignoreScroll, setIgnoreScroll] = useState(false);

  const headerRef = useRef();

  useEffect(() => {
    if (open) setIsOpen(true);
  }, [open]);

  useEffect(() => {
    if (isSelected && !ignoreScroll) {
      headerRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setIgnoreScroll(false);
  }, [ignoreScroll, isSelected]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseEnter = () => {
    if (onDisableDragging) onDisableDragging(index);
  };
  const handleMouseLeave = () => {
    if (onDisableDragging) onDisableDragging(null);
  };

  const handleOnClick = () => {
    if (onSelect) onSelect(caption);
    setIgnoreScroll(true);
  };

  return (
    <s.Wrapper
      isOpen={isOpen}
      id={`accordion-${id}`}
      data-testid={`accordion-${id}`}
      onKeyUp={interactions.handleEnterKey(toggleOpen)}
      tabIndex={0}
      isSelected={isSelected}
      onClick={handleOnClick}
    >
      <s.Header
        id={`accordion-header-${id}`}
        data-testid={`accordion-header-${id}`}
        onClick={toggleOpen}
        isOpen={isOpen}
        ref={headerRef}
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
        <div style={{ flexGrow: 1, lineBreak: 'anywhere' }}>
          <TextLine id={`accordion-caption-${id}`} style={{ padding: subTitle ? null : '8px 0px' }}>
            {caption}
          </TextLine>
          {subTitle && (
            <TextLine fontSize='small' color={colors.grey}>
              {subTitle}
            </TextLine>
          )}
        </div>
        <SvgIcon
          id={`accordion-caption-icon-${id}`}
          name={isOpen ? 'chevron-up-V4' : 'chevron-down-V4'}
          size={20}
          color={lightTheme.content.subtle}
        />
      </s.Header>
      <s.Content
        isOpen={isOpen}
        id={`accordion-content-${id}`}
        data-testid={`accordion-content-${id}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <s.Spacer />
        {children}
      </s.Content>
    </s.Wrapper>
  );
}

Accordion.propTypes = propTypes;
export default Accordion;
