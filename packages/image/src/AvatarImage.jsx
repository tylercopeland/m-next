/**
 * `AvatarImage` is a reusable component that outputs
 * a static image, or converts .mci images to TextAvatar 
 * ...and renders the initials, or renders a Person Svg Placeholder 
 * ...if no image source is suppplied.

 ## EXAMPLE
  <AvatarImage imageSrc="PT-0.mci" size="72px" caption="user avatar"/>
 
 ## PROPS - See `propTypes` below for prop configuration details. 
* ========================================================================= */

import React from 'react';
import PropTypes from 'prop-types';

// hoooks & utils
import TextAvatar, { useTextAvatarConfig } from './components/TextAvatar';
import RoundImage from './components/RoundImage';

// Constants
const PERSON_SVG = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><g stroke="#BACAD0" stroke-linejoin="round" stroke-miterlimit="10" fill="none"><path d="M10 15s-1.5-.5-1.5-3c-.826 0-.826-2 0-2 0-.335-1.5-4 1-3.5.5-2 6-2 6.5 0 .347 1.388-.5 3.254-.5 3.5.826 0 .826 2 0 2 0 2.5-1.5 3-1.5 3v2.5c2.477.929 4.93 1.697 6.186 2.575 2.048-2.076 3.314-4.928 3.314-8.075 0-6.352-5.148-11.5-11.5-11.5s-11.5 5.148-11.5 11.5c0 3.153 1.27 6.009 3.325 8.087 1.33-.92 3.952-1.746 6.175-2.587v-2.5zM3.825 20.087c2.085 2.107 4.977 3.413 8.175 3.413 3.203 0 6.1-1.311 8.186-3.425"/></g></svg>`;
const PLACEHOLDER = `data:image/svg+xml;base64,${window.btoa(PERSON_SVG)}`;

const propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  imageSrc: PropTypes.string, // imageSrc - src (.mci or https) image path ideally
  style: PropTypes.instanceOf(Object),
  caption: PropTypes.string.isRequired, // caption - for screen readers
  tabIndex: PropTypes.oneOf(['0', '-1', undefined]), // tabIndex - set `tabIndex="0"` if Avatar is tabbable and make sure `hasClick={true}`
  hasClick: PropTypes.bool, // hasClick - if "false", focus or click styling is never shown
  onClick: PropTypes.func,
  size(props, propName, componentName) {
    // size - since avatar is even-sided, we only need one FIXED size
    const isValidSize =
      parseInt(props[propName], 10) && typeof props[propName] === 'string' && props[propName].includes('px');

    if (!isValidSize) {
      return new Error(
        ` Invalid prop "${propName}" supplied to "${componentName}". "${propName}" must be a valid pixel dimension of 'String' type -- E.g. "72px" \n`,
      );
    }
  },

  // can also override or pass more props: {...otherProps}
};

function AvatarImage(props) {
  const {
    id = null,
    className = null,
    style = {},
    imageSrc = PLACEHOLDER,
    size,
    caption,
    hasClick = false,
    onClick = null,
    tabIndex = undefined,
    ...otherProps
  } = props;

  const textAvatar = useTextAvatarConfig(imageSrc);

  return (
    <div id={id} className={className} style={{ width: size, height: size, ...style }} {...otherProps}>
      {textAvatar ? (
        <TextAvatar
          id={id ? `${id}-TextAvatar` : null}
          initial={textAvatar.initial}
          size={size}
          color={textAvatar.color}
          round
          caption={caption}
          tabIndex={tabIndex}
          hasClick={hasClick}
          onClick={onClick}
        />
      ) : (
        <RoundImage
          id={id ? `${id}-TextAvatar` : null}
          height={size}
          width='100%'
          caption={caption}
          imageUrl={imageSrc}
          tabIndex={tabIndex}
          hasClick={hasClick}
          onClick={onClick}
        />
      )}
    </div>
  );
}

AvatarImage.propTypes = propTypes;
export default AvatarImage;
