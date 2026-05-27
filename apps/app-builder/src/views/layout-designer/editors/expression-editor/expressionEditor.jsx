import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { colors } from '@m-next/styles';
import Button from '@m-next/button';
import Dropdown from '@m-next/dropdown';
import Container from '@m-next/container';
import { Field } from '@m-next/types';
import { expressionParser, ComplexValue } from '@m-next/expression';
import { formatter } from '@m-next/utilities';
import Caption from '@m-next/caption';
import Input from '@m-next/input';
import LoadingSkeleton from '@m-next/loading-skeleton';
import ExpressionEditorLine from './expressionEditorLine';
import * as s from './expressionEditor.styles';
import ExpressionEditorTextLine from './expressionEditorTextLine';

// types
const propTypes = {
  id: PropTypes.string,
  controlName: PropTypes.string,
  dataModelId: PropTypes.string,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  expression: PropTypes.arrayOf(ComplexValue),
  fieldList: PropTypes.arrayOf(Field),
  data: PropTypes.instanceOf(Object),
  fieldListLoading: PropTypes.bool,
  fieldLoadingError: PropTypes.string,
  displayPreferences: PropTypes.instanceOf(Object),
  projection: PropTypes.shape({
    id: PropTypes.string,
    fields: PropTypes.arrayOf(Field),
  }),
};

