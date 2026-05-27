import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

const c = colors as Record<string, string | undefined>;

export const BannerWrapper = styled.div<{ backgroundColor: string }>`
  background-color: ${(p) => c[p.backgroundColor] || p.backgroundColor};
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 16px;
  align-items: flex-start;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 24px;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

export const IconWrapper = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

export const Title = styled.p`
  /* Heading/H2 */
  font-family: 'Source Sans Pro';
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  color: ${c['grey-darker']};
  margin: 0;
`;

export const Description = styled.p`
  font-family: 'Source Sans Pro', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: ${c['grey-dark']};
  margin: 0;

  @media (max-width: 650px) {
    font-size: 16px;
    line-height: 24px;
  }
`;

export const SectionTitle = styled.p`
  font-family: 'Source Sans Pro', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: ${c['grey-darker']};
  margin: 0 0 8px 0;
`;

export const BulletPointsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
  margin-bottom: 24px;
  max-width: 1080px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const BulletPointRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const IconContainer = styled.div`
  @media (max-width: 650px) {
    margin-top: 5px;
    align-self: flex-start;
  }
`;

export const BulletPointText = styled.p`
  font-family: 'Source Sans Pro', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: ${c['grey-dark']};
  margin: 0;

  @media (max-width: 650px) {
    font-size: 16px;
    line-height: 24px;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;

  @media (max-width: 650px) {
    flex-direction: column;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
  }

  &:focus {
    outline: 2px solid ${c['blue']};
    outline-offset: 2px;
  }
`;
