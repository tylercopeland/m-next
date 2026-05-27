import styled from '@emotion/styled';

export const ContentCardWrapper = styled.div`
  display: flex;
  width: 318px;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 8px;
  border: 1px solid var(--Grey-Grey-Light, #bacad0);
  background: #fff;
`;

export const Thumbnail = styled.div`
  height: 178.875px;
  align-self: stretch;
  aspect-ratio: 16/9;
  border-radius: 8px 8px 0 0;
  background: var(--Grey-Grey-Lighter, #eef5f7);
`;

export const ThumbnailImage = styled.img`
  height: 178.875px;
  width: 100%;
  object-fit: cover;
  aspect-ratio: 16/9;
  border-radius: 8px 8px 0 0;
  display: block;
`;

export const BottomSection = styled.div`
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
`;

export const HeaderText = styled.span`
  color: var(--Grey-Grey-Darker, #0f1b31);
  font-feature-settings:
    'liga' off,
    'clig' off;
  font-family: 'Source Sans Pro';
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px;
  align-self: stretch;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 16px;
`;

export const Description = styled.div`
  color: var(--Grey-Grey-Primary, #545f67);
  font-feature-settings:
    'liga' off,
    'clig' off;
  font-family: 'Source Sans Pro';
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  align-self: stretch;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 32px;
`;

export const CTAContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  align-self: stretch;
`;

export const CompletionIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 9px;
  z-index: 2;
  background: white;
  border-radius: 50%;
  overflow: hidden;
`;
