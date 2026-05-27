import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Tooltip } from 'react-tooltip';
import { colors } from '@m-next/styles';
import SearchInput from '@m-next/search-input';
import { TextLine } from '@m-next/typeography';
import { Z_POPUP } from '@m-next/layout-canvas';
import RibbonItem from './RibbonItem';
import * as s from './RibbonManagement.styles';

const propTypes = {
  tabList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      caption: PropTypes.string,
      icon: PropTypes.string,
      color: PropTypes.string,
      visible: PropTypes.bool,
    }),
  ),
  isMobile: PropTypes.bool,
  onTabsSettingsChange: PropTypes.func,
  selectedTab: PropTypes.string,
  onSelect: PropTypes.func,
};

const getItemStyle = (draggableStyle, isMobile, isDragging) => ({
  // some basic styles to make the items look a bit nicer
  ...draggableStyle,
  userSelect: 'none',
  marginBottom: isMobile ? 0 : 8,
  cursor: isDragging ? 'grabbing' : 'default',
  ...(isDragging && { pointerEvents: 'auto' }),
});

const getListStyle = () => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
});

const getHiddenListStyle = () => ({
  borderRadius: 8,
  position: 'relative',
  height: 48,
  width: '100%',
});

const queryAttr = 'data-rbd-drag-handle-draggable-id';

