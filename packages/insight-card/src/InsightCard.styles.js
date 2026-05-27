import styled from '@emotion/styled';

export const InsightCardContainer = styled.div`
  background: #ffffff;
  border: 1px solid #bacad0;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
  gap: 8px;
  min-width: 120px;
  min-height: 120px;

  cursor: ${(props) => (props.isClickable ? 'pointer' : 'default')};

  ${(props) =>
    props.isClickable &&
    `
    &:hover {
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.10);
    }

  `}
`;

export const InsightCardHeader = styled.div`
  display: flex;
  align-items: center;
  align-self: stretch;
  gap: 8px;
  height: 24px;
`;

export const InsightCardIcon = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const InsightCardTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  align-self: stretch;
`;

export const InsightCardTitle = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  color: #2a394a;
  font-feature-settings:
    'liga' off,
    'clig' off;
  font-style: normal;
  flex: 1;
  min-width: 0;
  word-wrap: break-word;
  display: flex;
  align-items: flex-start;
`;

export const InsightCardInfo = styled.button`
  width: 12px;
  height: 12px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const InsightCardContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
`;

export const InsightCardValue = styled.p`
  font-size: 20px;
  font-weight: 600;
  font-style: normal;
  line-height: 24px;
  color: #2a394a;
  font-family: 'Source Sans Pro';
  font-feature-settings:
    'liga' off,
    'clig' off;
  flex: 1 0 0;
`;

export const InsightCardCTA = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  color: #0d71c8;
  font-style: normal;
  font-feature-settings:
    'liga' off,
    'clig' off;
  font-family: 'Source Sans Pro';
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  max-width: 100%;
  height: 24px;
`;

export const SkeletonWrapper = styled.div`
  flex: 1;
  display: flex;
  gap: 4px;
  align-items: center;
  min-width: 0;

  .react-loading-skeleton {
    background-color: #eef5f7;
  }
`;
