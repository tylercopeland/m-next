import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Text, TextLine } from '@m-next/typeography';
import { FieldTypeNames } from '@m-next/types';
import Dropdown from '@m-next/dropdown';
import { formatter, Guid } from '@m-next/utilities';
import { useSelector } from 'react-redux';
import LoadingSkeleton from '@m-next/loading-skeleton';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import Toggle from '@m-next/toggle';
import Banner from '@m-next/banner';
import { RumComponentContextProvider } from '../../../../common/rum/RumComponentContext';
import ActionListSection from '../common/components/action-list-section/ActionListSection';
import TableDropdown from '../common/components/table-dropdown/TableDropdown';

import { selectDisplayPreferences } from '../../../../common/services/sessionSlice';
import GalleryModel from './type';
import ViewSettings from './ViewSettings';
import { resetGalleryControl } from '../../control-classes';
import Accordion from '../../../../components/accordion/Accordion';
import * as s from '../common/BlockEditor.styles';
import CaptionInput from '../common/components/caption-input/CaptionInput';
import DefaultStateSelector from '../common/components/default-state-selector/DefaultStateSelector';

const propTypes = {
  control: GalleryModel,
  onChange: PropTypes.func.isRequired,
  fieldList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  tableList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  loadingFieldList: PropTypes.bool,
  onAddAction: PropTypes.func,
};

