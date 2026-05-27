import React, { useState, useEffect, useRef, Suspense } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { Z_POPUP } from '@m-next/layout-canvas';
import { interactions } from '@m-next/utilities';

import {
  selectControls,
  selectLastControlUpdated,
  clearLastControlUsed,
  selectActiveRecordId,
  selectSelectedControlId,
  selectSelectedControlProperty,
  controlSelected,
} from '../../../common/services/screenLayoutSlice';
import { useGetDataQuery } from '../../../common/services/runtimeApi';
import * as s from './designerWrapper.styles';
import { selectAccountName, selectDisplayPreferences } from '../../../common/services/sessionSlice';
import { useGetTagSuggestionsQuery } from '../../../common/services/tagsApi';
import { selectScreenId } from '../../../common/services/appSlice';
import { dataStates, selectRecordData, selectRecordStatus } from '../../../common/services/dataSlice';

const FieldBlock = React.lazy(() => import('@m-next/field-block'));

// types
const propTypes = {
  id: PropTypes.string,
};

function FieldBlockDesignerWrapper({ id }) {
  const dispatch = useDispatch();

  const lastControlUpdated = useSelector(selectLastControlUpdated);
  const activeRecordId = useSelector(selectActiveRecordId);
  const screenId = useSelector(selectScreenId);
  const selectedControlId = useSelector(selectSelectedControlId);
  const selectedControlProperty = useSelector(selectSelectedControlProperty);

  const control = useSelector((state) => selectControls(state)[id]);
  const displayPreferences = useSelector(selectDisplayPreferences);
  const {
    data: v3Data,
    error,
    isLoading,
    refetch,
  } = useGetDataQuery(
    {
      dataModelId: control?.dataModel || control?.dataModelId,
      screenId,
      activeRecordId,
      joinKey: control?.joinKey,
      isV4Control: control?.isV4Control,
    },
    { skip: !control || control.isV4Control || !activeRecordId },
  );

  const v4Data = useSelector((state) => selectRecordData(state, control?.dataModel, activeRecordId));
  const v4DataState = useSelector((state) => selectRecordStatus(state, control?.dataModel, activeRecordId));
  const [forceOpen, setForceOpen] = useState(false);
  const accountName = useSelector(selectAccountName);
  const { data: tagList, isLoading: isLoadingTagList } = useGetTagSuggestionsQuery({ accountName });
  const showMoreRef = useRef();

  const handleRefetch = () => {
    if (refetch) refetch();
  };

  const handleMoreClick = (isCollapsed) => {
    if (!isCollapsed) {
      setTimeout(() => {
        showMoreRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  useEffect(() => {
    if (lastControlUpdated === id) {
      setForceOpen(true);
      dispatch(clearLastControlUsed());
    } else {
      setForceOpen(false);
    }
  }, [lastControlUpdated, id, dispatch]);

  const handleOnSelect = (e, controlId, property) => {
    dispatch(controlSelected({ controlId, property }));
    interactions.preventPropagation(e);
  };

  return (
    <>
      {(!control || !control.projection || !control.projection.fields || control.projection.fields.length === 0) && (
        <s.EmptyWrapper id={`${id}-no-fields`}>
          <strong>No fields added</strong>
          <span>To add fields select this object and add fields from the right panel.</span>
        </s.EmptyWrapper>
      )}
      {control && control.projection && control.projection.fields && control.projection.fields.length > 0 && (
        <Suspense
          fallback={
            <LoadingSkeleton count={control.projection.fields.length} height={48} style={{ marginBottom: 8 }} />
          }
        >
          {' '}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: Z_POPUP.POPOVER,
              }}
            />
            <FieldBlock
              showMoreRef={showMoreRef}
              id={id}
              inlineValidation={control.inlineValidation}
              collapseEmpty={control.collapseEmpty}
              fields={control.projection.fields}
              isReadOnly={control.isReadOnly}
              caption={control.caption}
              data={control.isV4Control ? v4Data : v3Data}
              isV4Design={false}
              isLoading={isLoading || v4DataState === dataStates.loading}
              error={error}
              style={{ cursor: 'pointer' }}
              forceOpen={forceOpen}
              onRefetch={handleRefetch}
              displayPreferences={displayPreferences}
              tagsList={isLoadingTagList ? null : tagList?.others}
              onMoreClick={handleMoreClick}
              onSelect={control.isV4Control ? null : handleOnSelect}
              mode={control.mode}
              clearLabel={control.clearLabel}
              editLabel={control.editLabel}
              saveLabel={control.saveLabel}
              onClearClick={control.onClearClick}
              onSaveClick={control.onSaveClick}
              showClearAndNew={control.showClearAndNew}
              showEdit={control.showEdit}
              showSave={control.showSave}
              selectedField={
                selectedControlId === id && selectedControlProperty !== null ? selectedControlProperty : null
              }
            />
          </div>
        </Suspense>
      )}
    </>
  );
}

FieldBlockDesignerWrapper.propTypes = propTypes;
export default FieldBlockDesignerWrapper;
