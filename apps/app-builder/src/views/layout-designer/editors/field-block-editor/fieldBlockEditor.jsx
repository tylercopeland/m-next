import React, { useState, Suspense, useMemo } from 'react';
import { useSelector } from 'react-redux';

import PropTypes from 'prop-types';
import LoadingSkeleton from '@m-next/loading-skeleton';
import Toggle from '@m-next/toggle';
import { DebouncedInput } from '@m-next/input';
import Dropdown from '@m-next/dropdown';
import Tabs from '@m-next/tabs';
import { Projection } from '@m-next/types';
import { TextLine } from '@m-next/typeography';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';

import { useGetFieldsForTableQuery } from '../../../../common/services/tablesFieldsApi';
import { selectAccountName, selectDisplayPreferences } from '../../../../common/services/sessionSlice';
import {
  selectActiveRecordId,
  selectBaseModel,
  selectBaseModelJoins,
  selectSelectedControlId,
  selectSelectedControlProperty,
  selectDataModels,
} from '../../../../common/services/screenLayoutSlice';
import { useGetDataLegacyQuery } from '../../../../common/services/runtimeApi';
import * as s from './fieldBlockEditor.styles';
import { selectScreenId } from '../../../../common/services/appSlice';

const DataModelEditor = React.lazy(() => import('../data-model-editor'));

const ProjectionGrid = React.lazy(() => import('../../../models/Projections/ProjectionGrid'));
// types
const propTypes = {
  onChange: PropTypes.func,
  control: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    caption: PropTypes.string,
    collapseEmpty: PropTypes.bool,
    dataModel: PropTypes.string,
    joinKey: PropTypes.string,
    projection: Projection,
    mode: PropTypes.number,
    showSave: PropTypes.bool,
    showClearAndNew: PropTypes.bool,
    showEdit: PropTypes.bool,
    saveLabel: PropTypes.string,
    clearLabel: PropTypes.string,
    editLabel: PropTypes.string,
    dataModelId: PropTypes.string,
    isV4Control: PropTypes.bool,
  }),
  onSelect: PropTypes.func,
};

