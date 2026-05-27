import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const DropZone = styled.div<{
  isDragActive: boolean;
  disabled: boolean;
  canUpload: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  padding: 24px;
  border: 1px dashed
    ${(props) => {
      if (props.isDragActive) return colors.blue;
      if (props.disabled) return colors['grey-light'];
      return colors['grey-light'];
    }};
  border-radius: 8px;
  background: ${(props) => {
    if (props.isDragActive) return colors['blue-lighter'];
    if (props.disabled) return colors['grey-lighter'];
    return colors.white;
  }};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;

  &:hover {
    ${(props) =>
      !props.disabled &&
      !props.isDragActive &&
      `
      border-color: ${colors.blue};
      background: ${colors['blue-lighter']};
    `}
  }

  &:focus-within {
    outline: 2px solid ${colors.blue};
    outline-offset: 2px;
  }
`;

export const UploadText = styled.div`
  text-align: center;
  color: ${colors['grey-darkest']};
  margin-bottom: 8px;
`;

export const UploadSubtext = styled.div`
  text-align: center;
  font-size: 12px;
  color: ${colors['grey-dark']};
  font-style: italic;
`;

export const HiddenInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
