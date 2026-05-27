import React from 'react';

export function findReferences(controlWidget: any, exportedFunctions: any): any[] {

    if (controlWidget === undefined || controlWidget === null) {
        return [];
    }

    const controlId = controlWidget.options.id;
    const errorList: any[] = [];
    const controls = exportedFunctions.getControls();
    const events = exportedFunctions.getEvents();
    const actionSets = exportedFunctions.getActionSets();

    // Loop through all controls on the screen
    controls.forEach((control: any) => {
        const controlEvents = control.properties.events;

        // Check to ensure we aren't checking this control
        if (control.options.id !== controlId) {
            // Only search controls that offer event properties
            const buttonIds: any[] = [];

            if (control.options.Type === 'BGR') {
                control.options.buttons.forEach((btn: any) => {
                    buttonIds.push(btn);
                });

                buttonIds.forEach(function (btn) {
                    if (btn.onClick !== null && btn.onClick !== undefined) {
                        const actions = events[btn.onClick] && actionSets[events[btn.onClick][0]] ? actionSets[events[btn.onClick][0]].Actions : [];
                        const array = findIdReferences(controlId, actions, []);

                        if (array.length > 0) {
                        errorList.push({
                            type: 'ActionSet',
                            controlName: control.options.name,
                            event: btn.caption,
                            references: array.length,
                            eventId: btn.onClick
                        });
                        }
                    }
                });
            }

            if (control.options.Type === 'CHT') {
                control.options.model.columns.forEach(function (btn: any) {
                    if (btn.onClick) {
                        buttonIds.push(btn);
                    }
                });

                buttonIds.forEach(function (btn) {
                    if (btn.onClick !== null && btn.onClick !== undefined) {
                        const actions = events[btn.onClick] && actionSets[events[btn.onClick][0]] ? actionSets[events[btn.onClick][0]].Actions : [];
                        const array = findIdReferences(controlId, actions, []);

                        if (array.length > 0) {
                            errorList.push({
                                type: 'ActionSet',
                                controlName: control.options.name,
                                event: 'Point click',
                                references: array.length,
                                eventId: btn.onClick,
                                isNested: true
                            });
                        }
                    }
                });
            }

            if (control.options.Type === 'EDT') {
                control.options.columns.forEach(function (btn: any) {
                    if (btn.onChangeEvent) {
                        buttonIds.push(btn);
                    }

                    if(btn?.defaultValue?.ValueType == 5 && btn?.defaultValue?.Value == controlId){
                        errorList.push({
                        type: 'ColumnDefaultValue',
                        controlName: control.options.name,
                        event: btn.header,
                        references: 1,
                        isNested: false
                        });
                    }
                });

                buttonIds.forEach(function (btn) {
                    if (btn.onChangeEvent !== null && btn.onChangeEvent !== undefined) {
                        const actions = events[btn.onChangeEvent] && actionSets[events[btn.onChangeEvent][0]] ? actionSets[events[btn.onChangeEvent][0]].Actions : [];
                        const array = findIdReferences(controlId, actions, []);

                        if (array.length > 0) {
                            errorList.push({
                                type: 'ActionSet',
                                controlName: control.options.name,
                                event: btn.header,
                                references: array.length,
                                eventId: btn.onChangeEvent,
                                isNested: true,
                            });
                        }
                    }
                });
            }


            if (controlEvents.length > 0) {
                controlEvents.forEach((event: any) => {
                    // If control has an event created
                    const eventId = control.options[event.func];

                    if (eventId !== null && eventId !== undefined) {
                        // Check for undefined in case screen eventID is an orphan
                        const actions = events[eventId] && actionSets[events[eventId][0]] ? actionSets[events[eventId][0]].Actions : [];
                        const array = findIdReferences(controlId, actions, []);

                        if (array.length > 0) {
                            errorList.push({
                                type: 'ActionSet',
                                controlName: control.options.name,
                                event: event.name,
                                references: array.length,
                                eventId: eventId,
                                isNested: false
                            });
                        }


                    }
                });
            }

            // check grid filters
            if (control.options.filterDef) {
                control.options.filterDef.forEach((filterDef: any) =>{
                    const expression = JSON.stringify(filterDef.expression);
                    const matches = expression.match(new RegExp(controlId, 'g'));
                    const occurrences = matches ? matches.length : 0;

                    if (occurrences > 0) {
                        if (control.options.Type === "GRD" || control.options.Type === "EDT") {
                            errorList.push({
                                type: 'Reference',
                                controlName: control.options.name,
                                event: filterDef.filterName,
                                references: occurrences,
                                isNested: false
                            });
                        } else {
                            errorList.push({
                                type: 'Reference',
                                controlName: control.options.name,
                                event: "Default Filter",
                                references: occurrences,
                                isNested: false
                            });
                        }
                    }
                });
            }

            if (control.options.viewList) {
                control.options.viewList.forEach((filterDef: any) => {
                    const expression = JSON.stringify(filterDef.filtering);
                    const matches = expression.match(new RegExp(controlId, 'g'));
                    const occurrences = matches ? matches.length : 0;

                    if (occurrences > 0) {
                        if (control.options.Type === "GRD" || control.options.Type === "EDT") {
                            errorList.push({
                                type: 'Reference',
                                controlName: control.options.name,
                                event: filterDef.name,
                                references: occurrences,
                                isNested: false
                            });
                        } else {
                            errorList.push({
                                type: 'Reference',
                                controlName: control.options.name,
                                event: "Default Filter",
                                references: occurrences,
                                isNested: false
                            });
                        }
                    }
                });
            }
        }

        // Now check if this controls action sets are being used elswhere
        if (control.options.id === controlId) {
            if (controlEvents.length > 0) {
                controlEvents.forEach((event: any) => {
                    const eventId = control.options[event.func];

                    if (eventId !== null && eventId !== undefined) {
                        // Check if this eventId is being referenced by call another action set
                        const array = isActionSetBeingCalled(events[eventId][0], exportedFunctions);

                        if (array.length > 0) {
                            array.forEach((item: any) => {
                                const exists = errorList.filter(function (element) {
                                    return element.controlName === item.controlName && element.event === item.event;
                                });

                                if (exists.length === 0) {
                                    errorList.push({
                                        type: 'ActionSet',
                                        controlName: item.controlName,
                                        event: item.event,
                                        references: event.name,
                                        eventId: item.eventId,
                                        isNested: false
                                    });
                                }
                            });
                        }
                    }
                });
            }

            if (control.options.Type === 'BGR') {
                const buttonIds: any[] = [];

                control.options.buttons.forEach((btn: any) => {
                    buttonIds.push(btn);
                });

                buttonIds.forEach(function (btn) {
                    if (btn.onClick !== null && btn.onClick !== undefined) {
                        const array = isActionSetBeingCalled(events[btn.onClick][0], exportedFunctions);

                        if (array.length > 0) {
                            array.forEach((item: any) => {
                                errorList.push({
                                type: 'ActionSet',
                                controlName: item.controlName,
                                event: item.event,
                                references: btn.caption + ': Click',
                                eventId: btn.onClick,
                                isNested: false
                                });
                            });
                        }
                    }
                });
            }
        }
    });

    // Check for screen references
    const screenErrorList = findRefOnScreen(controlId, actionSets, events, exportedFunctions.getScreenEventsFromProperties(), exportedFunctions);
    if (screenErrorList.length > 0) {
       screenErrorList.forEach((item: any) => {
            const exists = errorList.filter(function (element) {
                return element.controlName === item.controlName && element.event === item.event;
            });

            if (exists.length === 0) {
                errorList.push(item);
            }
        });

    }
    
  return errorList;
};

