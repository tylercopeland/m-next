import styled from '@emotion/styled';
import Input from '@m-next/input';
import { colors } from '@m-next/styles';

// Define prop types for styled components
interface SignatureContainerProps {
  isInvalid?: boolean;
}

interface PlaceholderProps {
  isSignatureAdded?: boolean;
}

interface WrapperProps {
  isSigned?: boolean;
  isInvalid?: boolean;
}

interface ContainerProps {
  isSignatureAdded?: boolean;
}

interface ButtonsContainerProps {
  isMobile?: boolean;
}

export const SignatureInput = styled(Input)`
  margin-bottom: 0px;
  & input {
    height: 56px !important;
    font-size: 24px !important;
    line-height: normal !important;
  }
`;

export const inputContainer = styled.div`
  width: 400px;
  padding-bottom: 4px;
  min-height: 363px;

  @media (max-width: 768px) {
    width: calc(100vw - 46px);
  }

  & button {
    height: 32px;
  }
`;

export const signatureContainer = styled.div<SignatureContainerProps>`
  border: 1px solid ${(p) => (p.isInvalid ? colors['red'] : colors['grey-light'])};
`;

export const Placeholder = styled.div<PlaceholderProps>`
  display: ${(p) => (p.isSignatureAdded ? 'none' : 'flex')};
  min-height: 80px;
  line-height: 80px;
  color: ${colors['blue']};
  cursor: pointer;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  outline: none;

  body.user-is-tabbing &:focus {
    background-color: rgba(93, 157, 213, 0.2);
  }
`;

export const Wrapper = styled.div<WrapperProps>`
  border-style: ${(p) => (p.isSigned ? 'solid' : 'dashed')};
  border-color: ${(p) => (p.isInvalid ? colors['red'] : colors['grey'])};
  border-width: 1px;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;

  &:hover {
    background-color: rgba(93, 157, 213, 0.2);
  }
`;

export const Container = styled.div<ContainerProps>`
  ${(p) => !p.isSignatureAdded && `display: none`};
  cursor: pointer;
`;

export const ButtonsContainer = styled.div<ButtonsContainerProps>`
  display: flex !important;
  flex-direction: ${(p) => (p.isMobile ? 'column' : 'row-reverse')};
`;

export const SignatureLabel = styled.div`
  font-family: 'Kalam', cursive;
  font-size: 24px;
`;

export const SignatureLink = styled.div`
  color: #00558b;
  cursor: pointer;
  width: fit-content;
`;