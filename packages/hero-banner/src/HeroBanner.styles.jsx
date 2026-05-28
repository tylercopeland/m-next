import styled from '@emotion/styled';
import { colors } from '@m-next/tokens';

const backgroundFor = (family) => {
  switch (family) {
    case 'orange':
      return colors.orange.lighter; // #FFFAF0
    case 'green':
      return colors.green.lighter; // #E7F5F0
    case 'red':
      return colors.red.lighter; // #FFF3F0
    case 'blue':
    default:
      return colors.blue.lighter; // #E5F7FF
  }
};

// Mobile breakpoint — switches to vertical stacking, centered image, full-width actions.
const MOBILE_MAX = '640px';

export const HeroBannerRoot = styled.div`
  position: relative;
  background-color: ${(props) => backgroundFor(props.backgroundColor)};
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  overflow: hidden;

  @media (max-width: ${MOBILE_MAX}) {
    flex-direction: column;
  }
`;

export const DismissButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: transparent;
  border: 0;
  padding: 0;

  &:focus-visible {
    outline: 2px solid ${colors.blue.base};
    outline-offset: 2px;
  }

  @media (max-width: ${MOBILE_MAX}) {
    top: 4px;
    right: 4px;
  }
`;

export const HeroBannerContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
  flex: 1;
  min-width: 0;
  min-height: 0;

  @media (max-width: ${MOBILE_MAX}) {
    flex-direction: column;
    align-items: center;
  }
`;

export const HeroBannerImageContainer = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  width: 200px;
  max-width: 200px;
  flex-shrink: 0;
  background-color: ${(props) => backgroundFor(props.backgroundColor)};

  @media (max-width: ${MOBILE_MAX}) {
    width: 100%;
    max-width: none;
  }
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

  @media (max-width: ${MOBILE_MAX}) {
    width: 100%;
  }
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

  @media (max-width: ${MOBILE_MAX}) {
    width: 100%;
  }
`;
