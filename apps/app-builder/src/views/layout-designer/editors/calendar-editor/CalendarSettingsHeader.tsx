import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import SettingsHeader from '../common/components/settings-header/SettingsHeader';
import { getWidgetIconName, WidgetType } from '@m-next/layout-canvas';

interface ControlProperty {
    eventCardSelected: boolean;
    eventTitleSelected: string;
    eventDescriptionSelected: string;
    controlReferencesSelected?: boolean;
}

interface CalendarSettingsHeaderProps {
    control: { id: string, name: string, type: WidgetType };
    controlProperty: ControlProperty;
    onControlPropertySelected: (controlId: string, property: Partial<ControlProperty> | null) => void;
    onControlDuplicate?: (controlId: string) => void;
    onControlDelete?: (controlId: string) => void;
    screenData?: Record<string, unknown>;
}

const propTypes = {
    control: PropTypes.instanceOf(Object),
    controlProperty: PropTypes.instanceOf(Object),
    onControlPropertySelected: PropTypes.func,
    onControlDuplicate: PropTypes.func,
    onControlDelete: PropTypes.func,
    screenData: PropTypes.instanceOf(Object)
};

function CalendarSettingsHeader({ control, controlProperty, onControlPropertySelected, onControlDuplicate, onControlDelete, screenData }: CalendarSettingsHeaderProps) {
    const crumbs = useMemo(() => {
        const crumbList: { id: string, label: string, onClick?: () => void }[] = [];
        if (!control) return crumbList;
        crumbList.push({
            id: 'calendar-settings-crumb',
            label: control.name || 'Calendar',
            onClick: controlProperty?.eventCardSelected ? () => onControlPropertySelected(control.id, { eventCardSelected: false, eventTitleSelected: '', eventDescriptionSelected: '' }) : undefined,
        });
        
        if (controlProperty?.eventCardSelected) {
            crumbList.push({ 
                id: 'event-card-details-crumb', 
                label: 'Event card details'
            });
        }
        return crumbList;
    }, [control, controlProperty, onControlPropertySelected]);

    return (
        <SettingsHeader
            controlId={control.id}
            crumbs={crumbs}
            controlProperty={controlProperty}
            onControlPropertySelected={onControlPropertySelected}
            showDeleteIcon={true}
            showDuplicateIcon={true}
            onDelete={() => onControlDelete?.(control.id)}
            onDuplicate={() => onControlDuplicate?.(control.id)}
            screenData={screenData}
            iconName={getWidgetIconName(control.type)}
        />
    );
}

CalendarSettingsHeader.propTypes = propTypes;
export default CalendarSettingsHeader;