interface Reference {
    type: string;
    controlName: string;
    event: string;
    isNested?: boolean;
}

interface Props {
    errorList: Reference[];
}

export function handleFoundReferences({ errorList }: Props) {
    const [controlRefs, setControlRefs] = React.useState<JSX.Element[]>([]);
    const [columnRefs, setColumnRefs] = React.useState<JSX.Element[]>([]);
    const [actionSetRefs, setActionSetRefs] = React.useState<JSX.Element[]>([]);
    const [containsControls, setContainsControls] = React.useState(false);
    const [containsActions, setContainsActions] = React.useState(false);
    const [containsColumns, setContainsColumns] = React.useState(false);

    React.useEffect(() => {
        const controlRefsTemp: JSX.Element[] = [];
        const columnRefsTemp: JSX.Element[] = [];
        const actionSetRefsTemp: JSX.Element[] = [];
        let containsControlsTemp = false;
        let containsActionsTemp = false;
        let containsColumnsTemp = false;

        errorList.forEach((obj: Reference, idx: number) => {
            if (obj.type === 'ActionSet') {
                actionSetRefsTemp.push(
                    <li key={idx} data-control-name={obj.controlName} data-event={obj.event} data-is-nested={obj.isNested?.toString()}>
                        {obj.controlName} ({obj.event})
                    </li>
                );
                containsActionsTemp = true;
            } else if (obj.type === 'ColumnDefaultValue') {
                columnRefsTemp.push(
                    <li key={idx} data-control-name={obj.controlName} data-event={obj.event}>
                        {obj.controlName} ({obj.event})
                    </li>
                );
                containsColumnsTemp = true;
            } else {
                controlRefsTemp.push(
                    <li key={idx} data-control-name={obj.controlName} data-event={obj.event}>
                        {obj.controlName} ({obj.event})
                    </li>
                );
                containsControlsTemp = true;
            }
        });

        setControlRefs(controlRefsTemp);
        setColumnRefs(columnRefsTemp);
        setActionSetRefs(actionSetRefsTemp);
        setContainsControls(containsControlsTemp);
        setContainsActions(containsActionsTemp);
        setContainsColumns(containsColumnsTemp);
    }, [errorList]);

    return (
        <div>
            {containsControls && (
                <div>
                    <label>This control is being referenced in the following filter views</label>
                    <ul>{controlRefs}</ul>
                </div>
            )}
            {containsActions && (
                <div>
                    <label>This control is being referenced in the following action sets</label>
                    <ul>{actionSetRefs}</ul>
                </div>
            )}
            {containsColumns && (
                <div>
                    <label>This control is being referenced in the following columns</label>
                    <ul>{columnRefs}</ul>
                </div>
            )}
        </div>
    );
};

