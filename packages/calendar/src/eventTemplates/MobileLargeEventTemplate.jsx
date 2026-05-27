/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { getTimeString } from '../CalendarUtilities';

function MobileLargeEventTemplate(props) {
  const { eventProps, compactEventTime } = props;

  if (eventProps.IsAllDay) {
    return (
      <div className='template-wrap' style={{ padding: 0, margin: 0 }}>
        <div className='time'>
          <strong dangerouslySetInnerHTML={{ __html: eventProps.Subject }} />
        </div>
      </div>
    );
  }

  switch (compactEventTime) {
    case 'TitleLeft':
      return (
        <div className='template-wrap' style={{ padding: 0, margin: 0 }}>
          <div className='subject'>
            <strong>{getTimeString(eventProps.StartTime, eventProps.EndTime)}</strong>{' '}
            <span dangerouslySetInnerHTML={{ __html: eventProps.Subject }} />
          </div>
          {!eventProps.Description.includes('<table') ? (
            <div className='description' dangerouslySetInnerHTML={{ __html: eventProps.Description }} />
          ) : null}
        </div>
      );
    case 'TitleRight':
      return (
        <div className='template-wrap' style={{ padding: 0, margin: 0 }}>
          <div className='subject'>
            <strong dangerouslySetInnerHTML={{ __html: eventProps.Subject }} />{' '}
            {getTimeString(eventProps.StartTime, eventProps.EndTime)}
          </div>
          {!eventProps.Description.includes('<table') ? (
            <div className='description' dangerouslySetInnerHTML={{ __html: eventProps.Description }} />
          ) : null}
        </div>
      );
    case 'Description':
      return (
        <div className='template-wrap' style={{ padding: 0, margin: 0 }}>
          <div className='subject'>
            <strong dangerouslySetInnerHTML={{ __html: eventProps.Subject }} />
          </div>
          <div>
            <div className='time' style={{ float: 'left' }}>
              {getTimeString(eventProps.StartTime, eventProps.EndTime)}
            </div>
            {!eventProps.Description.includes('<table') ? (
              <div
                className='description'
                style={{ float: 'left', marginLeft: '8px' }}
                dangerouslySetInnerHTML={{ __html: eventProps.Description }}
              />
            ) : null}
          </div>
        </div>
      );
    case '':
    default:
      return (
        <div className='template-wrap' style={{ padding: 0, margin: 0 }}>
          <div className='subject'>
            <strong dangerouslySetInnerHTML={{ __html: eventProps.Subject }} />
          </div>
          <div className='time'>{getTimeString(eventProps.StartTime, eventProps.EndTime)}</div>
          {!eventProps.Description.includes('<table') ? (
            <div className='description' dangerouslySetInnerHTML={{ __html: eventProps.Description }} />
          ) : null}
        </div>
      );
  }
}

const propTypes = {
  compactEventTime: PropTypes.string,
  eventProps: PropTypes.instanceOf(Object),
};

MobileLargeEventTemplate.propTypes = propTypes;
export default MobileLargeEventTemplate;
