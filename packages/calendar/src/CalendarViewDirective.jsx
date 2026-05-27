import React from 'react';
import { ViewDirective, ViewsDirective } from '@syncfusion/ej2-react-schedule';
import { MobileLargeEventTemplate, SmallEventTemplate, LargeEventTemplate, MonthEventTemplate } from './eventTemplates';

const viewsDirectives = (isMobile, displayViews, compactEventTime, currentView) => {
  const monthEventTemplate = (eventProps) => <MonthEventTemplate eventProps={eventProps} />;
  const smallEventTemplate = (eventProps) => <SmallEventTemplate eventProps={eventProps} />;
  const largeEventTemplate = (eventProps) =>
    isMobile ? (
      <MobileLargeEventTemplate eventProps={eventProps} compactEventTime={compactEventTime} />
    ) : (
      <LargeEventTemplate eventProps={eventProps} />
    );

  const group = { byDate: true, resources: ['Resources'] };

  if (displayViews == null) {
    if (isMobile) {
      return (
        <ViewsDirective>
          <ViewDirective
            option='Day'
            displayName='Day'
            isSelected={currentView === 'Day'}
            eventTemplate={(p) => largeEventTemplate(p)}
          />
          <ViewDirective
            option='Week'
            displayName='Week'
            isSelected={currentView === 'Week'}
            eventTemplate={(p) => largeEventTemplate(p)}
          />
          <ViewDirective
            option='Month'
            displayName='Month'
            isSelected={currentView === 'Month'}
            eventTemplate={(p) => monthEventTemplate(p)}
          />
          <ViewDirective
            option='Day'
            displayName='Day Vertical'
            group={group}
            isSelected={currentView === 'DayVertical'}
            eventTemplate={(p) => largeEventTemplate(p)}
          />
          <ViewDirective
            option='TimelineDay'
            displayName='Day Horizontal'
            isSelected={currentView === 'DayHorizontal'}
            group={group}
            eventTemplate={(p) => smallEventTemplate(p)}
          />
          <ViewDirective
            option='Week'
            displayName='Week Vertical'
            group={group}
            isSelected={currentView === 'WeekVertical'}
            eventTemplate={(p) => largeEventTemplate(p)}
          />
        </ViewsDirective>
      );
    }
    return (
      <ViewsDirective>
        <ViewDirective
          option='Day'
          displayName='Day'
          isSelected={currentView === 'Day'}
          eventTemplate={(p) => largeEventTemplate(p)}
        />
        <ViewDirective
          option='Week'
          displayName='Week'
          isSelected={currentView === 'Week'}
          eventTemplate={(p) => largeEventTemplate(p)}
        />
        <ViewDirective
          option='Month'
          displayName='Month'
          isSelected={currentView === 'Month'}
          eventTemplate={(p) => monthEventTemplate(p)}
        />
        <ViewDirective
          option='Day'
          displayName='Day Vertical'
          isSelected={currentView === 'DayVertical'}
          group={group}
          eventTemplate={(p) => largeEventTemplate(p)}
        />
        <ViewDirective
          option='TimelineDay'
          displayName='Day Horizontal'
          isSelected={currentView === 'DayHorizontal'}
          group={group}
          eventTemplate={(p) => smallEventTemplate(p)}
        />
        <ViewDirective
          option='Week'
          displayName='Week Vertical'
          isSelected={currentView === 'WeekVertical'}
          group={group}
          eventTemplate={(p) => largeEventTemplate(p)}
        />
        <ViewDirective
          option='TimelineWeek'
          displayName='Week Horizontal'
          isSelected={currentView === 'WeekHorizontal'}
          group={group}
          eventTemplate={(p) => smallEventTemplate(p)}
        />
        <ViewDirective
          option='Agenda'
          displayName='List Week'
          isSelected={currentView === 'ListWeek'}
          allowVirtualScrolling={false}
          eventTemplate={(p) => smallEventTemplate(p)}
        />
        <ViewDirective
          option='MonthAgenda'
          displayName='List Month'
          isSelected={currentView === 'ListFull'}
          eventTemplate={(p) => smallEventTemplate(p)}
        />
      </ViewsDirective>
    );
  }

  return (
    <ViewsDirective>
      {displayViews.day.visible && displayViews.day.standard && (
        <ViewDirective
          option='Day'
          displayName='Day'
          isSelected={currentView === 'Day'}
          eventTemplate={(p) => largeEventTemplate(p)}
        />
      )}

      {displayViews.week.visible && displayViews.week.standard && (
        <ViewDirective
          option='Week'
          displayName='Week'
          isSelected={currentView === 'Week'}
          eventTemplate={(p) => largeEventTemplate(p)}
        />
      )}

      {displayViews.month.visible && displayViews.month.standard && (
        <ViewDirective
          option='Month'
          displayName='Month'
          isSelected={currentView === 'Month'}
          eventTemplate={(p) => monthEventTemplate(p)}
        />
      )}

      {displayViews.day.visible && displayViews.day.vertical && (
        <ViewDirective
          option='Day'
          displayName='Day Vertical'
          group={group}
          isSelected={currentView === 'DayVertical'}
          eventTemplate={(p) => largeEventTemplate(p)}
        />
      )}
      {displayViews.day.visible && displayViews.day.horizontal && !isMobile && (
        <ViewDirective
          option='TimelineDay'
          displayName='Day Horizontal'
          isSelected={currentView === 'DayHorizontal'}
          group={group}
          eventTemplate={(p) => smallEventTemplate(p)}
        />
      )}

      {displayViews.week.visible && displayViews.week.vertical && (
        <ViewDirective
          option='Week'
          displayName='Week Vertical'
          group={group}
          isSelected={currentView === 'WeekVertical'}
          eventTemplate={(p) => largeEventTemplate(p)}
        />
      )}

      {displayViews.week.visible && displayViews.week.horizontal && !isMobile && (
        <ViewDirective
          option='TimelineWeek'
          displayName='Week Horizontal'
          isSelected={currentView === 'WeekHorizontal'}
          group={group}
          eventTemplate={(p) => smallEventTemplate(p)}
        />
      )}

      {displayViews.list.visible && displayViews.list.weekly && !isMobile && (
        <ViewDirective
          option='Agenda'
          displayName='List Week'
          isSelected={currentView === 'ListWeek'}
          allowVirtualScrolling={false}
          eventTemplate={(p) => smallEventTemplate(p)}
        />
      )}

      {displayViews.list.visible && displayViews.list.full && !isMobile && (
        <ViewDirective
          option='MonthAgenda'
          displayName='List Month'
          isSelected={currentView === 'ListFull'}
          eventTemplate={(p) => smallEventTemplate(p)}
        />
      )}
    </ViewsDirective>
  );
};

export default viewsDirectives;
