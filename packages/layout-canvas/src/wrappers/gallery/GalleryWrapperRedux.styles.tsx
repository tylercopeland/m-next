import styled from '@emotion/styled';

export const GalleryWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

interface HeaderProps {
  hasCaption?: boolean;
}

export const Header = styled.div<HeaderProps>`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0 16px;
  justify-content: ${(props) => (props.hasCaption ? 'space-between' : 'flex-end')};
  flex-shrink: 0;
  margin-bottom: 16px;
`;

export const Caption = styled.div`
  flex-shrink: 0;
  font-weight: 600;
  margin: 0;
  max-width: 100%;
`;

interface SearchBoxProps {
  isMobile?: boolean;
}

export const SearchBox = styled.input<SearchBoxProps>`
  margin: 0 !important;
  padding: 8px 8px 8px 32px !important;
  width: ${(props) => (props.isMobile ? '100%' : '256px')} !important;
  background: url('data:image/svg+xml;utf8,<svg width="16px" height="16px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M1017.771 987.563l-384.384-384.384c57.003-64.085 91.947-148.181 91.947-240.512 0-199.979-162.688-362.667-362.667-362.667s-362.667 162.688-362.667 362.667 162.688 362.667 362.667 362.667c92.331 0 176.427-34.944 240.512-91.989l384.384 384.384c4.181 4.181 9.643 6.272 15.104 6.272s10.923-2.091 15.104-6.229c8.32-8.363 8.32-21.845 0-30.208zM42.667 362.667c0-176.469 143.531-320 320-320s320 143.531 320 320-143.531 320-320 320-320-143.531-320-320z"></path></svg>')
    8px center no-repeat !important;
`;

export const GalleryContent = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const PaginationWrapper = styled.div`
  flex-shrink: 0;
  border-top: 1px solid #545f67;
  margin-top: 16px;
  padding-top: 16px;
`;

export const Empty = styled.div`
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  text-align: center;
`;

export const EmptyWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 8px;

  strong {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  span {
    font-size: 14px;
    color: #666;
  }
`;
