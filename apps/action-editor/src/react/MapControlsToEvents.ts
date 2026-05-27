const controlEvents = {
    onAccept: { name: "Accept", func: "onAccept" },
    onActiveRowChange: { name: "Row Click", func: "onActiveRowChange" },
    onAddEvent: { name: "Add Event", func: "onAddEvent" },
    onBlur: { name: 'Lose Focus', func: 'onBlur' },
    onCancel: { name: "Cancel", func: "onCancel" },
    onChange: { name: 'Change', func: 'onChange' },
    onClick: { name: 'Click', func: 'onClick' },
    onCustomRowClick: { name: "Custom Row Click", func: "onCustomRowClick" },
    onDragMoveEvent: { name: "Drag Move Event", func: "onDragMoveEvent" },
    onFocus: { name: 'Focus', func: 'onFocus' },
    onLoad: { name: "Load", func: "onLoad" },
    onSelectEvent: { name: "Selection", func: "onSelectEvent" }
}


export function GrabControlEvents(controlType: string): { name: string; func: string; }[] {
    const events = [];

    if (['SIG'].includes(controlType)) events.push(controlEvents.onAccept);
    if (['EDT', 'EGRD', 'GRD'].includes(controlType)) events.push(controlEvents.onActiveRowChange);
    if (['CAL'].includes(controlType)) events.push(controlEvents.onAddEvent);
    if (['ADR', 'DRP', 'HTM', 'SIG', 'TXA', 'TXT'].includes(controlType)) events.push(controlEvents.onBlur);
    if (['SIG'].includes(controlType)) events.push(controlEvents.onCancel);
    if (['ADR', 'CHK', 'DTP', 'DRP', 'HTM', 'RAD', 'SIG', 'TXA', 'TXT', 'TGL'].includes(controlType)) events.push(controlEvents.onChange);
    if (['BTN', 'FIL', 'GAL', 'HTM', 'ICO', 'PIC', 'LBL'].includes(controlType)) events.push(controlEvents.onClick);
    if (['DRP'].includes(controlType)) events.push(controlEvents.onCustomRowClick);
    if (['CAL'].includes(controlType)) events.push(controlEvents.onDragMoveEvent);
    if (['ADR', 'DRP', 'HTM', 'SIG', 'TXA', 'TXT'].includes(controlType)) events.push(controlEvents.onFocus);
    if (['EGRD', 'GRD'].includes(controlType)) events.push(controlEvents.onLoad);
    if (['CAL'].includes(controlType)) events.push(controlEvents.onSelectEvent);

    return events;
}