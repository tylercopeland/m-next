import styled from '@emotion/styled';
import { lightTheme } from '@m-next/styles';
import { colors } from '@m-next/tokens';

export const BannerRoot = styled.div`
  padding: 16px;
  background: ${(p) => {
    switch (p.status) {
      case 'error':
        return lightTheme.negative.background;
      case 'success':
        return lightTheme.positive.background;
      case 'warning':
        return lightTheme.warning.background;
      default:
        return lightTheme.informative.background;
    }
  }};
  border-radius: 2px;
  display: flex;
  gap: 16px;
  min-height: 48px;
`;

export const BannerContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
`;

export const BannerContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: center;
  justify-content: flex-start;
  width: 100%;
  flex-wrap: wrap;
`;

export const BannerActionButton = styled.button`
  font-size: 14px;
  line-height: 16px;
  color: ${(p) => {
    switch (p.status) {
      case 'error':
        return lightTheme.negative.secondary;
      case 'success':
        return lightTheme.positive.secondary;
      case 'warning':
        return lightTheme.warning.secondary;
      default:
        return lightTheme.informative.secondary;
    }
  }};
  text-align: right;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  background-color: transparent;
  outline: 0;
  border: 0;
  margin: 0;
  border-radius: 0;
  padding: 0;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  text-decoration: none;
  order-style: none;
`;

export const BannerCloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: 0;
  margin: 8px 0;
  padding: 0;
  cursor: pointer;
  color: ${colors.grey.base};
  &:focus-visible {
    outline: 2px solid ${colors.blue.base};
    outline-offset: 2px;
  }
`;

export const BannerContentActionBlock = styled.div``;

export const BannerContentPrimaryAction = styled.div`
  display: inline-flex;
  order: 1;
`;
export const BannerContentSectionAction = styled.div`
  display: inline-flex;
  order: 1;
  padding-right: 16px;
`;

export const BannerContentMessage = styled.div`
  display: inline-flex;
  font-size: 14px;
  line-height: 16px;
  color: ${(p) => {
    switch (p.status) {
      case 'error':
        return lightTheme.negative.primary;
      case 'success':
        return lightTheme.positive.primary;
      case 'warning':
        return lightTheme.warning.primary;
      default:
        return lightTheme.informative.primary;
    }
  }};
  order: 0;
  flex-grow: ${(p) => (p.variant === 'full' ? 1 : null)};
`;

export const BannerContentIcon = styled.div`
  display: inline-flex;
  background-color: ${(p) => {
    switch (p.status) {
      case 'error':
        return lightTheme.negative.iconBackground;
      case 'success':
        return lightTheme.positive.iconBackground;
      case 'warning':
        return lightTheme.warning.iconBackground;
      default:
        return lightTheme.informative.iconBackground;
    }
  }};

  margin-right: 16px;
  justify-content: center;
  align-items: center;
  border-radius: 32px;
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
`;
