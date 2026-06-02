import styled from '@emotion/styled';
import { spacing } from '@m-next/tokens';

// The original MethodUI SectionHeader used child-selector rules:
//   & > h3 { padding-bottom: 8px; }
//   & > p  { padding-bottom: 16px; }
// We preserve the exact visual rhythm (8px after title, 16px after subtitle)
// but apply it via explicit child-selectors here too — they survive even when
// the inner @m-next/text element is wrapped or styled, and they don't depend
// on the consumer passing margin props through. spacing.sm === 8, spacing.lg === 16.
export const SectionHeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  & > h3 {
    padding-bottom: ${spacing.sm}px;
  }

  & > p {
    padding-bottom: ${spacing.lg}px;
  }
`;
