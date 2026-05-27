import React, { useState, useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { ClickOutside } from '@m-next/utilities';
import { useResizeDetector } from 'react-resize-detector';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { colors } from '@m-next/styles';
import * as s from './Tabs.styles';

const queryAttr = 'data-rbd-drag-handle-draggable-id';

/* ------------------------------------------------------- *
                  HOOKS & HELPERS 
 * --------------------------------------------------------*/

/*
 * find the actual DOM width for each tab item by its id,
 * from "useTabWidthList" hook
 */
const marginRight = 24;

const findTabWidthFromList = (tabId, tabWidths) => {
  let tabWidth = 0;

  for (let i = 0; i < tabWidths.length; i++) {
    if (tabWidths[i]?.id === tabId) {
      tabWidth = tabWidths[i].size + marginRight;
      break;
    }
  }

  return tabWidth;
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
};

function TabHeader(props) {
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
  } = props;

  const containerRef = useRef();
  const [initialVisibility, setInitialVisibility] = useState(0);
  const [internalRefresh, setInternalRefresh] = useState(0);
  const [tabHash, setTabHash] = useState(null);

  useEffect(() => {
    const hash = `${tabList.reduce((acc, tab) => {
      const temp = acc + tab.id;
      return temp;
    }, '')}-${tabList.length}`;
    if (hash === tabHash) {
      return;
    }
    setTabHash(hash);
    if (tabList.length === 0) setInitialVisibility(0);
    else {
      setInitialVisibility(0);
      setInternalRefresh(internalRefresh + 1);

      setTimeout(() => {
        setInitialVisibility(1);
        setInternalRefresh(internalRefresh + 2);
      }, 10);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabList]);

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

  const iconRightWidth = 28;
  const moreMenuBtnWidth = 48;
  const spaceAround = 16;
  const { width, ref: wrapperRef } = useResizeDetector();

  useEffect(() => {
    if (disableTabs) return;
    let tabWidth = wrapperRef.current ? wrapperRef.current.offsetWidth - spaceAround - spaceAround : 0;
    tabWidth -= moreMenuBtnWidth;
    tabWidth += onRenderTabHeaderRightIcon ? iconRightWidth : 0;
    setTabBarWidth(tabWidth);
  }, [disableTabs, onRenderTabHeaderRightIcon, width, wrapperRef]);

  // Generate a list of {id, size} from the DOM render
  const tabWidthList = useMemo(
    () => {
      const getOriginalId = (domId) => domId.slice(5 + (id.length ?? 0), domId.length); // remove 'tab-{id}-'
      const renderedTabHeaders = Array.from(document.querySelectorAll('.mi-TabBar-TabHeaderButton'));

      const list = renderedTabHeaders.map((tab) => ({
        id: getOriginalId(tab.id),
        size: tab.clientWidth + tabPadding,
      }));
      return list;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [internalRefresh],
  );

  useEffect(() => {
    if (disableTabs) return;
    let sum = 0;
    const updatedTabsList = [...originalTabsList];
    let hideTab = -1;
    let lastVisibleTab = -1;
    updatedTabsList.forEach((tab, index) => {
      const tabWidth = findTabWidthFromList(tab.id, tabWidthList);
      if (initialVisibility === 0) {
        // eslint-disable-next-line no-param-reassign
        tab.visible = true;
      } else {
        // eslint-disable-next-line no-param-reassign
        tab.visible = sum + tabWidth < tabBarWidth;
        sum += tabWidth;
        if (selectedTab !== tab.id && tab.visible) {
          lastVisibleTab = index;
        }
        if (selectedTab === tab.id && !tab.visible) {
          hideTab = lastVisibleTab;
          // eslint-disable-next-line no-param-reassign
          tab.visible = true;
        }
      }
    });
    if (hideTab > -1) {
      updatedTabsList[hideTab].visible = false;
    }
    setTransformedTabsList(updatedTabsList);
  }, [tabBarWidth, tabWidthList, originalTabsList, initialVisibility, disableTabs, selectedTab]);

  const handleChange = (headerId, index, e) => {
    // Find the tab to check if it's disabled
    const tab = tabList.find((t) => t.id === headerId);
    if (tab?.disabled) {
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
    if (tab?.disabled) {
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
    const selectedIndex = tabList.findIndex((x) => x.id === selectedTab);
    let hiddenTabIndex = hiddenList.findIndex((x) => x.id === selectedTab);
    let visibleTabIndex = visibleList.findIndex((x) => x.id === selectedTab);
    let isStopPropigation = false;

    if (hiddenTabIndex === -1 && hiddenListNavIndex > -1) {
      hiddenTabIndex = hiddenListNavIndex;
      visibleTabIndex = -1;
    }

    switch (e.which) {
      case 37: // left arrow
      case 38: // Up arrow
        if (selectedIndex > 0 && hiddenTabIndex === -1) {
          const newTabIndex = visibleList.findIndex((x) => x.id === selectedTab) - 1;
          handleChange(visibleList[newTabIndex].id, newTabIndex, e);
        } else {
          if (hiddenTabIndex > 0)
            if (!open) {
              setOpen(true);
            } else {
              setHiddenListNavIndex(hiddenList.length - 1);
            }
          if (hiddenTabIndex === 0) {
            if (open) {
              setOpen(false);
              setHiddenListNavIndex(-1);
            }
            handleChange(visibleList[visibleList.length - 1].id, visibleList.length - 1, e);
          }

          if (hiddenList.length > 0)
            if (!open) {
              setOpen(true);
            } else {
              setHiddenListNavIndex(hiddenList.length - 1);
            }

          handleChange(visibleList[visibleList.length - 1].id, visibleList.length - 1, e);
        }
        isStopPropigation = true;

        break;
      case 39: // right arrow
      case 40: // down arrow
        if (selectedIndex < tabList.length) {
          if (hiddenTabIndex > -1 && hiddenTabIndex < hiddenList.length - 1) {
            if (!open) {
              setOpen(true);
            }
            setHiddenListNavIndex(hiddenTabIndex + 1);
          } else if (hiddenTabIndex > -1 && hiddenTabIndex === hiddenList.length - 1) {
            if (open) {
              setOpen(false);
              setHiddenListNavIndex(-1);
            }
            handleChange(visibleList[0].id, 0, e);
          } else if (visibleTabIndex > -1 && visibleTabIndex < visibleList.length - 1) {
            const newTabIndex = visibleList.findIndex((x) => x.id === selectedTab) + 1;
            handleChange(visibleList[newTabIndex].id, newTabIndex, e);
          } else {
            if (!open) {
              setOpen(true);
            }
            setHiddenListNavIndex(0);
          }
        } else {
          if (open) {
            setOpen(false);
            setHiddenListNavIndex(-1);
          }
          handleChange(visibleList[0].id, 0, e);
        }
        isStopPropigation = true;
        break;
      case 36: // home
        if (open) {
          setOpen(false);
          setHiddenListNavIndex(-1);
        }
        handleChange(visibleList[0].id, 0, e);
        isStopPropigation = true;
        break;
      case 35: // end
        if (hiddenList.length > 0) {
          if (!open) {
            setOpen(true);
            setHiddenListNavIndex(hiddenList.length - 1);
          }
        } else {
          handleChange(visibleList[visibleList.length - 1].id, visibleList.length - 1, e);
        }

        isStopPropigation = true;
        break;
      case 13: // home
      case 32: // space
        if (hiddenListNavIndex > -1) {
          const newTabIndex = tabList.findIndex((x) => x.id === hiddenList[hiddenListNavIndex].id);
          handleMenuItemClick(tabList[newTabIndex].id, newTabIndex, e);
        }
        setHiddenListNavIndex(-1);

        isStopPropigation = true;
        break;
      default:
        break;
    }

    if (isStopPropigation) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const getItemStyle = (draggableStyle, isDragging) => ({
    // some basic styles to make the items look a bit nicer
    ...draggableStyle,
    borderRadius: isDragging ? 4 : 0,
    background: isDragging ? colors['grey-lighter'] : null,
    boxShadow: isDragging ? '0px 10px 10px 0px rgba(0, 0, 0, 0.25)' : null,
    padding: isDragging ? '8px 4px' : null,
    cursor: 'default',
  });

  const getListStyle = () => ({});

  const reorder = (startIndex, endIndex) => {
    const visible = [...visibleList];
    const hidden = [...hiddenList];

    const [removed] = visible.splice(startIndex, 1);
    visible.splice(endIndex, 0, removed);
    return [...visible, ...hidden];
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
    const final = [...updated].map((tab) => ({ ...tab, visible: true }));
    onTabOrderChange(final, result.source.index, result.destination.index);
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
    if (!draggedDOM) {
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
      tabIndex={selectedTab === tab.id ? '0' : -1}
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
      onKeyDown={handleTabHeaderKeyUp}
      isDragging={isDragging}
      isDragable={!!onTabOrderChange}
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
      ref={wrapperRef}
      id={`tabs-header-${id}`}
      initialVisibility={initialVisibility}
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
              {/* <CustomPlaceholder snapshot={snapshot} /> */}
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

TabHeader.propTypes = propTypes;

export default TabHeader;
