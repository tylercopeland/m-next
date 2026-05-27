import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image, { EditableImage, type ImageType, type UnsetImageType } from '@m-next/image';
import { createImageControl, type ImageControl } from '@m-next/runtime-interface';
import type { ActionHandler } from '../actions/types';
import { useRuntimeContext } from '../contexts/RuntimeContext';
import { useDesignerContext } from '../contexts/DesignerContext';

import { colors } from '@m-next/styles';
import SvgIcon from '@m-next/svg-icon';

// Runtime image data structure (matches MethodUI's data reducer format)
export interface RuntimeImageData {
  url?: string | null;
  originalName?: string | null;
}

// Extend the centralized ImageControl with legacy properties needed for backward compatibility
interface LegacyImageControl extends ImageControl {
  // Legacy image-specific properties for backward compatibility
  value?: string;
  originalName?: string;
  imgType?: string;
  unsetImage?: string;
  isV4Control?: boolean;
  minWidth?: number;
  minWidthTablet?: number;
  maxWidth?: number;
  maxWidthTablet?: number;
  // Legacy width/height properties that may conflict with ImageControl
  imgWidth?: number;
  imgHeight?: number;
}

export interface ImageDesignerWrapperProps {
  id: string;
  onControlClick?: (controlId: string) => void;
  control?: Record<string, unknown>;
  mode?: 'runtime' | 'designer';
  // Runtime-specific props
  actionHandler?: ActionHandler;
  screenId?: string;
  recordId?: string;
  // Runtime image data from MethodUI's data reducer
  runtimeData?: RuntimeImageData;
  // Callbacks for upload/delete operations (provided by MethodUI)
  onUpload?: (file: File) => void;
  onDelete?: () => void;
  onWebUrlChange?: (url: string) => void;
  // Upload state (managed by MethodUI)
  uploading?: boolean;
  uploadProgress?: number;
  uploadError?: string;
  onCancelUpload?: () => void;
  // Additional runtime props
  isMobile?: boolean;
}

// Check if a string looks like a real image reference (URL, path, or avatar .mci file)
// rather than a bare label like "Image". Must contain a '/' or '.' character.
const isImageRef = (val: string): boolean => /[/.]/.test(val);

