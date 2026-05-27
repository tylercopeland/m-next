import React, { createRef, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import { Z_POPUP } from '@m-next/layout-canvas';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import * as s from './Ribbon.styles';
import RibbonItem from './RibbonItem';
import { selectFeatureFlags } from '../../../../common/services/sessionSlice';
import { selectSelectedControlId } from '../../../../common/services/screenLayoutSlice';

const propTypes = {
  onControlClick: PropTypes.func,
  onTabSettingsChange: PropTypes.func,
  tabList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  selectedTab: PropTypes.string,
};

const queryAttr = 'data-rbd-drag-handle-draggable-id';

function Ribbon({ onControlClick, tabList, onTabSettingsChange, selectedTab }) {
  const featureFlags = useSelector(selectFeatureFlags);
  const selectedControlId = useSelector(selectSelectedControlId);

  const menuRef = createRef();
  const [placeholderProps, setPlaceholderProps] = useState({});
  const [ribbonList, setRibbonList] = useState(tabList);
  const visibleTabList = useMemo(() => ribbonList?.filter((item) => item.visible), [ribbonList]);

  useEffect(() => {
    setRibbonList(tabList);
  }, [tabList]);

  const handleRibbonItemClick = (e) => {
    const headerId = e.currentTarget.id;
    if (!headerId) {
      onControlClick('tab-panel', null);
    } else {
      const tab = tabList.find((x) => x.id === headerId) ?? {};
      onControlClick('tab-panel', {
        id: headerId,
        caption: tab.caption,
        isStock: tab.isStock,
        visible: tab.visible,
      });
    }
    e.stopPropagation();
    e.preventDefault();
  };

  const getItemStyle = (draggableStyle, isDragging) => ({
    ...draggableStyle,
    borderRadius: isDragging ? 4 : 0,
    background: isDragging ? colors['grey-lighter'] : null,
    boxShadow: isDragging ? '0px 10px 10px 0px rgba(0, 0, 0, 0.25)' : null,
    padding: isDragging ? '4px' : null,
    paddingBottom: 8,
  });

  const getListStyle = () => ({});

  const reorder = (startIndex, endIndex) => {
    const visibleRibbons = ribbonList.filter((item) => item.visible);
    const hiddenRibbons = ribbonList.filter((item) => !item.visible);

    const [removed] = visibleRibbons.splice(startIndex, 1);
    visibleRibbons.splice(endIndex, 0, removed);
    return [...visibleRibbons, ...hiddenRibbons];
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    setPlaceholderProps({});

    if (!result.destination) {
      return;
    }

    const updated = reorder(result.source.index, result.destination.index);
    setRibbonList(updated);
    onTabSettingsChange(updated);
  };

  const onDragUpdate = (update) => {
    if (!update.destination) {
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
      clientWidth: clientWidth - 8,
      clientY,
      clientX: parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingLeft),
    });
  };

  const renderItems = () => (
    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
      <Droppable droppableId='ribbon-droppable'>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle()}>
            {visibleTabList.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={item.id}
                index={index}
                isDragDisabled={!featureFlags?.appRibbonV3Configuration}
              >
                {(innerProvided, innerSnapshot) => (
                  <div
                    ref={innerProvided.innerRef}
                    {...innerProvided.draggableProps}
                    {...innerProvided.dragHandleProps}
                    style={getItemStyle(innerProvided.draggableProps.style, innerSnapshot.isDragging)}
                  >
                    <RibbonItem
                      key={`quick-access-${item.id}-${item.name}`}
                      id={item.id}
                      icon={item.icon}
                      color={item.color}
                      name={item.caption}
                      recordCount={item.recordCount}
                      onClick={handleRibbonItemClick}
                      menuRef={menuRef}
                      selected={item.id === selectedTab}
                    />
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
                borderRadius: 8,
                top: placeholderProps.clientY,
                left: placeholderProps.clientX,
                height: placeholderProps.clientHeight,
                width: placeholderProps.clientWidth,
                margin: 8,
              }}
            />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

  return !ribbonList ? null : (
    <>
      <Tooltip id='ribbon-collapsed-tooltip' opacity={1} style={{ zIndex: Z_POPUP.TOOLTIP }} />
      <s.Wrapper selected={selectedControlId === 'tab-panel' && !selectedTab}>
        <s.RibbonList role='menubar' ref={menuRef} hasItems={ribbonList.length > 0}>
          {renderItems() /* Visible Apps */}
        </s.RibbonList>

        {featureFlags?.appRibbonV3Configuration && ribbonList.length > 0 && (
          <div>
            <s.Divider />
            <SvgIcon
              id='tab-settings-button'
              name='settings2'
              size={14}
              color={colors.grey}
              onClick={(e) => {
                e.stopPropagation();
                onControlClick('tab-panel', null);
              }}
              tooltip='Display Settings'
              tooltipId='ribbon-collapsed-tooltip'
              style={{ marginTop: 16, marginBottom: 16 }}
            />
          </div>
        )}
      </s.Wrapper>
    </>
  );
}

Ribbon.propTypes = propTypes;
export default Ribbon;
