import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';
import styled from '@emotion/styled';
import { DragDropContext } from 'react-beautiful-dnd';
import Container from '@m-next/container';
import { colors } from '@m-next/styles';
import { Text } from '@m-next/typeography';
import Popover from '@m-next/popover';
import Button from '@m-next/button';
import { HTMLElementType, EmptyPredicate, basicOperationId } from '@m-next/types';
import { Guid, listUtilities } from '@m-next/utilities';
import GroupTypeSelector from './GroupTypeSelector';
import AdvancedEditGroup from './AdvancedEditGroup';

// types
const propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  fieldList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  fieldListOptions: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  controlList: PropTypes.instanceOf(Object),
  formattedExpression: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
  onPredicateChange: PropTypes.func,
  onPredicateDelete: PropTypes.func,
  onConnectorChange: PropTypes.func,
  onClose: PropTypes.func,
  onCancel: PropTypes.func,
  onAddGroup: PropTypes.func,
  onReorder: PropTypes.func,
  anchorEl: PropTypes.oneOfType([HTMLElementType, PropTypes.object, PropTypes.func, PropTypes.string]),
  open: PropTypes.bool,
  inline: PropTypes.bool,
  includeControls: PropTypes.bool,
  includeSessionVariables: PropTypes.bool,
  marginVertical: PropTypes.number,
  marginHorizontal: PropTypes.number,
  marginThreshold: PropTypes.number,
  relativeToParent: PropTypes.bool,
  anchorOrigin: PropTypes.instanceOf(Object),
  shiftLeft: PropTypes.number,
  splitValues: PropTypes.bool,
  forcedTimeZone: PropTypes.string,
};

const PredicateSubGroupWrapper = styled.div(() => [
  {
    paddingLeft: 8,
    width: '100%',
  },
]);
const FilterWrapper = styled.div(() => [
  {
    maxHeight: 400,
    overflow: 'hidden',
  },
]);

const AddGroupFooter = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
  },
]);

const ButtonFooter = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
    paddingBottom: 8,
    justifyContent: 'flex-end',
  },
]);

