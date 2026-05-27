/* eslint-disable react/no-danger */
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import SimpleBar from 'simplebar-react';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import Button from '@m-next/button';
import ButtonGroup from '@m-next/button-group';
import * as s from './Calendar.styles';

function CalendarModal({
  event,
  isVisible,
  isMobile,
  alignVWith,
  alignHWith,
  dateSection,
  onClose,
  eventCardMenu,
  hoverCard,
  isWaitlistEvent,
}) {
  document.documentElement.style.setProperty('--popup-radius', '6px');

  const [isModalVisible, setIsModalVisible] = useState(isVisible);
  const [wrapperStyle, setWrapperStyle] = useState({ position: 'absolute' });

  const wrapperRef = useRef(null);

  const handleClickOutside = useCallback(
    (evt) => {
      const id = evt?.target?.offsetParent?.id?.substring(0, 18);
      if (wrapperRef.current && !wrapperRef.current.contains(evt.target) && id !== 'calender-wait-list') {
        setIsModalVisible(false);
        onClose();
      }
    },
    [onClose],
  );

  // Handles clicking outside the modal to close it.
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    setIsModalVisible(isVisible);

    // Re-position the modal with the grid row that was clicked on, and scheduler
    if (alignVWith && alignHWith) {
      const alignLeft = alignHWith.offsetWidth + alignHWith.offsetLeft - 320;

      // 320px is the modal width
      setWrapperStyle({ ...wrapperStyle, left: `${alignLeft}px`, top: alignVWith.offsetTop });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, alignVWith, alignHWith]);

  return (
    isModalVisible && (
      <div ref={wrapperRef} css={{ ...wrapperStyle }}>
        <div className='e-quick-popup-wrapper e-lib e-popup e-control e-popup-open'>
          <div className='e-event-popup'>
            <div className='e-popup-header'>
              <CalendarModalHeader showTitle={hoverCard.title} event={event} isMobile={isMobile} onClose={onClose} />
              <div className='e-popup-content'>
                <CalendarModalContent
                  showDescription={hoverCard.description}
                  showResource={hoverCard.resource}
                  showDateTime={hoverCard.startdate || hoverCard.starttime || hoverCard.enddate || hoverCard.endtime}
                  event={event}
                  isMobile={isMobile}
                  isWaitlistEvent={isWaitlistEvent}
                  dateSection={dateSection}
                />
              </div>
              <div className='e-popup-footer'>
                <CalendarModalFooter isMobile={isMobile} eventCardMenu={eventCardMenu} closePopup={onClose} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

function CalendarModalHeader({ event, isMobile, onClose, showTitle }) {
  return showTitle ? (
    <s.quickInfoHeader className='quick-info-header' isMobile={isMobile} showTitle={showTitle}>
      <div className='quick-info-header-content'>
        {isMobile ? (
          <s.mobileQuickInfoHeaderTitle dangerouslySetInnerHTML={{ __html: event.Subject }} />
        ) : (
          <h5 className='quick-info-title'>
            <strong dangerouslySetInnerHTML={{ __html: event.Subject }} />
          </h5>
        )}
        <SvgIcon
          id='dialog-close-icon'
          size={12}
          name='close-V4'
          color={colors.black}
          style={{ marginTop: '6px' }}
          onClick={onClose}
        />
      </div>
    </s.quickInfoHeader>
  ) : (
    <s.quickInfoHeader className='quick-info-header'>
      <s.quickInfoHeaderContent className='quick-info-header-content'>
        <SvgIcon
          id='dialog-close-icon'
          size={12}
          name='close-V4'
          color={colors.black}
          style={{ marginTop: '6px' }}
          onClick={onClose}
        />
      </s.quickInfoHeaderContent>
    </s.quickInfoHeader>
  );
}

function CalendarModalContent({
  event,
  isMobile,
  dateSection,
  showDescription,
  showResource,
  showDateTime,
  isWaitlistEvent,
}) {
  const hasScheduledDateTime = showDateTime && dateSection !== '' && dateSection != null;
  const shouldShowDateTimeSection = hasScheduledDateTime || isWaitlistEvent;

  const renderDateTimeContent = () => {
    if (!isWaitlistEvent) {
      return dateSection;
    }

    return (
      <div>
        <b>Duration: </b>
        {hasScheduledDateTime ? event.Duration : 'Unscheduled'}
      </div>
    );
  };

  return (
    <SimpleBar>
      <s.quickInfoContent className='quick-info-content' isMobile={isMobile}>
        <div className='event-content'>
          {shouldShowDateTimeSection && (
            <div style={{ display: 'flex' }}>
              <div className='event-content-icon'>
                <SvgIcon size={isMobile ? 20 : 16} name='calendarEventCard' color={colors['grey']} />
              </div>
              <div className='description-text'>{renderDateTimeContent()}</div>
            </div>
          )}
          {showDescription &&
          ((event?.Description_1 !== '' && event?.Description_1 != null) ||
            (event?.Description !== '' && event?.Description != null)) ? (
            <s.descriptionTextWrapper>
              <div className='event-content-icon'>
                <SvgIcon size={isMobile ? 20 : 16} name='checklist' color={colors['grey']} />
              </div>
              <div
                className='description-style description-text'
                dangerouslySetInnerHTML={{ __html: event.Description_1 || event.Description }}
              />
            </s.descriptionTextWrapper>
          ) : null}
          {showResource && event?.ResourceNames && (
            <div style={{ display: 'flex' }}>
              <div className='event-content-icon'>
                <SvgIcon size={isMobile ? 20 : 16} name='people' color={colors.grey} />
              </div>
              <div>
                {event.ResourceNames.split('\n').map((name) => (
                  <s.quickInfoContentTextWrapper key={name} isMobile={isMobile}>
                    {name}
                  </s.quickInfoContentTextWrapper>
                ))}
              </div>
            </div>
          )}
          {showResource && !event?.ResourceNames && event?.AssignedToName !== '' && event?.AssignedToName != null ? (
            <div style={{ display: 'flex' }}>
              <div className='event-content-icon'>
                <SvgIcon size={isMobile ? 20 : 16} name='user' color={colors.grey} />
              </div>
              <div>
                <s.quickInfoContentTextWrapper isMobile={isMobile}>
                  {event.AssignedToName}
                </s.quickInfoContentTextWrapper>
              </div>
            </div>
          ) : null}
        </div>
      </s.quickInfoContent>
    </SimpleBar>
  );
}

function CalendarModalFooter({ isMobile, version, eventCardMenu, closePopup }) {
  document.documentElement.style.setProperty('--popup-footer-position', isMobile ? 'absolute' : 'unset');

  const handleButtonMenuClick = (item) => {
    closePopup();
    if (item && item.onClick && !item.disabled) {
      item.onClick();
    }
  };

  const v4Styling = useMemo(() => {
    if (eventCardMenu[0].style && Object.keys(eventCardMenu[0].style).length > 0) {
      const colorMap = {
        backgroundColor: '',
        color: '',
        borderColor: '',
      };

      const { variant, color } = eventCardMenu[0].style;

      if (variant === 'primary') {
        colorMap.backgroundColor = colors[color] || color;
        colorMap.borderColor = colors[color] || color;
        colorMap.color = colors.white;
        if (
          [colors.white, colors.teal, colors.yellow, colors['grey-lightest']].includes(colorMap.backgroundColor || '')
        ) {
          colorMap.color = colors.grey;
        }
      } else if (variant === 'secondary') {
        colorMap.color = colors[color] || color;
        colorMap.borderColor = colors[color] || color;
        colorMap.backgroundColor = colors.white;
      }
      return colorMap;
    }
    return null;
  }, [eventCardMenu]);

  if (eventCardMenu && eventCardMenu.length > 0) {
    const footerButton = () =>
      eventCardMenu.length === 1 ? (
        <Button
          id='schedule-event-edit'
          isV4Design
          onClick={() => handleButtonMenuClick(eventCardMenu[0])}
          value={version === '1.0.0' ? eventCardMenu[0].label : 'Edit'}
          isMobile={isMobile}
          style={{ ...v4Styling, margin: '8px 16px 8px 0px' }}
        />
      ) : (
        <ButtonGroup
          id='schedule-event-edit'
          data={eventCardMenu}
          onClick={handleButtonMenuClick}
          buttonStyle='calendarMenu'
          margin='8px 16px 8px 0px;'
          isMobile={isMobile}
          forceOpenUp={isMobile}
          backgroundColor={v4Styling.backgroundColor}
          color={v4Styling.color}
          borderColor={v4Styling.borderColor}
        />
      );

    return (
      <div className='quick-info-footer' style={{ borderBottomLeftRadius: !isMobile ? '6px' : null }}>
        <div className='event-footer'>{footerButton()}</div>
      </div>
    );
  }

  return null;
}

CalendarModalHeader.propTypes = {
  event: PropTypes.instanceOf(Object),
  isMobile: PropTypes.bool,
  onClose: PropTypes.func,
  showTitle: PropTypes.bool,
};

CalendarModalContent.propTypes = {
  event: PropTypes.instanceOf(Object),
  isMobile: PropTypes.bool,
  isWaitlistEvent: PropTypes.bool,
  dateSection: PropTypes.element,
  showDescription: PropTypes.bool,
  showResource: PropTypes.bool,
  showDateTime: PropTypes.bool,
};

CalendarModalFooter.propTypes = {
  isMobile: PropTypes.bool,
  version: PropTypes.string,
  eventCardMenu: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  closePopup: PropTypes.func,
};

CalendarModal.propTypes = {
  event: PropTypes.instanceOf(Object),
  isMobile: PropTypes.bool,
  isVisible: PropTypes.bool,
  isWaitlistEvent: PropTypes.bool,
  onClose: PropTypes.func,
  eventCardMenu: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  dateSection: PropTypes.element,
  alignVWith: PropTypes.instanceOf(Element),
  alignHWith: PropTypes.instanceOf(Element),
  hoverCard: PropTypes.instanceOf(Object),
};

export { CalendarModal, CalendarModalHeader, CalendarModalContent, CalendarModalFooter };
