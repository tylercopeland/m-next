import * as React from 'react';
import PropTypes from 'prop-types';
import { customOffsetFocusOutline } from '@m-next/styles';
import { interactions } from '@m-next/utilities';
import styled from '@emotion/styled';

const propTypes = {
  id: PropTypes.string,
  caption: PropTypes.string.isRequired, // aria-label for the image on screen readers
  imageUrl: PropTypes.string.isRequired, // image to render
  height: PropTypes.string, // % or px -- in most cases should be the same as width
  hasClick: PropTypes.bool, // set to false if there's an onClick that does background tasks.
  onClick: PropTypes.func,
  tabIndex: PropTypes.oneOf(['0', '-1', undefined]), // set to "0" if you want the image to be part of tab order
  width: PropTypes.string.isRequired, // % or px
  style: PropTypes.instanceOf(Object),
};

const ImageWrapper = styled.div((props) => ({
  width: props?.style?.width ?? props.width,
  height: props?.style?.height ?? (props.height || props.width),
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: '50%',
  outline: 'none',
  cursor: props.hasClick ? 'pointer' : 'default',
  body: {
    '&.user-is-tabbing': {
      '&:focus': {
        ...(props.hasClick ? customOffsetFocusOutline : ''),
      },
    },
  },
  ...(props?.style ?? {}),
}));

function RoundImage({ id, caption, imageUrl, height, hasClick, onClick, tabIndex, width, style }) {
  return (
    <ImageWrapper
      id={id}
      role='img'
      onClick={onClick}
      onKeyUp={interactions.handleActionKey(onClick)}
      tabIndex={hasClick ? tabIndex : undefined} // prevent "clickable" in screenreader
      aria-label={`Image: ${caption}`}
      style={{ backgroundImage: `url(${imageUrl})`, ...style }}
      height={height}
      hasClick={hasClick}
      width={width}
    />
  );
}

RoundImage.propTypes = propTypes;
export default RoundImage;
