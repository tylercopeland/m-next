import React, { useState, useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { ClickOutside } from '@m-next/utilities';
import { useResizeDetector } from 'react-resize-detector';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { colors } from '@m-next/styles';
import * as s from './TabsV2.styles';

const queryAttr = 'data-rbd-drag-handle-draggable-id';

/* ------------------------------------------------------- *
                  HOOKS & HELPERS 
 * --------------------------------------------------------*/

/**
 * Find the actual DOM width for each tab item by its id
 * @param {string} tabId - The ID of the tab to find
 * @param {Array} tabWidths - Array of tab width objects {id, size}
 * @returns {number} The width of the tab including any margins
 */
const findTabWidthFromList = (tabId, tabWidths) => {
  const tabData = tabWidths.find((tab) => tab?.id === tabId);
  return tabData ? tabData.size : 0; // No margin in V2 tabs
};

/**
 * Calculate available widths for tab layout
 * @param {Object} wrapperRef - Reference to the wrapper element
 * @param {boolean} onRenderTabHeaderRightIcon - Whether right icon is present
 * @returns {Object} Object containing containerWidth, availableWidthWithoutMore, availableWidthWithMore
 */
const calculateAvailableWidths = (wrapperRef, onRenderTabHeaderRightIcon) => {
  const SPACE_AROUND = 16;
  const ICON_RIGHT_WIDTH = 28;
  const MORE_MENU_BTN_WIDTH = 48;

  const parentWidth = wrapperRef.current.parentElement
    ? wrapperRef.current.parentElement.offsetWidth
    : wrapperRef.current.offsetWidth;
  const containerWidth = parentWidth - SPACE_AROUND * 2;
  const rightIconWidth = onRenderTabHeaderRightIcon ? ICON_RIGHT_WIDTH : 0;

  return {
    containerWidth,
    availableWidthWithoutMore: containerWidth - rightIconWidth,
    availableWidthWithMore: containerWidth - rightIconWidth - MORE_MENU_BTN_WIDTH,
    rightIconWidth,
  };
};

/**
 * Calculate which tabs should be visible based on available width
 * @param {Array} currentTabsList - Current tabs list
 * @param {Array} tabWidthList - List of tab widths
 * @param {number} availableWidthWithMore - Available width when More button is present
 * @param {string} selectedTab - Currently selected tab ID
 * @returns {Array} Array of visibility boolean values
 */
const calculateTabVisibility = (currentTabsList, tabWidthList, availableWidthWithMore, selectedTab) => {
  let sum = 0;
  let lastVisibleTabIndex = -1;
  const tabVisibility = [];

  currentTabsList.forEach((tab, index) => {
    const tabWidth = findTabWidthFromList(tab.id, tabWidthList);
    const wouldFit = sum + tabWidth <= availableWidthWithMore;

    if (wouldFit) {
      sum += tabWidth;
      if (selectedTab !== tab.id) {
        lastVisibleTabIndex = index;
      }
      tabVisibility[index] = true;
    } else {
      tabVisibility[index] = false;
    }
  });

  return { tabVisibility, lastVisibleTabIndex };
};

/**
 * Ensure the selected tab is always visible by adjusting visibility
 * @param {Array} updatedTabsList - Tabs list with initial visibility
 * @param {string} selectedTab - Currently selected tab ID
 * @param {number} lastVisibleTabIndex - Index of last visible non-selected tab
 * @returns {Array} Final tabs list with adjusted visibility
 */
const ensureSelectedTabVisible = (updatedTabsList, selectedTab, lastVisibleTabIndex) => {
  const selectedTabIndex = updatedTabsList.findIndex((tab) => tab.id === selectedTab);

  if (selectedTabIndex > -1 && !updatedTabsList[selectedTabIndex].visible) {
    // Create final array with selected tab visible and last visible hidden
    return updatedTabsList.map((tab, index) => {
      if (index === selectedTabIndex) {
        return { ...tab, visible: true };
      }
      if (index === lastVisibleTabIndex) {
        return { ...tab, visible: false };
      }
      return tab;
    });
  }

  return updatedTabsList;
};

/**
 * Update container width based on tab layout requirements
 * @param {Object} wrapperRef - Reference to the wrapper element
 * @param {boolean} fullWidthTabs - Whether tabs should use full width
 * @param {number} totalTabsWidth - Total width of all tabs
 * @param {number} rightIconWidth - Width of right icon if present
 * @param {boolean} needsMoreButton - Whether More button is needed
 */
const updateContainerWidth = (wrapperRef, fullWidthTabs, totalTabsWidth, rightIconWidth, needsMoreButton) => {
  const wrapperElement = wrapperRef.current;
  if (!wrapperElement || fullWidthTabs) return;

  const CONTAINER_PADDING = 8;

  if (!needsMoreButton) {
    // Set container width to wrap content
    const exactWidthNeeded = totalTabsWidth + CONTAINER_PADDING + rightIconWidth;
    const currentStyle = wrapperElement.style.width;
    const targetWidth = `${exactWidthNeeded}px`;

    // Only update if significantly different to prevent micro-adjustments
    if (currentStyle !== targetWidth && Math.abs(parseInt(currentStyle, 10) - exactWidthNeeded) > 2) {
      wrapperElement.style.width = targetWidth;
    }
  } else {
    // Use full width for overflow layout
    const currentStyle = wrapperElement.style.width;
    if (currentStyle !== '100%' && currentStyle !== '') {
      wrapperElement.style.width = '100%';
    }
  }
};

/**
 * Calculate current navigation state for keyboard navigation
 * @param {string} selectedTab - Currently selected tab ID
 * @param {Array} tabList - All tabs
 * @param {Array} visibleList - Visible tabs
 * @param {Array} hiddenList - Hidden tabs
 * @param {number} hiddenListNavIndex - Current hidden list navigation index
 * @returns {Object} Navigation state object
 */
const calculateNavigationState = (selectedTab, tabList, visibleList, hiddenList, hiddenListNavIndex) => {
  const selectedIndex = tabList.findIndex((x) => x.id === selectedTab);
  let hiddenTabIndex = hiddenList.findIndex((x) => x.id === selectedTab);
  let visibleTabIndex = visibleList.findIndex((x) => x.id === selectedTab);

  // If navigating in hidden list, override indices
  if (hiddenTabIndex === -1 && hiddenListNavIndex > -1) {
    hiddenTabIndex = hiddenListNavIndex;
    visibleTabIndex = -1;
  }

  return {
    selectedIndex,
    hiddenTabIndex,
    visibleTabIndex,
    isInHiddenList: hiddenTabIndex > -1,
    isInVisibleList: visibleTabIndex > -1,
  };
};

/**
 * Handle left/up arrow key navigation
 * @param {Object} state - Navigation state
 * @param {Array} visibleList - Visible tabs list
 * @param {Array} hiddenList - Hidden tabs list
 * @param {Function} handleChange - Tab change handler
 * @param {boolean} open - Whether more menu is open
 * @param {Function} setOpen - Set open state
 * @param {Function} setHiddenListNavIndex - Set hidden nav index
 * @param {Object} e - Event object
 */
const handleLeftUpNavigation = (
  state,
  visibleList,
  hiddenList,
  handleChange,
  open,
  setOpen,
  setHiddenListNavIndex,
  e,
) => {
  const { selectedIndex, hiddenTabIndex, visibleTabIndex } = state;

  // Navigating within hidden list
  if (hiddenTabIndex > 0) {
    if (!open) setOpen(true);
    setHiddenListNavIndex(hiddenTabIndex - 1);
    return;
  }

  // At beginning of hidden list, move to last visible tab
  if (hiddenTabIndex === 0) {
    if (open) {
      setOpen(false);
      setHiddenListNavIndex(-1);
    }
    if (visibleList.length > 0) {
      const lastVisibleIndex = visibleList.length - 1;
      handleChange(visibleList[lastVisibleIndex].id, lastVisibleIndex, e);
    }
    return;
  }

  // Navigating within visible tabs
  if (selectedIndex > 0 && visibleTabIndex > -1) {
    const newTabIndex = visibleTabIndex - 1;
    // Bounds check to prevent crash
    if (newTabIndex >= 0 && visibleList[newTabIndex]) {
      handleChange(visibleList[newTabIndex].id, newTabIndex, e);
    }
    return;
  }

  // Fallback: go to last visible tab
  if (visibleList.length > 0) {
    const lastVisibleIndex = visibleList.length - 1;
    handleChange(visibleList[lastVisibleIndex].id, lastVisibleIndex, e);
  }
};

/**
 * Navigate to the next tab in the hidden list
 * @param {number} hiddenTabIndex - Current hidden tab index
 * @param {Array} hiddenList - Hidden tabs list
 * @param {boolean} open - Whether more menu is open
 * @param {Function} setOpen - Set open state
 * @param {Function} setHiddenListNavIndex - Set hidden nav index
 * @returns {boolean} True if navigation was handled
 */
const navigateInHiddenList = (hiddenTabIndex, hiddenList, open, setOpen, setHiddenListNavIndex) => {
  if (hiddenTabIndex > -1 && hiddenTabIndex < hiddenList.length - 1) {
    if (!open) setOpen(true);
    setHiddenListNavIndex(hiddenTabIndex + 1);
    return true;
  }
  return false;
};

/**
 * Navigate from end of hidden list to first visible tab
 * @param {number} hiddenTabIndex - Current hidden tab index
 * @param {Array} hiddenList - Hidden tabs list
 * @param {Array} visibleList - Visible tabs list
 * @param {boolean} open - Whether more menu is open
 * @param {Function} setOpen - Set open state
 * @param {Function} setHiddenListNavIndex - Set hidden nav index
 * @param {Function} handleChange - Tab change handler
 * @param {Object} e - Event object
 * @returns {boolean} True if navigation was handled
 */
const navigateFromHiddenToVisible = (
  hiddenTabIndex,
  hiddenList,
  visibleList,
  open,
  setOpen,
  setHiddenListNavIndex,
  handleChange,
  e,
) => {
  if (hiddenTabIndex > -1 && hiddenTabIndex === hiddenList.length - 1) {
    if (open) {
      setOpen(false);
      setHiddenListNavIndex(-1);
    }
    if (visibleList.length > 0) {
      handleChange(visibleList[0].id, 0, e);
    }
    return true;
  }
  return false;
};

/**
 * Navigate to the next tab in the visible list
 * @param {number} visibleTabIndex - Current visible tab index
 * @param {Array} visibleList - Visible tabs list
 * @param {Function} handleChange - Tab change handler
 * @param {Object} e - Event object
 * @returns {boolean} True if navigation was handled
 */
const navigateInVisibleList = (visibleTabIndex, visibleList, handleChange, e) => {
  if (visibleTabIndex > -1 && visibleTabIndex < visibleList.length - 1) {
    const newTabIndex = visibleTabIndex + 1;
    // Bounds check to prevent crash
    if (newTabIndex < visibleList.length && visibleList[newTabIndex]) {
      handleChange(visibleList[newTabIndex].id, newTabIndex, e);
    }
    return true;
  }
  return false;
};

/**
 * Navigate from visible list to hidden list or wrap to first visible tab
 * @param {Array} hiddenList - Hidden tabs list
 * @param {Array} visibleList - Visible tabs list
 * @param {boolean} open - Whether more menu is open
 * @param {Function} setOpen - Set open state
 * @param {Function} setHiddenListNavIndex - Set hidden nav index
 * @param {Function} handleChange - Tab change handler
 * @param {Object} e - Event object
 */
const navigateFromVisibleToHiddenOrWrap = (
  hiddenList,
  visibleList,
  open,
  setOpen,
  setHiddenListNavIndex,
  handleChange,
  e,
) => {
  // Move to hidden list if available
  if (hiddenList.length > 0) {
    if (!open) setOpen(true);
    setHiddenListNavIndex(0);
    return;
  }

  // Fallback: go to first visible tab
  if (visibleList.length > 0) {
    handleChange(visibleList[0].id, 0, e);
  }
};

/**
 * Handle right/down arrow key navigation
 * @param {Object} state - Navigation state
 * @param {Array} visibleList - Visible tabs list
 * @param {Array} hiddenList - Hidden tabs list
 * @param {Function} handleChange - Tab change handler
 * @param {boolean} open - Whether more menu is open
 * @param {Function} setOpen - Set open state
 * @param {Function} setHiddenListNavIndex - Set hidden nav index
 * @param {Object} e - Event object
 */
const handleRightDownNavigation = (
  state,
  visibleList,
  hiddenList,
  handleChange,
  open,
  setOpen,
  setHiddenListNavIndex,
  e,
) => {
  const { hiddenTabIndex, visibleTabIndex } = state;

  // Try to navigate within hidden list first
  if (navigateInHiddenList(hiddenTabIndex, hiddenList, open, setOpen, setHiddenListNavIndex)) {
    return;
  }

  // Try to navigate from end of hidden list to first visible tab
  if (
    navigateFromHiddenToVisible(
      hiddenTabIndex,
      hiddenList,
      visibleList,
      open,
      setOpen,
      setHiddenListNavIndex,
      handleChange,
      e,
    )
  ) {
    return;
  }

  // Try to navigate within visible tabs
  if (navigateInVisibleList(visibleTabIndex, visibleList, handleChange, e)) {
    return;
  }

  // Handle end-of-visible-list scenarios (move to hidden or wrap)
  navigateFromVisibleToHiddenOrWrap(hiddenList, visibleList, open, setOpen, setHiddenListNavIndex, handleChange, e);
};

/**
 * Handle home key navigation
 * @param {Array} visibleList - Visible tabs list
 * @param {Function} handleChange - Tab change handler
 * @param {boolean} open - Whether more menu is open
 * @param {Function} setOpen - Set open state
 * @param {Function} setHiddenListNavIndex - Set hidden nav index
 * @param {Object} e - Event object
 */
const handleHomeNavigation = (visibleList, handleChange, open, setOpen, setHiddenListNavIndex, e) => {
  if (open) {
    setOpen(false);
    setHiddenListNavIndex(-1);
  }
  if (visibleList.length > 0) {
    handleChange(visibleList[0].id, 0, e);
  }
};

/**
 * Handle end key navigation
 * @param {Array} visibleList - Visible tabs list
 * @param {Array} hiddenList - Hidden tabs list
 * @param {Function} handleChange - Tab change handler
 * @param {boolean} open - Whether more menu is open
 * @param {Function} setOpen - Set open state
 * @param {Function} setHiddenListNavIndex - Set hidden nav index
 * @param {Object} e - Event object
 */
const handleEndNavigation = (visibleList, hiddenList, handleChange, open, setOpen, setHiddenListNavIndex, e) => {
  if (hiddenList.length > 0) {
    if (!open) setOpen(true);
    setHiddenListNavIndex(hiddenList.length - 1);
  } else if (visibleList.length > 0) {
    const lastVisibleIndex = visibleList.length - 1;
    handleChange(visibleList[lastVisibleIndex].id, lastVisibleIndex, e);
  }
};

/**
 * Handle enter/space key navigation
 * @param {Array} tabList - All tabs
 * @param {Array} hiddenList - Hidden tabs list
 * @param {number} hiddenListNavIndex - Current hidden nav index
 * @param {Function} handleMenuItemClick - Menu item click handler
 * @param {Function} setHiddenListNavIndex - Set hidden nav index
 * @param {Object} e - Event object
 */
const handleEnterSpaceNavigation = (
  tabList,
  hiddenList,
  hiddenListNavIndex,
  handleMenuItemClick,
  setHiddenListNavIndex,
  e,
) => {
  if (hiddenListNavIndex > -1 && hiddenList[hiddenListNavIndex]) {
    const newTabIndex = tabList.findIndex((x) => x.id === hiddenList[hiddenListNavIndex].id);
    if (newTabIndex > -1) {
      handleMenuItemClick(tabList[newTabIndex].id, newTabIndex, e);
    }
  }
  setHiddenListNavIndex(-1);
};

const propTypes = {
  id: PropTypes.string.isRequired,
  tabList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      caption: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onChange: PropTypes.func,
  selectedTab: PropTypes.string,
  onRenderTabHeader: PropTypes.func,
  onRenderTabHeaderMenuItem: PropTypes.func,
  onRenderTabHeaderRightIcon: PropTypes.func,
  tabPadding: PropTypes.number,
  headerStyle: PropTypes.instanceOf(Object),
  legacyPadding: PropTypes.bool,
  refreshId: PropTypes.number,
  onTabOrderChange: PropTypes.func,
  fullWidthTabs: PropTypes.bool,
};

function TabHeaderV2(props) {
  const {
    id = null, // {string} - Tab container id
    tabList = [], // {object[]} - All tabs (tab = { id: string; caption: string; })
    selectedTab = null, // {string} - Id of the active tab
    onChange = null, // {func} - Event handler
    onRenderTabHeader = null, // {func} - Render fn for tab header button
    onRenderTabHeaderMenuItem = null, // {func} - Render fn for each tab in the hidden list (more menu)
    onRenderTabHeaderRightIcon = null,
    tabPadding = 0,
    headerStyle = null,
    legacyPadding = false,
    refreshId = 0,
    onTabOrderChange = null,
    fullWidthTabs = false,
  } = props;

  const containerRef = useRef();
  const [initialVisibility, setInitialVisibility] = useState(0);
  const [internalRefresh, setInternalRefresh] = useState(0);
  const [tabHash, setTabHash] = useState(null);

  useEffect(() => {
    const hash = `${tabList.map((tab) => tab.id).join('-')}-${tabList.length}`;
    if (hash === tabHash) {
      return;
    }
    setTabHash(hash);
    if (tabList.length === 0) {
      setInitialVisibility(0);
    } else {
      setInitialVisibility(0);
      setInternalRefresh((prev) => prev + 1);

      setTimeout(() => {
        setInitialVisibility(1);
        setInternalRefresh((prev) => prev + 1);
      }, 10);
    }
  }, [tabList, tabHash]);

  const [tabBarWidth, setTabBarWidth] = useState(0);

  const [open, setOpen] = useState(false);

  const originalTabsList = useMemo(
    () => tabList.map((tab, index) => ({ ...tab, originalPos: index, visible: true })),
    [tabList],
  );
  const [transformedTabsList, setTransformedTabsList] = useState(originalTabsList);

  const visibleList = useMemo(() => transformedTabsList.filter((tab) => tab.visible), [transformedTabsList]);
  const hiddenList = useMemo(() => transformedTabsList.filter((tab) => !tab.visible), [transformedTabsList]);
  const [placeholderProps, setPlaceholderProps] = useState({});
  const [disableTabs, setDisableTabs] = useState(false);

  const [hiddenListNavIndex, setHiddenListNavIndex] = useState(-1);

  const { width, ref: wrapperRef } = useResizeDetector();

  useEffect(() => {
    if (disableTabs) return;
    if (!wrapperRef.current) return;

    const SPACE_AROUND = 16;
    const ICON_RIGHT_WIDTH = 28;

    // Use parent container width for available space calculation when using fit-content
    const parentWidth = wrapperRef.current.parentElement
      ? wrapperRef.current.parentElement.offsetWidth
      : wrapperRef.current.offsetWidth;
    const containerWidth = parentWidth - SPACE_AROUND * 2;
    const rightIconWidth = onRenderTabHeaderRightIcon ? ICON_RIGHT_WIDTH : 0;
    // Don't pre-subtract More button width - let the main effect decide if it's needed
    const availableWidth = containerWidth - rightIconWidth;

    setTabBarWidth(availableWidth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableTabs, onRenderTabHeaderRightIcon, width]);
  // wrapperRef intentionally excluded to prevent circular dependencies

  // Generate a list of {id, size} from the DOM render
  const tabWidthList = useMemo(() => {
    if (initialVisibility === 0) return []; // Don't query DOM until visible

    const getOriginalId = (domId) => domId.slice(5 + (id.length ?? 0), domId.length);
    const renderedTabHeaders = Array.from(document.querySelectorAll('.mi-TabBar-TabHeaderButton'));

    const list = renderedTabHeaders.map((tab) => ({
      id: getOriginalId(tab.id),
      size: tab.getBoundingClientRect().width + tabPadding,
    }));
    return list;
  }, [id, tabPadding, initialVisibility]);

  useEffect(() => {
    if (disableTabs || initialVisibility === 0 || tabWidthList.length === 0) return;
    if (!wrapperRef.current) return;

    // Calculate dimensions and available space
    const { availableWidthWithoutMore, availableWidthWithMore, rightIconWidth } = calculateAvailableWidths(
      wrapperRef,
      onRenderTabHeaderRightIcon,
    );

    const totalTabsWidthRaw = tabWidthList.reduce((sum, tab) => sum + tab.size, 0);
    const totalTabsWidth = Math.ceil(totalTabsWidthRaw);

    // Create a fresh copy of tabs to avoid mutation issues
    const currentTabsList = tabList.map((tab, index) => ({ ...tab, originalPos: index, visible: true }));

    // Check if all tabs fit without needing a More button
    if (totalTabsWidth <= availableWidthWithoutMore) {
      setTransformedTabsList(currentTabsList);
      updateContainerWidth(wrapperRef, fullWidthTabs, totalTabsWidth, rightIconWidth, false);
      return;
    }

    // Calculate tab visibility when More button is needed
    const { tabVisibility, lastVisibleTabIndex } = calculateTabVisibility(
      currentTabsList,
      tabWidthList,
      availableWidthWithMore,
      selectedTab,
    );

    // Apply initial visibility
    const updatedTabsList = currentTabsList.map((tab, index) => ({
      ...tab,
      visible: tabVisibility[index],
    }));

    // Ensure selected tab is always visible
    const finalTabsList = ensureSelectedTabVisible(updatedTabsList, selectedTab, lastVisibleTabIndex);

    setTransformedTabsList(finalTabsList);
    updateContainerWidth(wrapperRef, fullWidthTabs, totalTabsWidth, rightIconWidth, true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tabBarWidth,
    tabWidthList,
    tabList,
    initialVisibility,
    disableTabs,
    selectedTab,
    onRenderTabHeaderRightIcon,
    fullWidthTabs,
    internalRefresh,
    // wrapperRef intentionally excluded to prevent circular dependencies
  ]);

  const handleChange = (headerId, index, e) => {
    // Find the tab to check if it's disabled
    const tab = tabList.find((t) => t.id === headerId);
    if (!tab) {
      return;
    }
    if (tab.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (onChange) {
      onChange(headerId, index, e);
    }
  };

  const handleToggleList = () => {
    setOpen(!open);
    setHiddenListNavIndex(-1);
  };

  const handleMenuItemClick = (headerId, index, e) => {
    // Find the tab to check if it's disabled
    const tab = tabList.find((t) => t.id === headerId);
    if (!tab) {
      return;
    }
    if (tab.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    handleToggleList();
    handleChange(headerId, index, e);
  };

  const handleOutsideClick = () => {
    setOpen(false);
    setHiddenListNavIndex(-1);
  };

  const handleTabHeaderKeyUp = (e) => {
    // Calculate current navigation state
    const navigationState = calculateNavigationState(selectedTab, tabList, visibleList, hiddenList, hiddenListNavIndex);

    let shouldStopPropagation = false;

    switch (e.which) {
      case 37: // left arrow
      case 38: // up arrow
        handleLeftUpNavigation(
          navigationState,
          visibleList,
          hiddenList,
          handleChange,
          open,
          setOpen,
          setHiddenListNavIndex,
          e,
        );
        shouldStopPropagation = true;
        break;

      case 39: // right arrow
      case 40: // down arrow
        handleRightDownNavigation(
          navigationState,
          visibleList,
          hiddenList,
          handleChange,
          open,
          setOpen,
          setHiddenListNavIndex,
          e,
        );
        shouldStopPropagation = true;
        break;

      case 36: // home
        handleHomeNavigation(visibleList, handleChange, open, setOpen, setHiddenListNavIndex, e);
        shouldStopPropagation = true;
        break;

      case 35: // end
        handleEndNavigation(visibleList, hiddenList, handleChange, open, setOpen, setHiddenListNavIndex, e);
        shouldStopPropagation = true;
        break;

      case 13: // enter
      case 32: // space
        handleEnterSpaceNavigation(
          tabList,
          hiddenList,
          hiddenListNavIndex,
          handleMenuItemClick,
          setHiddenListNavIndex,
          e,
        );
        shouldStopPropagation = true;
        break;

      default:
        // No action needed for other keys
        break;
    }

    if (shouldStopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const getItemStyle = (draggableStyle, isDragging) => ({
    ...draggableStyle,
    borderRadius: isDragging ? 4 : 0,
    background: isDragging ? colors['grey-lighter'] : null,
    boxShadow: isDragging ? '0px 10px 10px 0px rgba(0, 0, 0, 0.25)' : null,
    padding: isDragging ? '8px 4px' : null,
    cursor: 'default',
  });

  const getListStyle = () => ({});

  const reorder = (startIndex, endIndex) => {
    // Preserve complete tab order including visibility state
    const reorderedList = [...transformedTabsList];
    const visibleOnly = reorderedList.filter((tab) => tab.visible);

    const [removed] = visibleOnly.splice(startIndex, 1);
    visibleOnly.splice(endIndex, 0, removed);

    // Reconstruct the full list maintaining visibility
    const hiddenOnly = reorderedList.filter((tab) => !tab.visible);
    return [...visibleOnly, ...hiddenOnly];
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    setPlaceholderProps({});
    setDisableTabs(false);

    if (!result.destination) {
      return;
    }

    const updated = reorder(result.source.index, result.destination.index);
    setTransformedTabsList(updated);

    // Send complete tab order to parent, preserving all properties except visibility
    if (onTabOrderChange) {
      const final = updated.map((tab) => {
        const { visible, ...tabWithoutVisibility } = tab;
        return tabWithoutVisibility;
      });
      onTabOrderChange(final, result.source.index, result.destination.index);
    }
  };

  const onDragUpdate = (update) => {
    if (!update.destination) {
      setPlaceholderProps({
        clientHeight: 0,
        clientWidth: 0,
        clientY: 0,
        clientX: 0,
      });
      return;
    }
    const { draggableId } = update;
    const destinationIndex = update.destination.index;

    const domQuery = `[${queryAttr}='${draggableId}']`;
    const draggedDOM = document.querySelector(domQuery);
    if (!draggedDOM || !draggedDOM.parentNode) {
      setPlaceholderProps({
        clientHeight: 0,
        clientWidth: 0,
        clientY: 0,
        clientX: 0,
      });
      return;
    }
    const { clientHeight, clientWidth } = draggedDOM;

    const clientX =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingLeft) +
      [...draggedDOM.parentNode.children].slice(0, destinationIndex).reduce((total, curr) => {
        const style = curr.currentStyle || window.getComputedStyle(curr);
        const margin = parseFloat(style.marginRight);
        return total + curr.clientWidth + margin;
      }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY: parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) - 8,
      clientX,
    });
  };

  const renderTabHeader = (tab, index, isDragging) => (
    <s.TabHeader
      tabIndex={selectedTab === tab.id ? 0 : -1}
      role='tab'
      aria-controls={`tab-panel-${id}`}
      aria-selected={selectedTab === tab.id}
      aria-disabled={tab.disabled || false}
      key={`tab-${id}-${tab.id}`}
      id={`tab-${id}-${tab.id}`}
      onClick={(e) => handleChange(tab.id, index, e)}
      selected={selectedTab === tab.id}
      disabled={tab.disabled || false}
      className={`mi-TabBar-TabHeaderButton ${selectedTab === tab.id ? 'selected' : ''} ${tab.disabled ? 'disabled' : ''}`}
      onKeyUp={handleTabHeaderKeyUp}
      isDragging={isDragging}
      isDraggable={!!onTabOrderChange}
    >
      {onRenderTabHeader && onRenderTabHeader(tab, refreshId)}
      {!onRenderTabHeader && tab.caption}
    </s.TabHeader>
  );

  const renderMoreTabHeader = (tab, index) => (
    <s.MenuItem
      role='tab'
      key={`tab-${id}-${tab.id}`}
      id={`tab-${id}-${tab.id}`}
      onClick={(e) => handleMenuItemClick(tab.id, index, e)}
      selected={selectedTab === tab.id || hiddenListNavIndex === index}
      disabled={tab.disabled || false}
    >
      {onRenderTabHeaderMenuItem && onRenderTabHeaderMenuItem(tab, refreshId)}
      {!onRenderTabHeaderMenuItem && tab.caption}
    </s.MenuItem>
  );

  return (
    <s.TabHeaderContainer
      className='mi-TabBar-TabHeaderContainer'
      ref={wrapperRef}
      id={`tabs-header-${id}`}
      initialVisibility={initialVisibility}
      fullWidthTabs={fullWidthTabs}
      role='tablist'
      style={headerStyle}
    >
      {/* Main Visible Tabs */}
      <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate} onDragStart={() => setDisableTabs(true)}>
        <Droppable droppableId={`tabs-header-droppable-${id}`} direction='horizontal' type='COLUMN'>
          {(provided) => (
            <s.TabHeaderDroppableContainer {...provided.droppableProps} ref={provided.innerRef} style={getListStyle()}>
              {visibleList.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={!onTabOrderChange}>
                  {(innerProvided, innerSnapshot) => (
                    <div
                      ref={innerProvided.innerRef}
                      {...innerProvided.draggableProps}
                      {...innerProvided.dragHandleProps}
                      style={getItemStyle(innerProvided.draggableProps.style, innerSnapshot.isDragging)}
                    >
                      {renderTabHeader(item, index, innerSnapshot.isDragging)}
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
              <div
                style={{
                  position: 'absolute',
                  background: colors['grey-light'],
                  borderRadius: 4,
                  top: placeholderProps.clientY,
                  left: placeholderProps.clientX,
                  height: placeholderProps.clientHeight,
                  width: placeholderProps.clientWidth,
                }}
              />
              {hiddenList.length > 0 && (
                <s.MoreSection ref={containerRef}>
                  {/* More Menu Button */}
                  <s.Menu legacyPadding={legacyPadding}>
                    <s.MenuHeader id={`tab-${id}-more`} onClick={handleToggleList}>
                      <s.MoreLabel>More</s.MoreLabel>
                      <s.IconHolder id={`tab-${id}-more-caret`}>
                        <SvgIcon name='caret-down' size={8} />
                      </s.IconHolder>
                    </s.MenuHeader>
                  </s.Menu>
                  {/* More Menu Tabs/ Hidden List */}
                  {open && (
                    <ClickOutside parentRef={containerRef} onClickOutsideHandler={handleOutsideClick}>
                      <s.MenuList legacyPadding={legacyPadding}>
                        {hiddenList.map((hiddenTab, index) => renderMoreTabHeader(hiddenTab, index))}
                      </s.MenuList>
                    </ClickOutside>
                  )}
                </s.MoreSection>
              )}
            </s.TabHeaderDroppableContainer>
          )}
        </Droppable>
      </DragDropContext>

      {/* Right hand Icon */}
      {onRenderTabHeaderRightIcon !== null && (
        <div id={`tabs-header-button-${id}`}>{onRenderTabHeaderRightIcon()} </div>
      )}
    </s.TabHeaderContainer>
  );
}

TabHeaderV2.propTypes = propTypes;

export default TabHeaderV2;
