import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const SyncWidgetContainerWrapper = styled.span`
  padding: 8px;
  display: inline-block;
`;

export const SyncWidgetContainer = styled.span`
  display: flex;
  align-items: center;
  background-color: ${(p) => p.backgroundColor};
  padding: 0px 8px;
  border-radius: 30px;
  color: ${colors['grey-darker']};
  font-size: 12px;
  line-height: 20px;
  font-weight: 600;
  width: fit-content;
  white-space: nowrap;
`;

export const SyncWidgetText = styled.span`
  padding-left: 4px;
  padding-right: 8px;
`;

export const SyncWidgetChevron = styled.span`
  font-size: 10px;
  cursor: pointer;
  color: ${colors['grey-dark']};
`;

export const SyncWidgetAdditionalInfoPopup = styled.div`
  position: absolute;
  margin-top: ${(p) => p.topPosition}px;
  padding: 12px;
  background-color: ${colors['white']};
  border: 1px solid ${colors['grey-light']};
  border-radius: 4px;
  box-shadow: 0 2px 4px 0px ${colors['grey-light']};
  z-index: 1000;
  max-width: 360px;
  ${(p) => (p.popupWidth ? `width: ${p.popupWidth}px;` : '')}
  ${(p) => (p.popupMaxWidth ? `max-width: ${p.popupMaxWidth};` : '')}
  text-align: left;
  line-height: 18px;
`;

export const SyncWidgetAdditionalInfoShowMoreButton = styled.span`
  color: ${colors['blue']};
  cursor: pointer;
  padding-left: 8px;
`;

export const SyncWidgetAdditionalInfoTitle = styled.div`
  font-weight: 600;
  padding-bottom: 8px;
`;
