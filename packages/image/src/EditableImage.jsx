import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { colors } from '@m-next/styles';
import Dialog from '@m-next/dialog';
import SvgIcon from '@m-next/svg-icon';
import PopOver from '@m-next/popover';
import { downloadImage } from '@m-next/utilities';
import Input from '@m-next/input';
import { Tooltip } from 'react-tooltip';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import * as s from './ImageWidget.styles';
import Image from './Image';

const propTypes = {
  id: PropTypes.string.isRequired,
  caption: PropTypes.string, // used as "alt" or additional description for screen readers
  imgType: PropTypes.oneOf(['Fixed', 'Responsive', 'Background', 'Dynamic', 'Fit']), // oneOf [ "Fixed", "Responsive", "Background" ]
  value: PropTypes.string, // image url
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // image width px,%
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // image height px,%
  minWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // image min-Width px,%
  minWidthTablet: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // image min-Width Tablet px,%
  minWidthMobile: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // image min-Width Mobile px,%
  maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // image max-Width px,%
  maxWidthTablet: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // image max-Width Tablet px,%
  maxWidthMobile: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // image max-Width Mobile px,%
  disabled: PropTypes.bool, // disabled html state
  tabIndex: PropTypes.string, // html tab order
  originalName: PropTypes.string, // specified name used in messages etc, instead of one parse out of url
  unsetImage: PropTypes.oneOf(['person', 'document', 'landscape', 'loader']), // placeholder oneOf [ "person", "document", "landscape", "loader" ]
  circle: PropTypes.bool, // masks the image in a circle
  className: PropTypes.string,
  style: PropTypes.instanceOf(Object), // Add additional top level style.
  uploadStyle: PropTypes.instanceOf(Object),
  progressStyle: PropTypes.instanceOf(Object),
  hideCaption: PropTypes.bool,
  isMobile: PropTypes.bool,
  isLoading: PropTypes.bool,
  onDelete: PropTypes.func,
  tooltip: PropTypes.string,
  onFileReadSuccess: PropTypes.func,
  uploading: PropTypes.bool,
  uploadProgress: PropTypes.number,
  uploadingFile: PropTypes.string,
  onClose: PropTypes.func,
  onClick: PropTypes.func,
  onErrorMessageForUser: PropTypes.func,
  showSetImage: PropTypes.bool,
  customSetImageButton: PropTypes.func,
  cornerEditing: PropTypes.bool,
  onDownloadImage: PropTypes.func,
  fitToContainer: PropTypes.bool,
  placeholderIcon: PropTypes.string,
  isV4Design: PropTypes.bool, // V4 mode flag for new designer behavior
  onWebUrlChange: PropTypes.func, // cb to handle setting image from a web URL
  hasImage: PropTypes.bool, // explicit override for blank detection; when provided, used instead of !value
};