function findIdReferences(controlId: string, searchItem: any, array: any[]): any[] {
    if (!(searchItem instanceof Function)) {
      if (searchItem instanceof Array) {
        if (searchItem.indexOf(controlId) > -1) {
          array.push(searchItem);
        } else {
          for (let i = 0; i < searchItem.length; i++) {
            findIdReferences(controlId, searchItem[i], array);
          }
        }
      } else {
        for (const prop in searchItem) {
          if (searchItem[prop] instanceof Object || searchItem[prop] instanceof Array) {
            findIdReferences(controlId, searchItem[prop], array);
          }
          if (searchItem[prop] === controlId) {
            array.push(searchItem);
          }
        }
      }
    }

    return array;
};

function isActionSetBeingCalled(actionSetId: any, exportedFunctions: any): any[] {
    const errors: any[] = [];
    const actionSets = exportedFunctions.getActionSets();

    actionSets.forEach((set: any) => {
      const found = findIdReferences(actionSetId, set.Actions, []);

      if (found.length > 0) {
        const getControlEvent = findControlAndEvent(set.ActionSetId, exportedFunctions);

        if (getControlEvent !== null) {
            errors.push(getControlEvent);
        } else {
            const fetchedScreenEvent = findScreenEvent(set.ActionSetId, exportedFunctions);

            if (fetchedScreenEvent) errors.push(fetchedScreenEvent);
        }
      }
    });

    return errors;
}

/**
 * FindScreenEvent() loops through onload/focus/activerecord
 * to see if any of their eventId -> actionSetIds matches the input.
 * If yes, it returns the event info
 */
function findScreenEvent(actionSetId: any, exportedFunctions: any): any {
    let found = null;
    const events = exportedFunctions.getEvents();
    const screenEvents = exportedFunctions.getScreenEventsFromProperties();

    screenEvents.forEach((screenEventType: any) => {
        const eventId = exportedFunctions.getOption(screenEventType.func);

        if (eventId && events[eventId][0] === actionSetId) {
            found = {
                controlName: 'Screen',
                event: screenEventType['name'],
                eventId: eventId
            };
        }
    });

    return found;
}

function findControlAndEvent(actionSetId: any, exportedFunctions: any): any {
    const events = exportedFunctions.getEvents();
    const controls = exportedFunctions.getControls();
    let found = null;

    controls.forEach((control: any) => {
        const screenEvents = exportedFunctions.getScreenEventsFromProperties();

        if (screenEvents.length > 0) {
            screenEvents.forEach((screenEvent: any) =>{
                // If control has an event created
                const screenEventId = control.options[screenEvent.func];

                // Check if this actionSetId matches this event ID
                if (screenEventId !== null && screenEventId !== undefined && events[screenEventId] !== null && events[screenEventId] !== undefined) {
                    if (events[screenEventId][0] === actionSetId) {
                        found = {
                            controlName: control.options.name,
                            event: screenEvent.name,
                            eventId: screenEventId
                        };
                    }
                }
            });
        }

        // check EG columns
        if (control.options.Type === 'EDT' && control.options.columns) {
            control.options.columns.forEach((column: any) => {
                if (column.onChangeEvent) {
                    if (events[column.onChangeEvent][0] === actionSetId) {
                        found = {
                            controlName: control.options.name,
                            event: column.header,
                            eventId: column.onChangeEvent
                        };
                    }
                }
            });
        }

        if (control.options.Type === 'BGR' && control.options.buttons) {
            control.options.buttons.forEach((button: any) => {
                if (button.onClick) {
                    if (events[button.onClick][0] === actionSetId) {
                        found = {
                            controlName: control.options.name,
                            event: button.caption,
                            eventId: button.onClick
                        };
                    }
                }
            });
        }
    });

    return found;
}

/**
 * findRefOnScreen() looks through the list of available Screen events
 * and returns an array of "Reference" errors
 * if the target control is referenced on the Screen
 */
function findRefOnScreen(controlId: any, actionSets: any, events: any, screenEvents: any, exportedFunctions: any): any[] {
    // default list of available events on Screen
    const errors = [];

    // loop through events available on Screen widget
    for (let i = 0; i < screenEvents.length; i++) {
        // event name
        const event = screenEvents[i]['func'];

        // is that screen event used or null
        if (events[exportedFunctions.getOption[event]]) {
            // Do screen events reference our target widget's id(controlId)?
            // Create a new error object for it result not empty
            const idRefResult = findIdReferences(controlId, actionSets[events[exportedFunctions.getOption[event]]].Actions, []);

            if (idRefResult.length > 0) {
                errors.push({
                    type: 'ActionSet',
                    controlName: 'Screen',
                    event: screenEvents[i]['name'],
                    references: idRefResult.length
                });
            }
        }
    }
    return errors;
  }
