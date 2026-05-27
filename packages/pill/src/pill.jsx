import * as React from 'react';
import PropTypes from 'prop-types';
import { interactions } from '@m-next/utilities';
import SvgIcon from '@m-next/svg-icon';
import AvatarImage from '@m-next/image/src/AvatarImage';
import * as s from './pill.styles';

const propTypes = {
  size: PropTypes.oneOf(['narrow', 'regular']),
  variant: PropTypes.oneOf(['subtle', 'solid', 'ghost']),
  colorScheme: PropTypes.oneOf([
    'blue',
    'green',
    'fuchsia',
    'grey',
    'yellow',
    'red',
    'purple',
    'orange',
    'teal',
    'transparent',
    'v4-blue',
    'v4-red',
    'v4-yellow',
    'v4-purple',
    'v4-green',
    'v4-gray',
    'v4-orange',
  ]),
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isMobile: PropTypes.bool,
  leadIcon: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    size: PropTypes.number,
    showTooltip: PropTypes.bool,
  }),
  trailIcon: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    size: PropTypes.number,
  }),
  profileIcon: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    size: PropTypes.number,
  }),
  id: PropTypes.string,
  className: PropTypes.string,
  forwardRef: PropTypes.instanceOf(Object),
  style: PropTypes.instanceOf(Object),
  textStyle: PropTypes.instanceOf(Object),
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  disabled: PropTypes.bool,
  bold: PropTypes.bool,
  fontSize: PropTypes.number,
  tooltip: PropTypes.string,
  tooltipId: PropTypes.string,
};

/* ================ Helpers ================ */

function validateProps(props) {
  const { size, variant, colorScheme } = props;

  if (!['narrow', 'regular'].includes(size)) {
    throw new Error(
      "Invalid prop `size` in 'Pill' component. `size` must be one of [ 'simple', 'narrow' ] string values.",
    );
  }

  if (!['subtle', 'solid', 'ghost'].includes(variant)) {
    throw new Error(
      "Invalid prop `variant` in 'Pill' component. `variant` should be one of [ 'subtle', 'solid' ] string values.",
    );
  }

  if (
    ![
      'blue',
      'green',
      'fuchsia',
      'grey',
      'yellow',
      'red',
      'purple',
      'orange',
      'teal',
      'transparent',
      'v4-blue',
      'v4-red',
      'v4-yellow',
      'v4-purple',
      'v4-green',
      'v4-gray',
      'v4-orange',
    ].includes(colorScheme)
  ) {
    let message = "Invalid prop `colorScheme` in 'Pill' component. `colorScheme` must be one of: ";
    message +=
      '\n[ "blue" , "green" , "fuchsia" , "grey" , "yellow" , "red" , "purple" , "orange" , "teal" ,"transparent", "v4-blue", "v4-red", "v4-yellow", "v4-purple", "v4-green", "v4-gray", "v4-orange" ]';
    message += '\nUse the `variant` prop to set the shade to "subtle" (lighter) or "solid" (light).';
    throw new Error(message);
  }
}

/* ================ PILL Component ================ */

