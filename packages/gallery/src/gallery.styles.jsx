import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const Gallery = styled.div``;

export const Items = styled.div(
  (props) => `
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(min(${props.size}px, 100%), 1fr));
    justify-content: center;
`,
);

export const Thumbnail = styled.figure(
  (props) => `
    cursor: ${props.showActionCursor ? 'pointer' : 'auto'};
    flex-shrink: 0;
    margin: 0;
    opacity: ${props.opacity ?? 1};
    overflow: hidden;
    text-align: center;

    & img {
      aspect-ratio: 1 / 1;
      background-color: ${colors['grey-lighter']};
      border: 1px solid ${colors['grey']};
      object-fit: cover;
      width: 100%;
    }

    & figcaption {
      font-weight: 600;
      margin: 8px 0 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
`,
);

export const EmptyImage = styled.div`
  align-items: center;
  aspect-ratio: 1 / 1;
  background-color: ${colors['grey-lighter']};
  border: 1px solid ${colors['grey']};
  color: ${colors['grey']};
  display: flex;
  justify-content: center;
  user-select: none;
`;

export const TiffContainer = styled.div(() => [
  {
    canvas: {
      maxWidth: '100%',
      maxHeight: '100%',
    },
  },
]);
