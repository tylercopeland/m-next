import React, { useMemo, useState, useEffect, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import Container from '@m-next/container';
import LoadingSkeleton from '@m-next/loading-skeleton';
import InputArea from '@m-next/input-area';
import Input from '@m-next/input';
import { TextLine } from '@m-next/typeography';
import { colors } from '@m-next/tokens';
import styled from '@emotion/styled';

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

const EMPTY_VALUE = Object.freeze({
  Line1: null,
  Line2: null,
  Line3: null,
  Line4: null,
  Line5: null,
  City: undefined,
  State: undefined,
  PostalCode: undefined,
  Country: undefined,
});

// Builds the canonical Address value object from the legacy flat props.
const collectLegacyValue = (props) => {
  const { Line1, Line2, Line3, Line4, Line5, City, State, PostalCode, Country } = props;
  if (
    Line1 === undefined &&
    Line2 === undefined &&
    Line3 === undefined &&
    Line4 === undefined &&
    Line5 === undefined &&
    City === undefined &&
    State === undefined &&
    PostalCode === undefined &&
    Country === undefined
  ) {
    return null;
  }
  return { Line1, Line2, Line3, Line4, Line5, City, State, PostalCode, Country };
};

export const LineWrapper = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
  },
]);

const propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.shape({
    Line1: PropTypes.string,
    Line2: PropTypes.string,
    Line3: PropTypes.string,
    Line4: PropTypes.string,
    Line5: PropTypes.string,
    City: PropTypes.string,
    State: PropTypes.string,
    PostalCode: PropTypes.string,
    Country: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
  isEditable: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  style: PropTypes.instanceOf(Object),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

const Address = forwardRef(function Address(props, ref) {
  const {
    id: idProp,
    label,
    value: valueProp,
    isLoading = false,
    isEditable = false,
    disabled = false,
    required = false,
    style = {},
    width,
    onChange,
    onFocus,
    onBlur,

    // Legacy flat-field API — soft-shimmed.
    Line1,
    Line2,
    Line3,
    Line4,
    Line5,
    City,
    State,
    PostalCode,
    Country,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,
    caption: legacyCaption,

    // Silently ignored legacy ghosts
    isV4Design: _isV4Design,
    isMobile: _isMobile,
    legacyClass: _legacyClass,
    displayAuto: _displayAuto,
    compactStyle: _compactStyle,

    ...rest
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-address-${++autoIdCounter}`;
  }
  const id = idProp ?? internalIdRef.current;

  // ============ Backwards-compat translation ============

  // Detect (and warn about) the legacy flat-prop API. If a `value` object is also
  // provided it wins; otherwise we synthesize one from the flat props.
  const legacyValue = useMemo(
    () => collectLegacyValue({ Line1, Line2, Line3, Line4, Line5, City, State, PostalCode, Country }),
    [Line1, Line2, Line3, Line4, Line5, City, State, PostalCode, Country],
  );

  if (legacyValue && valueProp === undefined) {
    warnOnce(
      'address-flat-props',
      '@m-next/address: passing `Line1`/`City`/`State`/`PostalCode`/`Country` as individual props is deprecated. Pass a single `value={{ Line1, Line2, …, City, State, PostalCode, Country }}` object instead.',
    );
  }

  let resolvedLabel = label;
  if (legacyCaption != null && resolvedLabel == null) {
    warnOnce('address-caption', '@m-next/address: `caption` is deprecated. Use `label`.');
    resolvedLabel = legacyCaption;
  }

  if (legacyForwardRef) {
    warnOnce(
      'address-forwardRef-prop',
      '@m-next/address: `forwardRef` prop is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  const value = valueProp ?? legacyValue ?? EMPTY_VALUE;

  // ============ Refs ============

  const containerRef = useRef(null);
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

  // ============ State ============

  const buildLines = (v) => [v.Line1, v.Line2, v.Line3, v.Line4, v.Line5].filter(Boolean).join('\n');

  const [addressLines, setAddressLines] = useState(() => buildLines(value));
  const [cityInternal, setCityInternal] = useState(value.City);
  const [stateInternal, setStateInternal] = useState(value.State);
  const [postalCodeInternal, setPostalCodeInternal] = useState(value.PostalCode);
  const [countryInternal, setCountryInternal] = useState(value.Country);

  useEffect(() => {
    setAddressLines(buildLines(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.Line1, value.Line2, value.Line3, value.Line4, value.Line5]);

  useEffect(() => {
    setCityInternal(value.City);
  }, [value.City]);

  useEffect(() => {
    setStateInternal(value.State);
  }, [value.State]);

  useEffect(() => {
    setPostalCodeInternal(value.PostalCode);
  }, [value.PostalCode]);

  useEffect(() => {
    setCountryInternal(value.Country);
  }, [value.Country]);

  const combinedLine = useMemo(() => {
    const parts = [value.City, value.State, value.PostalCode].filter(Boolean);
    return parts.join(', ');
  }, [value.City, value.State, value.PostalCode]);

  // ============ Handlers ============

  const handleChange = (field, e) => {
    const delta = {
      Line1: null,
      Line2: null,
      Line3: null,
      Line4: null,
      Line5: null,
      City: cityInternal,
      State: stateInternal,
      PostalCode: postalCodeInternal,
      Country: countryInternal,
    };

    let lines = addressLines;
    if (field === 'lines') {
      setAddressLines(e);
      lines = e;
    } else if (field === 'city') {
      setCityInternal(e);
      delta.City = e;
    } else if (field === 'state') {
      setStateInternal(e);
      delta.State = e;
    } else if (field === 'postalcode') {
      setPostalCodeInternal(e);
      delta.PostalCode = e;
    } else if (field === 'country') {
      setCountryInternal(e);
      delta.Country = e;
    }

    lines.split('\n').forEach((line, index) => {
      delta[`Line${index + 1}`] = line;
    });

    if (onChange) onChange(delta);
  };

  // ============ Render ============

  const groupId = `${id}-address-block`;
  const labelId = resolvedLabel ? `${id}-address-label` : undefined;

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton count={7} height={14} style={{ marginBottom: 2 }} />;
    }

    if (isEditable) {
      return (
        <Container borderless style={{ gap: 12, padding: 0 }}>
          <InputArea
            id={`${id}-address-lines`}
            isV4Design
            compactStyle
            rows={5}
            value={addressLines}
            disableResize
            disabled={disabled}
            required={required}
            aria-label={resolvedLabel ? `${resolvedLabel} — street address` : 'Street address'}
            onChange={(e) => setAddressLines(e)}
            onBlur={(e) => handleChange('lines', e.target.value)}
            onFocus={onFocus}
          />
          <LineWrapper>
            <Input
              id={`${id}-address-city`}
              value={cityInternal}
              onChange={(e) => handleChange('city', e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              label='City'
              disabled={disabled}
              required={required}
            />
            <Input
              id={`${id}-address-state`}
              value={stateInternal}
              onChange={(e) => handleChange('state', e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              label='State/Province'
              disabled={disabled}
              required={required}
            />
          </LineWrapper>
          <LineWrapper>
            <Input
              id={`${id}-address-postalcode`}
              value={postalCodeInternal}
              onChange={(e) => handleChange('postalcode', e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              label='Zip/Postal Code'
              disabled={disabled}
              required={required}
            />
            <Input
              id={`${id}-address-country`}
              value={countryInternal}
              onChange={(e) => handleChange('country', e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              label='Country'
              disabled={disabled}
              required={required}
            />
          </LineWrapper>
        </Container>
      );
    }

    return (
      <>
        {value.Line1 && <TextLine>{value.Line1}</TextLine>}
        {value.Line2 && <TextLine>{value.Line2}</TextLine>}
        {value.Line3 && <TextLine>{value.Line3}</TextLine>}
        {value.Line4 && <TextLine>{value.Line4}</TextLine>}
        {value.Line5 && <TextLine>{value.Line5}</TextLine>}
        {(value.City || value.State || value.PostalCode) && <TextLine>{combinedLine}</TextLine>}
        {value.Country && <TextLine>{value.Country}</TextLine>}
      </>
    );
  };

  return (
    <Container
      id={groupId}
      ref={containerRef}
      style={{ ...{ background: 'inherit' }, ...style }}
      isRound={false}
      borderless
      width={width}
      padding='0px'
      role={isEditable ? 'group' : undefined}
      aria-labelledby={isEditable && labelId ? labelId : undefined}
      aria-label={isEditable && !labelId ? 'Address' : undefined}
      {...rest}
    >
      {resolvedLabel && (
        <TextLine
          id={labelId}
          style={{
            color: colors.grey.darkest,
            fontWeight: 600,
            marginBottom: 4,
          }}
        >
          {resolvedLabel}
          {required ? <span style={{ color: colors.red.base, marginLeft: 2 }}>*</span> : null}
        </TextLine>
      )}
      {renderContent()}
    </Container>
  );
});

Address.displayName = 'Address';
Address.propTypes = propTypes;

export default Address;
