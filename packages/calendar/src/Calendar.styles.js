import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const mobileHeader = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${colors['grey-light']};
  padding: 0px 16px;
  height: 48px;
`;

export const mobileHeaderCaption = styled.h1`
  display: block;
  text-align: center;
  padding: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
  margin: 0;
`;

export const mobileHeaderBackIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(_) => (_.disabled ? 'default' : 'pointer')};
  user-select: none;
  color: ${colors['grey-darker']};
`;

export const calendarDaysToggleWrapper = styled.div`
  margin: auto;
`;

export const calendarDayWrapper = styled.div`
    width: ${(_) => (_.isMobile ? '44px' : '32px')};
    height:  ${(_) => (_.isMobile ? '44px' : '32px')};
    background-color: ${(_) => (_.toggle ? colors.blue : colors['grey-lightest'])};
    border-radius: 50%;
    display: inline-flex;
    margin: ${(_) => {
      switch (_.index) {
        case 0:
          return '2px 2px 2px 0px;';
        case 6:
          return '2px 0px 2px 2px;';
        default:
          return '2px 2px 2px 2px;';
      }
    }}
    cursor: ${(_) => (_.isLastToggledOn ? 'initial' : 'pointer')};`;

export const calendarDay = styled.div`
  margin: auto;
  color: ${(_) => (_.toggle ? colors.white : colors.black)};
`;

export const calendarMenuWrapper = styled.div`
  flex-basis: 288px;
  min-width: 288px;
  max-width: 288px;
  border: solid ${colors['grey-calendar-v2']};
  border-width: 1px 1px;
  background: white;
  display: ${(_) => (_.isDesktopMenuOpen ? 'initial' : 'none')};
`;

export const quickInfoHeader = styled.div`
  bordertopleftradius: ${(_) => (!_.isMobile ? '6px;' : null)} ${(_) => (_.showTitle ? `float: 'right';` : '')};
`;

export const mobileQuickInfoHeaderTitle = styled.h4`
  font-size: 18px !important;
  font-weight: 600;
`;

export const quickInfoHeaderContent = styled.div`
  border: unset;
`;

export const quickInfoContent = styled.div`
  padding: ${(_) => (_.isMobile ? '16px 8px 16px 8px' : '16px')};
  ${(_) => (!_.isMobile ? 'max-height: 600px;' : '')}
`;

export const quickInfoContentTextWrapper = styled.div`
  font-size: ${(_) => (_.isMobile ? '16px' : '14px')};
  padding-top: 1px;
`;

export const descriptionTextWrapper = styled.div`
  display: flex;
  margin: 16px 0px 16px 0px;
`;

export const calendarErrorWraper = styled.div`
  padding: ${(_) => (_.isMobile ? '6px 0px' : '6px 0px 16px 0px')};
`;
