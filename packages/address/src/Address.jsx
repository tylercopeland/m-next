import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Container from '@m-next/container';
import LoadingSkeleton from '@m-next/loading-skeleton';
import InputArea from '@m-next/input-area';
import Input from '@m-next/input';
import { TextLine } from '@m-next/typeography';
import styled from '@emotion/styled';

// types
const propTypes = {
  id: PropTypes.string,
  isLoading: PropTypes.bool,
  style: PropTypes.instanceOf(Object),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  Line1: PropTypes.string,
  Line2: PropTypes.string,
  Line3: PropTypes.string,
  Line4: PropTypes.string,
  Line5: PropTypes.string,
  City: PropTypes.string,
  State: PropTypes.string,
  PostalCode: PropTypes.string,
  Country: PropTypes.string,
  isEditable: PropTypes.bool,
  onChange: PropTypes.func,
};

export const LineWrapper = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
  },
]);

function Address({
  id,
  isLoading = false,
  style = {},
  width,
  Line1,
  Line2,
  Line3,
  Line4,
  Line5,
  City,
  State,
  PostalCode,
  Country,
  isEditable,
  onChange,
}) {
  const combinedLine = useMemo(() => {
    const parts = [City, State, PostalCode].filter(Boolean);
    return parts.join(', ');
  }, [City, State, PostalCode]);

  const buildLines = () => {
    const linesArray = [Line1, Line2, Line3, Line4, Line5].filter(Boolean);
    return linesArray.join('\n');
  };

  const [addressLines, setAddressLines] = useState(() => buildLines());
  const [cityInternal, setCityInternal] = useState(City);
  const [stateInternal, setStateInternal] = useState(State);
  const [postalCodeInternal, setPostalCodeInternal] = useState(PostalCode);
  const [countryInternal, setCountryInternal] = useState(Country);

  useEffect(() => {
    setAddressLines(buildLines());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Line1, Line2, Line3, Line4, Line5]);

  useEffect(() => {
    setCityInternal(City);
  }, [City]);

  useEffect(() => {
    setStateInternal(State);
  }, [State]);

  useEffect(() => {
    setPostalCodeInternal(PostalCode);
  }, [PostalCode]);

  useEffect(() => {
    setCountryInternal(Country);
  }, [Country]);

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
            onChange={(e) => setAddressLines(e)}
            onBlur={(e) => handleChange('lines', e.target.value)}
          />
          <LineWrapper>
            <Input
              id={`${id}-address-city`}
              value={cityInternal}
              onChange={(e) => handleChange('city', e.target.value)}
              label='City'
              compactStyle
              isV4Design
            />
            <Input
              id={`${id}-address-state`}
              value={stateInternal}
              onChange={(e) => handleChange('state', e.target.value)}
              label='State/Province'
              compactStyle
              isV4Design
            />
          </LineWrapper>
          <LineWrapper>
            <Input
              id={`${id}-address-postalcode`}
              value={postalCodeInternal}
              onChange={(e) => handleChange('postalcode', e.target.value)}
              label='Zip/Postal Code'
              compactStyle
              isV4Design
            />
            <Input
              id={`${id}-address-country`}
              value={countryInternal}
              onChange={(e) => handleChange('country', e.target.value)}
              label='Country'
              compactStyle
              isV4Design
            />
          </LineWrapper>
        </Container>
      );
    }

    return (
      <>
        {Line1 && <TextLine>{Line1}</TextLine>}
        {Line2 && <TextLine>{Line2}</TextLine>}
        {Line3 && <TextLine>{Line3}</TextLine>}
        {Line4 && <TextLine>{Line4}</TextLine>}
        {Line5 && <TextLine>{Line5}</TextLine>}
        {(City || State || PostalCode) && <TextLine>{combinedLine}</TextLine>}
        {Country && <TextLine>{Country}</TextLine>}
      </>
    );
  };

  return (
    <Container
      id={`${id}-address-block`}
      style={{ ...{ background: 'inherit' }, ...style }}
      isRound={false}
      borderless
      width={width}
      padding='0px'
    >
      {renderContent()}
    </Container>
  );
}

Address.propTypes = propTypes;
export default Address;
