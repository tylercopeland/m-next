import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const Container = styled.div<{ width?: string }>`
  width: ${(props) => props.width || '100%'};
  max-width: 100%;
`;

export const Header = styled.div<{ visible: boolean; hasMargin: boolean }>`
  display: ${(props) => (props.visible ? 'block' : 'none')};
  margin-bottom: ${(props) => (props.hasMargin ? '16px' : '0')};
`;

export const Title = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: ${colors['grey-darkest']};
`;

export const Description = styled.p<{ visible: boolean }>`
  display: ${(props) => (props.visible ? 'block' : 'none')};
  margin: 0 0 8px 0;
  font-size: 14px;
  color: ${colors['grey-dark']};
  line-height: 1.4;
`;

export const LoadingMessage = styled.div<{ visible: boolean }>`
  display: ${(props) => (props.visible ? 'block' : 'none')};
  padding: 16px;
  text-align: center;
  color: ${colors['grey-dark']};
`;

export const EmptyMessage = styled.div<{ visible: boolean }>`
  display: ${(props) => (props.visible ? 'block' : 'none')};
  padding: 16px;
  text-align: center;
  color: ${colors['grey-dark']};
`;

export const AttachmentsList = styled.div<{ visible: boolean }>`
  display: ${(props) => (props.visible ? 'block' : 'none')};
  margin-bottom: 16px;
`;

export const AttachmentWrapper = styled.div<{ isLast: boolean }>`
  margin-bottom: ${(props) => (props.isLast ? '4px' : '8px')};
`;

export const DropZoneWrapper = styled.div<{ visible: boolean }>`
  display: ${(props) => (props.visible ? 'block' : 'none')};
`;
