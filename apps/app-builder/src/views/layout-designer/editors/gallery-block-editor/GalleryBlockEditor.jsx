/**
 * GalleryBlockEditor component for editing gallery blocks in the layout designer.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.rawControl - The raw control data for the gallery.
 * @param {Function} props.onChange - Callback function to handle changes to the gallery control.
 * @param {Function} props.onActionChange - Callback function to handle action changes.
 * @param {Function} props.onSendAnalytics - Callback function to send analytics data.
 * @param {Object} props.featureFlags - Feature flags for enabling/disabling features.
 * @param {Function} props.onSelect - Callback function to handle selection changes.
 * @param {Object} props.controlProperty - The control property object.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';
import { FieldTypeNames } from '@m-next/types';
import { toCamelCase } from '@m-next/utilities';
import { Z_POPUP } from '@m-next/layout-canvas';
import { RumComponentContextProvider } from '../../../../common/rum/RumComponentContext';
import { selectAccountName, selectDisplayPreferences } from '../../../../common/services/sessionSlice';
import { useGetFieldsForTableQuery, useGetTablesQuery } from '../../../../common/services/tablesFieldsApi';
import GallerySettings from './GallerySettings';
import GalleryModel from './type';
import { migrateGalleryControl } from '../../control-classes';

const propTypes = {
  onChange: PropTypes.func,
  onAddAction: PropTypes.func,
  rawControl: GalleryModel,
  onSendAnalytics: PropTypes.func,
};

function GalleryBlockEditor({ rawControl, onChange, onAddAction, onSendAnalytics }) {
  const accountName = useSelector(selectAccountName);
  const displayPreferences = useSelector(selectDisplayPreferences);
  const [lastControlId, setLastControlId] = useState(null);

  const control = useMemo(() => {
    const defaultControl = {
      caption: 'Gallery',
      hideCaption: false,
      name: 'Gallery',
      model: {
        baseTable: '',
        imageField: '',
        captionField: '',
        viewName: '',
      },
      visible: true,
      disabled: false,
    };

    if (lastControlId !== rawControl?.id) {
      setLastControlId(rawControl?.id);
    }

    const updated = toCamelCase({ ...(rawControl ?? defaultControl) });
    const migrated = migrateGalleryControl(updated);
    return migrated ?? updated;
  }, [lastControlId, rawControl]);

  const { data: fieldList, isFetching: loadingFieldList } = useGetFieldsForTableQuery(
    { accountName, tableName: control.model?.viewName, complexFields: false },
    { skip: !control || !control.model?.viewName },
  );

  const { data: tableList } = useGetTablesQuery({ accountName }, { skip: !control });

  useEffect(() => {
    if (control && control.model?.viewName && !control.model?.imageField && fieldList && fieldList.length > 0 && !loadingFieldList) {
      const imageField = fieldList.find((field) => field.type === FieldTypeNames.Picture);
      if (imageField) {
        const updated = { ...control, model: { ...control.model, imageField: imageField.name } };
        updated.model.columns.push(imageField);

        onChange(updated);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [control, fieldList]);

  return (
    <RumComponentContextProvider componentName='GalleryBlockEditor'>
      <Tooltip id='editor-tooltip' opacity={1} style={{ zIndex: Z_POPUP.TOOLTIP, maxWidth: '240px', wordBreak: 'break-word' }} />
      <GallerySettings
        id={control.id}
        control={control}
        onChange={onChange}
        displayPreferences={displayPreferences}
        fieldList={fieldList}
        tableList={tableList}
        onSendAnalytics={onSendAnalytics}
        loadingFieldList={loadingFieldList}
        onAddAction={onAddAction}
      />
    </RumComponentContextProvider>
  );
}

GalleryBlockEditor.propTypes = propTypes;
export default GalleryBlockEditor;
