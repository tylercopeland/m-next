# Calendar

_Calendar is an implementation of SyncFusion's Scheduler component. It should have no runtime dependencies and can be used on system pages if/when required._

_This readme file is currently a stub. It will be expanded upon as we implement the component._

### Example

```js
import Calendar from 'shared/calendar';

<Calendar
  onAddEvent={options?.onAddEvent}
  eventCardMenu={options?.eventCardMenu}
  onSelectEvent={options?.onSelectEvent}
  onDragMoveEvent={options?.onDragMoveEvent}
  updateControlProps={(p) => updateControlProps(p)}
  isMobile={isMobile}
  startTime={convertTimeToMilitary(control.timeRange.startTime)}
  endTime={convertTimeToMilitary(control.timeRange.endTime)}
  resourceMappedField='AssignedToId'
  resourceLabel={columnName}
  resources={resources?.data ?? []}
  defaultResource={options?.defaultResource === 'Session.Username' ? String(userId) : null}
  data={activityData.data}
/>;
```

<br>
<br>

### Props

Basic props:

- **id** : `string` | optional
  <br>

**onAddEvent**

- `Function` | Optional
- Function to be called upon clicking on the 'Add New' button.
  <br>

**eventCardMenu**

- `Array` | Optional
- Array of actions used in the event card footer button
  <br>

**onSelectEvent**

- `Function` | Optional
- Function to be called upon selecting one or more empty cells.
  <br>

**onDragMoveEvent**

- `Function` | Optional
- Function to be called upon editing an existing event (ex. drag/drop or resizing).
  <br>

**updateControlProps**

- `Function` | Optional
- Function to be called when viewing the information on an event. This should update the control properties to reflect the selected event.
  <br>

**isMobile**

- `Boolean` | Optional
- Hides the lefthand column to match mobile styling.
  <br>

**startTime**

- `String` | Optional
- The start time cutoff for visible events.
  <br>

**endTime**

- `String` | Optional
- The end time cutoff for visible events.
  <br>

**resourceMappedField**

- `String` | Optional
- The event field that corresponds to the resource.
  <br>

**resourceLabel**

- `String` | Optional
- The field that should be used to label the resource.
  <br>

**resources**

- `Array` | Optional
- A list of resources that the calendar can be filtered by.
  <br>

**defaultResource**

- `String` | Optional
- A default resource value to be set when first loading the calendar.
  <br>

**data**

- `Array` | Optional
- A list of event data to be displayed on the calendar.
  <br>

<br>
