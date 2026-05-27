import React, { useEffect, Suspense, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSkeleton from '@m-next/loading-skeleton';

import {
  selectControls,
  selectLastControlUpdated,
  clearLastControlUsed,
  selectActiveRecordId,
  selectDataModels,
} from '../../../common/services/screenLayoutSlice';
import * as s from './designerWrapper.styles';
import { selectAccountName, selectDisplayPreferences } from '../../../common/services/sessionSlice';
import { useGetTagSuggestionsQuery } from '../../../common/services/tagsApi';
import { dataStates, selectRecordData, selectRecordStatus } from '../../../common/services/dataSlice';

const Card = React.lazy(() => import('@m-next/card'));

// types
const propTypes = {
  id: PropTypes.string,
};

function CardDesignerWrapper({ id }) {
  const dispatch = useDispatch();

  const lastControlUpdated = useSelector(selectLastControlUpdated);
  const activeRecordId = useSelector(selectActiveRecordId);
  const control = useSelector((state) => selectControls(state)[id]);
  const displayPreferences = useSelector(selectDisplayPreferences);
  const dataModels = useSelector(selectDataModels);
  const data = useSelector((state) => selectRecordData(state, control.dataModelId, activeRecordId));
  const dataState = useSelector((state) => selectRecordStatus(state, control.dataModelId, activeRecordId));

  const dataModel = useMemo(() => {
    const match = dataModels.filter((x) => x.id === control.dataModelId);
    if (match !== null && match.length > 0) {
      return match[0];
    }
    return null;
  }, [control.dataModelId, dataModels]);

  const accountName = useSelector(selectAccountName);
  const { data: tagList } = useGetTagSuggestionsQuery({ accountName });

  useEffect(() => {
    if (lastControlUpdated === id) {
      dispatch(clearLastControlUsed());
    }
  }, [lastControlUpdated, id, dispatch]);

  const cardModel = useMemo(() => {
    const model = {
      field1: null,
      field2: null,
      field3: null,
      field4: null,
      field5: null,
      field6: null,
    };
    if (control) {
      ['field1', 'field2', 'field3', 'field4', 'field5', 'field6'].forEach((element) => {
        if (control[element]) {
          const match = dataModel.fields.filter((x) => x.name === control[element].name);
          if (match.length > 0) {
            model[element] = { ...match[0] };
            model[element].displayAs = control[element].displayAs;
          }
        }
      });
    }

    return model;
  }, [control, dataModel.fields]);

  return (
    <>
      {!control && (
        <s.EmptyWrapper id={`${id}-no-fields`}>
          <strong>No fields added</strong>
          <span>To add fields select this object and add fields from the right panel.</span>
        </s.EmptyWrapper>
      )}
      {control && (
        <Suspense fallback={<LoadingSkeleton count={1} height={72} style={{ marginBottom: 8 }} />}>
          <Card
            id={id}
            displayPreferences={displayPreferences}
            avatar={data ? data[control.avatar] : null}
            field1={cardModel.field1}
            field2={cardModel.field2}
            field3={cardModel.field3}
            field4={cardModel.field4}
            field5={cardModel.field5}
            field6={cardModel.field6}
            hasAvatar={!!control.avatar}
            data={data}
            tagsList={tagList ? tagList.others : []}
            isLoading={dataState === dataStates.loading}
          />
        </Suspense>
      )}
    </>
  );
}

CardDesignerWrapper.propTypes = propTypes;
export default CardDesignerWrapper;
