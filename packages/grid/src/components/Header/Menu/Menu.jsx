/* eslint-disable no-nested-ternary */
import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { IconMenuList, MenuItem } from '@m-next/menu';
import { breakpointNames } from '@m-next/styles';

const KEY_CODES = {
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  END: 35,
  HOME: 36,
  UP: 38,
  DOWN: 40,
};

const ACTION_TYPES = {
  REFRESH: 'refresh',
  EXPORT: 'export',
  SORT: 'sort',
};

const Menu = ({
  id = 'defaultMenuId',
  showRefresh = false,
  showExport = false,
  showSort = false,
  showShowHide = false,
  onRefresh,
  onExport,
  onSort,
  onShowHideColumns,
  rowCount = 0,
  size,
  disabled = false,
  customActions = null,
  onCustomActionClick,
}) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const actions = useMemo(() => {
    const userActions = [
      showRefresh && {
        label: 'Refresh',
        value: ACTION_TYPES.REFRESH,
      },
      showExport && {
        label: 'Export to CSV',
        value: ACTION_TYPES.EXPORT,
        disabled: rowCount === 0,
      },
      showShowHide && {
        label: 'Show/Hide Columns',
        value: ACTION_TYPES.SHOWHIDE,
      },
      showSort && {
        label: 'Sort',
        value: ACTION_TYPES.SORT,
      },
    ].filter(Boolean);

    if (customActions) {
      userActions.push(...customActions);
    }
    return userActions;
  }, [customActions, rowCount, showExport, showRefresh, showSort, showShowHide]);

  const handleAction = (action) => {
    if (action.disabled) return;

    const actionHandlers = {
      [ACTION_TYPES.REFRESH]: onRefresh,
      [ACTION_TYPES.EXPORT]: onExport,
      [ACTION_TYPES.SHOWHIDE]: onShowHideColumns,
      [ACTION_TYPES.SORT]: onSort,
      default: () => onCustomActionClick?.(action.value),
    };

    const handler = actionHandlers[action.value] || actionHandlers.default;
    handler?.();
    setOpen(false);
  };

  const handleKeyPress = (e) => {
    const { keyCode } = e;

    // Handle closing menu
    if ([KEY_CODES.TAB, KEY_CODES.ESCAPE].includes(keyCode)) {
      setActiveIndex(-1);
      return;
    }

    // Handle menu item selection
    if (activeIndex !== -1 && [KEY_CODES.ENTER].includes(keyCode)) {
      handleAction(actions[activeIndex]);
      setActiveIndex(-1);
      setOpen(false);
      return;
    }

    // Handle initial menu item selection
    if (activeIndex === -1 && [KEY_CODES.ENTER].includes(keyCode)) {
      setActiveIndex(0);
      return;
    }

    // Handle navigation to start/end
    if (keyCode === KEY_CODES.HOME) setActiveIndex(0);
    if (keyCode === KEY_CODES.END) setActiveIndex(actions.length - 1);

    // Handle up/down navigation
    if (keyCode === KEY_CODES.DOWN) {
      setActiveIndex((prev) => (prev === -1 ? 0 : prev === actions.length - 1 ? 0 : prev + 1));
    }
    if (keyCode === KEY_CODES.UP) {
      setActiveIndex((prev) => (prev === -1 ? actions.length - 1 : prev === 0 ? actions.length - 1 : prev - 1));
    }
  };

  const isCompactSize = size === breakpointNames.xs || size === breakpointNames.sm;

  return (
    <IconMenuList
      id={id}
      marginVertical={4}
      icon='navigation-show-more'
      iconBorder={!isCompactSize}
      horizontalAlign='right'
      onKeyUp={handleKeyPress}
      disabled={disabled}
      inline
      relativeToParent
      width='200px'
      open={open}
      onToggle={setOpen}
    >
      {actions.map((action, index) => (
        <MenuItem
          key={action.value}
          id={`${id}-item-${action.value}`}
          onClick={() => handleAction(action)}
          disabled={action.disabled}
          active={index === activeIndex}
        >
          {action.label}
        </MenuItem>
      ))}
    </IconMenuList>
  );
};

Menu.propTypes = {
  id: PropTypes.string,
  showRefresh: PropTypes.bool,
  showExport: PropTypes.bool,
  showShowHide: PropTypes.bool,
  showSort: PropTypes.bool,
  onRefresh: PropTypes.func,
  onExport: PropTypes.func,
  onShowHideColumns: PropTypes.func,
  onSort: PropTypes.func,
  rowCount: PropTypes.number,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  customActions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  onCustomActionClick: PropTypes.func,
};

export default Menu;
