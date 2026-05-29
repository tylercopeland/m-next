import styled from '@emotion/styled';
import { colors } from '@m-next/tokens';

interface ContainerWrapperProps {
  width: string | number;
  isValid?: boolean;
  disabled?: boolean;
}

export const ContainerWrapper = styled('div', {
  shouldForwardProp: (prop) => !['isValid', 'disabled', 'width'].includes(prop),
})<ContainerWrapperProps>`
  width: ${(props) => (typeof props.width === 'number' ? `${props.width}px` : props.width)};
  display: inline-block;
  margin-bottom: 14px;
  vertical-align: top;
  position: relative;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'auto')};
  border: ${(props) => (props.isValid === false ? `1px solid ${colors.red.base}` : 'none')};
`;

export const IconWrapper = styled.div`
  padding-right: 0px;
  padding-left: 8px;
  display: flex;
  align-items: center;
`;

export const Label = styled.label`
  text-align: left;
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
  color: ${colors.grey.dark};
`;

export const RequiredMark = styled.span`
  color: ${colors.red.base};
  margin-left: 4px;
`;

export const ValidationMessage = styled.div`
  color: ${colors.red.base};
  font-size: 12px;
  margin-top: 4px;
`;
