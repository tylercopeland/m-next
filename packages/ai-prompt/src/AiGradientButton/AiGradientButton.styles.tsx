import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

const AiGradientButtonStyle = styled.button<{ disabled?: boolean }>`
  padding: 8px 16px;
  background: linear-gradient(124deg, #ff6b3d 18.11%, #7b2ff7 78.2%);
  color: ${colors.white};
  border: none;
  border-radius: 24px;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 14px;
  line-height: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: linear-gradient(109deg, #ff6b3d 34.89%, #7b2ff7 70.53%);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 74, 237, 0.3);
  }
`;

export default AiGradientButtonStyle;
