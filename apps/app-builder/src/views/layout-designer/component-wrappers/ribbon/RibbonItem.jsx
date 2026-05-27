import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import * as s from './Ribbon.styles';

const propTypes = {
  id: PropTypes.string,
  icon: PropTypes.string,
  name: PropTypes.string,
  recordCount: PropTypes.number,
  onClick: PropTypes.func,
  color: PropTypes.string,
  menuRef: PropTypes.instanceOf(Object),
  selected: PropTypes.bool,
};

function RibbonItem({ id, icon, name, recordCount, onClick, color, menuRef , selected}) {
  const colorName = useMemo(() => (color === 'pink' ? 'fuchsia' : color), [color]);
  const iconColor = useMemo(() => colors[`${colorName}-darker`] || colors['blue-dark'], [colorName]);
  const backgroundColor = useMemo(() => colors[`${colorName}-clear`] || colors[`blue-clear`], [colorName]);

  const recordCountDisplay = useMemo(() => (recordCount > 99 ? '99+' : recordCount?.toString()), [recordCount]);
  const handleKeyDown = (e) => {
    switch (e.which) {
      case 38: // Up arrow
      case 40: // down arrow
        {
          const currentId = e.target.id;
          const children = [].slice.call(menuRef.current.children);
          const index = children.findIndex((x) => x.id === currentId);

          if (index === -1) break;

          if (children.findIndex((x) => x.className.indexOf('tooltip') > -1) > -1) {
            // Up arrow
            if (e.which === 38) {
              if (index === 1) menuRef.current.children[children.length - 1].focus();
              else menuRef.current.children[index - 1].focus();
            }

            // Down arrow
            if (index === children.length - 1) menuRef.current.children[1].focus();
            else menuRef.current.children[index + 1].focus();
          }

          // Up arrow
          if (e.which === 38) {
            if (index === 0) menuRef.current.children[children.length - 1].focus();
            else menuRef.current.children[index - 1].focus();
          }

          // Down arrow
          if (index === children.length - 1) menuRef.current.children[0].focus();
          else menuRef.current.children[index + 1].focus();

          e.preventDefault();
          e.stopPropagation();
        }
        break;
      case 36: // home
        {
          const children = [].slice.call(menuRef.current.children);

          if (children.findIndex((x) => x.className.indexOf('tooltip') > -1) > -1) menuRef.current.children[1].focus();
          else menuRef.current.children[0].focus();
        }
        break;
      case 35: // end
        {
          const children = [].slice.call(menuRef.current.children);
          menuRef.current.children[children.length - 1].focus();

          e.preventDefault();
          e.stopPropagation();
        }
        break;
      case 13: // enter
      case 32: // space
        if (onClick) onClick(e);
        e.preventDefault();
        e.stopPropagation();
        break;
      default:
        break;
    }
  };

  return (
    <s.RibbonItem
      id={id}
      onClick={onClick}
      value={id}
      color={iconColor}
      backgroundColor={backgroundColor}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role='menuitem'
      selected={selected}
    >
      <s.RibbonIcon id={`icon-${id}`} color={iconColor} backgroundColor={backgroundColor}>
        <SvgIcon name={icon} size={16} />
        {recordCount > 0 && <s.RibbonIconCount className='ribbon-icon-count'>{recordCountDisplay}</s.RibbonIconCount>}
      </s.RibbonIcon>
      <s.RibbonCaptionDesktop>{`${name}`}</s.RibbonCaptionDesktop>
    </s.RibbonItem>
  );
}

RibbonItem.propTypes = propTypes;
export default RibbonItem;
