import React, { useState, useEffect, useMemo, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import Container from '@m-next/container';
import { ExpressionElement, Field, EmptyPredicate, basicOperationId, Tag, FieldTypeNames } from '@m-next/types';
import { formatter, Guid } from '@m-next/utilities';
import { Tooltip } from 'react-tooltip';
import Button from '@m-next/button';
import { parseExpression, reformatExpression, AdvancedEdit, filterAndSplitFieldList } from '@m-next/criteria-builder';
import ButtonGroup from '@m-next/button-group';
import AddChip from './components/AddChip';
import Chip from './components/Chip';
import ChipBuilderPopup from './components/ChipBuilderPopup';
import AdvancedChip from './components/AdvancedChip';
import { hasUnsavedChanges } from './utils/unsaved-changes-helpers';

// One-time deprecation warner — mirrors @m-next/button and @m-next/input.
const warnOnce = (() => {
  const seen = new Set();
  return (key, message) => {
    if (seen.has(key) || typeof console === 'undefined') return;
    seen.add(key);
    // eslint-disable-next-line no-console
    console.warn(message);
  };
})();

let autoIdCounter = 0;

const propTypes = {
  id: PropTypes.string,
  disabled: PropTypes.bool,
  fieldList: PropTypes.arrayOf(Field),
  simpleChipsExpression: PropTypes.arrayOf(ExpressionElement),
  advancedChipsExpression: PropTypes.arrayOf(ExpressionElement),
  displayPreferences: PropTypes.instanceOf(Object),
  onExpressionChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string,
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  isLoading: PropTypes.bool,
  onSearch: PropTypes.func,
  searchText: PropTypes.string,
  tagsList: PropTypes.arrayOf(Tag),
  viewName: PropTypes.string,
  forcedTimeZone: PropTypes.string,
  disableMaxWidth: PropTypes.bool,
  forceClear: PropTypes.bool,
  resetChipsTriggered: PropTypes.bool,
  egCustomViewsSaveButtonEnabled: PropTypes.bool,
  onClickShowSaveGridViewDialog: PropTypes.func,
  onClickResetButton: PropTypes.func,
  onChipFilterApplied: PropTypes.func,
  onChipFilterRemoved: PropTypes.func,
  viewResetButtonVisible: PropTypes.bool,
  currentViewType: PropTypes.string,
  onUpdateCurrentView: PropTypes.func,
  canEditSharedView: PropTypes.bool,
  onUpdateSharedView: PropTypes.func,
  setViewSaveAndResetButtonsVisible: PropTypes.func,
  hasOtherViewChanges: PropTypes.bool,
  viewType: PropTypes.string, // 'Standard', 'Personal', 'Shared'
  updateInitialValues: PropTypes.bool, // Trigger to update initial values after save
  // eslint-disable-next-line react/forbid-prop-types
  label: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  'aria-label': PropTypes.string,
  // Legacy / deprecated (kept for shim)
  isMobile: PropTypes.bool,
};

const ChipsFilter = forwardRef(function ChipsFilter(props, ref) {
  const {
    id: idProp,
    disabled = false,
    fieldList = [],
    simpleChipsExpression = [],
    advancedChipsExpression = [],
    displayPreferences,
    onExpressionChange,
    options,
    isLoading,
    onSearch,
    searchText,
    tagsList,
    viewName,
    forcedTimeZone,
    disableMaxWidth,
    forceClear,
    resetChipsTriggered,
    egCustomViewsSaveButtonEnabled = false,
    viewResetButtonVisible = false,
    currentViewType = 'standard',
    onUpdateCurrentView = null,
    canEditSharedView = false,
    onUpdateSharedView = null,
    setViewSaveAndResetButtonsVisible = null,
    hasOtherViewChanges = false,
    onClickShowSaveGridViewDialog = null,
    onClickResetButton = null,
    onChipFilterApplied = null,
    onChipFilterRemoved = null,
    viewType = null, // 'Standard', 'Personal', 'Shared'
    updateInitialValues = false, // Trigger to update initial values after save

    // Clean API
    label: labelProp,
    'aria-label': ariaLabelProp,
    isMobile = false,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,
    caption: legacyCaption,

    // Silently ignored legacy ghosts (no behavioral effect — V4 is always on)
    isV4Design: _isV4Design,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-filter-chips-${++autoIdCounter}`;
  }
  const id = idProp && idProp !== '' ? idProp : internalIdRef.current;

  // ============ Backwards-compat translation ============

  let label = labelProp;
  if (legacyCaption !== undefined && label === undefined) {
    warnOnce(
      'filter-chips-caption',
      '@m-next/chips-filter: `caption` is deprecated. Use `label` (passed through as the accessible group name).',
    );
    label = legacyCaption;
  }

  if (legacyForwardRef) {
    warnOnce(
      'filter-chips-forwardRef-prop',
      '@m-next/chips-filter: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  // Compose accessible name: explicit aria-label wins, then label, then a sensible default.
  const ariaLabel = ariaLabelProp ?? label ?? 'Filter chips';

  // Expose the root for ref consumers (forwardRef API + legacy forwardRef prop).
  const rootRef = useRef(null);
  useImperativeHandle(ref, () => rootRef.current, []);
  useEffect(() => {
    if (!legacyForwardRef) return;
    if (typeof legacyForwardRef === 'function') {
      legacyForwardRef(rootRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      legacyForwardRef.current = rootRef.current;
    }
  }, [legacyForwardRef]);

  const [open, setOpen] = useState(false);
  const [openChip, setOpenChip] = useState(null);
  const [internalSimpleChipsExpression, setSimpleChipsExpression] = useState([]);
  const [internalAdvancedChipsExpression, setAdvancedChipsExpression] = useState([]);
  const [preEditAdvanced, setPreEditAdvanced] = useState([]);
  const [preEditSimple, setPreEditSimple] = useState([]);

  // Capture initial values for comparison to detect changes
  const [initialSimpleChipsExpression, setInitialSimpleChipsExpression] = useState([]);
  const [initialAdvancedChipsExpression, setInitialAdvancedChipsExpression] = useState([]);
  const isInitialMountSimple = useRef(true);
  const isInitialMountAdvanced = useRef(true);

  const [selectedPredicate, setSelectedPredicate] = useState({
    set: 0,
    key: Guid.create(),
    index: 0,
    first: { ...EmptyPredicate },
    operation: basicOperationId.Equals,
    second: { ...EmptyPredicate },
    ghost: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const currentChipIsValid = useMemo(() => {
    if (
      !internalSimpleChipsExpression ||
      !internalSimpleChipsExpression[0] ||
      !internalSimpleChipsExpression[0].expression[openChip] ||
      !internalSimpleChipsExpression[0].expression[openChip].first ||
      !internalSimpleChipsExpression[0].expression[openChip].first.value
    )
      return false;

    return true;
  }, [internalSimpleChipsExpression, openChip]);

  const hasSimpleExpression = useMemo(
    () =>
      internalSimpleChipsExpression &&
      internalSimpleChipsExpression.length > 0 &&
      internalSimpleChipsExpression[0].expression &&
      internalSimpleChipsExpression[0].expression.length > 0,
    [internalSimpleChipsExpression],
  );

  const hasValidSimpleExpression = useMemo(
    () => hasSimpleExpression && !!internalSimpleChipsExpression[0].expression[0].first?.value,
    [hasSimpleExpression, internalSimpleChipsExpression],
  );

  const hasAdvancedExpression = useMemo(
    () =>
      internalAdvancedChipsExpression &&
      internalAdvancedChipsExpression.length > 0 &&
      internalAdvancedChipsExpression[0].expression &&
      internalAdvancedChipsExpression[0].expression.length > 0,
    [internalAdvancedChipsExpression],
  );

  const splitFieldList = useMemo(
    () =>
      filterAndSplitFieldList(fieldList, [
        FieldTypeNames.Address,
        FieldTypeNames.CardColumn,
        FieldTypeNames.FileAttachment,
        FieldTypeNames.Picture,
        FieldTypeNames.Formula,
      ]),
    [fieldList],
  );

  const cleanFieldList = useMemo(
    () =>
      splitFieldList.filter((f) => {
        if (
          !internalSimpleChipsExpression ||
          internalSimpleChipsExpression.length === 0 ||
          internalSimpleChipsExpression[0].expression.length === 0
        )
          return true;

        if (
          internalSimpleChipsExpression[0].expression.find(
            (e) => e.first.value === f.name && (e.first.metadata ? e.first.metadata?.type === f.type : true),
          )
        )
          return false;
        return true;
      }),
    [splitFieldList, internalSimpleChipsExpression],
  );

  const fieldListOptions = useMemo(
    () => formatter.formatFieldList(cleanFieldList, viewName, null, {}, displayPreferences, null, true, true),
    [cleanFieldList, viewName, displayPreferences],
  );

  const parseSimpleChipsExpression = useCallback((simpleExpressionData) => {
    if (!simpleExpressionData) return;

    const elements = parseExpression(simpleExpressionData);
    if (elements !== null) {
      elements.forEach((set, setIndex) => {
        // eslint-disable-next-line no-param-reassign
        set.key = Guid.create();
        set.expression.forEach((item, itemIndex) => {
          // eslint-disable-next-line no-param-reassign
          item.key = Guid.create();
          // eslint-disable-next-line no-param-reassign
          item.index = itemIndex;
          // eslint-disable-next-line no-param-reassign
          item.set = setIndex;
        });
      });

      setSimpleChipsExpression(elements);
    }
  }, []);

  const parseAdvancedChipsExpression = useCallback((advancedExpressionData) => {
    if (!advancedExpressionData) return;

    const elements = parseExpression(advancedExpressionData);
    if (elements !== null) {
      elements.forEach((set, setIndex) => {
        // eslint-disable-next-line no-param-reassign
        set.key = Guid.create();
        set.expression.forEach((item, itemIndex) => {
          // eslint-disable-next-line no-param-reassign
          item.key = Guid.create();
          // eslint-disable-next-line no-param-reassign
          item.index = itemIndex;
          // eslint-disable-next-line no-param-reassign
          item.set = setIndex;
        });
      });

      setAdvancedChipsExpression(elements);
    }
  }, []);

  useEffect(() => {
    if (resetChipsTriggered) {
      parseSimpleChipsExpression([]);
      parseAdvancedChipsExpression([]);
    }
  }, [resetChipsTriggered, parseSimpleChipsExpression, parseAdvancedChipsExpression]);

  // Capture initial values on first mount for change detection
  // Important: Capture even if expressions are empty to handle views with no initial filters
  useEffect(() => {
    if (isInitialMountSimple.current && initialSimpleChipsExpression.length === 0) {
      setInitialSimpleChipsExpression(simpleChipsExpression ? [...simpleChipsExpression] : []);
      isInitialMountSimple.current = false;
    }
  }, [simpleChipsExpression, initialSimpleChipsExpression.length]);

  useEffect(() => {
    if (isInitialMountAdvanced.current && initialAdvancedChipsExpression.length === 0) {
      setInitialAdvancedChipsExpression(advancedChipsExpression ? [...advancedChipsExpression] : []);
      isInitialMountAdvanced.current = false;
    }
  }, [advancedChipsExpression, initialAdvancedChipsExpression.length]);

  // Force update initial values when updateInitialValues prop is true (e.g., after save)
  useEffect(() => {
    if (updateInitialValues) {
      setInitialSimpleChipsExpression(simpleChipsExpression ? [...simpleChipsExpression] : []);
      setInitialAdvancedChipsExpression(advancedChipsExpression ? [...advancedChipsExpression] : []);
    }
  }, [updateInitialValues, simpleChipsExpression, advancedChipsExpression]);

  useEffect(() => {
    if (!simpleChipsExpression || simpleChipsExpression.length === 0) return;
    parseSimpleChipsExpression(simpleChipsExpression);
  }, [simpleChipsExpression, parseSimpleChipsExpression]);

  useEffect(() => {
    if (!advancedChipsExpression || advancedChipsExpression.length === 0) return;
    parseAdvancedChipsExpression(advancedChipsExpression);
  }, [advancedChipsExpression, parseAdvancedChipsExpression]);

  // Helper function to populate metadata for expressions loaded from backend
  // Returns { updatedExpression, wasUpdated } - creates new objects instead of mutating
  const populateExpressionMetadata = useCallback(
    (expression) => {
      if (!expression?.length || !splitFieldList?.length) {
        return { updatedExpression: expression, wasUpdated: false };
      }

      let wasUpdated = false;
      const updatedExpression = expression.map((set) => ({
        ...set,
        expression: set.expression.map((item) => {
          if (item.first?.value && !item.first.metadata?.type) {
            const matchedField = splitFieldList.find((f) => f.name === item.first.value);
            if (matchedField) {
              wasUpdated = true;
              return {
                ...item,
                first: {
                  ...item.first,
                  metadata: { ...item.first.metadata, type: matchedField.type },
                },
              };
            }
          }
          return item;
        }),
      }));

      return { updatedExpression, wasUpdated };
    },
    [splitFieldList],
  );

  // Populate metadata for expressions loaded from backend
  // This is needed because parseExpression doesn't set metadata.type,
  // but reformatExpression needs it for field-type-aware validation
  useEffect(() => {
    if (!splitFieldList || splitFieldList.length === 0) return;

    const { updatedExpression: updatedSimple, wasUpdated: simpleUpdated } =
      populateExpressionMetadata(internalSimpleChipsExpression);
    const { updatedExpression: updatedAdvanced, wasUpdated: advancedUpdated } = populateExpressionMetadata(
      internalAdvancedChipsExpression,
    );

    if (simpleUpdated) {
      setSimpleChipsExpression(updatedSimple);
    }
    if (advancedUpdated) {
      setAdvancedChipsExpression(updatedAdvanced);
    }
  }, [splitFieldList, internalSimpleChipsExpression, internalAdvancedChipsExpression, populateExpressionMetadata]);

  const handleChipToggle = (index) => {
    if (openChip === index) {
      setOpenChip(null);
      setOpen(false);
      return;
    }

    const key = Guid.create();
    let { second, third } = internalSimpleChipsExpression[0].expression[index];

    if (!second || second.type === undefined) {
      second = EmptyPredicate();
    }
    if (!third || third.type === undefined) {
      third = EmptyPredicate();
    }
    setSelectedPredicate({
      set: 0,
      key,
      index,
      first: internalSimpleChipsExpression[0].expression[index].first,
      operation: internalSimpleChipsExpression[0].expression[index].operation,
      second,
      third,
      ghost: true,
    });

    setOpenChip(index);
    setOpen(true);
  };

  const unwrapExpression = (updatedExpression, updatedAdvancedExpression) => {
    const updated = reformatExpression(updatedExpression);
    const updatedAdvanced = reformatExpression(updatedAdvancedExpression);

    if (egCustomViewsSaveButtonEnabled) {
      // Compare current expressions against the initial props (which represent the "saved" state)
      const hasChanges = hasUnsavedChanges(
        updated,
        updatedAdvanced,
        initialSimpleChipsExpression,
        initialAdvancedChipsExpression,
        viewType,
      );

      // Show save/reset buttons only if there are changes from the initial state
      if (setViewSaveAndResetButtonsVisible) setViewSaveAndResetButtonsVisible(hasChanges);
    }

    // Check if any filters returned the special "allFiltersInvalid" marker
    // This happens when user entered invalid values like "10--" or "22++"
    const simpleInvalid = updated?.allFiltersInvalid;
    const advancedInvalid = updatedAdvanced?.allFiltersInvalid;

    onExpressionChange({
      simple: simpleInvalid ? null : updated,
      advanced: advancedInvalid ? null : updatedAdvanced,
      // Signal to parent that filters were attempted but all were invalid
      // This allows showing "No results" UI without making an API call
      allFiltersInvalid: simpleInvalid || advancedInvalid,
    });
  };

  const handleDelete = (index, set) => {
    let updated = [...internalSimpleChipsExpression];

    // 🎯 Get field name before deletion for analytics
    const deletedElement = updated[set]?.expression?.[index];
    const deletedFieldName = deletedElement?.first?.value;

    updated[set] = { ...updated[set] };
    updated[set].expression.splice(index, 1);
    updated.isEditing = false;
    updated = updated.filter((element) => element.expression.length > 0);
    if (updated.length === 0) {
      updated.push({ connector: basicOperationId.And, expression: [] });
    }
    for (let i = 0; i < updated[set].expression.length; i++) {
      updated[set].expression[i].index = i;
    }

    // 🎯 Track chip filter removed analytics
    if (onChipFilterRemoved && deletedFieldName) {
      onChipFilterRemoved(deletedFieldName);
    }

    setSimpleChipsExpression(updated);
    unwrapExpression(updated, internalAdvancedChipsExpression);
  };

  const handlePredicateChange = (index, element, set) => {
    let updated = [...internalSimpleChipsExpression];
    if (!internalSimpleChipsExpression || internalSimpleChipsExpression.length <= 0) {
      updated = [{ connector: basicOperationId.And, expression: [] }];
    }

    updated[set].expression[index] = element;
    if (element.second.value && element.ghost && !element.invalid) {
      updated[set].expression[index].ghost = false;
    }

    // 🎯 Track chip filter applied analytics
    if (element?.first?.value && element?.second?.value && onChipFilterApplied) {
      onChipFilterApplied(element.first.value);
    }
    setSimpleChipsExpression(updated);
    setIsEditing(true);
  };

  const handleAddFilter = () => {
    if (!internalSimpleChipsExpression || internalSimpleChipsExpression.length <= 0) {
      setSimpleChipsExpression([{ connector: basicOperationId.And, expression: [] }]);
    }
    const index =
      internalSimpleChipsExpression && internalSimpleChipsExpression.length > 0
        ? internalSimpleChipsExpression[0].expression.length
        : 0;
    setOpenChip(index);
    handlePredicateChange(
      index,
      {
        key: Guid.create(),
        first: { ...EmptyPredicate },
        operation: null,
        second: { ...EmptyPredicate },
        ghost: true,
      },
      0,
    );

    const key = Guid.create();
    setSelectedPredicate({
      set: 0,
      key,
      index,
      first: { ...EmptyPredicate },
      operation: null,
      second: { ...EmptyPredicate },
      ghost: true,
    });

    setOpen(true);
    window.dispatchEvent(new Event('resize')); // Tells scrollbars to recalc if needed
  };

  const handleClear = () => {
    setOpen(false);
    setSelectedPredicate({
      set: 0,
      key: Guid.create(),
      index: 0,
      first: { ...EmptyPredicate },
      operation: basicOperationId.Equals,
      second: { ...EmptyPredicate },
      ghost: true,
    });
    setOpenChip(null);
    setSimpleChipsExpression([]);
    setAdvancedChipsExpression([]);

    // Clear initial values if component is being reset
    if (updateInitialValues) {
      setInitialSimpleChipsExpression([]);
      setInitialAdvancedChipsExpression([]);
    }

    if (onExpressionChange) onExpressionChange({});

    // Only hide buttons if there are no other view changes (columns/sorting)
    if (setViewSaveAndResetButtonsVisible) {
      setViewSaveAndResetButtonsVisible(hasOtherViewChanges);
    }
  };

  useEffect(() => {
    if (forceClear) {
      handleClear();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceClear]);

  const handleClose = (e) => {
    if (e.target.id === `${id}-clear-all`) {
      handleClear();
      setOpenChip(null);
      setOpen(false);
      return;
    }

    const last = internalSimpleChipsExpression[selectedPredicate.set]?.expression[selectedPredicate.index];

    setSelectedPredicate({
      set: 0,
      key: Guid.create(),
      index: 0,
      first: { ...EmptyPredicate },
      operation: basicOperationId.Equals,
      second: { ...EmptyPredicate },
      ghost: true,
    });
    if (!last) return;
    let deleteLast = false;
    const updated = [...internalSimpleChipsExpression];
    if (
      last.operation !== basicOperationId.IsEmpty &&
      last.operation !== basicOperationId.IsNotEmpty &&
      last.operation !== basicOperationId.IsTrue &&
      last.operation !== basicOperationId.IsFalse &&
      (last.second.value === null || last.second.value === undefined || last.second.value === '')
    ) {
      handleDelete(selectedPredicate.index, selectedPredicate.set);
      deleteLast = true;
    } else {
      updated[selectedPredicate.set].expression[selectedPredicate.index].ghost = false;
    }

    updated[selectedPredicate.set].expression = updated[selectedPredicate.set].expression.map((element) => {
      if (element.operation === basicOperationId.Between && (!element.third || element.third.value === null)) {
        return { ...element, operation: basicOperationId.Is, third: null };
      }
      return element;
    });

    if (isEditing) {
      setIsEditing(false);
      // Only call unwrapExpression if we didn't already call it via handleDelete
      // handleDelete already calls unwrapExpression with the correct updated state
      if (!deleteLast) {
        unwrapExpression(updated, internalAdvancedChipsExpression);
      }
    }

    if (
      !last.first.value ||
      (last.operation !== basicOperationId.IsEmpty &&
        last.operation !== basicOperationId.IsNotEmpty &&
        last.operation !== basicOperationId.IsTrue &&
        last.operation !== basicOperationId.IsFalse &&
        (last.second.value === null || last.second.value === undefined || last.second.value === ''))
    ) {
      setOpenChip(null);
      setOpen(false);
      return;
    }

    if (e.target.parentNode.id.includes(`pill-text-${id}`) || e.target.id.includes(`${id}-active-editing`)) {
      return;
    }

    if (e.target.parentNode.id.includes(`${id}-button-add`) && currentChipIsValid && !deleteLast) {
      return;
    }

    setOpenChip(null);
    setOpen(false);
  };

  const handleSearch = (field, text) => {
    if (typeof onSearch !== 'function') {
      // ChipsFilter handleSearch was called, but onSearch was not a function!
      return;
    }
    onSearch(field, text, internalSimpleChipsExpression);
  };

  // Advanced filters

  const handleAdvancedPredicateChange = (index, element, set) => {
    let updated = [...internalAdvancedChipsExpression];
    if (!internalAdvancedChipsExpression || internalAdvancedChipsExpression.length <= 0) {
      updated = [{ connector: basicOperationId.And, expression: [] }];
    }

    updated[set].expression[index] = element;
    if (element.second.value && element.ghost && !element.invalid) {
      updated[set].expression[index].ghost = false;
    }
    updated = updated.filter((elements) => elements.expression.length > 0);

    setAdvancedChipsExpression(updated);
    setIsEditing(true);
  };

  const handleToggleAdvancedChip = () => {
    setAdvancedOpen(!advancedOpen);
    const updated = [];
    if (internalAdvancedChipsExpression && internalAdvancedChipsExpression.length > 0) {
      internalAdvancedChipsExpression.forEach((set) => {
        updated.push({
          connector: set.connector,
          key: Guid.create(),
          expression: [...set.expression],
        });
      });
    }
    setPreEditAdvanced(updated);
    setPreEditSimple(internalSimpleChipsExpression);
  };

  const handleDeleteAdvanced = () => {
    setAdvancedOpen(false);
    setAdvancedChipsExpression(null);
    unwrapExpression(internalSimpleChipsExpression, []);
  };

  const handlePredicateReorder = (reordered) => {
    const updated = [...reordered];
    setAdvancedChipsExpression(updated);
  };

  const handleCancelEdit = () => {
    setAdvancedOpen(false);
    setIsEditing(false);
    setAdvancedChipsExpression(preEditAdvanced);
    setSimpleChipsExpression(preEditSimple);
    unwrapExpression(preEditSimple, preEditAdvanced);
  };

  const handleConnectorChange = (connector, set) => {
    const updated = [...internalAdvancedChipsExpression];
    updated[set].connector = connector;
    setAdvancedChipsExpression(updated);
    setIsEditing(true);
  };

  const handleAddGroup = () => {
    const updated = [...internalAdvancedChipsExpression];
    updated.push({
      connector: basicOperationId.And,
      key: Guid.create(),
      expression: [
        {
          key: Guid.create(),
          first: { ...EmptyPredicate },
          operation: null,
          second: { ...EmptyPredicate },
          ghost: true,
        },
      ],
    });
    setAdvancedChipsExpression(updated);
    setTimeout(() => {
      document
        .getElementById(`${updated.length - 1}-0-readonly-predicate`)
        .scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  const handleCloseAdvancedEdit = (event, current) => {
    setAdvancedOpen(false);
    const initial = current !== null && current !== undefined ? current : internalAdvancedChipsExpression;
    let updated = current !== null && current !== undefined ? current : [...internalAdvancedChipsExpression];

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
    updated.isEditing = false;
    setAdvancedChipsExpression(updated);
    if (isEditing) {
      unwrapExpression(internalSimpleChipsExpression, updated);
    }

    setIsEditing(false);
  };

  const handleOnPredicateDelete = (index, set) => {
    const updated = [...internalAdvancedChipsExpression];
    updated[set] = { ...updated[set] };
    updated[set].expression.splice(index, 1);
    let empty = true;
    updated.forEach((item) => {
      if (item.expression.length > 0) empty = false;
    });
    if (updated[set].expression.length === 0) {
      updated.splice(set, 1);
    }
    if (empty) handleCloseAdvancedEdit(null, updated);
    else {
      for (let i = 0; i < updated[set].expression.length; i++) {
        updated[set].expression[i].index = i;
      }

      setAdvancedChipsExpression(updated);
      setIsEditing(true);
    }
  };

  const handleMoveChipToAdvancedEdit = () => {
    setOpen(false);
    setOpenChip(null);

    const preSimple = [];

    if (internalSimpleChipsExpression && internalSimpleChipsExpression.length > 0) {
      internalSimpleChipsExpression.forEach((set, index) => {
        const expression = [];
        set.expression.forEach((element, elementIndex) => {
          if (
            element.first &&
            (element.operation === basicOperationId.IsEmpty ||
              element.operation === basicOperationId.IsNotEmpty ||
              element.operation === basicOperationId.IsTrue ||
              element.operation === basicOperationId.IsFalse ||
              (element.second.value !== null && element.second.value !== undefined && element.second.value !== ''))
          ) {
            expression.push({ ...element, elementIndex });
          }
        });

        preSimple.push({
          connector: set.connector,
          key: Guid.create(),
          expression,
          index,
        });
      });
    }
    setPreEditSimple(preSimple);

    const updated = internalAdvancedChipsExpression ? [...internalAdvancedChipsExpression] : [];

    if (updated.length === 0) {
      updated.push({ connector: basicOperationId.And, key: Guid.create(), expression: [] });
    }

    const element = internalSimpleChipsExpression[0].expression[selectedPredicate.index];
    updated[0].expression.push(element);
    const updatedSimpleChipsExpression = [...internalSimpleChipsExpression];
    updatedSimpleChipsExpression[0].expression.splice(selectedPredicate.index, 1);
    for (let i = 0; i < updated[0].expression.length; i++) {
      updated[0].expression[i].index = i;
    }

    setAdvancedChipsExpression(updated);
    setSimpleChipsExpression(updatedSimpleChipsExpression);

    const preUpdate = [];
    if (internalAdvancedChipsExpression && internalAdvancedChipsExpression.length > 0) {
      internalAdvancedChipsExpression.forEach((set) => {
        preUpdate.push({
          connector: set.connector,
          key: Guid.create(),
          expression: [...set.expression],
        });
      });
    }
    setPreEditAdvanced(preUpdate);
    setAdvancedOpen(true);
  };

  // Helper functions for button rendering - optimized to reduce duplication
  const createButton = (buttonId, value, onClick, extraProps = {}) => (
    <>
      <Button size='small' id={buttonId} value={value} onClick={onClick} {...extraProps} />
      {isMobile && (
        <Button
          buttonStyle='link'
          size='small'
          id={`${id}-reset`}
          value='Reset'
          onClick={onClickResetButton}
          style={{ marginLeft: '8px' }}
        />
      )}
    </>
  );

  const createButtonGroup = (groupId, data, extraProps = {}) => (
    <>
      <ButtonGroup
        id={groupId}
        buttonStyle='calendarMenu'
        size='small'
        margin='0'
        style={{ padding: 0 }}
        onClick={(item) => {
          if (item?.onClick && !item.disabled) {
            item.onClick();
          }
        }}
        data={data}
        {...extraProps}
      />
      {isMobile && (
        <Button
          buttonStyle='link'
          size='small'
          id={`${id}-reset`}
          value='Reset'
          onClick={onClickResetButton}
          style={{ marginLeft: '8px' }}
        />
      )}
    </>
  );

  const getButtonConfig = () => {
    const saveAsNewAction = () => onClickShowSaveGridViewDialog(false);

    const buttonConfigs = {
      standard: {
        type: 'single',
        id: `${id}-save-as-new-view`,
        value: 'Save as new view',
        onClick: saveAsNewAction,
      },
      custom: {
        type: 'group',
        id: 'chipsFilter-personal-view-save-button-group',
        data: [
          { value: 'Save changes', label: 'Save changes', onClick: onUpdateCurrentView },
          { value: 'Save as new view', label: 'Save as new view', onClick: saveAsNewAction },
        ],
      },
      sharedWithAccess: {
        type: 'group',
        id: 'chipsFilter-shared-view-save-button-group',
        data: [
          { value: 'Save for everyone', label: 'Save for everyone', onClick: onUpdateSharedView },
          { value: 'Save as new view', label: 'Save as new view', onClick: saveAsNewAction },
        ],
      },
      sharedReadOnly: {
        type: 'single',
        id: 'chipsFilter-shared-view-save-as-new-button',
        value: 'Save as new view',
        onClick: saveAsNewAction,
        label: 'Save as new view',
        margin: '0',
      },
      default: {
        type: 'group',
        id: 'chipsFilter-eg-custom-views-save-button-group',
        data: [
          { value: 'Save for everyone', label: 'Save for everyone', onClick: onUpdateSharedView },
          { value: 'Save as new view', label: 'Save as new view', onClick: saveAsNewAction },
        ],
      },
    };

    if (currentViewType === 'standard') return buttonConfigs.standard;
    if (currentViewType === 'custom') return buttonConfigs.custom;
    if (currentViewType === 'shared' && canEditSharedView) return buttonConfigs.sharedWithAccess;
    if (currentViewType === 'shared' && !canEditSharedView) return buttonConfigs.sharedReadOnly;
    return buttonConfigs.default;
  };

  const renderSaveButtons = () => {
    const config = getButtonConfig();

    if (config.type === 'single') {
      const { type, ...buttonProps } = config;
      return createButton(buttonProps.id, buttonProps.value, buttonProps.onClick, buttonProps);
    }

    if (config.type === 'group') {
      return createButtonGroup(config.id, config.data);
    }

    return null;
  };

  // Advanced filters
  return (
    <>
      <Container
        ref={rootRef}
        id={id}
        borderless
        data-view-type={viewType || 'default'}
        role='group'
        aria-label={ariaLabel}
        style={{
          position: 'relative',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 8,
          flexWrap: 'nowrap',
          padding: 12,
          borderRadius: 8,
        }}
      >
        <div style={{ display: 'flex', flex: 1, flexWrap: 'wrap', alignItems: 'center', gap: 8, width: '100%' }}>
          <Tooltip
            id={`${id}-chips-tooltip`}
            opacity={1}
            style={{ zIndex: 100000, maxWidth: 304, wordBreak: 'break-all' }}
          />
          {hasAdvancedExpression && (
            <AdvancedChip
              id={id}
              isMobile={isMobile}
              onDelete={handleDeleteAdvanced}
              isOpen={advancedOpen}
              isActive
              onClick={handleToggleAdvancedChip}
              displayPreferences={displayPreferences}
              fieldList={fieldList}
              expression={internalAdvancedChipsExpression}
            />
          )}
          {hasSimpleExpression &&
            internalSimpleChipsExpression[0].expression.map((element, index) => (
              <Chip
                id={id}
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                isMobile={isMobile}
                first={element.first}
                operation={element.operation}
                second={element.second}
                third={element.third}
                onDelete={handleDelete}
                isOpen={openChip === index}
                onClick={handleChipToggle}
                displayPreferences={displayPreferences}
                fieldList={splitFieldList}
                index={element.index}
                set={element.set}
                hasValidSimpleExpression={hasValidSimpleExpression}
                onClose={handleClose}
                disableMaxWidth={disableMaxWidth}
                tooltipId={`${id}-chips-tooltip`}
              />
            ))}
          <AddChip
            id={`${id}-button-add`}
            onClick={handleAddFilter}
            disabled={disabled}
            showLabel={!hasValidSimpleExpression}
            isVisible={!open || currentChipIsValid}
          />
          {!open && (hasValidSimpleExpression || hasAdvancedExpression) && (
            <Button id={`${id}-clear-all`} size='small' buttonStyle='link' value='Clear all' onClick={handleClear} />
          )}
        </div>
        {egCustomViewsSaveButtonEnabled && viewResetButtonVisible && !isMobile && (
          <div style={{ marginLeft: 'auto' }}>
            <Button buttonStyle='link' size='small' id={`${id}-reset`} value='Reset' onClick={onClickResetButton} />
          </div>
        )}
        {egCustomViewsSaveButtonEnabled && viewResetButtonVisible && (
          <div
            style={{
              marginLeft: isMobile ? 0 : 'auto',
              alignSelf: isMobile ? 'stretch' : null,
            }}
          >
            {/* Scenario-based button rendering */}
            {renderSaveButtons()}
          </div>
        )}
      </Container>
      {!advancedOpen && (
        <ChipBuilderPopup
          id={id}
          key={selectedPredicate.key}
          isMobile={isMobile}
          anchorEl={`${id}-active-editing`}
          open={open}
          onClose={handleClose}
          fieldList={splitFieldList}
          cleanfieldList={cleanFieldList}
          predicate={selectedPredicate}
          onChange={handlePredicateChange}
          displayPreferences={displayPreferences}
          options={options}
          isLoading={isLoading}
          onSearch={handleSearch}
          searchText={searchText}
          tagsList={tagsList}
          onShowAdvancedEdit={handleMoveChipToAdvancedEdit}
          forcedTimeZone={forcedTimeZone}
          tooltipId={`${id}-chips-tooltip`}
        />
      )}
      {advancedOpen && (
        <AdvancedEdit
          id='advanced-edit-filter'
          anchorEl={`${id}-active-editing`}
          fieldList={splitFieldList}
          fieldListOptions={fieldListOptions}
          onConnectorChange={handleConnectorChange}
          onPredicateChange={handleAdvancedPredicateChange}
          onPredicateDelete={handleOnPredicateDelete}
          onClose={handleCloseAdvancedEdit}
          onCancel={handleCancelEdit}
          onAddGroup={handleAddGroup}
          onReorder={handlePredicateReorder}
          open={advancedOpen}
          formattedExpression={internalAdvancedChipsExpression}
          includeControls={false}
          includeSessionVariables={false}
          inline
          relativeToParent
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          shiftLeft={48}
          marginHorizontal={0}
          marginVertical={48}
          splitValues
          forcedTimeZone={forcedTimeZone}
        />
      )}
    </>
  );
});

ChipsFilter.displayName = 'ChipsFilter';
ChipsFilter.propTypes = propTypes;

export default ChipsFilter;