function ExpressionEditor({
  id,
  controlName,
  expression,
  onChange,
  dataModelId,
  fieldList,
  data,
  fieldListLoading,
  fieldLoadingError,
  displayPreferences,
  projection,
  onSelect,
}) {
  const [fieldToAdd, setFieldToAdd] = useState(null);
  const [currentFieldOption, setCurrentFieldOption] = useState(null);
  const [disableDrag, setDisableDrag] = useState(null);
  const [expressionResult, setExpressionResult] = useState('');
  const [textToAdd, setTextToAdd] = useState('');

  const handleFieldChange = (field, index) => {
    if (onChange) {
      const updated = [...expression];
      updated[index] = field;
      const updatedProjection = { ...projection, fields: [...projection.fields] };
      updatedProjection.fields[index] = field;
      onChange(updated, updatedProjection);
    }
  };

  const handleFieldDelete = (field, index) => {
    if (onChange) {
      const updated = [...expression];
      updated.splice(index, 1);

      const updatedProjection = { ...projection, fields: [...projection.fields] };
      const fieldIndex = updatedProjection.fields.findIndex((x) => x.name === field.name);
      updatedProjection.splice(fieldIndex, 1);
      onChange(updated, updatedProjection);
    }
  };

  const handleTextChange = (complexValue, index) => {
    if (onChange) {
      const updated = [...expression];
      updated[index] = complexValue;
      onChange(updated, projection);
    }
  };

  const handleTextDelete = (index) => {
    if (onChange) {
      const updated = [...expression];
      updated.splice(index, 1);
      onChange(updated, projection);
    }
  };

  const handleFieldAdd = () => {
    if (onChange) {
      const toAdd = { id: fieldToAdd.name, value: fieldToAdd.name, label: fieldToAdd.caption, valueType: 3 };
      const toAddField = { ...fieldToAdd };

      if (toAddField.type === 'Decimal') {
        toAddField.displayOptions = { decimalRounding: toAddField.size ?? 0 };
      }

      if (toAddField.type === 'DateTime') {
        toAddField.displayOptions = { dateFormat: 1 };
      }
      if (!expression || expression.length === 0) {
        const intial = { id, fields: [] };
        intial.fields.push(toAddField);
        onChange([toAdd], intial);
      } else {
        const updated = [...expression];
        updated.push(toAdd);
        const updatedProjection = { ...projection, fields: [...projection.fields] };
        updatedProjection.fields.push(toAddField);
        onChange(updated, updatedProjection);
      }
    }
    setFieldToAdd(null);
    setCurrentFieldOption(null);
  };

  const handleTextAdd = () => {
    if (onChange) {
      const toAdd = { id: new Date().getTime().toString(), value: textToAdd, label: textToAdd, valueType: 9 };

      if (!expression || expression.length === 0) {
        const intial = { id, fields: [] };
        onChange([toAdd], intial);
      } else {
        const updated = [...expression];
        updated.push(toAdd);
        onChange(updated, projection);
      }
    }
    setTextToAdd('');
  };

  const reorder = (startIndex, endIndex) => {
    const updated = Array.from(expression);
    const [removed] = updated.splice(startIndex, 1);
    updated.splice(endIndex, 0, removed);
    return updated;
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const updated = reorder(result.source.index, result.destination.index);
    onChange(updated, projection);
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
      setFieldToAdd(found[0]);
    }
    setCurrentFieldOption(field);
  };

  const handleDisableDragging = (index) => {
    setDisableDrag(index);
  };

  useEffect(() => {
    if (!expression || !fieldList || !data) {
      setExpressionResult('');
    }
    setExpressionResult(expressionParser.formatExpression(expression, fieldList, data, displayPreferences));
  }, [expression, fieldList, data, displayPreferences]);

  const fieldListOptions = useMemo(
    () => formatter.formatFieldList (fieldList, dataModelId, projection, data, displayPreferences),
    [fieldList, dataModelId, projection, data, displayPreferences]
  );

  return (
    <Container borderles>
      <Caption label='Result' />
      <div style={{ paddingBottom: 16, paddingTop: 8 }}>{expressionResult}</div>
      <Caption label='Expression' />

      {expression && expression.length > 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='droppable'>
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                {expression.map((field, index) => (
                  <Draggable
                    key={`${controlName}-${field.id}`}
                    draggableId={field.id}
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
                        {field.valueType === 3 && (
                          <ExpressionEditorLine
                            id={`${controlName}-${field.id}`}
                            expressionElement={field}
                            projection={projection}
                            key={`${controlName}-${field.id}`}
                            onChange={handleFieldChange}
                            onSelect={onSelect}
                            index={index}
                            onDelete={handleFieldDelete}
                            isDragging={snapshotInner.isDragging}
                            onDisableDragging={handleDisableDragging}
                          />
                        )}
                        {field.valueType === 9 && (
                          <ExpressionEditorTextLine
                            id={`${controlName}-${field.id}`}
                            expressionElement={field}
                            key={`${controlName}-${field.id}`}
                            onChange={handleTextChange}
                            index={index}
                            onDelete={handleTextDelete}
                            isDragging={snapshotInner.isDragging}
                            onDisableDragging={handleDisableDragging}
                            onSelect={onSelect}
                          />
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <s.Divider />
      <s.Footer>
        <Input
          compactStyle
          id={`data-model-caption-${id}`}
          value={textToAdd}
          isV4Design={false}
          onChange={(e) => {
            setTextToAdd(e.target.value);
          }}
        />

        <div>
          <Button
            id='data-model-add-text'
            value='+ Add text'
            buttonStyle='link'
            onClick={handleTextAdd}
            disabled={!textToAdd}
          />
        </div>

        {fieldListLoading && !fieldLoadingError && (
          <LoadingSkeleton count={2} height={24} style={{ marginBottom: 8 }} />
        )}
        {!fieldListLoading && !fieldLoadingError && (
          <div style={{ zIndex: 10, width: '100%' }}>
            <Dropdown
              id='expression-field-list'
              options={fieldListOptions}
              onChange={handleFieldSelected}
              placeholder='Select a field'
              dropdownStyle='multi-icon'
              isV4Design
              value={currentFieldOption}
              width='100%'
            />
            <div>
              <Button
                id='data-model-add-field'
                value='+ Add field'
                buttonStyle='link'
                onClick={handleFieldAdd}
                disabled={!fieldToAdd}
              />
            </div>
          </div>
        )}
      </s.Footer>
    </Container>
  );
}

ExpressionEditor.propTypes = propTypes;
export default ExpressionEditor;
