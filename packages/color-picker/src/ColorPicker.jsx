import React, { forwardRef, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ColorPickerComponent } from '@syncfusion/ej2-react-inputs';
import { registerLicense } from '@syncfusion/ej2-base';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import * as s from './ColorPicker.styles';
import './ColorPicker.css';
import { iconSize } from '@m-next/tokens';

// One-time deprecation warner — fires once per key, mirrors @m-next/input.
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
  /** Optional. Auto-generated when not provided. */
  id: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  onDefaultPressed: PropTypes.func,
  containerStyle: PropTypes.instanceOf(Object),
  popupPanelStyle: PropTypes.instanceOf(Object),
  enableOpacity: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  /** When true, panel aligns its right edge with the trigger (extends left). Use in narrow right-side panels to avoid going off-screen. */
  alignPanelRight: PropTypes.bool,
  /** Forwarded to the root container element. */
  className: PropTypes.string,
  /** Forwarded to the root container element; merged over `containerStyle`. */
  style: PropTypes.instanceOf(Object),
};

registerLicense('Ngo9BigBOggjHTQxAR8/V1NGaF5cXmdCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdgWXdfeHVdQ2ZdWUx+W0Q=');

/**
 * ColorPicker — Syncfusion-backed color picker with an inline panel,
 * default-value reset affordance, and Picker/Palette mode toggle.
 *
 * Soft-shim caveats:
 *  - `id` is optional. Auto-generated as `m-next-color-picker-${n}` when
 *    omitted. All internal id-derived markers (`${id}-viewer`, `${id}-panel`,
 *    `${id}-component`, `${id}-reset-icon`) derive from the same resolved id.
 *  - Legacy `forwardRef` prop is soft-shimmed: callers passing it still get
 *    their ref populated, but a one-time console.warn nudges them to use the
 *    standard React ref API. The modern `ref` is attached to the outermost
 *    `s.ColorPickerContainer` (which is also the click-outside boundary).
 *  - `displayAuto` / `hidden` are silently accepted as legacy ghosts so
 *    upstream callers that still pass them don't crash. They were never read.
 */