function GallerySettings({ control, onChange, fieldList, tableList, loadingFieldList, onAddAction }) {
  const displayPreferences = useSelector(selectDisplayPreferences);
  const [prevCaptionField, setPrevCaptionField] = useState(control.model.captionField);
  const [showCaption, setShowCaption] = useState(!!control.model.captionField);

  useEffect(() => {
    if (prevCaptionField !== control.model.captionField && control.model.captionField) {
      setPrevCaptionField(control.model.captionField);
    }
  }, [control.model.captionField, prevCaptionField, control.id]);

  useEffect(() => {
    setPrevCaptionField(control.model.captionField);
    setShowCaption(!!control.model.captionField);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [control.id]);

  const imageFields = useMemo(() => fieldList?.filter((f) => f.type === FieldTypeNames.Picture), [fieldList]);

  const imageFieldOptions = useMemo(
    () =>
      formatter.formatFieldList(
        fieldList,
        control.model.viewName,
        null,
        {},
        displayPreferences,
        [FieldTypeNames.Picture],
        true,
        false,
        true,
      ),
    [displayPreferences, fieldList, control.model.viewName],
  );

  const textFieldOptions = useMemo(
    () =>
      formatter.formatFieldList(
        fieldList,
        control.model.viewName,
        null,
        {},
        displayPreferences,
        [FieldTypeNames.Text],
        true,
      ),
    [displayPreferences, fieldList, control.model.viewName],
  );

  const handlePropertyChange = (property, value) => {
    const updated = { ...control, [property]: value };
    onChange(updated);
  };

  const handleViewChange = (view) => {
    const updated = {
      ...control,
      model: {
        ...control.model,
        viewFilter: { ...view },
      },
      filterDef: [{ ...view }],
    };
    onChange(updated);
  };

  const handleFieldChange = (property, value) => {
    const updated = {
      ...control,
      model: {
        ...control.model,
        [property]: value,
      },
    };

    const field = fieldList.find((f) => f.name === value);
    if (field) {
      updated.model.columns = updated.model.columns.filter((c) => c.name !== control.model[property]);
      updated.model.columns.push(field);
    }
    onChange(updated);
  };

  const handleShowCaptionChange = (e) => {
    setShowCaption(e);
    if (e) {
      if (!control.model.captionField && prevCaptionField) {
        handleFieldChange('captionField', prevCaptionField);
      }
    } else {
      handleFieldChange('captionField', null);
    }
  };

  const events = useMemo(() => {
    if (control.onClick) {
      return [{ id: control.onClick, value: 'Click', label: 'Click' }];
    }
  }, [control.onClick]);

  const handleAddAction = (property, eventName) => {
    const updated = { ...control, [property]: Guid.create() };
    onAddAction(updated, eventName);
  };

  const handleTableChange = (newTable) => {
    const updated = resetGalleryControl(control.id, control.name, control.caption, newTable, control);
    onChange(updated);
  };

  const handleCaptionChange = (newCaption, newName) => {
    const updated = { ...control, caption: newCaption, name: newName };
    onChange(updated);
  };

  return (
    <RumComponentContextProvider componentName='GallerySettings'>
      <s.Wrapper padding={16} gutter={80}>
        <TextLine>Editing the base configuration and styles of the gallery.</TextLine>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <s.LineWrapper>
            <Text>Table</Text>
            <TableDropdown
              tableList={tableList}
              selectedTableName={control.model.viewName}
              onChange={handleTableChange}
              loading={loadingFieldList}
              validationMessage={control.model.viewName ? '' : 'Table is required'}
              warningLabel='Changing the base table for this gallery will mean that all properties will be lost.'
              warningSubLabel='Are you sure you want to change the table for this gallery?'
              showWarning={!!control.model.imageField}
            />
          </s.LineWrapper>
          {imageFields?.length > 0 && (
            <>
              <s.LineWrapper>
                <Text>Image field</Text>
                {loadingFieldList ? (
                  <LoadingSkeleton count={1} width='184px' height='36px' />
                ) : (
                  <Dropdown
                    id='image-field'
                    options={imageFieldOptions}
                    onChange={(field) => handleFieldChange('imageField', field.value)}
                    value={
                      control.model.imageField
                        ? {
                            value: control.model.imageField,
                            label:
                              fieldList?.find((f) => f.name === control.model.imageField)?.displayName ||
                              control.model.imageField,
                          }
                        : null
                    }
                    width='184px'
                    placeholder='Select image field'
                    hasValidation
                    disabled={!control.model.viewName || loadingFieldList}
                    isV4Design
                  />
                )}
              </s.LineWrapper>

              <s.LineWrapper>
                <Toggle
                  id='show-gallery-caption'
                  checked={showCaption}
                  onChange={handleShowCaptionChange}
                  label='Show caption'
                  width='100%'
                  style={{ justifyContent: 'flex-start' }}
                  labelStyle={{ flexBasis: '100%' }}
                />
              </s.LineWrapper>
              {showCaption && (
                <s.LineWrapper gap={8}>
                  <SvgIcon name='arrow-elbow' size={12} color={colors.grey} />

                  <Text style={{ width: 132 }}>Caption field</Text>
                  {loadingFieldList ? (
                    <LoadingSkeleton count={1} width='184px' height='36px' />
                  ) : (
                    <Dropdown
                      id='caption-field'
                      options={textFieldOptions}
                      value={
                        control.model.captionField
                          ? {
                              value: control.model.captionField,
                              label:
                                fieldList?.find((f) => f.name === control.model.captionField)?.displayName ||
                                control.model.captionField,
                            }
                          : null
                      }
                      onChange={(field) => handleFieldChange('captionField', field.value)}
                      width='184px'
                      placeholder='Select caption field'
                      disabled={!control.model.viewName || loadingFieldList}
                      isV4Design
                    />
                  )}
                </s.LineWrapper>
              )}
            </>
          )}

          {imageFields?.length === 0 && tableList && tableList.length > 0 && (
            <Banner icon='warning-sign' severity='error'>
              <div>
                <TextLine>No image fields found on this table.</TextLine>
                <TextLine>Select another table.</TextLine>
              </div>
            </Banner>
          )}
        </div>
        {imageFields?.length > 0 ? (
          <>
            <s.SettingDivider />

            <Accordion id='display' caption='Display' variant='left' open borderless>
              <CaptionInput
                id='caption'
                label='Title'
                controlId={control.id}
                value={control.caption}
                onChange={handleCaptionChange}
              />
              <s.LineWrapper gap={8}>
                <SvgIcon name='arrow-elbow' size={12} color={colors.grey} />
                <Toggle
                  id='show-header'
                  checked={!control.hideCaption}
                  onChange={(e) => handlePropertyChange('hideCaption', !e)}
                  label='Show title'
                  width='100%'
                  style={{ justifyContent: 'flex-start' }}
                  labelStyle={{ flexBasis: '100%' }}
                />
              </s.LineWrapper>

                      <DefaultStateSelector control={control} onChange={onChange} />
            
            </Accordion>

            <s.SettingDivider />

            <ViewSettings
              onChange={handleViewChange}
              view={control.model.viewFilter}
              viewFriendlyName={control.model.viewName}
              fieldList={fieldList}
            />
            <s.SettingDivider />

            <ActionListSection
              caption='Events'
              values={events}
              emptyMessage='No events applied'
              canAdd
              actions={[{ value: 'Click', label: 'Click', source: 'onClick' }]}
              addLabel='Add click'
              onAddAction={handleAddAction}
              control={control}
            />
          </>
        ) : null}
      </s.Wrapper>
    </RumComponentContextProvider>
  );
}

GallerySettings.propTypes = propTypes;
export default GallerySettings;
