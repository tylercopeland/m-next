import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Header, Text } from '@m-next/typeography';
import { colors } from '@m-next/styles';
import SvgIcon from '@m-next/svg-icon';
import * as s from './Model.styles';

const propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  fields: PropTypes.string,
  views: PropTypes.string,
};

function ModelCard({ name, id, fields, views }) {
  return (
    <Link style={{ textDecoration: 'none', outline: 'none', color: colors['grey-dark'] }} to={`${id}/${name}`}>
      <s.ModelCardWrapper id={`model-card-${name}`}>
        <SvgIcon name='user' size={24} colors={colors['grey-dark']} />
        <s.ModelCardContent>
          <Header>{name}</Header>
          <s.ModelCardFooter>
            <SvgIcon name='accordion' size={12} color={colors.blue} tooltip='Fields' tooltipId='model-tooltip' />
            <Text color={colors.blue} style={{ marginRight: 16 }}>
              Fields: {fields}
            </Text>
            <SvgIcon name='filter' size={12} color={colors.blue} tooltip='Views' tooltipId='model-tooltip' />
            <Text color={colors.blue}>Views: {views}</Text>
          </s.ModelCardFooter>
        </s.ModelCardContent>
      </s.ModelCardWrapper>
    </Link>
  );
}

ModelCard.propTypes = propTypes;
export default ModelCard;
