/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { datesAreOnSameDay, getTimeFormat } from '../CalendarUtilities';

function MonthEventTemplate(props) {
  const { eventProps } = props;

  return (
    <div className='template-wrap' style={{ padding: '4px 8px 4px 8px', margin: 0 }}>
      <div className='subject'>
        {eventProps.IsAllDay ||
        (!eventProps.IsAllDay &&
          !datesAreOnSameDay(new Date(eventProps.StartTime), new Date(eventProps.EndTime))) ? null : (
          <strong>{getTimeFormat(eventProps.StartTime)} </strong>
        )}
        <span dangerouslySetInnerHTML={{ __html: eventProps.Subject }} />
      </div>
    </div>
  );
}

const propTypes = {
  eventProps: PropTypes.instanceOf(Object),
};

MonthEventTemplate.propTypes = propTypes;
export default MonthEventTemplate;
