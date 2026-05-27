import styled from '@emotion/styled';

export const MainContainer = styled.div`
  display: flex;
  padding: 160px 16px;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1 0 0;
  align-self: stretch;
  cursor: default;
`;

export const EmptyStateContainer = styled.div`
  display: flex;
  width: 400px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;

  /* Inside auto layout */
  flex: none;
  order: 0;
  flex-grow: 0;
  z-index: 6;
`;

export const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  background-color: #f0f2f5;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  flex-grow: 0;
`;

export const TextContainer = styled.div`
  display: flex;
  width: 320px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  flex: none;
  flex-grow: 0;
`;

export const Heading = styled.h2`
  align-self: stretch;
  color: #0f1b31; /* var(--Grey-Grey-Darker, #0F1B31) */
  text-align: center;
  font-feature-settings:
    'liga' off,
    'clig' off;

  /* Heading/H3 */
  font-family: 'Source Sans Pro';
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 120% */

  margin: 0;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

export const Subtext = styled.p`
  align-self: stretch;
  color: #2a394a; /* var(--Grey-Grey-Dark, #2A394A) */
  text-align: center;
  font-feature-settings:
    'liga' off,
    'clig' off;

  /* Body/Body-Text */
  font-family: 'Source Sans Pro';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */

  margin: 0;
  flex: none;
  order: 1;
  flex-grow: 0;
`;
