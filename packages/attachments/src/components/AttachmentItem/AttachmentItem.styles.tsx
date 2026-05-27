import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const Container = styled.div<{
  minWidth?: number | string;
  float?: boolean;
}>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 56px;
  border: 1px solid ${colors['grey-light']};
  border-radius: 4px;
  padding: 8px;
  background-color: ${colors.white};
  box-shadow: ${(props) => (props.float ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none')};
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`;

export const FileIconWrapper = styled.div<{
  isUploading: boolean;
  hasError: boolean;
}>`
  margin-right: 12px;
  position: relative;
  cursor: ${(props) => (props.isUploading ? 'default' : 'pointer')};
  opacity: 1;
`;

export const FileIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${colors['blue-light']};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: ${colors.blue};
  text-transform: uppercase;
`;

export const FileExtention = styled.span`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 8px;
  line-height: 9px;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: #fff;
  background: ${colors['blue']};
  padding: 0 1px;
`;

export const ErrorIcon = styled.div`
  width: 24px;
  height: 24px;
  background: ${colors['red-light']};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.red};
  font-size: 16px;
`;

export const Content = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const FileName = styled.button<{
  isUploading: boolean;
  hasError: boolean;
}>`
  background: none;
  border: none;
  padding: 0;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  color: ${(props) => {
    if (props.hasError) return colors.red;
    if (props.isUploading) return colors['grey-dark'];
    return colors.blue;
  }};
  cursor: ${(props) => (props.isUploading ? 'default' : 'pointer')};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;

  &:hover:not(:disabled) {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${colors.blue};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

export const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 4px;
  background: ${colors['grey-lighter']};
  border-radius: 2px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: ${(props) => props.progress}%;
    height: 100%;
    background: ${colors.blue};
    border-radius: 2px;
    transition: width 0.3s ease;
  }
`;

export const Description = styled.div<{ hasError: boolean }>`
  font-size: 12px;
  color: ${(props) => (props.hasError ? colors.red : colors['grey-dark'])};
  line-height: 1.3;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  white-space: nowrap;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  margin-left: 8px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors['grey-dark']};

  &:hover {
    background: ${colors['grey-lighter']};
    color: ${colors['grey-darkest']};
  }

  &:focus-visible {
    outline: 2px solid ${colors.blue};
    outline-offset: 2px;
  }
`;
