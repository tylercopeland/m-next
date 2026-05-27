import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BaseControl } from '@m-next/runtime-interface';
import { Text, TextLine } from '@m-next/typeography';
import styled from '@emotion/styled';
import { colors } from '@m-next/styles';
import { openActionEditor } from '@m-next/action-editor';
import Accordion from '../../../../../components/accordion/Accordion'; 
import { selectControls, selectScreenProperties, controlSelected } from '../../../../../common/services/screenLayoutSlice';
import * as s from '../BlockEditor.styles';
import { findControlReferences, Reference } from './control-references-utils';

// Helper function to focus and scroll to an element by ID
const focusElementById = (id: string, delay: number = 300) => {
    setTimeout(() => {
        const element = document.getElementById(id);
        
        if (element) {
            element.focus();
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, delay);
};

const ListWrapper = styled.div({
    border: `1px solid ${colors['grey-light']}`,
    borderRadius: '4px', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
});

const ReferenceWrapper = styled.div(({ index }: { index: number }) => [
    {
        cursor: 'pointer',
        display: 'flex',
        padding: '8px',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
        borderTop: index !== 0 ? `1px solid ${colors['grey-light']}` : 'none',
        justifyContent: 'space-between',
        '& *': {
            cursor: 'inherit',
        },
    },
]);

interface ControlReferencesProps {
    control: BaseControl;
     
    screenData: Record<string, unknown>;
}

function ControlReferences({ control, screenData }: ControlReferencesProps) {
    const dispatch = useDispatch();
     
    const controlList = useSelector(selectControls) as Record<string, Record<string, unknown>>;
    const screenProperties = useSelector(selectScreenProperties);
    const [events, setEvents] = useState<Reference[]>([]);
    const [filters, setFilters] = useState<Reference[]>([]);
    const [defaultValues, setDefaultValues] = useState<Reference[]>([]);

    // Create a memoized version of control references that updates when dependencies change
    const controlReferences = useMemo(() => {
        if (!control) {
            return { events: [], filters: [], defaultValues: [] };
        }
        return findControlReferences(control, controlList, screenData, screenProperties);
    }, [control, controlList, screenProperties, screenData]);

    useEffect(() => {
        setEvents(controlReferences.events);
        setFilters(controlReferences.filters);
        setDefaultValues(controlReferences.defaultValues);
    }, [controlReferences]);

    const handleEventClick = (ref: Reference) => {
        openActionEditor(ref.controlName === 'Screen' ? ref.controlName : { options: ref.control }, ref.event, control.name, control.id);
    };

    return (
        <s.Wrapper padding={16}>
            <TextLine>This control is referenced in the following events and views.</TextLine>
            <Accordion 
                id='events' 
                caption='Events'
                variant='left' 
                open borderless
            >
                <TextLine>This control is referenced in the following events.</TextLine>
                <ListWrapper>
                    {events.length > 0 ? 
                    events.map((ref, index) => (
                        <ReferenceWrapper key={ref.controlName + ref.event} index={index} onClick={() => handleEventClick(ref)}>
                            <Text bold>{ref.controlName}</Text>
                            <Text>{`${ref.eventLabel  } event`}</Text>
                        </ReferenceWrapper>
                    ))
                : <div style={{ padding: '16px' }}>No events being referenced</div>}
                </ListWrapper>
            </Accordion>
            <s.SettingDivider/>
            <Accordion 
                id='filters' 
                caption='Filters' 
                variant='left' 
                open borderless
            >
                <TextLine>This control is referenced in the following filters.</TextLine>
                <ListWrapper>
                    {filters.length > 0 ? 
                    filters.map((ref, index) => (
                        <ReferenceWrapper key={ref.controlName + ref.event} index={index} onClick={() => {
                            const controlId = ref.control?.id || '';
                            if (ref.control?.type === 'EDT') {
                                if (ref.columnName) {
                                    dispatch(controlSelected({ controlId, property: { selectedColumn: ref.columnName, selectedChildColumn: null } }));
                                } else {
                                    dispatch(controlSelected({ controlId, property: { selectedView: ref.selectedView } }));
                                }
                            } else {
                                dispatch(controlSelected({ controlId }));
                            }

                            // Focus the filter input after a short delay to allow the editor to render
                            focusElementById('accordion-header-filter');
                        }}>
                            <Text bold>{ref.controlName}</Text>
                            <Text>{ref.eventLabel}</Text>
                        </ReferenceWrapper>
                    ))
                : <div style={{ padding: '16px' }}>No filters being referenced</div>}
                </ListWrapper>
            </Accordion>
            <s.SettingDivider/>
            <Accordion 
                id='default-values'
                caption='Default values'
                variant='left'
                open borderless
            >
                <TextLine>This control is referenced in the following default values.</TextLine>
                <ListWrapper>
                    {defaultValues.length > 0 ? 
                    defaultValues.map((ref, index) => (
                        <ReferenceWrapper key={ref.controlName + ref.event} index={index} onClick={() => {
                            const controlId = ref.control?.id || '';
                            if (ref.control?.type === 'EDT' && ref.columnName) {
                                dispatch(controlSelected({ controlId, property: { selectedColumn: ref.columnName, selectedChildColumn: null } }));
                            } else {
                                dispatch(controlSelected({ controlId }));
                            }

                            // Focus the default value input after a short delay to allow the editor to render
                            const id = `default-value-${controlId}-value-value-dropdown-list-input`;
                            focusElementById(id);
                        }}>
                            <Text bold>{ref.controlName}</Text>
                            {ref.columnName && <Text>{ref.eventLabel}</Text>}
                        </ReferenceWrapper>
                    ))
                : <div style={{ padding: '16px' }}>No default values being referenced</div>}
                </ListWrapper>
            </Accordion>
        </s.Wrapper>
    );
}

export default ControlReferences;
