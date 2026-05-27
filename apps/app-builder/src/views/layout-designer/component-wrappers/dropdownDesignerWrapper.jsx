import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { toCamelCase } from '@m-next/utilities';
import { ValidationMessage } from '@m-next/validation';
import { useDropdownSearch, parseDropdownData } from '@m-next/layout-canvas';
import {
  selectControls,
  selectActiveRecordId,
} from '../../../common/services/screenLayoutSlice';
import { selectScreenId } from '../../../common/services/appSlice';
import { useGetDropdownDataLegacyQuery, useLazyGetDropdownDataLegacyQuery } from '../../../common/services/runtimeApi';

const Dropdown = React.lazy(() => import('@m-next/dropdown'));

// types
const propTypes = {
  id: PropTypes.string,
};

function DropdownDesignerWrapper({ id }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemList, setItemList] = useState([]);
  const [multiLine, setMultiLine] = useState(false);
  const activeRecordId = useSelector(selectActiveRecordId);
  const screenId = useSelector(selectScreenId);
  const controls = useSelector((state) => selectControls(state));
  const control = controls && id ? controls[id] : null;
  const designerTotalRowsRef = useRef(0);

  // Lazy trigger for search/pagination
  const [triggerDropdownQuery] = useLazyGetDropdownDataLegacyQuery();

  // Create safe control with defaults
  const safeControl = useMemo(() => {
    const defaultControl = {
      id: id || '',
      type: 'dropdown',
      visible: true,
      disabled: false,
      hideCaption: true,
      name: 'dropdown',
      caption: 'Dropdown',
      classes: '',
      placeholder: 'Select an option',
      widthType: 'full',
      defaultValue: '',
      model: {},
      customRowText: '',
      onCustomRowClick: undefined,
      isDisabled: false,
      isMultiSelect: false,
      isClearable: false,
    };

    if (!control) {
      return defaultControl;
    }

    return {
      ...defaultControl,
      ...control,
      id: control.id || id || '',
    };
  }, [control, id]);

  // Validate that model has required columns before making API call
  // Backend requires at least 2 columns (RecordID + display column)
  const hasValidColumns = safeControl?.model?.columns && Array.isArray(safeControl.model.columns) && safeControl.model.columns.length >= 2;

  const {
    data,
    isLoading,
    error,
  } = useGetDropdownDataLegacyQuery(
    {
      id: safeControl.id,
      screenId,
      activeRecordId,
      body: {
        screenState: null,
        model: { ...safeControl.model },
      },
    },
    { skip: !safeControl.id || !hasValidColumns },
  );

  useEffect(() => {
    const { options, hasMultiLine: newMultiLine } = parseDropdownData(data?.data);
    setMultiLine(newMultiLine);
    setItemList(options);
  }, [data]);

  useEffect(() => {
    if (safeControl && safeControl.defaultValue && itemList.length > 0) {
      let defaultValue = typeof safeControl.defaultValue !== 'object' ? safeControl.defaultValue : '';
      if (!defaultValue) {
        defaultValue = toCamelCase(safeControl.defaultValue).value;
      }
      setSelectedItem(itemList.find((item) => item.label === defaultValue));
    }
  }, [safeControl, itemList]);

  // --- Search & Pagination via shared hook ---
  const designerLoadData = useCallback(
    async (searchText, page, append) => {
      const body = {
        screenState: null,
        model: { ...safeControl.model },
      };
      if (searchText) body.SearchText = searchText;
      if (page > 1) body.Page = page;
      const result = await triggerDropdownQuery({
        id: safeControl.id,
        screenId,
        activeRecordId,
        body,
      });
      if (result?.data) {
        const { options: newOptions, hasMultiLine: newMultiLine } = parseDropdownData(result.data.data);
        if (append) {
          setItemList((prev) => {
            const existingValues = new Set(prev.map((o) => o.value));
            const deduped = newOptions.filter((o) => !existingValues.has(o.value));
            return [...prev, ...deduped];
          });
        } else {
          setItemList(newOptions);
        }
        setMultiLine(newMultiLine);
        designerTotalRowsRef.current = result.data.totalRows || 0;
      }
    },
    [triggerDropdownQuery, safeControl, screenId, activeRecordId],
  );

  const getDesignerTotalRows = useCallback(() => designerTotalRowsRef.current, []);

  const {
    handleInputChange,
    handleMenuScrollToBottom,
    serverSideFilterOption,
    resetAndReload,
  } = useDropdownSearch({
    loadData: designerLoadData,
    getTotalRows: getDesignerTotalRows,
    enabled: true,
  });

  const handleMenuOpen = useCallback(() => {
    resetAndReload();
  }, [resetAndReload]);

  const widthAutoLoadingValue = useMemo(() => {
    if (safeControl?.widthType === 'auto' && isLoading) {
      return 100;
    }
    return '';
  }, [safeControl, isLoading]);

  return (
    <>
      {error && (
        <ValidationMessage
          id={safeControl.id}
          message={error.data?.message || 'Error loading data'}
          isV4Design
          compactStyle />
      )}
      {!error && (
        <Suspense fallback={<LoadingSkeleton count={1} height={400} />}>
          <div style={{ position: 'relative' }}>
            <Dropdown
              id={safeControl.id}
              caption={safeControl.hideCaption ? null : safeControl.caption}
              width={safeControl.widthType === 'auto' ? widthAutoLoadingValue : "100%"}
              displayAuto={safeControl.widthType === 'auto'}
              legacyClass={safeControl.classes}
              options={itemList}
              value={selectedItem}
              isV4Design
              dropdownStyle={multiLine ? "multi" : "single"}
              actionButtonText={safeControl.onCustomRowClick ? safeControl.customRowText : undefined}
              isCreateable={!!safeControl.customRowText}
              isLoading={isLoading}
              placeholder={safeControl.placeholder}
              disabled={safeControl.isDisabled}
              isMultiSelect={safeControl.isMultiSelect}
              isClearable={safeControl.isClearable}
              onInputChange={handleInputChange}
              onMenuScrollToBottom={handleMenuScrollToBottom}
              filterOption={serverSideFilterOption}
              onMenuOpen={handleMenuOpen}
            />
          </div>
        </Suspense>
      )}
    </>
  );
}

DropdownDesignerWrapper.propTypes = propTypes;
export default DropdownDesignerWrapper;
