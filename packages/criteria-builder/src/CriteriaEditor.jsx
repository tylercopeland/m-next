import React, { useEffect, useMemo, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Container from '@m-next/container';
import Button from '@m-next/button';
import { colors } from '@m-next/styles';
import { Text, TextLine } from '@m-next/typeography';
import SvgIcon, { EmptyFilterIcon } from '@m-next/svg-icon';
import { formatter, Guid } from '@m-next/utilities';
import { ExpressionElement, FieldTypeNames, basicOperationId } from '@m-next/types';
import LoadingSkeleton from '@m-next/loading-skeleton';
import parseExpression from './parser/parseExpression';
import { EmptyRowWrapper, EmptyColumnWrapper } from './CriteriaEditor.styles';
import QuickEdit from './components/QuickEdit';
import AdvancedEdit from './components/AdvancedEdit';
import filterFieldList from './parser/filterFieldList';
import InfoWrapper from './components/InfoWrapper';
import ExpressionGroup from './components/ExpressionGroup';
import { createEmptyChip, updateExpression } from './utilities';

// types
const propTypes = {
  id: PropTypes.string,
  fieldList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  controlList: PropTypes.instanceOf(Object),
  dataModelId: PropTypes.string,
  displayPreferences: PropTypes.instanceOf(Object),
  filterId: PropTypes.string,
  expression: PropTypes.arrayOf(ExpressionElement),
  onChange: PropTypes.func,
  onUpdateElementCount: PropTypes.func,
  onSendAnalytics: PropTypes.func,
  disabled: PropTypes.bool,
  forcedTimeZone: PropTypes.string,
  emptyMessage: PropTypes.string,
  showEmptyState: PropTypes.bool,
  openQuickEdit: PropTypes.bool,
  includeControls: PropTypes.bool,
  includeSessionVariables: PropTypes.bool,
  onClose: PropTypes.func,
  showEmptyFilterIcon: PropTypes.bool,
};

const CriteriaEditorButtonFooter = styled.div(({ isVisible }) => [
  {
    display: !isVisible ? 'none' : 'flex',
    flexDirection: 'row',
    gap: 16,
    marginLeft: 9,
    visibility: isVisible ? 'visible' : 'hidden',
  },
]);

function CriteriaEditor({
  id,
  fieldList,
  controlList,
  expression,
  filterId,
  onChange,
  dataModelId,
  displayPreferences,
  onUpdateElementCount,
  onSendAnalytics,
  disabled,
  forcedTimeZone,
  emptyMessage = 'Filters allow you to customize the data display on your charts.',
  showEmptyState = true,
  openQuickEdit = false,
  includeControls = true,
  includeSessionVariables = true,
  onClose,
  showEmptyFilterIcon = true,
}) {
  const [formattedExpression, setFormattedExpression] = useState([]);

  const [currentFilterId, setCurrentFilterId] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPredicate, setSelectedPredicate] = useState(null);
  const [showQuickEdit, setShowQuickEdit] = useState(false);
  const [showAdvancedEdit, setShowAdvancedEdit] = useState(false);
  const [marginHorizontal, setMarginHorizontal] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const quickEditRef = useRef();
  const advancedEditRef = useRef();
  const cleanedFieldList = useMemo(
    () =>
      filterFieldList(fieldList, [
        FieldTypeNames.Address,
        FieldTypeNames.CardColumn,
        FieldTypeNames.FileAttachment,
        FieldTypeNames.Picture,
      ]),
    [fieldList],
  );
  const fieldListOptions = useMemo(
    () => formatter.formatFieldList(cleanedFieldList, dataModelId, null, {}, displayPreferences, null, true),
    [cleanedFieldList, dataModelId, displayPreferences],
  );

  useEffect(() => {
    if (filterId !== currentFilterId) {
      setCurrentFilterId(filterId);
      const elements = parseExpression(expression || []);
      if (elements !== null) {
        elements.forEach((set) => {
          // eslint-disable-next-line no-param-reassign
          set.key = Guid.create();
          set.expression.forEach((item) => {
            // eslint-disable-next-line no-param-reassign
            item.key = Guid.create();
          });
        });

        setFormattedExpression(elements);
      }
    }
  }, [filterId, expression, currentFilterId]);

  const applyChanges = (updatedExpression) => {
    const result = updateExpression(updatedExpression);
    if (onUpdateElementCount) onUpdateElementCount(result.count);
    onChange(result.updatedExpression, result.isEditing);
  };

  const handlePredicateChange = (index, element, set) => {
    const updated = [...formattedExpression];
    updated[set].expression[index] = element;
    if (element.second.value && element.ghost) {
      updated[set].expression[index].ghost = false;
    }
    updated.isEditing = true;
    setIsDirty(true);
    setFormattedExpression(updated);
    // applyChanges(updated);
  };

  const handlePredicateReorder = (reordered) => {
    const updated = [...reordered];

    updated.isEditing = true;
    setIsDirty(true);
    setFormattedExpression(updated);
  };

  const handleCancelEdit = () => {
    setAnchorEl(null);
    setShowAdvancedEdit(false);
    setShowQuickEdit(false);
    setIsDirty(false);
    if (onClose) onClose();
    const elements = parseExpression(expression);
    if (elements !== null) {
      elements.forEach((set) => {
        // eslint-disable-next-line no-param-reassign
        set.key = Guid.create();
        set.expression.forEach((item) => {
          // eslint-disable-next-line no-param-reassign
          item.key = Guid.create();
        });
      });

      setFormattedExpression(elements);
    }
  };

  const handleCloseAdvancedEdit = (event, current) => {
    setAnchorEl(null);
    setShowAdvancedEdit(false);
    if (onClose) onClose();
    const initial = current !== null && current !== undefined ? current : formattedExpression;
    let updated = current !== null && current !== undefined ? current : [...formattedExpression];

    initial.forEach((set, setIndex) => {
      updated[setIndex].expression = updated[setIndex].expression.filter((element) => {
        if (
          element.operation === basicOperationId.IsEmpty ||
          element.operation === basicOperationId.IsNotEmpty ||
          element.operation === basicOperationId.IsTrue ||
          element.operation === basicOperationId.IsFalse
        )
          return true;
        if (element.second.value !== null && element.second.value !== undefined && element.second.value !== '')
          return true;
        return false;
      });
    });

    updated = updated.filter((set) => set.expression.length > 0);
    if (updated.length === 0) {
      updated.push({ connector: basicOperationId.And, expression: [] });
    }

    updated.isEditing = false;
    setFormattedExpression(updated);
    if (isDirty) {
      applyChanges(updated);
      if (event.target.id === 'apply' && onSendAnalytics) {
        onSendAnalytics('Chart Runtime Action', {
          action: 'Clicked apply on chart builder advanced filter editor',
          tablename: dataModelId,
        });
      }
    }
  };

  const handleOnPredicateDelete = (index, set) => {
    setIsDirty(true);
    let updated = [...formattedExpression];
    updated[set] = { ...updated[set] };
    updated[set].expression.splice(index, 1);
    if (!showAdvancedEdit) {
      updated.isEditing = false;
      updated = updated.filter((element) => element.expression.length > 0);
      if (updated.length === 0) {
        updated.push({ connector: basicOperationId.And, expression: [] });
      }
      setFormattedExpression(updated);
      applyChanges(updated);
    }
    if (showAdvancedEdit) {
      let empty = true;
      updated.forEach((item) => {
        if (item.expression.length > 0) empty = false;
      });
      if (updated[set].expression.length === 0) {
        updated.splice(set, 1);
      }
      if (empty) handleCloseAdvancedEdit(null, updated);
      else {
        setFormattedExpression(updated);
      }
    }
  };

  const handleQuickAddFilter = () => {
    if (formattedExpression.length === 0 || !formattedExpression[0].expression) {
      return;
    }

    setAnchorEl(quickEditRef.current);
    setMarginHorizontal(16);
    setShowQuickEdit(true);
    const index = formattedExpression[0].expression.length;
    handlePredicateChange(index, createEmptyChip(), 0);

    setSelectedPredicate({
      ...createEmptyChip(),
      set: 0,
      index,
    });
  };

  const handleReadOnlyClick = (event, index, set) => {
    if (disabled) return;
    setAnchorEl(event.currentTarget);
    setMarginHorizontal(48);
    setShowQuickEdit(true);
    setIsDirty(false);
    setSelectedPredicate({
      set,
      index,
      key: formattedExpression[set].expression[index].key,
      first: formattedExpression[set].expression[index].first,
      operation: formattedExpression[set].expression[index].operation,
      second: formattedExpression[set].expression[index].second,
      dateField: formattedExpression[set].expression[index].dateField,
    });
  };

  const handleShowAdvanced = () => {
    setAnchorEl(advancedEditRef.current);
    setMarginHorizontal(48);
    setShowAdvancedEdit(true);
    setIsDirty(false);
  };

  const handleCloseQuickEdit = (e) => {
    setAnchorEl(null);
    setShowQuickEdit(false);
    if (onClose) onClose();

    const last = formattedExpression[selectedPredicate.set].expression[selectedPredicate.index];
    const updated = [...formattedExpression];
    if (
      last.operation !== basicOperationId.IsEmpty &&
      last.operation !== basicOperationId.IsNotEmpty &&
      last.operation !== basicOperationId.IsTrue &&
      last.operation !== basicOperationId.IsFalse &&
      (last.second.value === null || last.second.value === undefined || last.second.value === '')
    ) {
      handleOnPredicateDelete(selectedPredicate.index, selectedPredicate.set);
    } else {
      updated[selectedPredicate.set].expression[selectedPredicate.index].ghost = false;
    }
    updated.isEditing = false;

    if (isDirty) {
      setFormattedExpression(updated);
      applyChanges(updated);
      if (e.target.id === 'apply' && onSendAnalytics) {
        onSendAnalytics('Chart Runtime Action', {
          action: 'Clicked apply on chart builder single filter editor',
          tablename: dataModelId,
        });
      }
    }
    if (
      e.target.parentElement.id === 'chart-expression-advanced-edit' ||
      e.target.nearestViewportElement?.parentElement?.id === 'chart-expression-advanced-edit'
    ) {
      handleShowAdvanced();
    }
  };

  const handleQuickEditChange = (index, element, set) => {
    handlePredicateChange(index, element, set);
  };

  const handleConnectorChange = (connector, set) => {
    const updated = [...formattedExpression];
    updated[set].connector = connector;
    setFormattedExpression(updated);
    setIsDirty(true);

    if (!showAdvancedEdit) {
      applyChanges(updated);
    }
  };

  const handleAddGroup = () => {
    const updated = [...formattedExpression];
    updated.push({
      connector: basicOperationId.And,
      key: Guid.create(),
      expression: [createEmptyChip()],
    });
    setFormattedExpression(updated);
    setIsDirty(true);
  };

  useEffect(() => {
    if (openQuickEdit && !showQuickEdit) {
      handleQuickAddFilter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openQuickEdit]);

  const renderEmptyState = () =>
    showEmptyFilterIcon ? (
      <EmptyColumnWrapper showEmptyFilterIcon={showEmptyFilterIcon}>
        <EmptyFilterIcon height={80} width={120} />
        <TextLine bold>No filters applied</TextLine>
        <TextLine>{emptyMessage}</TextLine>
        <Button
          id={`${id}-add-filter`}
          style={{ fontWeight: 400 }}
          value='Add filter'
          icon={{
            name: 'plus-V4',
            size: 10,
            position: 'left',
          }}
          buttonStyle='link'
          onClick={handleQuickAddFilter}
          disabled={disabled}
          isV4Design
        />
      </EmptyColumnWrapper>
    ) : (
      <EmptyRowWrapper showEmptyFilterIcon={showEmptyFilterIcon}>
        <Text>{emptyMessage}</Text>
        <Button
          id={`${id}-add`}
          value='Add'
          buttonStyle='link'
          icon={{
            name: 'plus-V4',
            size: 10,
            position: 'left',
          }}
          isV4Design
          onClick={handleQuickAddFilter}
        />
      </EmptyRowWrapper>
    );

  const renderCollection = () => {
    if (!formattedExpression?.length) return null;

    return (
      <ExpressionGroup
        onConnectorChange={handleConnectorChange}
        onPredicateChange={handlePredicateChange}
        onPredicateDelete={handleOnPredicateDelete}
        fieldListOptions={fieldListOptions}
        displayPreferences={displayPreferences}
        controlList={controlList}
        fieldList={cleanedFieldList}
        formattedExpression={formattedExpression}
        onReadOnlyClick={handleReadOnlyClick}
      />
    );
  };

  const shouldShowEmptyState =
    showEmptyState &&
    (!formattedExpression.length || (formattedExpression.length === 1 && !formattedExpression[0]?.expression.length));

  return (
    <Container
      id={id}
      borderless
      style={{ gap: 8, padding: 0, flexDirection: 'column', flexWrap: 'wrap', alignItems: 'flex-start' }}
    >
      {!dataModelId && (
        <InfoWrapper id='criteria-info'>
          <TextLine>A data source must be selected before filter can be configured.</TextLine>
        </InfoWrapper>
      )}

      {dataModelId && !cleanedFieldList && (
        <LoadingSkeleton count={1} width={320} height={60} circle={false} duration={1.4} />
      )}

      {dataModelId && cleanedFieldList && shouldShowEmptyState && renderEmptyState()}

      {dataModelId && cleanedFieldList && !shouldShowEmptyState && renderCollection()}

      <CriteriaEditorButtonFooter
        isVisible={
          dataModelId &&
          cleanedFieldList &&
          (formattedExpression.length > 1 || formattedExpression[0]?.expression.length > 0)
        }
        showEmptyState={showEmptyState}
      >
        <SvgIcon
          id={`${id}-add-filter`}
          name='circle-plus-V4'
          size={16}
          position='left'
          color={colors.grey}
          onClick={handleQuickAddFilter}
          forwardRef={quickEditRef}
        />
        <SvgIcon
          id={`${id}-advanced-edit`}
          name='settings'
          size={16}
          position='left'
          color={colors.grey}
          onClick={handleShowAdvanced}
          forwardRef={advancedEditRef}
        />
      </CriteriaEditorButtonFooter>

      {selectedPredicate && showQuickEdit && (
        <QuickEdit
          id='quick-edit-filter'
          elementKey={selectedPredicate.key}
          anchorEl={anchorEl}
          controlList={controlList}
          fieldList={cleanedFieldList}
          fieldListOptions={fieldListOptions}
          first={selectedPredicate.first}
          second={selectedPredicate.second}
          operation={selectedPredicate.operation}
          index={selectedPredicate.index}
          set={selectedPredicate.set}
          onChange={handleQuickEditChange}
          onClose={handleCloseQuickEdit}
          onCancel={handleCancelEdit}
          open={showQuickEdit}
          ghost={selectedPredicate.ghost}
          dateField={selectedPredicate.dateField}
          forcedTimeZone={forcedTimeZone}
          includeControls={includeControls}
          includeSessionVariables={includeSessionVariables}
        />
      )}

      {showAdvancedEdit && (
        <AdvancedEdit
          id='advanced-edit-filter'
          anchorEl={anchorEl}
          controlList={controlList}
          fieldList={cleanedFieldList}
          fieldListOptions={fieldListOptions}
          onConnectorChange={handleConnectorChange}
          onPredicateChange={handlePredicateChange}
          onPredicateDelete={handleOnPredicateDelete}
          onClose={handleCloseAdvancedEdit}
          onCancel={handleCancelEdit}
          onAddGroup={handleAddGroup}
          onReorder={handlePredicateReorder}
          open={showAdvancedEdit}
          marginHorizontal={marginHorizontal}
          formattedExpression={formattedExpression}
          forcedTimeZone={forcedTimeZone}
          includeControls={includeControls}
          includeSessionVariables={includeSessionVariables}
          shiftLeft={310}
          marginVertical={200}
        />
      )}
    </Container>
  );
}

CriteriaEditor.propTypes = propTypes;
export default CriteriaEditor;
