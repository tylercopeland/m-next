import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Box = styled.div`
  height: ${(p) => (p.tall ? '32px' : '32px')};
  border-radius: ${(p) => (p.tall ? '8px' : '4px')};
  width: 100%;
  background-color: #eef5f7;
`;

function Skeleton({ tall }) {
  return <Box tall={tall} />;
}

Skeleton.defaultProps = {
  tall: false,
};

Skeleton.propTypes = {
  tall: PropTypes.bool,
};

export default Skeleton;
