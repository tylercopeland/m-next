import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Field, FieldTypeNames } from '@m-next/types';
import Image, { EditableImage } from '@m-next/image';

import * as s from '../fieldBlock.styles';

const propTypes = {
  id: PropTypes.string,
  field: Field,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Object)]),
  onSelect: PropTypes.func,
  selected: PropTypes.string,
  mode: PropTypes.number,
  onChange: PropTypes.func,
  onImageUpload: PropTypes.func,
  metadata: PropTypes.shape({
    uploading: PropTypes.bool,
    progress: PropTypes.number,
    url: PropTypes.string,
  }),
  // Callback to download an image through the API instead of directly from CDN.
  // Signature: (imageUrl: string) => void
  // When not provided, EditableImage falls back to CDN-based download.
  onDownloadImage: PropTypes.func,
};

function ImageField({
  id,
  field,
  value,
  onSelect,
  selected,
  mode,
  onChange,
  onImageUpload,
  metadata,
  onDownloadImage,
}) {
  const [clicked, setClicked] = useState(false);
  const [clickTimer, setClickTimer] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      clearTimeout(clickTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetClick = useCallback(() => {
    clearTimeout(clickTimer);
    setClickTimer(
      setTimeout(() => {
        if (isMounted.current) {
          setClicked(false);
        }
      }, 100),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setClicked, isMounted]);

  const handleClick = (e) => {
    if (onSelect) {
      setClicked(true);
      resetClick();
      onSelect(e, id, field.name);
    }
  };

  useEffect(() => {
    setClicked(true);
    resetClick();
  }, [selected, resetClick]);

  const handleUpload = (val) => {
    onImageUpload(field.name, val);
  };

  const handleChange = (val) => {
    onChange(field.name, val);
  };

  useEffect(() => {
    if (metadata?.url) {
      handleChange(metadata.url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata]);

  return (
    <s.ReadOnlyLine
      data-testid={`${id}-data-block-line-${field.name}`}
      selected={field.name === selected}
      initial={clicked}
      onClick={handleClick}
    >
      <s.ReadonlyLabel id={`${id}-data-block-line-${field.name}-caption`}>{field.caption}</s.ReadonlyLabel>
      {mode === 1 && (
        <EditableImage
          id={`${id}-data-block-line-${field.name}-value`}
          circle={field.name === 'ProfileImage' || field.type === FieldTypeNames.ProfileImage}
          width={32}
          value={metadata?.url ? metadata.url : value}
          isV4Design
          onFileReadSuccess={(e) => handleUpload(e)}
          onDelete={() => handleChange(null)}
          uploadProgress={metadata?.progress}
          uploading={metadata?.uploading}
          onDownloadImage={onDownloadImage}
        />
      )}
      {mode === 0 && (
        <Image
          id={`${id}-data-block-line-${field.name}-value`}
          circle={field.name === 'ProfileImage'}
          width={32}
          value={value}
          isV4Design
        />
      )}
    </s.ReadOnlyLine>
  );
}

ImageField.propTypes = propTypes;
export default ImageField;
