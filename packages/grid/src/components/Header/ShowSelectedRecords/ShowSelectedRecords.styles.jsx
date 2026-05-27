import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const Wrapper = styled.div`
  padding: 8px;
`;

export const Link = styled.a`
  color: ${colors.blue};

  & :hover {
    color: ${colors.blue};
  }
`;
