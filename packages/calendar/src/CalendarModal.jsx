/* eslint-disable react/no-danger */
import React, { forwardRef, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import SimpleBar from 'simplebar-react';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import Button from '@m-next/button';
import ButtonGroup from '@m-next/button-group';
import * as s from './Calendar.styles';

// One-time deprecation warner — fires once per key, mirrors @m-next/input.
const warnOnce = (() => {
  const seen = new Set();
  return (key, message) => {
    if (seen.has(key) || typeof console === 'undefined') return;
    seen.add(key);
    // eslint-disable-next-line no-console
    console.warn(message);
  };
})();

let autoIdCounter = 0;

/**
 * CalendarModal — quick-info popup for calendar events (header + content +
 * footer). Positions itself absolutely against a row + the scheduler element.
 *
 * Note: many props that look legacy are LOAD-BEARING and remain real:
 *  - `isMobile` drives header/footer styles, popup height/radius CSS vars,
 *    and force-open-up behavior of action buttons
 *  - `alignVWith` / `alignHWith` drive absolute positioning math
 *
 * The root is conditional — when `isVisible` is false the component returns
 * `false` (no DOM). Following the Mapbox no-op pattern, refs are still
 * accepted but won't be assignable until/unless the modal is open; the
 * useEffect updates them every render to the current wrapperRef target
 * (null when closed).
 */
const CalendarModal = forwardRef(function CalendarModal(props, ref) {
  const {
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
    id: idProp,

    // Soft-shimmed legacy props
    forwardRef: legacyForwardRef,

    // Silently ignored legacy ghosts. isMobile is NOT a ghost — load-bearing above.
    isV4Design: _isV4Design,
    legacyClass: _legacyClass,
    compactStyle: _compactStyle,
    displayPreferences: _displayPreferences,
    displayAuto: _displayAuto,
    hidden: _hidden,
  } = props;

  // Auto-generate id if not provided.
  const internalIdRef = useRef(null);
  if (internalIdRef.current === null) {
    // eslint-disable-next-line no-plusplus
    internalIdRef.current = `m-next-calendar-modal-${++autoIdCounter}`;
  }
  // eslint-disable-next-line no-unused-vars
  const id = idProp ?? internalIdRef.current;

  if (legacyForwardRef) {
    warnOnce(
      'calendar-modal-forwardRef-prop',
      '@m-next/calendar: `forwardRef` prop on CalendarModal is deprecated. Use the React forwardRef API — pass `ref` directly.',
    );
  }

  document.documentElement.style.setProperty('--popup-radius', '6px');

  const [isModalVisible, setIsModalVisible] = useState(isVisible);
  const [wrapperStyle, setWrapperStyle] = useState({ position: 'absolute' });

  const wrapperRef = useRef(null);

  // Chain modern ref + legacy forwardRef prop onto wrapperRef. When the modal
  // is not rendered (isVisible false), wrapperRef.current is null — refs are
  // updated to null too (Mapbox no-op pattern).
  useEffect(() => {
    const assign = (target) => {
      if (!target) return;
      if (typeof target === 'function') {
        target(wrapperRef.current);
      } else {
        // eslint-disable-next-line no-param-reassign
        target.current = wrapperRef.current;
      }
    };
    assign(ref);
    assign(legacyForwardRef);
  });

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
});

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

CalendarModal.displayName = 'CalendarModal';
CalendarModal.propTypes = {
  /** Optional. Auto-generated when not provided. */
  id: PropTypes.string,
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
