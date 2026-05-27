/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { getTimeString } from '../CalendarUtilities';

function LargeEventTemplate(props) {
  const { eventProps } = props;

  if (!eventProps.IsAllDay) {
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
  return (
    <div className='template-wrap' style={{ padding: 0, margin: 0 }}>
      <div className='time'>
        <strong dangerouslySetInnerHTML={{ __html: eventProps.Subject }} />
      </div>
    </div>
  );
}

const propTypes = {
  eventProps: PropTypes.instanceOf(Object),
};

LargeEventTemplate.propTypes = propTypes;
export default LargeEventTemplate;