const ImageDesignerWrapper: React.FC<ImageDesignerWrapperProps> = ({
  id,
  control: controlProp,
  mode = 'designer',
  actionHandler,
  screenId,
  recordId,
  runtimeData,
  onUpload: onUploadProp,
  onDelete: onDeleteProp,
  onWebUrlChange: onWebUrlChangeProp,
  uploading: uploadingProp = false,
  uploadProgress: uploadProgressProp = 0,
  onCancelUpload,
  isMobile = false,
}) => {
  const isRuntimeMode = !!controlProp || mode === 'runtime';

  // Get RuntimeContext for image upload/delete callbacks (only in runtime mode)
  const runtimeContext = useRuntimeContext();
  const designerContext = useDesignerContext();

  // Local upload state for when using RuntimeContext (not direct props)
  const [localUploading, setLocalUploading] = useState(false);
  const [localUploadProgress, setLocalUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Clean up blob URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Determine which upload/delete functions to use (prop or context)
  const uploading = uploadingProp || localUploading;
  const uploadProgress = uploadProgressProp || localUploadProgress;

  // Get control from designer context (designer mode) or props (runtime mode)
  const controlBase = isRuntimeMode ? controlProp : designerContext?.selectControlById(id);
  const control = (controlBase || controlProp) as LegacyImageControl | undefined;

  // Derive image URL and originalName from control value.
  // processBulkUpdateControlValues wraps image values as { url, originalName }.
  // Upload also stores as { url, originalName } via updateControlValue.
  // Fall back to defaultValue for initial load before data reducer populates.
  const { url, originalName } = useMemo(() => {
    if (runtimeData?.url) {
      return { url: runtimeData.url, originalName: runtimeData.originalName || null };
    }

    if (!isRuntimeMode) {
      return { url: null, originalName: null };
    }

    const controlData = controlProp as Record<string, unknown> | undefined;
    if (!controlData) {
      return { url: null, originalName: null };
    }

    // Check value first (set by data reducer merge in useV4Components)
    const val = controlData.value;
    if (val && typeof val === 'object' && 'url' in val) {
      const imgData = val as RuntimeImageData;
      if (imgData.url && typeof imgData.url === 'string' && isImageRef(imgData.url)) {
        return { url: imgData.url, originalName: imgData.originalName ?? null };
      }
      return { url: null, originalName: null };
    }
    if (typeof val === 'string' && val && isImageRef(val)) {
      return { url: val, originalName: (controlData.originalName as string) ?? null };
    }

    // Fall back to defaultValue (initial load / unbound controls)
    // Note: defaultValue can be a label like "Image" rather than an actual URL,
    // so string values must be validated with isImageRef before use.
    const defaultVal = controlData.defaultValue ?? controlData.DefaultValue;
    if (defaultVal && typeof defaultVal === 'object' && 'url' in (defaultVal as Record<string, unknown>)) {
      const imgData = defaultVal as RuntimeImageData;
      if (imgData.url && typeof imgData.url === 'string' && isImageRef(imgData.url)) {
        return { url: imgData.url, originalName: imgData.originalName ?? null };
      }
      return { url: null, originalName: null };
    }
    if (typeof defaultVal === 'string' && defaultVal && isImageRef(defaultVal)) {
      return { url: defaultVal, originalName: (controlData.originalName as string) ?? null };
    }

    return { url: null, originalName: null };
  }, [runtimeData, isRuntimeMode, controlProp]);

  if (!control) {
    return null;
  }

  // Create proper ImageControl using the factory function
  const imageControl: ImageControl = createImageControl(
    {
      id: control.id,
      type: control.type,
      typeOverride: control.typeOverride,
      hideCaption: control.hideCaption,
      caption: control.caption,
      classes: control.classes,
      name: control.name,
      widthType: control.widthType,
      width: control.width,
      height: control.height,
      visible: control.visible,
      disabled: control.disabled,
      isBound: control.isBound,
      defaultValue: control.defaultValue,
    },
    {
      // Image-specific properties
      src: control.src || null,
      alt: control.alt || null,
      title: control.title || null,
      width: control.imgWidth || null,
      height: control.imgHeight || null,
      fit: control.fit || 'contain',
      alignment: control.alignment || 'left',
      onClick: control.onClick || null,
      border: control.border || false,
      borderRadius: control.borderRadius || null,
    },
  );

  // Helper function to safely get ImageType
  const getImageType = (value: string | undefined): ImageType | undefined => {
    const validTypes: ImageType[] = ['Fixed', 'Responsive', 'Background', 'Dynamic', 'Fit'];
    return value && validTypes.includes(value as ImageType) ? (value as ImageType) : undefined;
  };

  // Helper function to safely get UnsetImageType
  const getUnsetImageType = (value: string | undefined): UnsetImageType | undefined => {
    const validUnsetTypes: UnsetImageType[] = ['person', 'document', 'landscape', 'loader', 'runtimeLandscape'];
    if (value === 'landscape') return 'landscape';
    return value && validUnsetTypes.includes(value as UnsetImageType) ? (value as UnsetImageType) : undefined;
  };

  // Handle onClick action (runtime mode)
  const handleOnClick = useCallback(async () => {
    if (mode === 'runtime' && actionHandler && screenId && control?.onClick) {
      try {
        await actionHandler.executeAction({
          componentId: id,
          actionName: 'onClick',
          screenId,
          recordId,
          actionData: { event: { type: 'click' } },
          metadata: {
            componentType: control?.type || 'image',
            timestamp: Date.now(),
          },
        });
      } catch (error) {
        console.error('[ImageWrapper] Error executing action:', error);
      }
    }
  }, [mode, actionHandler, screenId, recordId, id, control?.onClick, control?.type]);

  // Handle file upload (runtime mode)
  // Use prop callback if provided, otherwise use RuntimeContext
  const handleFileReadSuccess = useCallback(
    (file: File) => {
      // Clean up previous blob URL before creating a new one
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      const blobUrl = URL.createObjectURL(file);
      setPreviewUrl(blobUrl);

      if (onUploadProp) {
        // Direct prop callback (e.g., from ImageWrapperV4)
        onUploadProp(file);
      } else if (runtimeContext?.uploadImage) {
        // RuntimeContext callback (e.g., from LayoutCanvas in Runtime.js)
        setLocalUploading(true);
        runtimeContext.uploadImage(
          id,
          file,
          // onProgress
          (progressEvent: any) => {
            if (progressEvent.total) {
              setLocalUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
            }
          },
          // onSuccess - parent state updates flow back through controlProp.value
          () => {
            setLocalUploading(false);
            setLocalUploadProgress(0);
          },
          // onError
          () => {
            setPreviewUrl(null);
            setLocalUploading(false);
            setLocalUploadProgress(0);
          },
        );
      }
    },
    [onUploadProp, runtimeContext, id, previewUrl],
  );

  // Handle delete (runtime mode)
  // Use prop callback if provided, otherwise use RuntimeContext
  const handleDelete = useCallback(() => {
    if (previewUrl) {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
    }

    if (onDeleteProp) {
      // Direct prop callback (e.g., from ImageWrapperV4)
      onDeleteProp();
    } else if (runtimeContext?.deleteImage) {
      // RuntimeContext callback (e.g., from LayoutCanvas in Runtime.js)
      runtimeContext.deleteImage(id, originalName || undefined);
    }
  }, [onDeleteProp, runtimeContext, id, originalName, previewUrl]);

  // Handle web URL upload (runtime mode)
  // The web upload is managed by the MethodUI/legacy side (performWebUpload).
  // We just set a preview URL for instant display and delegate to the bridge.
  // The bridge handles uploading state internally; new controlProp data flows back on completion.
  const handleWebUrlChange = useCallback(
    (address: string) => {
      setPreviewUrl(address);

      if (onWebUrlChangeProp) {
        onWebUrlChangeProp(address);
      } else if (runtimeContext?.uploadWebImage) {
        runtimeContext.uploadWebImage(id, address);
      }
    },
    [onWebUrlChangeProp, runtimeContext, id],
  );

  // Determine if we have upload capability (either via props or context)
  const hasUploadCapability =
    !!onUploadProp || !!onWebUrlChangeProp || !!runtimeContext?.uploadImage || !!runtimeContext?.uploadWebImage;

  // Handle error messages
  const handleErrorMessageForUser = useCallback((message: string) => {
    console.error('[ImageWrapper] Upload error:', message);
  }, []);

  // Check if image is not configured (not bound and no value) - designer mode only
  const isNotConfigured = !isRuntimeMode && !control.isBound && !control.value;

  if (isNotConfigured) {
    // Return a placeholder that LayoutCanvas will wrap with warning badge
    return (
      <div
        style={{
          display: 'flex',
          padding: '8px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: '10px',
          background: 'transparent',
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Warning badge positioned in top-left corner */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            padding: '8px',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            borderRadius: '4px',
            border: `1px solid ${colors['grey-light']}`,
            background: colors.white,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              color: colors['grey-dark'],
              fontFamily: 'Source Sans Pro',
              fontSize: '12px',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '16px',
              textAlign: 'center',
            }}
          >
            Image not configured
          </div>
          <div
            style={{
              color: colors.grey,
              fontFamily: 'Source Sans Pro',
              fontSize: '10px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '14px',
              textAlign: 'center',
            }}
          >
            Map the component or upload an image in the right panel to configure.
          </div>
        </div>
      </div>
    );
  }

  // Determine image value: runtime uses previewUrl (blob) for instant display, fallback to url, designer uses control value
  const imageValue = isRuntimeMode ? previewUrl || url || undefined : control.value || imageControl.src || undefined;

  const imageOriginalName = isRuntimeMode ? originalName || undefined : control.originalName;

  // Determine placeholder type
  // Default to 'landscape' when unsetImage is not set, so V4 placeholder always renders
  const placeholder = getUnsetImageType(control.unsetImage) || 'landscape';

  // Map unsetImage types to SvgIcon names for V4 placeholder rendering
  const PLACEHOLDER_ICON_MAP: Record<string, string> = {
    landscape: 'landscape-image',
    person: 'portrait-circle',
    document: 'common-file-empty-alternate-v4',
    runtimeLandscape: 'landscape-image',
  };
  const placeholderIcon = placeholder ? PLACEHOLDER_ICON_MAP[placeholder] : undefined;

  // Check if control has configured dimensions (non-empty, non-zero values)
  // Note: control.width/height can be string or number from different sources
  const controlWidth = control.width as string | number | null | undefined;
  const controlHeight = ((control as any).Height || control.height) as string | number | null | undefined;

  const hasConfiguredWidth = controlWidth && String(controlWidth) !== '0' && controlWidth !== 0;
  const hasConfiguredHeight = controlHeight && String(controlHeight) !== '0' && controlHeight !== 0;

  // For images with a value, let the image determine its own size (via Image component's default of '100%')
  // For placeholders (no image), use configured dimensions
  const hasImageValue =
    !!(
      control.value &&
      typeof control.value === 'object' &&
      (control.value as any).url &&
      typeof (control.value as any).url === 'string' &&
      isImageRef((control.value as any).url)
    ) || !!url;

  // When image has a value:
  //   - Use configured dimensions if set
  //   - Otherwise use '' which allows Image component to default to '100%' width
  // When no image (placeholder): use '100%' to fill the grid cell via fitToContainer
  const imgWidth: string | number = hasImageValue
    ? hasConfiguredWidth && controlWidth
      ? controlWidth
      : '' // Empty string allows Image.jsx to default to '100%'
    : '100%';
  const imgHeight: string | number = hasImageValue
    ? hasConfiguredHeight && controlHeight
      ? controlHeight
      : '' // Empty string allows Image.jsx to default to 'auto'
    : '100%';

  // Check if editable in runtime mode (bound + isEditable + not disabled)
  const isEditable = isRuntimeMode && (control as any)?.isEditable && control.isBound && !control.disabled;

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    padding: 8,
  };

  // Editable image: runtime (bound + editable + upload capable) OR designer (bound + editable placeholder)
  const isDesignerEditable = !isRuntimeMode && control.isBound && (control as any)?.isEditable;
  const showEditableImage = (isEditable && hasUploadCapability) || (isDesignerEditable && !hasImageValue);

  if (showEditableImage) {
    return (
      <div style={wrapperStyle}>
        <EditableImage
          key={`${url || 'empty'}-${hasImageValue}`}
          id={imageControl.id}
          caption={imageControl.caption}
          hideCaption={imageControl.hideCaption}
          value={imageValue}
          originalName={imageOriginalName}
          disabled={imageControl.disabled}
          imgType={getImageType(control.imgType)}
          unsetImage={placeholder}
          isMobile={isMobile}
          width={imgWidth}
          height={imgHeight}
          minWidth={control.minWidth}
          minWidthTablet={control.minWidthTablet}
          maxWidth={control.maxWidth}
          maxWidthTablet={control.maxWidthTablet}
          onClick={control?.onClick ? handleOnClick : undefined}
          onFileReadSuccess={handleFileReadSuccess}
          onDelete={handleDelete}
          onErrorMessageForUser={handleErrorMessageForUser}
          uploading={uploading}
          uploadProgress={uploadProgress}
          uploadingFile={originalName || undefined}
          onClose={onCancelUpload}
          onWebUrlChange={handleWebUrlChange}
          hasImage={hasImageValue}
          cornerEditing
          fitToContainer
          placeholderIcon={placeholderIcon}
          isV4Design
        />
      </div>
    );
  }

  // Show static plus icon in designer when bound + editable but has a value
  const showDesignerPlusIcon = isDesignerEditable && hasImageValue;

  const designerCornerAction = showDesignerPlusIcon ? (
    <div
      style={{
        position: 'absolute',
        top: -6,
        right: -6,
        zIndex: 200,
        width: 24,
        height: 24,
        borderRadius: '50%',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SvgIcon name='add-circle-v4' size={20} color={colors.blue} />
    </div>
  ) : undefined;

  // Display-only mode (designer or runtime non-editable)
  return (
    <div style={wrapperStyle}>
      <Image
        key={`${imageValue || 'empty'}-${hasImageValue}`} // Force re-render when image state changes
        id={imageControl.id}
        caption={imageControl.caption}
        hideCaption={imageControl.hideCaption}
        value={imageValue}
        originalName={imageOriginalName}
        disabled={imageControl.disabled}
        imgType={getImageType(control.imgType)}
        unsetImage={placeholder}
        style={{ imgStyle: { cursor: (isRuntimeMode && control?.onClick) || !isRuntimeMode ? 'pointer' : 'default' } }}
        isMobile={isMobile}
        width={imgWidth}
        height={imgHeight}
        minWidth={control.minWidth}
        minWidthTablet={control.minWidthTablet}
        maxWidth={control.maxWidth}
        maxWidthTablet={control.maxWidthTablet}
        onClick={isRuntimeMode && control?.onClick ? handleOnClick : undefined}
        fitToContainer={true}
        placeholderIcon={placeholderIcon}
        isV4
        cornerAction={designerCornerAction}
      />
    </div>
  );
};

export default ImageDesignerWrapper;
