import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';
import { toast } from 'react-toastify';
import Banner from '@m-next/banner';
import Button from '@m-next/button';
import { ButtonGroupRow } from '@m-next/button-group';
import Dialog from '@m-next/dialog';
import { EditableImage } from '@m-next/image';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import Toggle from '@m-next/toggle';
import { Text, TextLine } from '@m-next/typeography';
import { BaseControl, Field, FieldTypeNames } from '@m-next/runtime-interface';
import { Guid } from '@m-next/utilities';
import { Z_POPUP } from '@m-next/layout-canvas';
import Accordion from '../../../../components/accordion/Accordion';
import { useGetFieldsForTableQuery } from '../../../../common/services/tablesFieldsApi';
import { useUploadImageMutation, useDeleteImageMutation } from '../../../../common/services/imagesApi';
import { selectAccountName } from '../../../../common/services/sessionSlice';
import { selectBaseModel, selectScreenFields } from '../../../../common/services/screenLayoutSlice';
import ActionListSection from '../common/components/action-list-section/ActionListSection';
import CaptionInput from '../common/components/caption-input/CaptionInput';
import DefaultStateSelector from '../common/components/default-state-selector/DefaultStateSelector';
import MappedFieldSelector from '../common/components/mapped-field-selector/MappedFieldSelector';
import * as s from '../common/BlockEditor.styles';

interface Control extends BaseControl {
  id: string;
  caption: string;
  name: string;
  isBound: boolean;
  value: string;
  defaultValue: string;
  defaultValueWrapper: string;
  originalName: string;
  isEditable: boolean;
  hideCaption: boolean;
  unsetImage: string;
  onClick: string;
  validationError: string | null;
  height?: number;
  __dimensionsLockedUntil?: number;
}

interface ImageBlockEditorProps {
  control: Control;
  onChange: (control: Control) => void;
  onAddAction: (control: Control, eventName: string) => void;
}

