import styled from '@emotion/styled';

export const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ToggleButton = styled.button`
  position: relative;
  width: 56px;
  height: 28px;
  border-radius: 100px;
  border: none;
  background: #f6fafb;
  box-shadow: inset -1px 1px 6px 0px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  outline: none;
  padding: 2px;

  &:hover {
    background: #edf4f7;
  }

  &:active {
    transform: translateY(0);
    box-shadow: inset -1px 1px 4px 0px rgba(0, 0, 0, 0.16);
  }

  &:focus-visible {
    outline: 2px solid #0d71c8;
    outline-offset: 2px;
  }

  /* Translucent halo hover effect positioned behind the toggle circle */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: ${(props) => (props.isHidden ? '14px' : '42px')};
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--Blue-Blue-Primary, rgba(13, 113, 200, 1));
    opacity: 0;
    filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.15));
    transform: translate(-50%, -50%);
    transition: all 0.2s ease-in-out;
    z-index: 1;
  }

  &:hover::before {
    opacity: 0.1;
  }
`;

export const ToggleCircle = styled.div`
  position: absolute;
  top: 2px;
  left: ${(props) => (props.isHidden ? '2px' : '30px')};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${(props) => (props.isHidden ? '#FFFFFF' : '#0D71C8')};
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease-in-out;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
`;
