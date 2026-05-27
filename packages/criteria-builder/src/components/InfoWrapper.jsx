import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import { TextLine } from '@m-next/typeography';
import styled from '@emotion/styled';

// types
const propTypes = {
  id: PropTypes.string,
  header: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
};

const InfoWrapperContainer = styled.div(() => [
  {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    backgroundColor: colors['blue-lighter'],
    padding: '8px 16px',
  },
]);

function InfoWrapper({ id, header, children }) {
  return (
    <InfoWrapperContainer id={id}>
      <SvgIcon name='info-sign' color={colors.white} size={16} isRound backgroundColor={colors.blue} />
      <div>
        {header && <TextLine bold>{header}</TextLine>}
        {children}
      </div>
    </InfoWrapperContainer>
  );
}

InfoWrapper.propTypes = propTypes;
export default InfoWrapper;