function ImageBlockEditor({ control, onChange, onAddAction }: ImageBlockEditorProps) {
  const accountName: string = useSelector(selectAccountName);
  const screenBaseModel: string = useSelector(selectBaseModel) ?? '';
  const fieldList = useSelector(selectScreenFields) as Field[];
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!uploading) {
      setUploadProgress(0);
    }
  }, [uploading]);

  // Load fields for MappedFieldSelector. Most components w/ mapped fields
  // use said fields so we load in them here for consistency.
  const { isFetching: loadingFieldList } = useGetFieldsForTableQuery(
    { accountName, tableName: screenBaseModel, complexFields: false },
    { skip: !control || !screenBaseModel },
  );

  const [uploadImage] = useUploadImageMutation();
  const [deleteImage] = useDeleteImageMutation();

  const events = useMemo(() => {
    if (control.onClick) {
      return [{ id: control.onClick, value: 'Click', label: 'Click' }];
    }
    return undefined;
  }, [control.onClick]);

  const isLinkedField = useMemo(() => {
    if (!control.isBound) return false;
    const field = fieldList?.find((f) => f.name === control.name);
    return Boolean(field?.isLinked);
  }, [control.isBound, control.name, fieldList]);

  const handlePropertyChange = (property: string, value: string | boolean) => {
    const updatedControl = { ...control, [property]: value };
    // When showing label, ensure minimum height of 5
    if (property === 'hideCaption' && value === false) {
      if (typeof control.height === 'number' && control.height < 5) {
        updatedControl.height = 5;
        updatedControl.__dimensionsLockedUntil = Date.now() + 1700;
      }
    }
    onChange(updatedControl);
  };

  const handleLabelChange = (value: string, name: string) => {
    if (value) {
      const updatedControl = { ...control };
      updatedControl.caption = value;
      if (!control.isBound && control.name !== value) {
        updatedControl.name = name;
      }
      onChange(updatedControl);
    }
  };

  const handleAddAction = (property: string, eventName: string) => {
    const updated = { ...control, [property]: Guid.create() };
    onAddAction(updated, eventName);
  };

  const handleError = (error: string) => {
    toast.error(error);
  };

  const performUpload = async (formData: FormData) => {
    try {
      const response = await uploadImage({
        isImage: true,
        isBound: false,
        height: 0,
        width: 0,
        body: formData,
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      }).unwrap();
      if (!response.error) {
        const updatedControl = { ...control };
        const normalizeImageUrl = (response.url || '').toLowerCase();
        const normalizeOriginalName = (response.original_name || '').toLowerCase();
        updatedControl.value = normalizeImageUrl;
        updatedControl.defaultValue = normalizeImageUrl;
        updatedControl.defaultValueWrapper = normalizeImageUrl;
        updatedControl.originalName = normalizeOriginalName;
        // Clear validation error when image is successfully uploaded
        updatedControl.validationError = null;
        onChange(updatedControl);
        setUploading(false);
        await deleteImage({ url: control.originalName });
      }
    } catch {
      handleError('Failed to upload image');
    }
  };

  const performDelete = async () => {
    try {
      await deleteImage({ url: control.originalName }).unwrap();
      const updatedControl = { ...control };
      updatedControl.defaultValue = '';
      updatedControl.defaultValueWrapper = '';
      updatedControl.originalName = '';
      updatedControl.value = '';
      onChange(updatedControl);
    } catch {
      handleError('Failed to delete image');
    }
  };
  const onFileReadSuccess = (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('files', file);
    performUpload(formData);
  };

  const onDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteImage = () => {
    setDeleteDialogOpen(false);
    performDelete();
  };

  const unboundFallback = (
    <s.LineWrapper align='flex-start'>
      <Text style={{ whiteSpace: 'nowrap' }}>Image upload</Text>
      <div style={uploading ? { marginTop: 8 } : {}}>
        <EditableImage
          id='image-upload'
          value={control.value}
          onFileReadSuccess={onFileReadSuccess}
          onDelete={onDelete}
          circle={false}
          isV4Design
          width={184}
          height={uploading ? 15 : undefined}
          uploadStyle={{ flexDirection: 'row' }}
          progressStyle={{ marginBottom: 8 }}
          cornerEditing
          showSetImage
          customSetImageButton={(onClick: () => void, disabled: boolean) => (
            <Button
              id='add-image'
              buttonStyle='ghost'
              value='Add image'
              width={184}
              onClick={onClick}
              disabled={disabled}
            />
          )}
          onErrorMessageForUser={handleError}
          uploading={uploading}
          originalName={control.originalName}
          uploadProgress={uploadProgress}
        />
      </div>
    </s.LineWrapper>
  );

  return (
    <>
      <Tooltip id='editor-tooltip' opacity={1} style={{ zIndex: Z_POPUP.TOOLTIP, maxWidth: '240px', wordBreak: 'break-word' }} />
      <s.Wrapper>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TextLine>Edit the base configuration and styles of the image.</TextLine>
          <MappedFieldSelector<Control>
            control={control}
            onChange={(updatedControl: Control) => {
              if (!updatedControl.isBound) {
                updatedControl.value = '';
                updatedControl.defaultValue = '';
                updatedControl.defaultValueWrapper = '';
                updatedControl.originalName = '';
              }
              onChange(updatedControl);
            }}
            fieldTypes={[FieldTypeNames.Picture]}
            isLoading={loadingFieldList}
            unboundFallback={unboundFallback}
          />
          <s.SettingDivider />
          {control.isBound || control.value ? (
            <>
              <Accordion id='display-section' caption='Display' variant='left' open borderless>
                <CaptionInput
                  id='label-input'
                  value={control.caption}
                  label='Label'
                  onChange={handleLabelChange}
                  controlId={control.id}
                />
                <s.LineWrapper gap={8}>
                  <SvgIcon name='arrow-elbow' size={12} color={colors.grey} />
                  <Toggle
                    id='show-label'
                    checked={!control.hideCaption}
                    onChange={(e) => handlePropertyChange('hideCaption', !e)}
                    label='Show label'
                    width='100%'
                    style={{ justifyContent: 'flex-start' }}
                    labelStyle={{ flexBasis: '100%' }}
                  />
                </s.LineWrapper>
                {control.isBound && (
                  <>
                    <s.LineWrapper gap={8}>
                      <Text>Placeholder image</Text>
                      <ButtonGroupRow
                        id='label-position'
                        width={184}
                        selected={control.unsetImage}
                        data={[
                          { value: 'landscape', icon: 'landscape-image' },
                          { value: 'person', icon: 'portrait-circle' },
                        ]}
                        onClick={(e) => handlePropertyChange('unsetImage', String(e.value))}
                      />
                    </s.LineWrapper>
                    {!isLinkedField && (
                      <s.LineWrapper gap={8}>
                        <Toggle
                          id='allow-editing'
                          checked={control.isEditable}
                          onChange={(e) => handlePropertyChange('isEditable', e)}
                          label='Allow editing'
                          width='100%'
                          style={{ justifyContent: 'flex-start' }}
                          labelStyle={{ flexBasis: '100%' }}
                        />
                      </s.LineWrapper>
                    )}
                  </>
                )}
                <DefaultStateSelector control={control} onChange={onChange} />
              </Accordion>
              <s.SettingDivider />
            </>
          ) : (
            <Banner icon='warning-sign' severity='error' bannerStyle='trailing'>
              Image required - add image to continue.
            </Banner>
          )}
          {(control.isBound || control.value) && (
            <ActionListSection
              caption='Events'
              values={events}
              emptyMessage='No events applied'
              canAdd
              actions={[{ value: 'Click', label: 'Click', source: 'onClick' }]}
              addLabel='Add click'
              onAddAction={handleAddAction}
              control={control}
              valueKey='value'
              optionKey='value'
            />
          )}
        </div>
      </s.Wrapper>
      <Dialog
        title='Delete Image'
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        footer={{
          primaryButtonLabel: 'Delete',
          onPrimaryButtonClick: handleDeleteImage,
          secondaryButtonLabel: 'Cancel',
          onSecondaryButtonClick: () => setDeleteDialogOpen(false),
        }}
      >
        Are you sure you want to remove your current image? It will be permanently deleted.
      </Dialog>
    </>
  );
}

export default ImageBlockEditor;
