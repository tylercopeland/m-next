import React, { useState, useRef, useLayoutEffect, useMemo, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import Caption from '@m-next/caption';
import { convertLegacyControlStyle } from '@m-next/styles';
import { ClickOutside } from '@m-next/utilities';
import SvgIcon from '@m-next/svg-icon';
import { widgets } from '@m-next/types';
import * as s from './ButtonGroup.styles';
import { iconSize } from '@m-next/tokens';

// One-time deprecation warner — fires once per key, mirrors @m-next/button / @m-next/input.
const warnOnce = (() => {
  const seen = new Set();
  return (key, message) => {
    if (seen.has(key) || typeof console === 'undefined') return;
    seen.add(key);
    // eslint-disable-next-line no-console
    console.warn(message);
  };
})();

let autoIdCounter = 0;

const propTypes = {
  buttonStyle: PropTypes.oneOf(['primary', 'ghost', 'plain', 'calendarMenu']),
  data: PropTypes.instanceOf(Array),
  disabled: PropTypes.bool,
  id: PropTypes.string,
  isDropdown: PropTypes.bool,
  label: PropTypes.string,
  margin: PropTypes.string,
  onClick: PropTypes.func,
  showCaption: PropTypes.bool,
  width: PropTypes.string,
  hasMenuLabel: PropTypes.bool,
  menuLabel: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium']),
  fillWidth: PropTypes.bool,
  'aria-label': PropTypes.string,
};

const ButtonGroup = forwardRef(function ButtonGroup(props, ref) {
  const {
    buttonStyle = 'primary',
    data = [],
    disabled = false,
    id: idProp,
    isDropdown = false,
    label = '',
    margin = '0px 5px 10px 5px',
    onClick = null,
    showCaption = true,
    width = 'auto',
    forceOpenUp,
    hasMenuLabel = false,
    menuLabel = '',
    size = 'medium',
    fillWidth = false,

    // Standard ARIA
    'aria-label': ariaLabelProp,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,
    legacyClass,

    // Silently ignored legacy ghosts (accepted, no effect)
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,

    // Per-prop style overrides — soft-shimmed. Previously these did a runtime
    // lookup against the flat-key palette (colors[backgroundColor]). Now we
    // pass the user-supplied value through as raw CSS so consumers passing
    // hex / CSS color names continue to work; legacy flat keys like
    // 'dark-grey' will need to be replaced with hex / CSS color values.
    backgroundColor,
    color,
    borderColor,
    fontSize,

    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-button-group-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat warnings ============

  if (legacyForwardRef) {
    warnOnce(
      'button-group-forwardRef-prop',
      '@m-next/button-group: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }
  if (legacyClass) {
    warnOnce(
      'button-group-legacyClass',
      '@m-next/button-group: `legacyClass` is deprecated. Use `style` or compose the variant you need.',
    );
  }
  if (backgroundColor || color || borderColor || fontSize) {
    warnOnce(
      'button-group-style-overrides',
      '@m-next/button-group: per-prop style overrides (backgroundColor, color, borderColor, fontSize) are deprecated. Use `buttonStyle` or pass `style` for one-off escape hatches. Note: legacy flat-key palette names (e.g. `dark-grey`) are no longer translated — pass hex / CSS color names instead.',
    );
  }

  const containerRef = useRef();
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [containerHeight, setContainerHeight] = useState(500);
  const [containerWidth, setContainerWidth] = useState(280);
  const [headerWidth, setHeaderWidth] = useState(280);

  // Merge external ref (forwardRef API + legacy forwardRef prop) with internal containerRef.
  useEffect(() => {
    const targetRef = ref ?? legacyForwardRef;
    if (!targetRef) return;
    if (typeof targetRef === 'function') {
      targetRef(containerRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      targetRef.current = containerRef.current;
    }
  }, [ref, legacyForwardRef]);

  const styleOverrides = useMemo(() => {
    if (backgroundColor || color || fontSize) {
      // Pass through user-supplied values as raw CSS. Legacy flat-key
      // translation removed — see the warnOnce above.
      return {
        backgroundColor: backgroundColor || undefined,
        borderColor: borderColor || undefined,
        color: color || undefined,
        fontSize,
      };
    }
    return null;
  }, [backgroundColor, borderColor, color, fontSize]);

  const handleToggleList = () => {
    if (!disabled) {
      if (open) {
        setOpen(false);
        setSelectedIndex(0);
      } else {
        setOpen(true);
        setSelectedIndex(1);
      }
    }
  };

  const handleOutsideClick = () => {
    setOpen(false);
    setSelectedIndex(0);
  };

  const handleClick = (item, index) => {
    setSelectedIndex(0);
    if (!disabled) {
      setOpen(false);
      if (onClick) {
        onClick(item, index);
      }
    }
  };

  useLayoutEffect(() => {
    if (open && data.length > 1) {
      document.getElementById(`${id}-1`).focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useLayoutEffect(() => {
    setContainerHeight((data.length - (hasMenuLabel ? 0 : 1)) * 32);
    let newWidth = 0;

    data.forEach((element) => {
      if (newWidth < element.label.length * 8) newWidth = element.label.length * 8;
    });

    // Only use width prop for calculation if it's a number, not percentage
    if (typeof width === 'number') {
      newWidth = Math.min(280, width + 16);
    }

    if (containerRef && containerRef.current) {
      const actualWidth = containerRef.current.getBoundingClientRect().width;
      newWidth = Math.max(newWidth, actualWidth);
      setContainerWidth(newWidth);
      setHeaderWidth(actualWidth);
    }
  }, [data, hasMenuLabel, width]);

  const handleRenderItem = (item, index) => {
    if (index === 0 && !hasMenuLabel) return null;

    return (
      <s.ButtonRow
        key={index}
        tabIndex={-1}
        id={`${id}-${index}`}
        role='menuitem'
        aria-disabled={item.disabled}
        disabled={item.disabled}
        selected={index === selectedIndex}
        onClick={() => handleClick(item, index)}
      >
        {item.label}
      </s.ButtonRow>
    );
  };

  /**
   * Get the viewport rect to use for menu placement. When the button group is inside a
   * scrollable container (e.g. layout canvas), use that container's bounds so the menu
   * doesn't get pushed off and stay legible on smaller screens.
   */
  const getViewportRect = () => {
    if (!containerRef.current) {
      return {
        left: 0,
        top: 0,
        right: window.innerWidth,
        bottom: window.innerHeight,
      };
    }
    let el = containerRef.current.parentElement;
    while (el && el !== document.body) {
      const style = getComputedStyle(el);
      const overflow = `${style.overflow}${style.overflowX}${style.overflowY}`;
      if (/auto|scroll|hidden/.test(overflow)) {
        const rect = el.getBoundingClientRect();
        return {
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
        };
      }
      el = el.parentElement;
    }
    return {
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
    };
  };

  const viewport = open ? getViewportRect() : null;
  const containerRect = containerRef.current?.getBoundingClientRect();

  const openUp = () =>
    containerRect &&
    (containerRect.top + containerHeight + 32 > (viewport?.bottom ?? window.innerHeight) || forceOpenUp);

  const openLeft = () =>
    containerRect && containerRect.left + containerWidth + 32 > (viewport?.right ?? window.innerWidth);

  /**
   * When menu is anchored to the right (openLeft), clamp its left edge so it doesn't
   * go off the left side of the viewport. Returns a style object for ListWrapper.
   */
  const getListPlacementStyle = () => {
    if (!openLeft() || !containerRect || !viewport) return {};
    const menuLeftEdge = containerRect.left - (containerWidth - headerWidth);
    if (menuLeftEdge >= viewport.left) return {};
    return {
      left: viewport.left - containerRect.left,
      marginLeft: 0,
    };
  };

  const handleFocusItem = (index) => {
    setSelectedIndex(index);
    document.getElementById(`${id}-${index}`).focus();
  };

  const onMenuToggle = (e) => {
    if (data.length > 1) {
      if (selectedIndex === data.length - 1) {
        handleFocusItem(1);
      } else if (open) {
        setOpen(false);
        handleFocusItem(0);
      } else {
        setOpen(true);
        handleFocusItem(1);
      }
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const openMenu = () => {
    setOpen(true);
    setSelectedIndex(1);
  };

  const handleKeyDown = (e) => {
    if (!disabled) {
      switch (e.keyCode) {
        case 9: // Tab
          handleOutsideClick();
          break;
        case 38: // Up arrow
          if (selectedIndex === 0) {
            if (data.length > 1) {
              if (!open) {
                openMenu();
              }
            }
          } else if (selectedIndex === 1) {
            handleFocusItem(data.length - 1);
          } else {
            handleFocusItem(selectedIndex - 1);
          }
          e.preventDefault();
          e.stopPropagation();
          break;
        case 40: // down arrow
          if (!open) {
            openMenu();
          } else if (selectedIndex === data.length - 1 || selectedIndex === 0) {
            handleFocusItem(1);
          } else {
            handleFocusItem(selectedIndex + 1);
          }
          e.preventDefault();
          e.stopPropagation();
          break;
        case 13: // Enter
        case 32: // Space
          if (!open) {
            openMenu();
          } else {
            const item = data[selectedIndex];
            if ((isDropdown || hasMenuLabel) && selectedIndex === 0 && !open) {
              setOpen(true);
              handleFocusItem(selectedIndex + 1);
            } else if (open && selectedIndex === 0) {
              onMenuToggle(e);
            } else if (!item.disabled) {
              handleClick(item, selectedIndex);
            }
            e.preventDefault();
            e.stopPropagation();
          }
          break;

        default:
          break;
      }
    }
  };

  const handleKeyDownHeaderButton = (e) => {
    if (!disabled) {
      switch (e.keyCode) {
        case 9: // Tab
          handleOutsideClick();
          break;
        case 38: // Up arrow
          if (selectedIndex === 0) {
            if (data.length > 1) {
              if (!open) {
                openMenu();
              }
            }
          } else if (selectedIndex === 1) {
            handleFocusItem(data.length - 1);
          } else {
            handleFocusItem(selectedIndex - 1);
          }
          e.preventDefault();
          e.stopPropagation();
          break;
        case 40: // down arrow
          if (!open) {
            openMenu();
          } else if (selectedIndex === data.length - 1 || selectedIndex === 0) {
            handleFocusItem(1);
          } else {
            handleFocusItem(selectedIndex + 1);
          }
          e.preventDefault();
          e.stopPropagation();
          break;
        case 13: // enter
        case 32: {
          // space
          const item = data[selectedIndex];
          if ((isDropdown || hasMenuLabel) && selectedIndex === 0 && !open) {
            setOpen(true);
            handleFocusItem(selectedIndex + 1);
          } else if (open && selectedIndex === 0) {
            onMenuToggle(e);
          } else if (!item.disabled) {
            handleClick(item, selectedIndex);
          }
          e.preventDefault();
          e.stopPropagation();
          break;
        }

        default:
          break;
      }
    }
  };

  const buttonLabel = useMemo(() => {
    if (hasMenuLabel) {
      return menuLabel;
    }

    if (data && data.length > 0) {
      return data[0].label;
    }
    return '';
  }, [data, hasMenuLabel, menuLabel]);

  // A11y: group label — explicit aria-label wins, then visible label, then the
  // primary button text from the data array, finally a generic fallback.
  const groupAriaLabel = ariaLabelProp || label || (typeof buttonLabel === 'string' ? buttonLabel : undefined) || 'Button group';

  const handleRender = () => {
    if (!data || data.length === 0) return null;

    return (
      <s.ContainerWrapper
        width={width}
        id={id}
        margin={margin}
        fillWidth={fillWidth}
        role='group'
        aria-label={groupAriaLabel}
      >
        {label && showCaption && <Caption id={`${id}-Caption`} label={label} legacyClass={legacyClass} />}
        <ClickOutside parentRef={containerRef} onClickOutsideHandler={handleOutsideClick}>
          <s.Container
            id={`${id}-container`}
            ref={containerRef}
            width={width}
            onKeyDown={handleKeyDown}
            tabIndex={isDropdown || hasMenuLabel ? 0 : -1}
            fillWidth={fillWidth}
            {...rest}
          >
            <s.Wrapper
              disabled={disabled}
              aria-disabled={disabled || (data[0].disabled && !menuLabel)}
              role='button'
              aria-haspopup={data.length > 0}
              aria-expanded={open ? true : null}
              aria-controls={open ? `${id}-menu` : ''}
              buttonStyle={buttonStyle}
              isDropdown={isDropdown}
              fillWidth={fillWidth}
            >
              <s.Button
                id={`${id}-0`}
                tabIndex={isDropdown || hasMenuLabel ? -1 : 0}
                disabled={disabled || (data[0].disabled && !menuLabel)}
                single={data.length === 1}
                onClick={isDropdown || hasMenuLabel ? () => handleToggleList() : () => handleClick(data[0], 0)}
                onKeyDown={isDropdown || hasMenuLabel ? handleKeyDown : handleKeyDownHeaderButton}
                style={
                  styleOverrides ?? {
                    ...convertLegacyControlStyle(legacyClass, widgets.BUTTONGROUP, { ignoreBorder: true }),
                  }
                }
                buttonStyle={buttonStyle}
                isDropdown={isDropdown}
                isV4Design
                size={size}
                fillWidth={fillWidth}
              >
                <s.ButtonTextStyled>{buttonLabel}</s.ButtonTextStyled>
              </s.Button>
              {data.length > 1 && (
                <s.IconHolder
                  onKeyDown={handleKeyDown}
                  disabled={disabled}
                  tabIndex={isDropdown || hasMenuLabel ? -1 : 0}
                  onClick={handleToggleList}
                  id={`${id}-Arrow`}
                  style={
                    styleOverrides ?? {
                      ...convertLegacyControlStyle(legacyClass, widgets.BUTTONGROUP, { ignoreBorder: true }),
                    }
                  }
                  buttonStyle={buttonStyle}
                  size={size}
                  aria-label={`${groupAriaLabel} — open menu`}
                >
                  <SvgIcon
                    caption={`${label} open menu button`}
                    showCaption={false}
                    name='mi-icon-arrow-down-v4'
                    size={iconSize['2xs']}
                  />
                </s.IconHolder>
              )}
            </s.Wrapper>
            {open && (
              <s.ListWrapper
                id={`${id}-menu`}
                role='menu'
                aria-labelledby={label ? `${id}-Caption` : id}
                style={{ height: containerHeight, ...getListPlacementStyle() }}
                openUp={openUp()}
                openLeft={openLeft()}
                containerHeight={containerHeight}
                containerWidth={containerWidth}
                headerWidth={headerWidth}
              >
                {data.map((item, index) => handleRenderItem(item, index))}
              </s.ListWrapper>
            )}
          </s.Container>
        </ClickOutside>
      </s.ContainerWrapper>
    );
  };

  return handleRender();
});

ButtonGroup.displayName = 'ButtonGroup';
ButtonGroup.propTypes = propTypes;

export default ButtonGroup;
