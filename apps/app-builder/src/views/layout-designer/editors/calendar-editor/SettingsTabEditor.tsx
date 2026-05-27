import React, { useRef, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import styled from '@emotion/styled';
import { Popper } from '@mui/material';
import { ClickOutside } from '@m-next/utilities';
import Container from '@m-next/container';
import { colors } from '@m-next/styles';
import { Text } from '@m-next/typeography';
import Button from '@m-next/button';
import Toggle from '@m-next/toggle';
import Dropdown from '@m-next/dropdown';
import type { DropdownOption } from '@m-next/dropdown';
import CalendarDaysToggle from '@m-next/calendar/src/calendarMenu/CalendarDaysToggle';
import { Z_POPUP } from '@m-next/layout-canvas';
import * as s from '../common/BlockEditor.styles';
import type { CalendarControl, SettingsData } from './calendar-types';

interface SettingsTabEditorProps {
  id: string | number;
  onClose: (settings: SettingsData) => void;
  onCancel: () => void;
  anchorEl: HTMLElement | null;
  open: boolean;
  control: CalendarControl;
}

const HeaderWrapper = styled.div(() => [
  {
    display: 'flex',
    justifyContent: 'space-between',
  },
]);

const ButtonFooter = styled.div(() => [
  {
    display: 'flex',
    gap: 8,
    paddingTop: 8,
    justifyContent: 'flex-end',
  },
]);

const timeOptions: DropdownOption[] = [
  { value: '12am', label: '12:00 AM' },
  { value: '1am', label: '1:00 AM' },
  { value: '2am', label: '2:00 AM' },
  { value: '3am', label: '3:00 AM' },
  { value: '4am', label: '4:00 AM' },
  { value: '5am', label: '5:00 AM' },
  { value: '6am', label: '6:00 AM' },
  { value: '7am', label: '7:00 AM' },
  { value: '8am', label: '8:00 AM' },
  { value: '9am', label: '9:00 AM' },
  { value: '10am', label: '10:00 AM' },
  { value: '11am', label: '11:00 AM' },
  { value: '12pm', label: '12:00 PM' },
  { value: '1pm', label: '1:00 PM' },
  { value: '2pm', label: '2:00 PM' },
  { value: '3pm', label: '3:00 PM' },
  { value: '4pm', label: '4:00 PM' },
  { value: '5pm', label: '5:00 PM' },
  { value: '6pm', label: '6:00 PM' },
  { value: '7pm', label: '7:00 PM' },
  { value: '8pm', label: '8:00 PM' },
  { value: '9pm', label: '9:00 PM' },
  { value: '10pm', label: '10:00 PM' },
  { value: '11pm', label: '11:00 PM' },
];

function SettingsTabEditor({ id, onClose, onCancel, open, anchorEl, control }: SettingsTabEditorProps): JSX.Element {
  const [hasSettingsChanges, setHasSettingsChanges] = useState<boolean>(false);
  const [showAllDayEventsOnTop, setShowAllDayEventsOnTop] = useState<boolean>(false);
  const [showInactiveResources, setShowInactiveResources] = useState<boolean>(false);
  const [coloredEventBackgrounds, setColoredEventBackgrounds] = useState<boolean>(false);
  const [workingHoursStart, setWorkingHoursStart] = useState<DropdownOption>({ label: '', value: '' });
  const [workingHoursEnd, setWorkingHoursEnd] = useState<DropdownOption>({ label: '', value: '' });
  const [selectedWorkingDays, setSelectedWorkingDays] = useState<boolean[]>(Array(7).fill(true));

  const parent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with current control settings
    setShowAllDayEventsOnTop(control.displayOptions?.showAllDayEventsOnTop ?? false);
    setShowInactiveResources(control.displayOptions?.showInactiveResources ?? false);
    setColoredEventBackgrounds(control.displayOptions?.coloredEventBackgrounds ?? false);

    const startTime = control.displayOptions?.workingHours?.start ?? '8am';
    const endTime = control.displayOptions?.workingHours?.end ?? '5pm';

    const startOption = timeOptions.find((option) => option.value === startTime);
    const endOption = timeOptions.find((option) => option.value === endTime);

    if (startOption) setWorkingHoursStart(startOption);
    if (endOption) setWorkingHoursEnd(endOption);

    const workingDays = control.displayOptions?.workingHours?.days ?? [1, 2, 3, 4, 5]; // Default to Mon-Fri
    // Create a boolean array of length 7 (Sun-Sat), set true for indices in workingDays
    const workingDaysBoolArray = Array(7).fill(false);
    workingDays.forEach((dayIdx: number) => {
      if (dayIdx >= 0 && dayIdx < 7) {
        workingDaysBoolArray[dayIdx] = true;
      }
    });
    setSelectedWorkingDays(workingDaysBoolArray);

    setHasSettingsChanges(false);
  }, [control.displayOptions]);

  const handleCancel = (): void => {
    // Reset to original values
    setShowAllDayEventsOnTop(control.displayOptions?.showAllDayEventsOnTop ?? false);
    setShowInactiveResources(control.displayOptions?.showInactiveResources ?? false);
    setColoredEventBackgrounds(control.displayOptions?.coloredEventBackgrounds ?? false);

    const startTime = control.displayOptions?.workingHours?.start ?? '8am';
    const endTime = control.displayOptions?.workingHours?.end ?? '5pm';

    const startOption = timeOptions.find((option) => option.value === startTime);
    const endOption = timeOptions.find((option) => option.value === endTime);

    if (startOption) setWorkingHoursStart(startOption);
    if (endOption) setWorkingHoursEnd(endOption);

    const workingDays = control.displayOptions?.workingHours?.days ?? [1, 2, 3, 4, 5];
    const workingDaysBoolArray = Array(7).fill(false);
    workingDays.forEach((dayIdx: number) => {
      if (dayIdx >= 0 && dayIdx < 7) {
        workingDaysBoolArray[dayIdx] = true;
      }
    });
    setSelectedWorkingDays(workingDaysBoolArray);

    setHasSettingsChanges(false);
    onCancel();
  };

  const handleToggleChange = (property: string, checked: boolean) => {
    switch (property) {
      case 'showAllDayEventsOnTop':
        setShowAllDayEventsOnTop(checked);
        break;
      case 'showInactiveResources':
        setShowInactiveResources(checked);
        break;
      case 'coloredEventBackgrounds':
        setColoredEventBackgrounds(checked);
        break;
    }
    setHasSettingsChanges(true);
  };

  const handleWorkingHoursStartChange = (option: DropdownOption) => {
    setWorkingHoursStart(option);
    setHasSettingsChanges(true);
  };

  const handleWorkingHoursEndChange = (option: DropdownOption) => {
    setWorkingHoursEnd(option);
    setHasSettingsChanges(true);
  };

  const handleWorkingDaysChange = (options: boolean[]) => {
    setSelectedWorkingDays(options);
    setHasSettingsChanges(true);
  };

  return (
    <Popper
      id={`${id}-settings-editor`}
      ref={parent}
      open={open}
      anchorEl={anchorEl}
      placement='left-start'
      style={{ zIndex: 200, paddingBottom: 16 }}
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [92, 8],
          },
        },
        {
          name: 'flip',
          options: {
            fallbackPlacements: [],
          },
        },
      ]}
      role='none'
    >
      <Tooltip id='editor-tooltip' opacity={1} style={{ zIndex: Z_POPUP.TOOLTIP, maxWidth: '240px', wordBreak: 'break-word' }} />

      <ClickOutside onClickOutsideHandler={handleCancel} parentRef={parent}>
        <Container
          width={320}
          borderless
          style={{
            padding: 16,
            borderRadius: 4,
            border: ` 1px solid ${colors['grey-light']}`,
            background: colors.white,
            boxShadow: '0px 10px 10px 0px rgba(0, 0, 0, 0.25)',
            gap: 16,
          }}
        >
          <Container style={{ gap: 16, padding: 0 }}>
            <HeaderWrapper>
              <Text id={`${id}-settings-editor-title`} bold>
                Settings Tab
              </Text>
            </HeaderWrapper>
            <s.LineWrapper>
              <Text style={{ flexGrow: 1 }}>All day events on top</Text>
              <Toggle
                id='show-all-day-events-on-top'
                checked={showAllDayEventsOnTop}
                onChange={(checked) => handleToggleChange('showAllDayEventsOnTop', checked)}
              />
            </s.LineWrapper>

            <s.LineWrapper>
              <Text style={{ flexGrow: 1 }}>Show inactive resources</Text>
              <Toggle
                id='show-inactive-resources'
                checked={showInactiveResources}
                onChange={(checked) => handleToggleChange('showInactiveResources', checked)}
              />
            </s.LineWrapper>

            <s.LineWrapper>
              <Text style={{ flexGrow: 1 }}>Color event background</Text>
              <Toggle
                id='colored-event-backgrounds'
                checked={coloredEventBackgrounds}
                onChange={(checked) => handleToggleChange('coloredEventBackgrounds', checked)}
              />
            </s.LineWrapper>

            <div>
              <CalendarDaysToggle
                calendarDays={selectedWorkingDays}
                setCalendarDays={handleWorkingDaysChange}
                isMobile={false}
                disabled={false}
                label='Default work days'
                styles={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
                useTextLabel
              />
            </div>

            <s.LineWrapper style={{ gap: 8 }}>
              <Text style={{ flexGrow: 1 }}>Default workday start time</Text>
              <Dropdown
                id='working-hours-start'
                value={workingHoursStart}
                options={timeOptions}
                onChange={handleWorkingHoursStartChange}
                width={120}
                isV4Design
              />
            </s.LineWrapper>

            <s.LineWrapper style={{ gap: 8 }}>
              <Text style={{ flexGrow: 1 }}>Default workday end time</Text>
              <Dropdown
                id='working-hours-end'
                value={workingHoursEnd}
                options={timeOptions}
                onChange={handleWorkingHoursEndChange}
                width={120}
                isV4Design
              />
            </s.LineWrapper>
          </Container>
          <ButtonFooter>
            <Button id='cancel' buttonStyle='plain' onClick={handleCancel} value='Cancel' color={colors.blue} />
            <Button
              id='apply'
              buttonStyle='primary'
              onClick={() =>
                onClose({
                  showAllDayEventsOnTop,
                  showInactiveResources,
                  coloredEventBackgrounds,
                  workingHours: {
                    start: workingHoursStart.value as string,
                    end: workingHoursEnd.value as string,
                    days: selectedWorkingDays
                      .map((day, index) => (day ? index : null))
                      .filter((day): day is number => day !== null),
                  },
                })
              }
              value='Apply'
              disabled={!hasSettingsChanges}
            />
          </ButtonFooter>
        </Container>
      </ClickOutside>
      <Tooltip id='popover-tooltip' />
    </Popper>
  );
}

export default SettingsTabEditor;
