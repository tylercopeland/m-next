/*  eslint-disable no-param-reassign */

import React from 'react';
import { Internationalization } from '@syncfusion/ej2-base';
import { format, parse, isValid } from 'date-fns';
import { colors } from '@m-next/styles';

// Create a shared internationalization instance
const intlInstance = new Internationalization();

export const isSafari = () => {
  if (navigator.userAgentData) {
    let brands = navigator.userAgentData.brands ?? [];
    brands = brands.map((b) => b.brand.toUpperCase());
    if (brands.includes('GOOGLE CHROME') || brands.includes('CHROMIUM')) {
      return false;
    }
  } else {
    return navigator.userAgent.toUpperCase().includes('SAFARI');
  }
};

/*
  Interim fix for PL-37797

  Calendar cells were growing on swipe using mobile. Issue was with tbl wrapper classes.
  On mobile we go through the html tree and remove tbl classes from parent nodes 

*/
export const cleanParentTableClass = (elem) => {
  // Check to see if the target html node is a part of the waitlist
  while (elem?.parentNode) {
    elem = elem.parentNode;
    if (elem?.className?.substring(0, 3) === 'tbl') {
      const tblClass = elem.classList[0];
      elem.classList.remove(tblClass);
      if (tblClass === 'tbl') break;
    }
  }
};

export const validateDraggingArgs = (args, workCellhalfHeight) => {
  const event = args?.event?.event ?? {};
  const classList = event.target?.classList;
  const offsetY = event?.offsetY ?? 0;

  if (classList && classList.contains('e-work-cells') && offsetY > workCellhalfHeight) return true;

  return false;
};

export const arrayEquals = (a, b, nameKey = 'UserName') =>
  Array.isArray(a) &&
  Array.isArray(b) &&
  a.length === b.length &&
  a.every(
    (val, idx) =>
      val.RecordID === b[idx].RecordID && // same ID
      val[nameKey] === b[idx][nameKey], // same display name (UserName, EntityName, etc.)
  );

export const getWorkDays = (settings) => {
  const workDays = [];
  settings.forEach((setting, index) => {
    if (setting) {
      workDays.push(index);
    }
  });
  return workDays;
};

export const stripScripts = (s) => {
  const el = document.createElement('div');
  el.innerHTML = s;
  const scripts = el.getElementsByTagName('script');
  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];
    script.remove();
  }
  return el.innerHTML;
};

export const datesAreOnSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export const formatEvents = (data, showAllDayEvents, isEditable) => {
  const fifteenMin = 15 * 60000;
  return data.map((orig) => {
    // clone so we don't mutate the caller's data
    const record = { ...orig };

    // Check if StartTime is valid before processing dates
    const hasValidStartTime = record.StartTime && !Number.isNaN(new Date(record.StartTime).getTime());

    if (hasValidStartTime && (!record.EndTime || Number.isNaN(new Date(record.EndTime).getTime()))) {
      const startDateTime = new Date(record.StartTime);
      const newEndDate = new Date(startDateTime.getTime() + fifteenMin);

      const tzOffset = newEndDate.getTimezoneOffset() * 60000;
      const localISOString = new Date(newEndDate - tzOffset).toISOString();
      const newEndDateFormatted = localISOString.split('Z')[0];

      record.EndTime = newEndDateFormatted;
    }

    // Handle cases where Description might be empty but Description_1 exists (formula scenario where backend field is Description_1)
    if (!record.Description && record.Description_1) {
      record.Description = stripScripts(record.Description_1);
    }

    if (record.Description) {
      record.Description = stripScripts(record.Description);
    }

    if (record.Subject) {
      record.Subject = stripScripts(record.Subject);
    }

    if (record.ActivityStatus) {
      record.ActivityStatus = stripScripts(record.ActivityStatus);
    }

    if (!record.CategoryColor) {
      record.CategoryColor = colors.red; // Default color
    }

    // Only calculate IsAllDay if we have valid dates
    if (hasValidStartTime && record.EndTime) {
      const startDate = new Date(record.StartTime);
      const endDate = new Date(record.EndTime);
      const hasValidEndTime = !Number.isNaN(endDate.getTime());

      record.IsAllDay =
        (showAllDayEvents && record.IsAllDayAppointment) ||
        (showAllDayEvents && hasValidEndTime && !datesAreOnSameDay(startDate, endDate));
    } else {
      // Default to false for events without valid dates
      record.IsAllDay = false;
    }

    record.IsReadOnly = isEditable;
    return record;
  });
};

export const getTimeFormat = (value) => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  return !Number.isNaN(date.getTime()) ? intlInstance.formatDate(date, { skeleton: 'hm' }) : '';
};

export const getTimeString = (startTime, endTime) => {
  const start = getTimeFormat(startTime);
  const end = getTimeFormat(endTime);
  if (!start || !end) return '';
  return `${start} - ${end}`;
};

