import styled from '@emotion/styled';
import { customOffsetFocusOutline } from '@m-next/styles';

export const CardColumnWrapper = styled.div`
  display: grid;
  grid-template-columns: ${(p) => (p.hasAvatar ? '40px 1fr' : '1fr')};
  grid-gap: 14px;
  padding: ${(p) => {
    let padding = 0;
    if (p.isMobile) padding = '8px';
    return padding;
  }};
  min-height: ${(p) => (p.numRows ? p.numRows * 24 : 24)}px;
  transition: 0.15s ease-in;
  cursor: pointer;

  outline: none;
  body.user-is-tabbing &:focus {
    ${customOffsetFocusOutline};
    z-index: 200;
  }
`;

export const ContentWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: ${(p) => (p.hasTwoColumns ? '1fr 1fr' : '1fr')};
  grid-template-rows: ${(p) => {
    const numRows = p.numRows || 1;
    return Array(numRows).fill('1fr').join(' ');
  }};

  & > :first-of-type {
    font-weight: bold;
  }

  & > :nth-of-type(-n + ${(p) => p.numRows || 3}) {
    justify-self: start;
  }

  & > :nth-last-of-type(-n + ${(p) => p.numRows || 3}) {
    ${(p) => p.hasTwoColumns && 'justify-self: end'};
  }
`;

export const CalendarCardColumnContentWrapper = styled.div`
  padding-top: 8px;
  padding-bottom: 8px;
  display: grid;
`;

export const CalendarCardColumnContent = styled.div`
  overflow: hidden;
  max-width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  word-break: break-word;
  line-height: 1.2em;
  max-height: 3.6em;
`;

export const ContentItem = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;

  ${(p) =>
    p.isMobile &&
    `
    font-size: 16px;
    line-height: 24px;
  `};
`;

export const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 100%;
`;
