import React, { Suspense, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { complexValueTypes } from '@m-next/types';
import { selectControls } from '../../../common/services/screenLayoutSlice';
import { selectDisplayPreferences } from '../../../common/services/sessionSlice';

const DatePicker = React.lazy(() => import('@m-next/datepicker'));

const propTypes = {
  id: PropTypes.string,
};

function DateTimePickerDesignerWrapper({ id }) {
  const displayPreferences = useSelector(selectDisplayPreferences);
  const controls = useSelector((state) => selectControls(state));
  const [selectedDate, setSelectedDate] = useState(null);
  const control = controls[id];

  useEffect(() => {
    const {defaultValue} = control;
    if (typeof defaultValue === 'string') {
      setSelectedDate(defaultValue === 'today' ? new Date() : defaultValue || null);
    } else {
      let complexValue = defaultValue || { value: null };
      let derivedValue = complexValue.Value || complexValue.value;
  
      while (complexValue.ValueType === complexValueTypes.Control || complexValue.valueType === complexValueTypes.Control) {
        const sisterControl = controls[derivedValue];
        complexValue = sisterControl?.defaultValue || { value: null};
        derivedValue = complexValue.Value || complexValue.value;
      }

      if (derivedValue) {
        setSelectedDate(derivedValue === 'today' ? new Date() : new Date(derivedValue));
      } else {
        setSelectedDate(null);
      }
    }
  }, [control, controls]);

  // we do this on runtime core so brought it over so it matches what they see.
  const transformedDisplayPreferences = useMemo(() => {
      const transformed = {};
      if (!displayPreferences) return transformed;
      for (const [key, value] of Object.entries(displayPreferences)) {
        if (
          (key === 'timeFormat' ||
            key === 'hourFormat' ||
            key === 'dayFormat' ||
            key === 'monthFormat' ||
            key === 'yearFormat') &&
          value
        ) {
          transformed[key] = value.replace(/d/g, 'E').replace(/D/g, 'd').replace(/Y/g, 'y').replace(/A/g, 'a');
        } else {
          transformed[key] = value;
        }
      }
      return transformed;
  }, [displayPreferences]);

  return (
    <Suspense fallback={<LoadingSkeleton count={1} height={400} />}>
      <div style={{ position: 'relative' }}>
        <DatePicker
          id={control.id}
          caption={control.hideCaption ? null : control.caption}
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          width={control.widthType === 'auto' ? 'auto' : '100%'}
          legacyClass={control.classes}
          isV4Design
          disabled={control.disabled}
          placeholder={control.placeholder}
          useDateFormatPlaceholder={control.useDateFormatPlaceholder}
          format={control.dtFormat}
          formatType={control.formatType}
          compactStyle
          displayPreferences={transformedDisplayPreferences}
        />
      </div>
    </Suspense>
  );
}

DateTimePickerDesignerWrapper.propTypes = propTypes;
export default DateTimePickerDesignerWrapper; 