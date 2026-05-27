import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

// Full-screen backdrop overlay
export const OverlayBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  background: var(--Grey-Background, #f6fafb);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  z-index: 1000;
`;

// Centered white card
export const BannerCard = styled.div`
  position: relative;
  background-color: ${colors.white};
  border-radius: 8px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  padding: 40px;
  display: flex;
  flex-direction: column;
  margin: 0 24px 24px 24px;
  width: 100%;
  max-width: 1280px;

  @media (max-width: 768px) {
    padding: 32px;
  }
`;

// Main content wrapper (left + right)
export const ContentWrapper = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
  flex: 1;
  min-width: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 40px;
  }
`;

// Left content area
export const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;

  @media (max-width: 768px) {
    max-width: 100%;
    flex: 1 1 auto;
  }
`;

// Right content area (mockups/images)
export const RightContent = styled.div`
  flex: 1 1 473px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  max-width: 473px;
  min-width: 0;

  @media (max-width: 768px) {
    max-width: 100%;
    flex: 0 0 auto;

    img {
      width: 90%;
    }
  }

  img {
    max-height: 350px;
    height: auto;
    object-fit: contain;
  }
`;

// Icon wrapper with border
export const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  background-color: ${colors.white};
  border: 1px solid ${colors['grey-light']};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
`;

// Inner content wrapper
export const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

// Text section
export const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

// Title
export const Title = styled.p`
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 36px;
  color: ${colors['grey-darker']};
  margin: 0;
  white-space: pre-wrap;
`;

// Description
export const Description = styled.p`
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: ${colors['grey-dark']};
  margin-bottom: 24px;
  white-space: pre-wrap;
`;

// Section title ("Why use...?")
export const SectionTitle = styled.p`
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  margin-bottom: 12px;
  color: ${colors['grey-darker']};
  white-space: pre-wrap;
`;

// Bullet points container
export const BulletPointsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-bottom: 24px;
`;

// Single bullet point row
export const BulletPointRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  @media (max-width: 768px) {
    align-items: flex-start;
  }
`;

// Check icon wrapper for alignment
export const CheckIconWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding-top: 4px;
  }
`;

// Check icon background (green circle)
export const CheckIconBackground = styled.div`
  background-color: ${colors['green-primary']};
  border-radius: 100px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

// Bullet point text
export const BulletPointText = styled.span`
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  color: ${colors['grey-dark']};

  @media (max-width: 768px) {
    font-size: 16px;
    line-height: 24px;
  }
`;

// Buttons container
export const ButtonsContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// Primary button wrapper with responsive styles
export const PrimaryButtonWrapper = styled.div`
  button {
    padding: 8px 16px;
    border-radius: 38px;
    font-family: 'Source Sans Pro', sans-serif;
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;

    @media (max-width: 768px) {
      padding: 12px 24px;
      border-radius: 70px;
      font-size: 16px;
      line-height: 24px;
    }
  }
`;

// Secondary button wrapper with responsive styles
export const SecondaryButtonWrapper = styled.div`
  button {
    padding: 8px 16px;
    border-radius: 38px;
    font-family: 'Source Sans Pro', sans-serif;
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;

    @media (max-width: 768px) {
      padding: 12px 24px;
      font-size: 16px;
      line-height: 24px;
    }
  }
`;

// Close button
export const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 0;

  &:hover {
    background-color: ${colors['grey-lighter']};
  }

  &:focus-visible {
    outline: 2px solid ${colors['blue-primary']};
    outline-offset: 2px;
  }
`;