export function EditableImage({
  id,
  caption,
  imgType,
  value,
  width,
  height,
  minWidth,
  minWidthTablet,
  minWidthMobile,
  maxWidth,
  maxWidthTablet,
  maxWidthMobile,
  disabled,
  tabIndex,
  originalName,
  unsetImage,
  circle, // new v4 property
  className,
  style,
  uploadStyle,
  progressStyle,
  hideCaption,
  isMobile,
  isLoading,
  onDelete,
  tooltip,
  onFileReadSuccess,
  uploading,
  uploadProgress = 0,
  uploadingFile,
  onClose,
  onClick,
  onErrorMessageForUser,
  showSetImage,
  customSetImageButton,
  cornerEditing = false,
  onDownloadImage,
  fitToContainer = false,
  placeholderIcon = '',
  isV4Design = false,
  onWebUrlChange,
  hasImage,
}) {
  const showSetter = useMemo(() => showSetImage && !value, [showSetImage, value]);
  const [editMenuOpen, setEditMenuOpen] = useState(false);
  const [showWebLinkDialog, setShowWebLinkDialog] = useState(false);
  const [webUrl, setWebUrl] = useState('');
  const isBlank = hasImage !== undefined ? !hasImage : !value;

  const sanitizeFileName = (str) => str.replace(/[^a-zA-Z0-9_\-.\s()]/g, '_');

  const validateSelectedFile = (files, isFile) => {
    const picFileTypes = /(\.|\/)(gif|jpe?g|png|svg|bmp|tif?f)$/i;
    const fileFileTypes = /(\.|\/)(gif|jpe?g|png|svg|bmp|tif?f|docx?|xlsx?|txt|pdf|csv|rtf|pptx?)$/i;

    const maxFileSize = 52428800;

    const result = {
      files,
      errorMessage: '',
      invalidFileCount: false,
      invalidSize: false,
      invalidExtension: false,
    };

    const invalidFileCount = files?.length > 1;

    if (invalidFileCount) {
      const errorMessage =
        'Please try uploading one file at a time or if the issue persists, contact support@method.me.';
      Object.assign(result, { errorMessage, invalidFileCount });
    } else {
      const file = files[0];
      const fileParts = file.name.split('.');
      const fileExtension = `.${fileParts[fileParts.length - 1]}`;

      const invalidSize = file.size > maxFileSize;
      let invalidExtension = !picFileTypes.test(fileExtension);
      if (isFile) {
        invalidExtension = !fileFileTypes.test(fileExtension);
      }

      let errorMessage;

      if (invalidExtension) {
        if (isFile)
          errorMessage =
            'Please select another image. The following image types are allowed: gdoc, docx, xls, xlsx, txt, pdf, rtf, ppt, pptx, gif, jpg, jpeg, png, svg, bmp';
        else
          errorMessage =
            'Please select another image. The following image types are allowed: gif, jpg, jpeg, png, svg, bmp';
      } else if (invalidSize) {
        errorMessage = `Please select another file. Uploaded files must be smaller than 50MB`;
      } else {
        errorMessage = '';
      }

      Object.assign(result, { errorMessage, invalidExtension, invalidSize });
    }

    return result;
  };

  const handleDrop = (acceptedFiles) => {
    if (!disabled) {
      const sanitizedFiles = acceptedFiles.map(
        (f) =>
          new File([f], sanitizeFileName(f.name), {
            type: f.type,
            lastModified: f.lastModified,
          }),
      );
      const validationResult = validateSelectedFile(sanitizedFiles);

      if (validationResult?.errorMessage) {
        onErrorMessageForUser(validationResult.errorMessage);
      } else {
        const file = sanitizedFiles[0];
        onFileReadSuccess(file);
      }
    }
  };

  const [showImageEditor, setShowImageEditor] = useState(false);
  const { open, getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop, multiple: false });
  const fileExtension = useMemo(
    () => (uploadingFile && uploadingFile.includes('.') ? uploadingFile.split('.')[1] : ''),
    [uploadingFile],
  );

  const handleOnClick = () => {
    if (!cornerEditing) {
      setShowImageEditor(true);
    }
    if (onClick) onClick();
  };

  const handleDownload = () => {
    if (onDownloadImage) {
      onDownloadImage(value);
      return;
    }
    downloadImage({
      imageUrl: value,
      onError: () => {
        if (onErrorMessageForUser) {
          onErrorMessageForUser('Unable to download the image. Please try again later.');
        }
      },
    });
  };

  const handleUploadImage = () => {
    open();
    setEditMenuOpen(false);
  };

  const handleClose = () => {
    setShowImageEditor(false);
    setEditMenuOpen(false);
    if (onClose) onClose();
  };

  const handleDelete = () => {
    handleClose();
    if (onDelete) onDelete();
  };

  const handleOpenWebLink = () => {
    setWebUrl('');
    setShowWebLinkDialog(true);
    setEditMenuOpen(false);
  };

  const handleWebLinkConfirm = () => {
    if (webUrl && onWebUrlChange) {
      onWebUrlChange(webUrl);
    }
    setShowWebLinkDialog(false);
    setWebUrl('');
  };

  const handleWebLinkClose = () => {
    setShowWebLinkDialog(false);
    setWebUrl('');
  };

  const renderSetImageButton = () => {
    if (customSetImageButton) {
      return customSetImageButton(handleUploadImage, uploading);
    }
    return <SvgIcon size={16} name='circle-plus-V4' border onClick={handleUploadImage} disabled={uploading} />;
  };

  const renderEditMenu = () => (
    <PopOver
      id='edit-menu'
      open={editMenuOpen}
      anchorEl={document.getElementById(`${id}-PopUp-Button`)}
      width={157}
      relativeToParent
      shiftDown={28}
    >
      <s.MenuItemsContainer>
        {isBlank ? (
          <>
            <s.MenuItem onClick={handleUploadImage} onKeyUp={handleUploadImage} tabIndex='0' role='menuitem'>
              Upload Image
            </s.MenuItem>
            <s.MenuItem onClick={handleOpenWebLink} onKeyUp={handleOpenWebLink} tabIndex='0' role='menuitem'>
              Link from Web
            </s.MenuItem>
          </>
        ) : (
          <>
            <s.MenuItem onClick={handleUploadImage} onKeyUp={handleUploadImage} tabIndex='0' role='menuitem'>
              Replace Image
            </s.MenuItem>
            <s.MenuItem onClick={handleDelete} onKeyUp={handleDelete} tabIndex='0' role='menuitem'>
              Delete Image
            </s.MenuItem>
          </>
        )}
      </s.MenuItemsContainer>
    </PopOver>
  );

  // When fitToContainer is true, use block display with 100% dimensions to fill parent
  // Otherwise: use block when width is not set, inline-block when width is explicitly set
  const hasExplicitWidth = width && width !== '';
  const wrapperDisplay = fitToContainer || !hasExplicitWidth ? 'block' : 'inline-block';
  const wrapperStyle = fitToContainer
    ? { position: 'relative', display: wrapperDisplay, width: '100%', height: '100%' }
    : { position: 'relative', display: wrapperDisplay };

  const cornerActionElement = cornerEditing ? (
    <motion.div style={{ position: 'absolute', top: -6, right: -6, bottom: 'auto', left: 'auto', zIndex: 200 }}>
      <s.EditButton
        id={`${id}-PopUp-Button`}
        whileHover={{ scale: 1.15 }}
        transition={{ duration: 0.25 }}
        animate={{
          rotate: editMenuOpen ? 45 : 0,
          scale: editMenuOpen ? 1.15 : 1,
        }}
        onClick={() => {
          setEditMenuOpen(!editMenuOpen);
        }}
      >
        <SvgIcon name='add-circle-v4' size={20} color={colors.blue} />
      </s.EditButton>
    </motion.div>
  ) : undefined;

  return (
    <>
      {!uploading && !showSetter && (
        <div style={wrapperStyle}>
          <Image
            className={className}
            style={style}
            id={id}
            caption={caption}
            imgType={imgType}
            value={value}
            width={width}
            height={height}
            minWidth={minWidth}
            minWidthTablet={minWidthTablet}
            minWidthMobile={minWidthMobile}
            maxWidth={maxWidth}
            maxWidthTablet={maxWidthTablet}
            maxWidthMobile={maxWidthMobile}
            disabled={disabled}
            tabIndex={tabIndex}
            originalName={originalName}
            unsetImage={unsetImage}
            circle={circle}
            onClick={handleOnClick}
            hideCaption={hideCaption}
            isMobile={isMobile}
            isLoading={isLoading}
            tooltip={tooltip}
            tooltipId='grid-image-uploader'
            fitToContainer={fitToContainer}
            placeholderIcon={placeholderIcon}
            isV4={isV4Design}
            cornerAction={cornerActionElement}
          />
          {renderEditMenu()}
        </div>
      )}
      {!uploading && showSetter && renderSetImageButton()}
      {uploading && (
        <s.ImageEditorUploaderContent
          style={{ ...uploadStyle, width, height, cursor: 'pointer' }}
          onClick={handleOnClick}
        >
          <s.ImageEditorUploaderFileWrapper>
            <s.FileIconWrapper>
              <SvgIcon size={24} name='common-file-empty-alternate-v4' color={colors['grey-light']} />
              <s.FileExtention>{fileExtension}</s.FileExtention>
            </s.FileIconWrapper>
            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{uploadingFile}</span>
          </s.ImageEditorUploaderFileWrapper>
          <s.ProgressBarWrapper>
            <s.ProgressBar percentage={uploadProgress} />
          </s.ProgressBarWrapper>
        </s.ImageEditorUploaderContent>
      )}
      <Dialog title='Image' isOpen={showImageEditor} onClose={handleClose} width={440}>
        <s.ImageEditerContent>
          {!uploading && (
            <Image
              disabled={disabled}
              id={id}
              value={value}
              width={254}
              height={254}
              circle={circle}
              unsetImage={unsetImage}
              placeholderIcon={placeholderIcon}
            />
          )}
          {uploading && (
            <s.ImageEditorUploaderContent>
              <s.ImageEditorUploaderFileWrapper>
                <s.FileIconWrapper>
                  <SvgIcon size={24} name='common-file-empty-alternate-v4' color={colors['grey-light']} />
                  <s.FileExtention>{fileExtension}</s.FileExtention>
                </s.FileIconWrapper>
                {uploadingFile}
              </s.ImageEditorUploaderFileWrapper>
              <s.ProgressBarWrapper style={progressStyle}>
                <s.ProgressBar percentage={uploadProgress} />
              </s.ProgressBarWrapper>
            </s.ImageEditorUploaderContent>
          )}
          <s.ImageEditorFooter>
            <SvgIcon
              size={16}
              name='edit'
              tooltip='Replace image'
              tooltipId='grid-image-uploader'
              onClick={handleUploadImage}
              disabled={uploading}
            />
            <SvgIcon
              size={16}
              name='cloud-download-V4'
              tooltip='Download'
              tooltipId='grid-image-uploader'
              onClick={handleDownload}
              disabled={uploading}
            />
            <SvgIcon
              size={16}
              name='delete'
              tooltip='Delete'
              tooltipId='grid-image-uploader'
              onClick={handleDelete}
              disabled={uploading}
            />
          </s.ImageEditorFooter>
        </s.ImageEditerContent>
        <Tooltip id='grid-image-uploader' />
      </Dialog>
      <Dialog
        title='Link from Web'
        isOpen={showWebLinkDialog}
        onClose={handleWebLinkClose}
        width={440}
        footer={{
          primaryButtonLabel: 'Save',
          onPrimaryButtonClick: handleWebLinkConfirm,
          primaryDisabled: !webUrl,
          secondaryButtonLabel: 'Cancel',
          onSecondaryButtonClick: handleWebLinkClose,
        }}
      >
        <div style={{ padding: '8px 0', width: '100%' }}>
          <p style={{ marginBottom: 16, fontSize: 14 }}>Enter a URL of an image to attach.</p>
          <Input
            id={`${id}-web-link-input`}
            placeholder='Enter Link'
            value={webUrl}
            onChange={(e) => setWebUrl(e.target.value)}
            autoComplete='off'
          />
        </div>
      </Dialog>
      <div style={{ display: 'none' }} {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
      </div>
    </>
  );
}

EditableImage.propTypes = propTypes;
export default EditableImage;
