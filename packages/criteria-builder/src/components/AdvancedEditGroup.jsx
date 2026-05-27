import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { colors, lightTheme } from '@m-next/styles';
import SvgIcon from '@m-next/svg-icon';
import PredicateEditor from './PredicateEditor';

const propTypes = {
  fieldList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  fieldListOptions: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  controlList: PropTypes.instanceOf(Object),
  onPredicateChange: PropTypes.func,
  onPredicateDelete: PropTypes.func,
  setIndex: PropTypes.number,
  set: PropTypes.instanceOf(Object),
  onDisableClickOutside: PropTypes.func,
  includeControls: PropTypes.bool,
  includeSessionVariables: PropTypes.bool,
  splitValues: PropTypes.bool,
  forcedTimeZone: PropTypes.string,
};

const PredicateGroupWrapper = styled.div(() => [
  {
    backgroundColor: colors['grey-lighter'],
    padding: 8,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
]);

function AdvancedEditGroup({
  set,
  setIndex,
  controlList,
  fieldList,
  fieldListOptions,
  onPredicateDelete,
  onPredicateChange,
  onDisableClickOutside,
  includeControls,
  includeSessionVariables,
  splitValues,
  forcedTimeZone,
}) {
  const [disableDrag, setDisableDrag] = useState(null);

  const getListStyle = () => ({});

  const getItemStyle = (isDragging, draggableStyle) => ({
    // change background colour if dragging
    background: isDragging ? colors['blue-lighter'] : null,
    // styles we need to apply on draggables
    ...draggableStyle,
    outline: 'none',
    display: `flex`,
    alignItems: `center`,
    gap: 8,
    paddingBottom: 8,
  });

  const handleDisableDragging = (index) => {
    setDisableDrag(index);
  };

  return (
    <PredicateGroupWrapper>
      <Droppable droppableId={`droppable${setIndex}`}>
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
            {set.expression.map((element, idx) => (
              <Draggable
                key={element.key}
                draggableId={element.key}
                index={idx}
                isDragDisabled={disableDrag === idx}
                tabIndex='-1'
              >
                {(providedInner, snapshotInner) => (
                  <div
                    ref={providedInner.innerRef}
                    {...providedInner.draggableProps}
                    {...providedInner.dragHandleProps}
                    style={getItemStyle(snapshotInner.isDragging, providedInner.draggableProps.style)}
                  >
                    <SvgIcon
                      id={`drag-${setIndex}-${idx}`}
                      name='drag'
                      size={16}
                      color={lightTheme.content.primary}
                      style={{ cursor: 'grab', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                    />
                    <PredicateEditor
                      id={`${setIndex}-${idx}`}
                      key={element.key}
                      first={element.first}
                      operation={element.operation}
                      second={element.second}
                      third={element.third}
                      controlList={controlList}
                      fieldList={fieldList}
                      fieldListOptions={fieldListOptions}
                      onDelete={onPredicateDelete}
                      onChange={onPredicateChange}
                      onDisableDragging={handleDisableDragging}
                      connector={idx === 0 ? null : 'And'}
                      index={idx}
                      advanced
                      set={setIndex}
                      elementKey={element.key}
                      dateField={element.dateField}
                      onDisableClickOutside={onDisableClickOutside}
                      includeControls={includeControls}
                      includeSessionVariables={includeSessionVariables}
                      splitValues={splitValues}
                      forcedTimeZone={forcedTimeZone}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </PredicateGroupWrapper>
  );
}

AdvancedEditGroup.propTypes = propTypes;
export default AdvancedEditGroup;
