import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const FileList = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
`;

export const RemoveFileButton = styled.button`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  padding: 0;
  transition: opacity 0.2s ease;
`;

export const FileChip = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  max-width: 224px;
  padding: 8px 16px 8px 8px;
  border-radius: 8px;
  background: ${colors['grey-lighter']};
  position: relative;
`;

export const FileName = styled.span`
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