function FieldBlockEditor({ control, onChange, onSelect }) {
  const displayPreferences = useSelector(selectDisplayPreferences);
  const dataModels = useSelector(selectDataModels);

  // V3 Support
  const accountName = useSelector(selectAccountName);
  const activeRecordId = useSelector(selectActiveRecordId);
  const screenId = useSelector(selectScreenId);
  const baseModel = useSelector(selectBaseModel);
  const baseModelJoins = useSelector(selectBaseModelJoins);
  const selectedControlId = useSelector(selectSelectedControlId);
  const selectedControlProperty = useSelector(selectSelectedControlProperty);

  const {
    data: fieldList,
    error: fieldError,
    isLoading: fieldIsLoading,
  } = useGetFieldsForTableQuery(
    { accountName, tableName: control.dataModelId, complexFields: true },
    { skip: control.isV4Control },
  );

  const {
    data,
    error: dataError,
    isLoading: dataIsLoading,
  } = useGetDataLegacyQuery(
    { dataModelId: control.dataModelId, screenId, activeRecordId, joinKey: control.joinKey },
    { skip: !activeRecordId || control.isV4Control },
  );

  const tableOptions = useMemo(() => {
    const tables = [{ value: baseModel, label: baseModel }];
    if (baseModelJoins) {
      Object.keys(baseModelJoins).forEach((element) => {
        tables.push({ value: element, label: element });
      });
    }
    return tables;
  }, [baseModel, baseModelJoins]);

  const joinKeys = useMemo(() => {
    const keys = [];
    if (baseModelJoins && baseModelJoins[control.dataModelId]) {
      baseModelJoins[control.dataModelId].forEach((element) => {
        keys.push(element);
      });

      return keys;
    }
    return null;
  }, [baseModelJoins, control.dataModelId]);
  const joinKeyCaption = useMemo(() => {
    let result = control.joinKey;
    if (baseModelJoins && baseModelJoins[control.dataModelId]) {
      baseModelJoins[control.dataModelId].forEach((element) => {
        if (element.value === control.joinKey) {
          result = element.label;
        }
      });
    }
    return result;
  }, [control.joinKey, control.dataModelId, baseModelJoins]);

  const handleInputChange = (field, value) => {
    onChange({ ...control, [field]: value });
  };

  const dataModel = useMemo(() => {
    const match = dataModels.filter((x) => x.id === control.dataModel);
    if (match !== null && match.length > 0) {
      return match[0];
    }
    return null;
  }, [control.dataModel, dataModels]);

  const handleDataModelChange = (value) => {
    const updated = { ...control, projection: value };
    onChange(updated);
  };

  const [selectedTab, setSelectedTab] = useState('Data');

  const tabList = control.isV4Control
    ? [
        { id: 'Data', caption: 'Data' },
        { id: 'Display', caption: 'Display' },
        { id: 'Interactions', caption: 'Interactions' },
      ]
    : [
        { id: 'Data', caption: 'Data' },
        { id: 'Display', caption: 'Display' },
      ];

  const handleSelect = (field) => {
    if (onSelect) onSelect(control.id, field);
  };

  const handleTabChange = (e) => {
    setSelectedTab(e);
    if (e === 'Display') {
      handleSelect(null);
    }
  };

  const handleTableChange = (field) => {
    if (control.isV4Control) {
      if (onChange && field.value !== control.dataModel) {
        const updated = { ...control, dataModel: field.value };
        onChange(updated);
      }
    } else if (onChange && field.value !== control.dataModelId) {
      const updated = { ...control, dataModelId: field.value };
      updated.joinKey = baseModelJoins[field.value] ? baseModelJoins[field.value][0].value : null;
      updated.projection = {
        id: control.id,
        fields: [],
      };
      onChange(updated);
    }
  };

  const handleJoinChange = (field) => {
    if (onChange && field.value !== control.joinKey) {
      const updated = { ...control, joinKey: field.value };
      onChange(updated);
    }
  };

  const handleModeChange = (mode) => {
    handleInputChange('mode', mode);
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'Display':
        return (
          <s.Wrapper padding={16}>
            <s.LineWrapper>
              <DebouncedInput
                compactStyle
                id='settings-caption'
                value={control?.caption}
                caption='Caption'
                onChange={(value) => handleInputChange('caption', value)}
              />
            </s.LineWrapper>
            <s.LineWrapper>
              <Toggle
                id='settings-collapse'
                checked={control?.collapseEmpty}
                onChange={(value) => handleInputChange('collapseEmpty', value)}
                label='Hide Empty Fields'
                width='100%'
                bold
              />
            </s.LineWrapper>
            {!control.isV4Control && (
              <Dropdown
                id='settings-data-model'
                options={tableOptions}
                value={{ value: control.dataModelId, label: control.dataModelId }}
                caption='Table'
                isV4Design
                onChange={handleTableChange}
                style={{ zIndex: 5 }}
              />
            )}

            {!control.isV4Control && control.dataModelId !== baseModel && (
              <Dropdown
                id='settings-data-model-join'
                options={joinKeys}
                value={{ value: control.joinKey, label: joinKeyCaption }}
                onChange={handleJoinChange}
                caption='Joined on'
                isV4Design
              />
            )}

            {control.isV4Control && (
              <s.LineWrapperColumn>
                <TextLine bold>Mode</TextLine>
                <div style={{ display: 'flex', gap: 16 }}>
                  {[0, 1].map((modeValue) => (
                    <s.StateWrapper
                      key={modeValue}
                      selected={control.mode === modeValue}
                      onClick={() => handleModeChange(modeValue)}
                    >
                      <SvgIcon name={modeValue === 0 ? 'eye-open' : 'edit'} size={36} color={colors.blue} />
                      <div>
                        <TextLine bold>{modeValue === 0 ? 'View-only' : 'Editable'}</TextLine>
                        <TextLine>{modeValue === 0 ? 'View data' : 'Edit inline'}</TextLine>
                      </div>
                    </s.StateWrapper>
                  ))}
                </div>
              </s.LineWrapperColumn>
            )}
          </s.Wrapper>
        );

      case 'Interactions':
        return (
          <s.Wrapper padding={16}>
            {control?.mode === 0 && (
              <s.LineWrapper>
                <Toggle
                  id='settings-clear'
                  checked={control?.showEdit}
                  onChange={(value) => handleInputChange('showEdit', value)}
                  label='Show edit'
                  width='100%'
                  bold
                />
              </s.LineWrapper>
            )}
            {control?.mode === 1 && (
              <s.LineWrapper>
                <Toggle
                  id='settings-save'
                  checked={control?.showSave}
                  onChange={(value) => handleInputChange('showSave', value)}
                  label='Show save button'
                  width='100%'
                  bold
                />
              </s.LineWrapper>
            )}
            {(control?.showSave || (control?.mode === 0 && control?.showEdit)) && (
              <s.LineWrapper>
                <DebouncedInput
                  id='settings-save-label'
                  value={control?.saveLabel}
                  onChange={(value) => handleInputChange('saveLabel', value)}
                  placeholder='Save'
                  caption='Save button label'
                />
              </s.LineWrapper>
            )}
            {control?.mode === 1 && (
              <s.LineWrapper>
                <Toggle
                  id='settings-clear'
                  checked={control?.showClearAndNew}
                  onChange={(value) => handleInputChange('showClearAndNew', value)}
                  label='Show save and new'
                  width='100%'
                  bold
                />
              </s.LineWrapper>
            )}
            {control?.mode === 1 && control?.showClearAndNew && (
              <s.LineWrapper>
                <DebouncedInput
                  id='settings-clear-label'
                  value={control?.clearLabel}
                  onChange={(value) => handleInputChange('clearLabel', value)}
                  placeholder='Save and new'
                  caption='Save and new button label'
                />
              </s.LineWrapper>
            )}
          </s.Wrapper>
        );

      default:
        return control.isV4Control ? (
          <s.Wrapper padding={16}>
            <Dropdown
              id='settings-data-model'
              options={dataModels.map((x) => ({
                value: x.id,
                label: x.caption,
              }))}
              value={
                dataModel
                  ? {
                      value: dataModel.id,
                      label: dataModel.caption,
                    }
                  : null
              }
              caption='Data Model'
              isV4Design
              onChange={handleTableChange}
            />
            <Suspense
              fallback={<LoadingSkeleton count={1} width='100%' height='400px' circle={false} duration={1.4} />}
            >
              <TextLine bold>Columns</TextLine>
              <ProjectionGrid
                id={control.id}
                dataModel={dataModel}
                displayPreferences={displayPreferences}
                onChange={handleDataModelChange}
                onSelect={handleSelect}
                projection={control.projection}
              />
            </Suspense>
          </s.Wrapper>
        ) : (
          <s.Wrapper>
            <Suspense
              fallback={<LoadingSkeleton count={1} width='100%' height='400px' circle={false} duration={1.4} />}
            >
              <DataModelEditor
                id={control.id}
                projection={control.projection}
                dataModelId={control.dataModelId}
                controlName={control.name}
                onChange={handleDataModelChange}
                fieldList={fieldList}
                data={dataIsLoading || dataError ? null : data}
                fieldListLoading={fieldIsLoading}
                fieldLoadingError={fieldError}
                displayPreferences={displayPreferences}
                onSelect={handleSelect}
                lastSelectedField={selectedControlId === control.id ? selectedControlProperty : null}
              />
            </Suspense>
          </s.Wrapper>
        );
    }
  };

  return (
    <Tabs
      id='field-block-editor'
      tabList={tabList}
      onRenderTabContent={renderTabContent}
      onChange={handleTabChange}
      selectedTab={selectedTab}
      containerMargin='0px'
      borderless
      dynamicHeight
      headerStyle={{ marginLeft: 16 }}
      fullWidthTabs
    />
  );
}

FieldBlockEditor.propTypes = propTypes;
export default FieldBlockEditor;