// format the time string portion
export const formatModalTimeString = (hoverCard, event) => {
  if (!event) return '';

  if (hoverCard.starttime && hoverCard.endtime) {
    const startTime = getTimeFormat(event.StartTime);
    const endTime = getTimeFormat(event.EndTime);
    if (startTime && endTime) {
      return `(${startTime} - ${endTime})`;
    }
  }
  if (hoverCard.starttime && event.StartTime) {
    const startTime = getTimeFormat(event.StartTime);
    return startTime || '';
  }
  if (hoverCard.endtime && event.EndTime) {
    const endTime = getTimeFormat(event.EndTime);
    return endTime || '';
  }

  return '';
};

export const getModalDateSection = (event, hoverCard) => {
  if (!event || !event.StartTime || !event.EndTime) {
    return null;
  }

  if (!(event.StartTime instanceof Date)) {
    const startDate = new Date(event.StartTime);
    // Only assign if the date is valid
    if (!Number.isNaN(startDate.getTime())) {
      event.StartTime = startDate;
    } else {
      return null;
    }
  }

  if (!(event.EndTime instanceof Date)) {
    const endDate = new Date(event.EndTime);
    // Only assign if the date is valid
    if (!Number.isNaN(endDate.getTime())) {
      event.EndTime = endDate;
    } else {
      return null;
    }
  }

  const formattedStartDate = intlInstance.formatDate(event.StartTime, { type: 'date', skeleton: 'long' });
  const formattedEndDate = intlInstance.formatDate(event.EndTime, { type: 'date', skeleton: 'long' });

  // If its an all day appointment, the date displayed is both the start/end date, and there is no time
  // The user must have startdate and enddate visible in the calendar builder
  if (event.IsAllDayAppointment) {
    return hoverCard.startdate && hoverCard.enddate ? <p>{`${formattedStartDate}`}</p> : null;
  }

  // If the dates are on the same day, the date displayed is both the start/end date. There is a seperate time value
  if (datesAreOnSameDay(event.StartTime, event.EndTime)) {
    let dateString = '';

    if (hoverCard.startdate && hoverCard.enddate) {
      dateString += `${formattedStartDate} ${formatModalTimeString(hoverCard, event)}`;
    } else {
      dateString += `${formatModalTimeString(hoverCard, event)}`;
    }

    return <div>{dateString}</div>;
  }

  // If dates are not on the same day or not an all day appointment (two seperate date and times)
  return (
    <div className='description-style'>
      {hoverCard.startdate && hoverCard.starttime ? (
        <div>{`${hoverCard.startdate ? formattedStartDate : ''} ${
          hoverCard.starttime ? getTimeFormat(event.StartTime) : ''
        }`}</div>
      ) : null}
      {hoverCard.enddate && hoverCard.endtime ? (
        <div>{`${hoverCard.enddate ? formattedEndDate : ''} ${
          hoverCard.endtime ? getTimeFormat(event.EndTime) : ''
        }`}</div>
      ) : null}
    </div>
  );
};

export const getLocalStorageSettings = (id, methodIdentity) => {
  const ls = localStorage.getItem('userCalendarSettings');
  if (ls != null) {
    let settings = [];

    // Try to parse JSON, if invalid, remove setting and return null
    try {
      settings = JSON.parse(ls);
    } catch (err) {
      localStorage.removeItem('userCalendarSettings');
      return null;
    }
    const userSettings = settings.find((e) => e.userIdentity === methodIdentity);

    if (userSettings !== null && userSettings?.calendars?.length > 0) {
      return userSettings.calendars.find((e) => e.id === id);
    }
  }
  return null;
};

// Helper function to generate storage keys for resource caching
export const getStorageKey = (viewName, resourceField) => `resources_${viewName}_${resourceField}`;

/* 
  Finds the settings for this calendar, add/update the supplied settingName with settingVal
  If localStorage is null/undefined, creates the localStorage
*/
export const setCalendarLocalStorageSetting = (userIdentity, calendarId, settingName, settingVal) => {
  const settingString = localStorage.getItem('userCalendarSettings');

  if (settingString != null) {
    const setting = JSON.parse(settingString);
    const userIndex = setting.indexOf(setting.find((e) => e?.userIdentity === userIdentity));
    const calIndex =
      userIndex !== -1
        ? setting[userIndex]?.calendars.indexOf(setting[userIndex]?.calendars.find((e) => e?.id === calendarId))
        : -1;

    if (calIndex !== -1 && userIndex !== -1) {
      // Special handling for settings update - if we're updating any settings-related value,
      // make sure it's also updated in the settings object to keep things consistent
      if (settingName === 'settings') {
        setting[userIndex].calendars[calIndex].settings = settingVal;
      } else {
        setting[userIndex].calendars[calIndex][settingName] = settingVal;
      }
    } else if (userIndex === -1) {
      setting.push({
        userIdentity,
        calendars: [
          {
            id: calendarId,
            [settingName]: settingVal,
          },
        ],
      });
    } else if (calIndex === -1) {
      setting[userIndex].calendars.push({
        id: calendarId,
        [settingName]: settingVal,
      });
    }

    localStorage.setItem('userCalendarSettings', JSON.stringify(setting));
  } else {
    localStorage.setItem(
      'userCalendarSettings',
      JSON.stringify([
        {
          userIdentity,
          calendars: [
            {
              id: calendarId,
              [settingName]: settingVal,
            },
          ],
        },
      ]),
    );
  }
};

