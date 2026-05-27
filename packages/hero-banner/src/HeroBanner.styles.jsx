import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const HeroBannerRoot = styled.div`
  position: relative;
  position: relative;
  background-color: ${(props) => {
    switch (props.backgroundColor) {
      case 'orange-lighter':
        return colors['orange-lighter']; // #FFFAF0
      case 'green-lighter':
        return colors['green-lighter']; // #E7F5F0
      case 'red-lighter':
        return colors['red-lighter']; // #FFF3F0
      case 'blue-lighter':
      default:
        return colors['blue-lighter']; // #E5F7FF
    }
  }};
  box-sizing: border-box;
  display: flex;
  flex-direction: ${(props) => (props.isMobile ? 'column' : 'row')};
  align-items: flex-start;
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  overflow: hidden;
`;

export const DismissButton = styled.button`
  position: absolute;
  top: ${(props) => (props.isMobile ? '4px' : '16px')};
  right: ${(props) => (props.isMobile ? '4px' : '16px')};
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: transparent;
`;

export const HeroBannerContentWrapper = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.isMobile ? 'column' : 'row')};
  align-items: ${(props) => (props.isMobile ? 'center' : 'flex-start')};
  gap: 24px;
  width: 100%;
  flex: 1;
  min-width: 0;
  min-height: 0;
`;

export const HeroBannerImageContainer = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  width: ${(props) => (props.isMobile ? '100%' : '200px')};
  max-width: ${(props) => (props.isMobile ? 'none' : '200px')};
  flex-shrink: 0;
  background-color: ${(props) => {
    switch (props.backgroundColor) {
      case 'orange-lighter':
        return colors['orange-lighter'];
      case 'green-lighter':
        return colors['green-lighter'];
      case 'red-lighter':
        return colors['red-lighter'];
      default:
        return colors['blue-lighter'];
    }
  }};
`;

export const HeroBannerImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeroBannerInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  flex: 1;
  min-width: 0;
  min-height: 0;
  width: ${(props) => (props.isMobile ? '100%' : 'auto')};
`;

export const HeroBannerTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
`;

export const HeroBannerActionsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 8px;
  width: ${(props) => (props.isMobile ? '100%' : 'auto')};
`;
