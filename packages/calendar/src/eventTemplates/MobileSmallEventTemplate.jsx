/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { getTimeString } from '../CalendarUtilities';

function MobileSmallEventTemplate(props) {
  const { eventProps, compactEventTime } = props;

  switch (compactEventTime) {
    case 'TitleLeft':
      return (
        <div className='template-wrap' style={{ padding: '4px 8px 4px 8px', margin: 0 }}>
          <div className='subject'>
            <strong>{getTimeString(eventProps.StartTime, eventProps.EndTime)}</strong>{' '}
            <span dangerouslySetInnerHTML={{ __html: eventProps.Subject }} />
          </div>
        </div>
      );
    case 'TitleRight':
      return (
        <div className='template-wrap' style={{ padding: '4px 8px 4px 8px', margin: 0 }}>
          <div className='subject'>
            <strong dangerouslySetInnerHTML={{ __html: eventProps.Subject }} />{' '}
            {getTimeString(eventProps.StartTime, eventProps.EndTime)}
          </div>
        </div>
      );
    case '':
    default:
      return (
        <div className='template-wrap' style={{ padding: '4px 8px 4px 8px', margin: 0 }}>
          <div className='subject'>
            <strong dangerouslySetInnerHTML={{ __html: eventProps.Subject }} />
          </div>
          <div className='time'>{getTimeString(eventProps.StartTime, eventProps.EndTime)}</div>
        </div>
      );
  }
}

const propTypes = {
  compactEventTime: PropTypes.string,
  eventProps: PropTypes.instanceOf(Object),
};

MobileSmallEventTemplate.propTypes = propTypes;
export default MobileSmallEventTemplate;
