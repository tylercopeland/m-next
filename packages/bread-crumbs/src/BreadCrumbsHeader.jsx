import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { Text } from '@m-next/typeography';
import { useTheme } from '@mui/material';
import { IconMenuList, MenuItem } from '@m-next/menu';
import { lightTheme } from '@m-next/styles';
import { interactions } from '@m-next/utilities';
import * as s from './BreadCrumbsHeader.styles';

const propTypes = {
  id: PropTypes.string,
  showMenu: PropTypes.bool,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      onClick: PropTypes.func,
    }),
  ),
  crumbs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      onClick: PropTypes.func,
      tooltip: PropTypes.string,
    }),
  ),
  tooltipId: PropTypes.string,
  style: PropTypes.instanceOf(Object),
  className: PropTypes.string,
  iconName: PropTypes.string,
};

function BreadCrumbsHeader({ id, showMenu, menuItems, crumbs, tooltipId, style, className, iconName = 'screens-V4' }) {
  const { content: themeContent } = useTheme();
  const content = themeContent ?? lightTheme.content;
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setActive(-1);
    setOpen(false);
  }, [crumbs]);

  const handleKeyPress = (e) => {
    const keyPressed = e.keyCode;

    if ([9, 13, 27, 32, 35, 36, 38, 40].includes(keyPressed)) {
      interactions.preventPropagation(e);
    }

    switch (keyPressed) {
      case 9:
      case 27:
        setActive(-1);
        setOpen(false);
        break;
      case 13:
      case 32:
        if (active === -1) setActive(0);
        else menuItems[active].onClick();
        setActive(-1);
        break;
      case 35:
        setActive(menuItems.length - 1);
        break;
      case 36:
        setActive(0);
        break;
      case 38:
        setActive(active === 0 ? menuItems.length - 1 : active - 1);
        break;
      case 40:
        setActive(active === menuItems.length - 1 ? 0 : active + 1);
        break;
      default:
        break;
    }
  };

  return (
    <s.HeaderWrapper id={id} style={style} className={className}>
      <SvgIcon
        id={`${id}-icon`}
        name={iconName}
        color={crumbs?.length > 1 ? content.secondary : content.primary}
        size={16}
      />
      <s.CrumbsWrapper id={`${id}-crumbs`} aria-label='right-panel-breadcrumb'>
        {crumbs?.map((crumb, index) => (
          <div key={crumb.id}>
            <Text
              id={`${id}-${crumb.id}-crumb`}
              bold
              ellipsis
              onClick={crumb.onClick}
              color={index < crumbs.length - 1 ? content.secondary : content.primary}
              fontSize='mediumLarge'
              tooltip={crumb.tooltip}
              tooltipId={tooltipId}
              tooltipPlace='left'
              aria-current={index === crumbs.length - 1 ? 'page' : null}
            >
              {crumb.label}
            </Text>
            {index < crumbs.length - 1 && <Text style={{ paddingLeft: 4 }}>/</Text>}
          </div>
        ))}
      </s.CrumbsWrapper>

      {showMenu && (
        <IconMenuList
          id={id}
          inline
          relativeToParent
          icon='navigation-show-more'
          color={content.primary}
          size={16}
          iconRotation='transform: rotate(90deg)'
          onKeyUp={handleKeyPress}
          horizontalAlign='right'
          width={180}
          open={open}
          onToggle={setOpen}
        >
          {menuItems.map((item, index) => (
            <MenuItem
              key={item.id}
              id={item.id}
              style={{ fontWeight: 400 }}
              onClick={item.onClick}
              active={active === index}
            >
              {item.label}
            </MenuItem>
          ))}
        </IconMenuList>
      )}
    </s.HeaderWrapper>
  );
}

BreadCrumbsHeader.propTypes = propTypes;
export default BreadCrumbsHeader;
