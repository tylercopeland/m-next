import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

interface ContainerWrapperProps {
  width: string | number;
  isValid?: boolean;
  displayAuto?: boolean;
  isV4Design?: boolean;
  disabled?: boolean;
}

export const ContainerWrapper = styled('div', {
  shouldForwardProp: (prop) => !['isValid', 'displayAuto', 'isV4Design', 'disabled', 'width'].includes(prop),
})<ContainerWrapperProps>`
  width: ${(props) => (typeof props.width === 'number' ? `${props.width}px` : props.width)};
  display: inline-block;
  margin-bottom: 14px;
  vertical-align: top;
  max-width: ${(props) => (props.displayAuto ? '100%' : null)};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'auto')};

  ${(props) =>
    props.isV4Design &&
    `
    position: relative;
    margin-bottom: 0;
    border: ${!props.isValid ? colors.red : 'none'};
  `}
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
  color: ${colors.text};
`;

export const RequiredMark = styled.span`
  color: ${colors.red};
  margin-left: 4px;
`;

export const ValidationMessage = styled.div`
  color: ${colors.red};
  font-size: 12px;
  margin-top: 4px;
`;
