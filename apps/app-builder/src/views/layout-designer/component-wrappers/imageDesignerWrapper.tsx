import React from 'react';
import { useSelector } from 'react-redux';
import Image, { type ImageType, type UnsetImageType } from '@m-next/image';
import { createImageControl, type ImageControl } from '@m-next/runtime-interface';
import { selectControls } from '../../../common/services/screenLayoutSlice';
import type { RootState } from '../../../types/screenLayoutTypes';

import { colors } from '@m-next/styles';

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
}

const ImageDesignerWrapper: React.FC<ImageDesignerWrapperProps> = ({ id }) => {
  const control = useSelector((state) => selectControls(state as RootState)?.[id]) as LegacyImageControl | undefined;

  if (!control) {
    return null;
  }

  // Create proper ImageControl using the factory function
  const imageControl: ImageControl = createImageControl({
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
  }, {
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
  });

  // Helper function to safely get string value or undefined
  const getStringValue = (value: string | undefined): string | undefined => {
    return value;
  };

  // Helper function to safely get ImageType
  const getImageType = (value: string | undefined): ImageType | undefined => {
    const validTypes: ImageType[] = ['Fixed', 'Responsive', 'Background', 'Dynamic', 'Fit'];
    return value && validTypes.includes(value as ImageType) 
      ? value as ImageType 
      : undefined;
  };

  // Helper function to safely get UnsetImageType
  const getUnsetImageType = (value: string | undefined): UnsetImageType | undefined => {
    const validUnsetTypes: UnsetImageType[] = ['person', 'document', 'landscape', 'loader', 'runtimeLandscape'];
    if (value === 'landscape') return 'landscape';
    return value && validUnsetTypes.includes(value as UnsetImageType) 
      ? value as UnsetImageType 
      : undefined;
  };

  // Check if image is not configured (not bound and no value)
  // Note: The unconfigured warning badge will be displayed by LayoutCanvas.tsx
  const isNotConfigured = !control.isBound && !control.value;

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

  const imageValue = getStringValue(control.value) || imageControl.src || undefined;

  // Map unsetImage types to SvgIcon names for V4 placeholder rendering
  const PLACEHOLDER_ICON_MAP: Record<string, string> = {
    landscape: 'landscape-image',
    person: 'portrait-circle',
    document: 'common-file-empty-alternate-v4',
    runtimeLandscape: 'landscape-image',
  };
  const unsetImageValue = control.unsetImage === 'landscape' ? 'landscape' : getUnsetImageType(control.unsetImage);
  const placeholderIcon = unsetImageValue ? PLACEHOLDER_ICON_MAP[unsetImageValue] : undefined;

  return (
    <Image
        key={control.value} // Force re-render when value changes
        id={imageControl.id}
        caption={imageControl.caption}
        hideCaption={imageControl.hideCaption}
        value={imageValue}
        originalName={getStringValue(control.originalName)}
        disabled={imageControl.disabled}
        imgType={getImageType(control.imgType)}
        unsetImage={unsetImageValue}
        style={{ wrapperStyle: { display: 'block' }, imgStyle: { cursor: 'pointer' }, display: 'block' }}
        isV4Design={control.isV4Control}
        placeholderIcon={placeholderIcon}
        width={control.value ? '' : imageControl.width || 50}
        height={control.value ? '' : imageControl.height || 50}
        minWidth={control.minWidth}
        minWidthTablet={control.minWidthTablet}
        maxWidth={control.maxWidth}
        maxWidthTablet={control.maxWidthTablet}
    />
  );
};

export default ImageDesignerWrapper;
