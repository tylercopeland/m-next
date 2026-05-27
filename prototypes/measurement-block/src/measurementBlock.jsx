import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@emotion/react';
import Container from '@m-next/container';
import { ErrorBoundary } from '@m-next/utilities';
import Button from '@m-next/button';
import {  lightTheme } from '@m-next/styles';
import { ComplexValue, expressionParser } from '@m-next/expression';
import { Field } from '@m-next/types';
import LoadingSkeleton from '@m-next/loading-skeleton';
import * as s from './measurementBlock.styles';

// types
const propTypes = {
  id: PropTypes.string,
  style: PropTypes.instanceOf(Object),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fields: PropTypes.arrayOf(Field),
  data: PropTypes.instanceOf(Object),
  displayPreferences: PropTypes.instanceOf(Object),
  isLoading: PropTypes.bool,
  error: PropTypes.instanceOf(Object),
  onRefetch: PropTypes.func,
  children: PropTypes.node,
  backgroundColor: PropTypes.string,
  title: PropTypes.arrayOf(ComplexValue),
  subtitle: PropTypes.arrayOf(ComplexValue),
  value: PropTypes.arrayOf(ComplexValue),
  unit: PropTypes.string,
  subFooter: PropTypes.arrayOf(ComplexValue),
  onClick: PropTypes.func,
};

function MeasurementBlock({
  id = '',
  fields,
  isLoading = false,
  style = {},
  data = {},
  error,
  onRefetch,
  width,
  displayPreferences,
  children,
  backgroundColor,
  title,
  subtitle,
  value,
  unit,
  subFooter,
  onClick
}) {

  const theme = useTheme() || lightTheme;
  const formatTitle = () => expressionParser.formatExpression(title, fields, data, displayPreferences);

  const formatSubtitle = () => expressionParser.formatExpression(subtitle, fields, data, displayPreferences);

  const formatDisplayValue = () =>
    `${expressionParser.formatExpression(value, fields, data, displayPreferences, unit)} ${unit === '$' ? '' : unit}`;
  const formatSubFooter = () => expressionParser.formatExpression(subFooter, fields, data, displayPreferences);

  const renderContent = () => {
    if (!value || value.length === 0) {
      return (
        <s.EmptyWrapper>
          <strong>No measurement set</strong>
        </s.EmptyWrapper>
      );
    }

    if (error) {
      return (
        <s.EmptyWrapper>
          <strong>Unable to load fields</strong>
          <Button id={`${id}-measurement-block-refetch`} value='Try again' onClick={onRefetch} buttonStyle='link' />
        </s.EmptyWrapper>
      );
    }

    if (isLoading) {
      return <LoadingSkeleton count={1} height={140} style={{ marginBottom: 8 }} />;
    }

    return (
      <s.Wrapper backgroundColor={backgroundColor}>
        {title && <s.Header>{formatTitle()}</s.Header>}
        {subtitle && <s.BodyLabel>{formatSubtitle()}</s.BodyLabel>}
        {children && children}
        {!children && <s.ValueLabel>{formatDisplayValue()}</s.ValueLabel>}
        {subFooter && <s.BodyLabel>{formatSubFooter()}</s.BodyLabel>}
      </s.Wrapper>
    );
  };

  const errorFallback = () => (
    <s.EmptyWrapper>
      <strong>Unable to parse expression</strong>
    </s.EmptyWrapper>
  );
  return (
    <Container
      id={`${id}-measurement-block`}
      style={{
        ...style,
        gap: 8,
        backgroundColor: backgroundColor ?? theme.background.primary,
        justifyContent: 'center',
        cursor: onClick ? 'pointer' :'default',
        borderRadius: '8px'
      }}
      isRound={false}
      width={width}
      onClick={onClick}
    >
      <ErrorBoundary fallback={errorFallback()}>{renderContent()}</ErrorBoundary>
    </Container>
  );
}

MeasurementBlock.propTypes = propTypes;
export default MeasurementBlock;
