import { createSelector, createSlice } from '@reduxjs/toolkit';

export const dataStates = {
  uninitialized: 'uninitialized',
  loading: 'loading',
  loaded: 'loaded',
  editing: 'editing',
};

const initialState = {
  status: {},
  records: {},
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    dataLoading(state, action) {
      state.status[action.payload.dataModelId] = {
        [action.payload.activeRecordId || 'unset']: dataStates.loading,
      };
      state.records[action.payload.dataModelId] = {
        [action.payload.activeRecordId || 'unset']: {},
      };
    },
    dataLoaded(state, action) {
      state.status[action.payload.dataModelId] = {
        [action.payload.activeRecordId || 'unset']: dataStates.loaded,
      };
      state.records[action.payload.dataModelId] = {
        [action.payload.activeRecordId || 'unset']: action.payload.modelData,
      };
    },
  },
});

export const { dataLoading, dataLoaded } = dataSlice.actions;
export const selectData = (state) => state.data;
const selectModelId = (state, modelId) => modelId;
const selectActiveRecordId = (state, modelId, activeRecordId) => activeRecordId || 'unset';

export const selectDataByModelId = createSelector([selectData, selectModelId], (data, modelId) =>
  data && data.records[modelId] ? data.records[modelId] : null,
);

export const selectRecordData = createSelector(
  [selectData, selectModelId, selectActiveRecordId],
  (data, modelId, activeRecordId) => {
    if (!data || !data.records[modelId] || !data.records[modelId][activeRecordId]) return null;
    return data.records[modelId][activeRecordId];
  },
);

export const selectRecordStatus = createSelector(
  [selectData, selectModelId, selectActiveRecordId],
  (data, modelId, activeRecordId) => {
    if (!data || !data.status[modelId] || !data.status[modelId][activeRecordId]) return dataStates.uninitialized;
    return data.status[modelId][activeRecordId];
  },
);

export default dataSlice.reducer;
