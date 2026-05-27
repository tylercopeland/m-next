import styled from '@emotion/styled';
import { colors, customFocusOutline } from '@m-next/styles';
import { Z_UI } from '@m-next/layout-canvas';

export const Wrapper = styled.div(({ selected }) => {
  let border = `0px solid ${colors['grey-light']}`;
  if (selected) {
    border = `1px solid ${colors['blue']}`;
  }

  return {
    width: 74,
    border,
    boxShadow: selected ? '0px 0px 0px 2px rgba(13, 113, 200, 0.2)' : null,
    margin: 2,
    padding: selected ? 0 : 1,
    boxSizing: 'border-box',
    '&:hover': {
      border: `1px solid ${colors['grey-light']}`,
      cursor: 'pointer',
      padding: 0,
    },
  };
});

export const RibbonList = styled.div`
  display: flex;
  width: 'auto';
  opacity: 1;
  flex-direction: column;
  z-index: ${Z_UI.RIBBON};
  padding-top: 8px;
  padding-left: 4px;
  padding-right: 4px;
  position: relative;
`;

export const RibbonListMobile = styled.div`
  display: flex;
  padding-bottom: 56px;
  flex-direction: column;
  width: 100%;
  z-index: ${Z_UI.RIBBON};
`;

export const RibbonIcon = styled.div`
  position: relative;
  height: ${(p) => (p.isMobile ? '40px' : '32px')};
  width: ${(p) => (p.isMobile ? '40px' : '32px')};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${(p) => (p.isMobile ? '20px' : '16px')};
  background-color: ${colors['white']};
  color: ${({ color }) => color};
  cursor: pointer;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: ${({ color }) => color};
    color: ${colors['white']};
    transition: background-color 0.5s ease;
  }
`;

export const RibbonItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  width: 65px;
  flex-direction: column;
  padding-top: ${(p) => (p.selected ? '7px' : '8px')};
  padding-bottom: ${(p) => (p.selected ? '0px' : '1px')};

  min-height: 56px;
  border-radius: 4px;
  border: ${(p) => (p.selected ? `1px solid ${colors['blue']}` : `0px solid ${colors['grey-light']}`)};
  box-shadow: ${(p) => (p.selected ? '0px 0px 0px 2px rgba(13, 113, 200, 0.2)' : null)};
  &:hover {
    transition: background-color 0.5s ease;
    cursor: pointer;
    background: #eef5f7;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);

    .ribbon-icon-count {
      box-shadow: 0 0 0 2px ${colors['concrete']};
    }
  }
  min-height: 56px;
  outline: none;
  body.user-is-tabbing &:focus {
    border-radius: 4px;
    ${customFocusOutline};
  }
`;

export const RibbonIconCount = styled.div`
  height: 16px;
  min-width: 16px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: ${colors['white']};
  background-color: ${colors['blue-darkest']};
  font-size: smaller;
  position: absolute;
  right: 0px;
  top: 0px;
  text-align: center;
  line-height: 16px;
  transform: translateX(50%);
  cursor: pointer;
  padding: 0px 4px;

  &:hover {
    box-shadow: 0 0 0 2px ${colors['concrete']};
  }
`;

export const RibbonAddIcon = styled.div`
  color: ${colors['grey-darker']};
  border-radius: 50px;
  padding: 8px;
  cursor: pointer;

  &:hover {
    color: ${colors.legacy.mBlue};
    background-color: ${colors['grey-lighter']};
    transition: background-color 0.5s ease;
  }
  outline: none;
  body.user-is-tabbing &:focus {
    ${customFocusOutline};
  }
`;

export const RibbonCaption = styled.span`
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 40px;
  padding-left: 16px;
  cursor: pointer;
`;

export const RibbonCaptionDesktop = styled.div`
  flex-shrink: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  width: 48px;
  text-align: center;
  padding-top: 8px;
  padding-bottom: 8px;
`;

export const RibbonDivider = styled.div`
  border-bottom: 1px ${colors['grey-lighter']} solid;
`;

export const RibbonNotification = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: rgb(84, 95, 103);
  box-shadow: 0px 0px 0px 2px rgba(247, 249, 251, 1);
`;

export const Divider = styled.div`
  height: 1px;
  background: ${colors['grey-light']};
  margin: 0 16px;
`;
