/* eslint-disable react/no-danger */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { getTimeString } from '../CalendarUtilities';

function SmallEventTemplate(props) {
  const { eventProps } = props;

  useEffect(() => {}, []);

  return (
    <div className='template-wrap' style={{ padding: '4px 8px 4px 8px', margin: 0 }}>
      <div className='subject'>
        <strong dangerouslySetInnerHTML={{ __html: eventProps.Subject }} />
      </div>
      <div className='time'>{getTimeString(eventProps.StartTime, eventProps.EndTime)}</div>
    </div>
  );
}

const propTypes = {
  eventProps: PropTypes.instanceOf(Object),
};

SmallEventTemplate.propTypes = propTypes;
export default SmallEventTemplate;