function Pill(props) {
  const {
    size = 'regular', // narrow, regular
    variant = 'subtle', // subtle, solid
    colorScheme = 'blue',
    isMobile = false,
    maxWidth = '100%',
    leadIcon = null,
    trailIcon = null,
    profileIcon = null,
    id = null,
    className = null,
    forwardRef = null,
    style = {},
    textStyle = {},
    children,
    onClick,
    onDelete,
    disabled = false,
    bold = true,
    fontSize = 12,
    tooltip,
    tooltipId,
  } = props;

  validateProps({ variant, size, leadIcon, children, colorScheme });

  /* STYLES ------------------*/

  const CSSProperties = {
    lead: {
      display: 'inline-block',
      flexShrink: 0,

      ...{
        narrow: {
          margin: '0 4px 0 0',
        },
        regular: {
          margin: '0 4px 0 2px',
        },
      }[size],
    },
    trail: {
      display: 'inline-block',
      flexShrink: 0,
      marginLeft: 4,
    },
    profile: {
      display: 'inline-flex',

      ...{
        narrow: {
          margin: '0 4px 0 0',
        },
        regular: {
          margin: '0 4px 0 2px',
        },
      }[size],
    },
  };

  const leadIconSize = {
    narrow: 14,
    regular: isMobile ? 20 : 14,
  };

  const profileIconSize = {
    narrow: '12px',
    regular: isMobile ? '24px' : '16px',
  };

  /* RENDER ------------------*/

  const handleClick = (e) => {
    interactions.preventPropagation(e);
    if (onClick) {
      onClick(e);
    }
  };

  const handleDelete = (e) => {
    interactions.preventPropagation(e);
    if (onDelete) {
      onDelete(e);
    }
  };

  const hasClick = !disabled && !!onClick;
  return (
    <s.Wrapper
      id={id}
      className={className}
      style={style}
      ref={forwardRef}
      maxWidth={maxWidth}
      isMobile={isMobile}
      variant={variant}
      size={size}
      colorScheme={colorScheme}
      hasClick={hasClick}
      hasProfileIcon={!!profileIcon}
      onClick={hasClick ? handleClick : null}
      data-tooltip-id={tooltipId}
      data-tooltip-html={tooltip}
    >
      {leadIcon &&
        // eslint-disable-next-line no-nested-ternary
        (leadIcon.name === 'dot' ? (
          <s.Dot
            id={`pill-dot-${id}`}
            className='pill-lead-icon--dot'
            role='presentation'
            aria-label={leadIcon.label}
            size={size}
            colorScheme={colorScheme}
            isMobile={isMobile}
            onClick={hasClick ? handleClick : null}
          />
        ) : !leadIcon.showTooltip ? (
          // Render only the SVG icon without tooltip wrapper
          <SvgIcon
            id={`pill-dot-icon-${id}`}
            className='pill-lead-icon-no-tooltip'
            style={{
              ...CSSProperties.lead,
              color: leadIcon.color ? leadIcon.color : 'inherit',
            }}
            isV4Design
            name={leadIcon.name}
            size={leadIcon.size ? leadIcon.size : leadIconSize[size]}
            onClick={hasClick ? handleClick : null}
          />
        ) : (
          // Render with tooltip wrapper
          <s.Tooltip ml='0'>
            <SvgIcon
              id={`pill-dot-icon-${id}`}
              className='pill-lead-icon'
              style={{
                ...CSSProperties.lead,
                color: leadIcon.color ? leadIcon.color : 'inherit', // Set to red or inherit
              }}
              isV4Design
              name={leadIcon.name}
              size={leadIcon.size ? leadIcon.size : leadIconSize[size]}
              tooltipId={`pill-tooltip-${id}`}
              tooltip='{leadIcon.label}'
              onClick={hasClick ? handleClick : null}
            />
            <s.TooltipIconDescription className='tooltip-text'>{leadIcon.label}</s.TooltipIconDescription>
          </s.Tooltip>
        ))}

      {profileIcon && (
        <AvatarImage
          id={`pill-profile-icon-${id}`}
          className='pill-profile-icon'
          imageSrc={profileIcon.name}
          style={CSSProperties.profile}
          caption={profileIcon.label}
          size={profileIcon.size ? profileIcon.size : profileIconSize[size]}
        />
      )}

      <s.Text
        id={`pill-text-${id}`}
        data-testid={`pill-text-${id}`}
        className='pill-text'
        size={size}
        colorScheme={colorScheme}
        isMobile={isMobile}
        disabled={disabled}
        style={textStyle}
        hasIcon={!!leadIcon}
        bold={bold}
        overrideFontSize={fontSize}
        onClick={hasClick ? handleClick : null}
      >
        {children}
      </s.Text>
      {trailIcon &&
        (trailIcon.name === 'dot' ? (
          <s.Dot
            id={`pill-dot-${id}`}
            role='presentation'
            aria-label={trailIcon.label}
            size={size}
            colorScheme={colorScheme}
            isMobile={isMobile}
            onClick={hasClick ? handleClick : null}
          />
        ) : (
          <SvgIcon
            id={`pill-dot-${id}`}
            style={CSSProperties.trail}
            name={trailIcon.name}
            size={trailIcon.size ? trailIcon.size : leadIconSize[size]}
            caption={trailIcon.label}
            onClick={hasClick ? handleClick : null}
          />
        ))}
      {onDelete && (
        <SvgIcon
          id={`pill-remove-${id}`}
          name='close-V4'
          size={8}
          onClick={disabled ? null : handleDelete}
          style={{ marginLeft: 8 }}
        />
      )}
    </s.Wrapper>
  );
}

Pill.propTypes = propTypes;

export default Pill;