const ColorPicker = forwardRef(function ColorPicker(props, ref) {
  const {
    id: idProp,
    value,
    defaultValue,
    onChange,
    onDefaultPressed,
    containerStyle,
    popupPanelStyle,
    enableOpacity,
    onOpen,
    onClose,
    alignPanelRight = false,

    // Standard DOM envelope — forwarded to the root element.
    className,
    style,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts — defensive acceptors so callers passing
    // them don't error. Never read by the component body.
    displayAuto: _displayAuto,
    hidden: _hidden,

    ...rest
  } = props;

  // Auto-generate id if not provided. All internal id-derived markers
  // (viewer, panel, component, reset-icon) reuse this so the DOM tree stays
  // internally consistent.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-color-picker-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'color-picker-forwardRef-prop',
      '@m-next/color-picker: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  const values = ['Picker', 'Palette'];

  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [colorValue, setColorValue] = useState(value);

  useEffect(() => {
    if (displayColorPicker && onOpen) {
      onOpen();
    } else if (!displayColorPicker && onClose) {
      onClose();
    }
  }, [displayColorPicker, onOpen, onClose]);

  const position = useRef(0);
  const colorPicker = useRef(null);
  const colorPickerPanel = useRef(null);

  // Chain modern ref + legacy forwardRef prop onto the outer
  // s.ColorPickerContainer (colorPickerPanel ref). Runs after React assigns
  // colorPickerPanel.current, then forwards to both targets.
  useEffect(() => {
    const assign = (target) => {
      if (!target) return;
      if (typeof target === 'function') {
        target(colorPickerPanel.current);
      } else {
        // eslint-disable-next-line no-param-reassign
        target.current = colorPickerPanel.current;
      }
    };
    assign(ref);
    assign(legacyForwardRef);
  }, [ref, legacyForwardRef]);

  const handleCreate = () => {
    const cpElem = colorPicker.current.element.nextElementSibling;
    cpElem.insertBefore(colorPicker.current.element, cpElem.children[1]);

    const applyButton = document.querySelector('div.e-ctrl-btn button[title="Apply"]');
    const cancelButton = document.querySelector('div.e-ctrl-btn button[title="Cancel"]');

    applyButton.onclick = function () {
      setDisplayColorPicker(false);
    };

    cancelButton.onclick = function () {
      setDisplayColorPicker(false);
    };
  };

  const increasePosition = () => {
    if (position.current >= values.length - 1) position.current = 0;
    else position.current += 1;

    return values[position.current];
  };

  const handleClickOutside = (evt) => {
    if (colorPickerPanel.current && !colorPickerPanel.current.contains(evt.target)) {
      setDisplayColorPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    setColorValue(value);
  }, [value]);

  return (
    <s.ColorPickerContainer
      id={id}
      ref={colorPickerPanel}
      className={className}
      style={{ ...containerStyle, ...style }}
      {...rest}
    >
      <s.ColorPickerViewer
        id={`${id}-viewer`}
        tabIndex='0'
        onClick={() => {
          setDisplayColorPicker(!displayColorPicker);
        }}
        onKeyUp={(ev) => {
          if (ev.key === 'Enter') {
            setDisplayColorPicker(!displayColorPicker);
          }
        }}
      >
        <s.ColorWindow color={colorValue} />
        <s.ColorText>{String(colorValue).toUpperCase()}</s.ColorText>
      </s.ColorPickerViewer>

      <s.ColorPickerPanel
        id={`${id}-panel`}
        isVisible={displayColorPicker}
        alignPanelRight={alignPanelRight}
        style={popupPanelStyle}
      >
        <ColorPickerComponent
          id={`${id}-component`}
          name={id || 'color-picker'}
          inline
          className='e-input'
          created={handleCreate}
          ref={colorPicker}
          value={value || defaultValue}
          enableOpacity={enableOpacity}
          open={() => {
            // Hack to avoid inner syncfusion issue -> We manually set the mode and we prevent syncfusion to take care of it by stopping propagation
            // This hack won't be needed in version > 20.2.0
            const node = document.querySelector('button[title="Switch Mode"]');
            node.onclick = function (event) {
              colorPicker.current.toggle();
              colorPicker.current.mode = increasePosition();
              setTimeout(() => {
                colorPicker.current.toggle();
              }, 100);

              event.stopPropagation();
            };
          }}
          change={(evt) => {
            setColorValue(evt.value);

            if (onChange) onChange(evt);
          }}
        />
      </s.ColorPickerPanel>

      {defaultValue &&
        ((colorPicker.current && colorPicker.current.value !== defaultValue) ||
          (!colorPicker.current && value !== defaultValue)) && (
          <s.ResetIconContainer>
            <s.ResetIcon
              id={`${id}-reset-icon`}
              tabIndex={0}
              onClick={() => {
                colorPicker.current.value = defaultValue;
                setColorValue(defaultValue);
                setDisplayColorPicker(false);

                if (onChange) onChange({ value: colorPicker.current.value });

                if (onDefaultPressed) onDefaultPressed();
              }}
              onKeyUp={(ev) => {
                if (ev.key === 'Enter') {
                  colorPicker.current.value = defaultValue;
                  setColorValue(defaultValue);
                  setDisplayColorPicker(false);

                  if (onChange) onChange({ value: colorPicker.current.value });

                  if (onDefaultPressed) onDefaultPressed();
                }
              }}
            >
              <SvgIcon
                isV4Design={false}
                name='undo'
                size={iconSize.sm}
                color={colors['blue']}
                iconStyles={{ position: 'relative', zIndex: 2 }}
              />
            </s.ResetIcon>
            <s.ResetIconDescription>Reset to default</s.ResetIconDescription>
          </s.ResetIconContainer>
        )}
    </s.ColorPickerContainer>
  );
});

ColorPicker.displayName = 'ColorPicker';
ColorPicker.propTypes = propTypes;
export default ColorPicker;
