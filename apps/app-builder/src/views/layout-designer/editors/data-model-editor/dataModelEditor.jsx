import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { datadogRum } from '@datadog/browser-rum';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { colors } from '@m-next/styles';
import Dropdown from '@m-next/dropdown';
import Container from '@m-next/container';
import { Field } from '@m-next/types';
import { formatter } from '@m-next/utilities';

import LoadingSkeleton from '@m-next/loading-skeleton';
import DataModelLine from './dataModelEditorLine';
import * as s from './dataModelEditor.styles';


// types
const propTypes = {
  id: PropTypes.string,
  controlName: PropTypes.string,
  dataModelId: PropTypes.string,
  onChange: PropTypes.func,
  projection: PropTypes.shape({
    id: PropTypes.string,
    fields: PropTypes.arrayOf(Field),
  }),
  fieldList: PropTypes.arrayOf(Field),
  fieldListLoading: PropTypes.bool,
  fieldLoadingError: PropTypes.string,
  data: PropTypes.instanceOf(Object),
  displayPreferences: PropTypes.instanceOf(Object),
  onSelect: PropTypes.func,
  lastSelectedField: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
};

function DataModelEditor({
  id,
  controlName,
  projection,
  onChange,
  dataModelId,
  fieldList,
  data,
  fieldListLoading,
  fieldLoadingError,
  displayPreferences,
  onSelect,
  lastSelectedField,
}) {
  const [currentFieldOption, setCurrentFieldOption] = useState(null);
  const [disableDrag, setDisableDrag] = useState(null);
  const [openBlock, setOpenBlock] = useState(null);
  const [addedField, setAddedField] = useState(null);

  const handleFieldChange = (field, index) => {
    if (onChange) {
      const updated = { ...projection, fields: [...projection.fields] };
      updated.fields[index] = field;
      onChange(updated);
    }
  };

  const handleFieldDelete = (field, index) => {
    if (onChange) {
      const updated = { ...projection, fields: [...projection.fields] };

      updated.fields.splice(index, 1);
      onChange(updated);
    }
  };

  const handleFieldAdd = (fieldToAdd) => {
    if (onChange) {
      const toAdd = { ...fieldToAdd };
      if (toAdd.type === 'Decimal') {
        toAdd.displayOptions = { decimalRounding: toAdd.size ?? 0 };
      }

      if (toAdd.type === 'DateTime') {
        toAdd.displayOptions = { dateFormat: 1 };
      }
      if (!projection || !projection.fields) {
        const intial = { id, fields: [] };
        intial.fields.push(toAdd);
        onChange(intial);
      } else {
        const updated = { ...projection, fields: [...projection.fields] };
        updated.fields.push(toAdd);
        onChange(updated);
      }
    }
    datadogRum.addAction('Add Field', {
      component: 'Field Block',
      fieldType: fieldToAdd.type,
      fieldName: fieldToAdd.caption,
      dataModel: dataModelId,
    });

    setCurrentFieldOption(null);

    setAddedField(fieldToAdd.name);
  };

  const reorder = (startIndex, endIndex) => {
    const result = Array.from(projection.fields);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    const updated = { ...projection, fields: [...projection.fields] };
    updated.fields = result;
    return updated;
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const updated = reorder(result.source.index, result.destination.index);
    onChange(updated);
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    // change background colour if dragging
    background: isDragging ? colors['blue-lighter'] : null,
    // styles we need to apply on draggables
    ...draggableStyle,
    marginBottom: 16,
    outline: 'none',
  });

  const getListStyle = () => ({});

  const handleFieldSelected = (field) => {
    const found = fieldList.filter((item) => item.name === field.value);
    if (found && found.length > 0) {
      handleFieldAdd(found[0]);
    }
    //   setCurrentFieldOption(field);
  };

  const handleDisableDragging = (index) => {
    setDisableDrag(index);
  };

  useEffect(() => {
    setOpenBlock(lastSelectedField);
    setTimeout(() => {
      setOpenBlock(null);
    }, 100);
  }, [lastSelectedField]);

  const fieldListOptions = useMemo(
    () => formatter.formatFieldList(fieldList, dataModelId, projection, data, displayPreferences),
    [fieldList, dataModelId, projection, data, displayPreferences]
  );

  return (
    <Container borderless>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable'>
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
              {projection?.fields.map((field, index) => (
                <Draggable
                  key={`${controlName}-${field.name}`}
                  draggableId={field.name}
                  index={index}
                  isDragDisabled={disableDrag === index}
                  tabIndex='-1'
                >
                  {(providedInner, snapshotInner) => (
                    <div
                      ref={providedInner.innerRef}
                      {...providedInner.draggableProps}
                      {...providedInner.dragHandleProps}
                      style={getItemStyle(snapshotInner.isDragging, providedInner.draggableProps.style)}
                    >
                      <DataModelLine
                        id={`${controlName}-${field.name}`}
                        field={field}
                        key={`${controlName}-${field.name}`}
                        onChange={handleFieldChange}
                        index={index}
                        onDelete={handleFieldDelete}
                        isDragging={snapshotInner.isDragging}
                        onDisableDragging={handleDisableDragging}
                        onSelect={onSelect}
                        open={openBlock === field.name}
                        isSelected={lastSelectedField === field.name}
                        addedField={addedField === field.name}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <s.Divider />
      <s.Footer>
        {fieldListLoading && !fieldLoadingError && (
          <LoadingSkeleton count={2} height={24} style={{ marginBottom: 8 }} />
        )}
        {!fieldListLoading && !fieldLoadingError && (
          <Dropdown
            id='data-model-field-list'
            options={fieldListOptions}
            onChange={handleFieldSelected}
            placeholder='Select a field'
            dropdownStyle='multi-icon'
            isV4Design
            value={currentFieldOption}
          />
        )}
      </s.Footer>
    </Container>
  );
}

DataModelEditor.propTypes = propTypes;
export default DataModelEditor;