/**
 * input color * opacity + white background = output
 * In human terms -> The more opaque the white background, the lighter the color
 * @param inputColor a HEX (6 characters) or RGB color string
 * @param opacity from 1 to 0
 * @param bgCol background color, default #fff, white
 * @returns RGB color string
 */
export const colorLighten = (inputColor, opacity) => {
  const bgCol = { r: 255, g: 255, b: 255 };
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16), // r
          parseInt(result[2], 16), // g
          parseInt(result[3], 16), // b
        ]
      : null;
  };

  // check color code type HEX or RGB
  const inputColorObj = {
    r: 0,
    g: 0,
    b: 0,
  };
  if (inputColor.indexOf('rgb(') !== -1) {
    // inputColor is RGB
    const matchColors = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;
    const match = matchColors.exec(inputColor);
    if (match !== null) {
      inputColorObj.r = Number(match[1]);
      inputColorObj.g = Number(match[2]);
      inputColorObj.b = Number(match[3]);
    }
  } else {
    // inputColor is HEX
    let inputColor2 = inputColor;
    if (inputColor.length === 4) {
      // handle short like #fff => #ffffff
      const array = inputColor.substring(1).split('');
      inputColor2 = `#${array[0] + array[0] + array[1] + array[1] + array[2] + array[2]}`;
    }
    const match = hexToRgb(inputColor2);
    if (match !== null) {
      [inputColorObj.r, inputColorObj.g, inputColorObj.b] = match;
    } else {
      return colors.white; // return white background
    }
  }
  const flattenedColor = {
    r: opacity * inputColorObj.r + (1 - opacity) * bgCol.r,
    g: opacity * inputColorObj.g + (1 - opacity) * bgCol.g,
    b: opacity * inputColorObj.b + (1 - opacity) * bgCol.b,
  };
  return `rgb(${flattenedColor.r},${flattenedColor.g},${flattenedColor.b})`;
};
// Clear all local storage settings for a specific calendar
export const clearCalendarLocalStorageSettings = (userIdentity, calendarId) => {
  const settingString = localStorage.getItem('userCalendarSettings');

  if (settingString != null) {
    try {
      const settings = JSON.parse(settingString);
      const userIndex = settings.indexOf(settings.find((e) => e?.userIdentity === userIdentity));

      if (userIndex !== -1) {
        // Filter out the specified calendar
        settings[userIndex].calendars = settings[userIndex].calendars.filter((cal) => cal.id !== calendarId);

        // If this user has no more calendars, remove the user entry
        if (settings[userIndex].calendars.length === 0) {
          settings.splice(userIndex, 1);
        }

        // If no more settings exist, remove the entry completely
        if (settings.length === 0) {
          localStorage.removeItem('userCalendarSettings');
        } else {
          localStorage.setItem('userCalendarSettings', JSON.stringify(settings));
        }
      }
    } catch (err) {
      // If there's an error parsing, just remove the entire setting
      localStorage.removeItem('userCalendarSettings');
    }
  }
};

export const applyCategoryColor = (args, currentView, isFullColorBackground) => {
  let categoryColor = args.data.CategoryColor;

  if (!args.element) {
    return;
  }

  if (!categoryColor) {
    categoryColor = colors.red; // Default color
  }

  args.element.style.backgroundColor = isFullColorBackground ? colorLighten(categoryColor, 0.2) : colors.white;

  if (currentView === 'Agenda' || currentView === 'MonthAgenda') {
    args.element.firstChild.style.borderLeftColor = categoryColor;
    args.element.style.borderRadius = '4px';
    return;
  }

  args.element.style.borderRadius = '4px';
  args.element.style.borderLeft = `6px solid ${categoryColor}`;
  args.element.style.color = colors.black;
  args.element.style.cursor = 'pointer';
};

export const convertTimeToMilitary = (time) => {
  if (time === null || time === undefined) {
    return null;
  }

  // Handle different time formats
  try {
    // First try parsing as "H:mm" format (e.g., "8:00")
    const parsed = parse(time, 'H:mm', new Date());
    if (isValid(parsed)) {
      return format(parsed, 'HH:mm');
    }
  } catch (err) {
    // Continue to next format attempt
  }

  try {
    // Try parsing as "ha" format (e.g., "8a", "8am")
    const parsed = parse(time, 'ha', new Date());
    if (isValid(parsed)) {
      return format(parsed, 'HH:mm');
    }
  } catch (err) {
    // Continue to next format attempt
  }

  try {
    // Try parsing as "h:mm a" format (e.g., "8:00 AM")
    const parsed = parse(time, 'h:mm a', new Date());
    if (isValid(parsed)) {
      return format(parsed, 'HH:mm');
    }
  } catch (err) {
    // If all parsing attempts fail, return null
    return null;
  }

  return null;
};

export const refreshCalendarToolbar = (delay) => {
  setTimeout(() => {
    const toolbar = document.querySelector('.e-schedule-toolbar');
    if (toolbar) {
      const toolbarObj = toolbar.ej2_instances[0];
      toolbarObj.refreshOverflow();
    }
  }, delay);
};