function RibbonManagement({ tabList, onTabsSettingsChange, isMobile, selectedTab, onSelect }) {
  // using internal state to reduce flickering when reordering
  const [ribbonData, setRibbonData] = useState(tabList || []);
  const [searchText, setSearchText] = useState('');
  const [currentlySelectedTab, setCurrentlySelectedTab] = useState(selectedTab);
  const filteredRibbonData = useMemo(
    () => ribbonData.filter((item) => item.caption.toLowerCase().includes(searchText.toLowerCase())),
    [ribbonData, searchText],
  );

   
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const hasVisibleItems = useMemo(() => ribbonData.filter((item) => item.visible).length > 1, [filteredRibbonData]);
  const visibleRibbonData = useMemo(() => filteredRibbonData.filter((item) => item.visible), [filteredRibbonData]);
  const hiddenRibbonData = useMemo(() => filteredRibbonData.filter((item) => !item.visible), [filteredRibbonData]);
  const [placeholderProps, setPlaceholderProps] = useState({});

  // handle updates to the tabList
  useEffect(() => {
    setRibbonData(tabList);
  }, [tabList]);

  const handleShowHide = (id) => {
    const visible = [];
    const hidden = [];
    let changeSelected = false;
    let nextSelected = null;
    ribbonData.forEach((item) => {
      if (item.id !== id && item.visible) {
        if (changeSelected && !nextSelected) {
          nextSelected = item.id;
        }
        visible.push(item);
      } else if (item.id !== id && !item.visible) {
        hidden.push(item);
      } else if (item.id === id && item.visible) {
         
        item.visible = false;
        if (id === currentlySelectedTab) {
          changeSelected = true;
        }
        visible.push(item);
      } else if (item.id === id && !item.visible) {
         
        item.visible = true;
        hidden.splice(0, 0, item);
      }
    });

    if (changeSelected && !nextSelected) {
      nextSelected = visible[0]?.id;
    }
    const result = [...visible, ...hidden];
    setRibbonData(result);
    onTabsSettingsChange(result);
    if (nextSelected && nextSelected !== currentlySelectedTab) {
      setCurrentlySelectedTab(nextSelected);
    }
  };

  const reorder = (startIndex, endIndex) => {
    const visible = filteredRibbonData.filter((item) => item.visible);
    const hidden = filteredRibbonData.filter((item) => !item.visible);

    const [removed] = visible.splice(startIndex, 1);
    visible.splice(endIndex, 0, removed);
    return [...visible, ...hidden];
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    setPlaceholderProps({});
    if (!result.destination) {
      return;
    }
    if (result.destination.droppableId === 'ribbon-management-droppable-hidden') {
      const visible = filteredRibbonData.filter((item) => item.visible);
      const hidden = filteredRibbonData.filter((item) => !item.visible);

      const [removed] = visible.splice(result.source.index, 1);
      visible.push(removed);
      const updated = [...visible, ...hidden];
      setRibbonData(updated);
      onTabsSettingsChange(updated);
    } else {
      const updated = reorder(result.source.index, result.destination.index);
      setRibbonData(updated);
      onTabsSettingsChange(updated);
    }
  };

  const onDragUpdate = (update) => {
    if (!update.destination) {
      return;
    }
    if (update.destination.droppableId === 'ribbon-management-droppable-hidden') {
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

    const clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      [...draggedDOM.parentNode.children].slice(0, destinationIndex).reduce((total, curr) => {
        const style = curr.currentStyle || window.getComputedStyle(curr);
        const marginBottom = parseFloat(style.marginBottom);
        return total + curr.clientHeight + marginBottom;
      }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
      clientX: parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingLeft),
    });
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  return (
    <s.RibbonManagementWrapper isMobile={isMobile}>
      {!isMobile && (
        <SearchInput
          id='ribbon-search'
          wrapperStyle={{ borderRadius: 4 }}
          value={searchText}
          onChange={handleSearch}
          placeholder='Search'
        />
      )}
      <Tooltip id='ribbon-management' style={{ zIndex: Z_POPUP.TOOLTIP }} />

      <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
        <Droppable droppableId='ribbon-management-droppable'>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle()}>
              {visibleRibbonData.map((item, index) => (
                <Draggable key={item.id} draggableId={`ribbon-${item.id}`} index={index}>
                  {(innerProvided, innerSnapshot) => (
                    <div
                      ref={innerProvided.innerRef}
                      {...innerProvided.draggableProps}
                      {...innerProvided.dragHandleProps}
                      style={getItemStyle(innerProvided.draggableProps.style, isMobile, innerSnapshot.isDragging)}
                    >
                      <RibbonItem
                        id={item.id}
                        caption={item.caption}
                        visible={item.visible}
                        onClick={() =>
                          onSelect('tab-panel', {
                            id: item.ribbonId,
                            caption: item.caption,
                            isStock: item.isStock,
                            visible: item.visible,
                          })
                        }
                        onShowHideClick={handleShowHide}
                        isDragging={innerSnapshot.isDragging}
                        isMobile={isMobile}
                        color={item.color}
                        icon={item.icon}
                        showHide={hasVisibleItems}
                      />
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
              {/* <CustomPlaceholder snapshot={snapshot} /> */}
              <div
                id='ribbon-placeholder'
                style={{
                  position: 'absolute',
                  background: isMobile ? colors['grey-lighter'] : colors['blue-lighter'],
                  borderRadius: 8,
                  top: placeholderProps.clientY,
                  left: placeholderProps.clientX,
                  height: placeholderProps.clientHeight,
                  width: placeholderProps.clientWidth,
                }}
              />
            </div>
          )}
        </Droppable>
        {hiddenRibbonData.length > 0 && (
          <Droppable droppableId='ribbon-management-droppable-hidden'>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} style={getHiddenListStyle()}>
                <Draggable key='ribbon-hidden' draggableId='ribbon-hidden' index={0} isDragDisabled>
                  {(innerProvided) => (
                    <div
                      ref={innerProvided.innerRef}
                      {...innerProvided.draggableProps}
                      {...innerProvided.dragHandleProps}
                      style={getItemStyle(innerProvided.draggableProps.style, isMobile)}
                    >
                      <s.NotVisibleWrapper hasVisibleItems={visibleRibbonData && visibleRibbonData.length > 0}>
                        {hiddenRibbonData.map((item) => (
                          <RibbonItem
                            id={item.id}
                            key={item.id}
                            caption={item.caption}
                            visible={item.visible}
                            onClick={() =>
                              onSelect('tab-panel', {
                                id: item.ribbonId,
                                caption: item.caption,
                                isStock: item.isStock,
                                isVisible: item.visible,
                              })
                            }
                            onShowHideClick={handleShowHide}
                            isMobile={isMobile}
                            color={item.color}
                            icon={item.icon}
                          />
                        ))}
                      </s.NotVisibleWrapper>
                    </div>
                  )}
                </Draggable>

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
      </DragDropContext>

      {searchText && filteredRibbonData.length === 0 && (
        <s.NoResultsWrapper>
          <TextLine bold fontSize='mediumLarge'>
            No results found
          </TextLine>
          <TextLine style={{ textAlign: 'center' }}>
            Try changing the search keywords to get the results you&apos;re looking for.
          </TextLine>
        </s.NoResultsWrapper>
      )}
      <div style={{ height: 16, width: '100%' }} />
    </s.RibbonManagementWrapper>
  );
}

RibbonManagement.propTypes = propTypes;
export default RibbonManagement;
