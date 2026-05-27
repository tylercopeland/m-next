import styled from '@emotion/styled';

export const Loader = styled.div`
  opacity: 0.8;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #1b3047;

  > svg {
    fill: currentColor;
    width: 22px;
    height: 22px;
    animation-name: spin;
    animation-duration: 3000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingText = styled.div`
  display: block;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #1b3047;
  line-height: 24px;
  margin-top: 8px;
`;