function AdvancedEdit({
  id,
  formattedExpression,
  fieldList,
  controlList,
  onClose,
  onCancel,
  onPredicateChange,
  onConnectorChange,
  onPredicateDelete,
  onAddGroup,
  fieldListOptions,
  open,
  anchorEl,
  inline,
  onReorder,
  includeControls = true,
  includeSessionVariables = true,
  marginVertical,
  marginHorizontal = 72,
  marginThreshold = 64,
  relativeToParent = false,
  anchorOrigin = {
    vertical: 'top',
    horizontal: 'left',
  },
  shiftLeft = 0,
  splitValues = false,
  forcedTimeZone,
}) {
  const [disableClickOutside, setDisableClickOutside] = useState(false);

  const handleDisableClickOutSide = (disable) => {
    setDisableClickOutside(disable);
  };

  const handleAddFilter = (set) => {
    onPredicateChange(
      formattedExpression[set] ? formattedExpression[set].expression.length : 0,
      {
        key: Guid.create(),
        first: { ...EmptyPredicate },
        operation: basicOperationId.Is,
        second: { ...EmptyPredicate },
      },
      set,
    );
  };

  useEffect(() => {
    if (!formattedExpression || formattedExpression.length === 0 || formattedExpression[0].expression.length === 0) {
      handleAddFilter(0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formattedExpression, open]);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sourceSet = Number(source.droppableId.replace('droppable', ''));
    const destinationSet = Number(destination.droppableId.replace('droppable', ''));
    const updated = [...formattedExpression];
    if (source.droppableId === destination.droppableId) {
      const items = listUtilities.reorder(formattedExpression[sourceSet].expression, source.index, destination.index);
      updated[sourceSet].expression = items;
      onReorder(updated);
    } else {
      const moved = listUtilities.move(
        formattedExpression[sourceSet].expression,
        formattedExpression[destinationSet].expression,
        source.index,
        destination.index,
      );
      updated[sourceSet].expression = moved.source;
      updated[destinationSet].expression = moved.destination;
      onReorder(updated);
    }
  };

  const renderCollection = () => {
    if (!formattedExpression || formattedExpression.length === 0) return null;
    const { connector } = formattedExpression[0];
    return (
      <div key={formattedExpression[0].key}>
        <GroupTypeSelector
          id={0}
          key={`group-${formattedExpression[0].key}`}
          value={formattedExpression[0].connector}
          connector={null}
          readonly={false}
          onChange={onConnectorChange}
          set={0}
        />
        <Container
          borderless
          key={`container-${formattedExpression[0].key}`}
          isRound={false}
          style={{
            gap: 8,
            padding: 0,
            flexDirection: 'column',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            borderLeft: `2px solid ${colors['purple-light']}`,
            paddingLeft: 8,
            marginTop: 8,
          }}
        >
          <AdvancedEditGroup
            controlList={controlList}
            fieldList={fieldList}
            fieldListOptions={fieldListOptions}
            id='primary-filter-group'
            onPredicateChange={onPredicateChange}
            onPredicateDelete={onPredicateDelete}
            set={formattedExpression[0]}
            setIndex={0}
            onDisableClickOutside={handleDisableClickOutSide}
            includeControls={includeControls}
            includeSessionVariables={includeSessionVariables}
            splitValues={splitValues}
            forcedTimeZone={forcedTimeZone}
          />
          <Button
            id='0-add-filter'
            style={{ display: 'flex' }}
            icon={{
              name: 'circle-plus-V4',
              size: 16,
              position: 'left',
            }}
            buttonStyle='link'
            value='Add filter'
            onClick={() => handleAddFilter(0)}
          />
          {formattedExpression.length > 1 &&
            formattedExpression.map((set, setIndex) => {
              if (setIndex === 0) return null;

              return (
                <PredicateSubGroupWrapper key={set.key}>
                  <GroupTypeSelector
                    id={setIndex}
                    key={`group-${set.key}`}
                    value={set.connector}
                    connector={setIndex > 0 ? connector : null}
                    readonly={false}
                    onChange={onConnectorChange}
                    set={setIndex}
                  />
                  <Container
                    borderless
                    key={`container-${set.key}`}
                    isRound={false}
                    style={{
                      gap: 8,
                      padding: 0,
                      flexDirection: 'column',
                      flexWrap: 'wrap',
                      alignItems: 'flex-start',
                      borderLeft: `2px solid ${colors.teal}`,
                      paddingLeft: 8,
                      marginTop: 8,
                    }}
                  >
                    <AdvancedEditGroup
                      controlList={controlList}
                      fieldList={fieldList}
                      fieldListOptions={fieldListOptions}
                      id='primary-filter-group'
                      onPredicateChange={onPredicateChange}
                      onPredicateDelete={onPredicateDelete}
                      set={set}
                      setIndex={setIndex}
                      onDisableClickOutside={handleDisableClickOutSide}
                      includeControls={includeControls}
                      includeSessionVariables={includeSessionVariables}
                      splitValues={splitValues}
                      forcedTimeZone={forcedTimeZone}
                    />
                  </Container>

                  <Button
                    id={`${setIndex}-add-filter`}
                    style={{ display: 'flex' }}
                    icon={{
                      name: 'circle-plus-V4',
                      size: 16,
                      position: 'left',
                    }}
                    buttonStyle='link'
                    value='Add filter'
                    onClick={() => handleAddFilter(setIndex)}
                  />
                </PredicateSubGroupWrapper>
              );
            })}
        </Container>
      </div>
    );
  };

  return (
    <Popover
      id={`${id}-advanced-editor`}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      marginThreshold={marginThreshold}
      marginHorizontal={marginHorizontal}
      marginVertical={marginVertical}
      inline={inline}
      relativeToParent={relativeToParent}
      disableClickOutside={disableClickOutside}
      shiftLeft={shiftLeft}
    >
      <Container borderless width={800} padding={8}>
        <Text id={`${id}-advanced-editor-title`} style={{ marginBottom: 8 }} bold>
          Advanced edit
        </Text>
        <FilterWrapper>
          <Container borderless scrollable padding={8} maxHeight={400}>
            <DragDropContext onDragEnd={onDragEnd}>{renderCollection()}</DragDropContext>
          </Container>
        </FilterWrapper>
        <AddGroupFooter>
          <Button
            id='add-filter-group'
            icon={{
              name: 'filter-group',
              size: 16,
              position: 'left',
            }}
            buttonStyle='link'
            value='Add filter group'
            onClick={onAddGroup}
          />
        </AddGroupFooter>
        <ButtonFooter>
          <Button id='cancel' buttonStyle='link' onClick={onCancel} value='Cancel' />
          <Button id='apply' buttonStyle='primary' onClick={onClose} value='Apply' />
        </ButtonFooter>
      </Container>
      <Tooltip id='popover-tooltip' />
    </Popover>
  );
}

AdvancedEdit.propTypes = propTypes;
export default AdvancedEdit;
