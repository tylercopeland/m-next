import React, { useMemo, useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Popper } from '@mui/material';
import { ClickOutside } from '@m-next/utilities';
import Container from '@m-next/container';
import { colors } from '@m-next/styles';
import { Text } from '@m-next/typeography';
import Button from '@m-next/button';
import { useSelector } from 'react-redux';
import Dropdown from '@m-next/dropdown';
import type { DropdownOption } from '@m-next/dropdown';
import * as s from '../common/BlockEditor.styles';
import { selectAccountName } from '../../../../common/services/sessionSlice';
import type { CalendarControl, WaitlistData } from './calendar-types';
import { useGetStatusesQuery } from '../../../../common/services/calendarApi';

interface WaitlistTabEditorProps {
    id: string | number;
    onCancel: () => void;
    onClose: (waitlist: WaitlistData) => void;    
    anchorEl: HTMLElement | null;
    open: boolean;
    control: CalendarControl;
}

const HeaderWrapper = styled.div(() => [
    {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 8,
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

function WaitlistTabEditor({
    id,
    onCancel,
    onClose,
    open,
    anchorEl,
    control,
}: WaitlistTabEditorProps): JSX.Element {
    const [hasWaitlistChanges, setHasWaitlistChanges] = useState<boolean>(false);
    const [fromStatus, setFromStatus] = useState<DropdownOption>({label: '', value: ''});
    const [toStatus, setToStatus] = useState<DropdownOption>({label: '', value: ''});
  
    const accountName = useSelector(selectAccountName);

    const { data: statuses } = useGetStatusesQuery(
        {
            accountName
        },
        { skip: !accountName },
    );

    const formattedStatuses = useMemo(() => {
        if (statuses) {
            return Object.values(statuses).map((status) => ({
                label: status as string,
                value: status as string,
            }));
        }
        return [];
    }, [statuses]);

    useEffect(() => {
        if (formattedStatuses) {
            setFromStatus(formattedStatuses.find((status: DropdownOption) => status.value === control.model.fromWaitlistStatus)!);
            setToStatus(formattedStatuses.find((status: DropdownOption) => status.value === control.model.toWaitlistStatus)!);
        }
        setHasWaitlistChanges(false);
    }, [formattedStatuses, control.model.fromWaitlistStatus, control.model.toWaitlistStatus]);

    const parent = useRef<HTMLDivElement>(null);

    const handleCancel = (): void => {
        if (formattedStatuses) {
            setFromStatus(formattedStatuses.find((status: DropdownOption) => status.value === control.model.fromWaitlistStatus)!);
            setToStatus(formattedStatuses.find((status: DropdownOption) => status.value === control.model.toWaitlistStatus)!);
        }
        setHasWaitlistChanges(false);
        onCancel();
    };

    const handleFromStatusChange = (status: DropdownOption) => {
        setFromStatus(status);
        setHasWaitlistChanges(true);
    };

    const handleToStatusChange = (status: DropdownOption) => {
        setToStatus(status);
        setHasWaitlistChanges(true);
    };

    return (
        <Popper
            id={`${id}-quick-editor`}
            ref={parent}
            open={open}
            anchorEl={anchorEl}
            placement='left-start'
            style={{ zIndex: 200 }}
            modifiers={[
                {
                    name: 'offset',
                    options: {
                        offset: [50, 8],
                    },
                },
            ]}
            role='none'
        >
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
                            <Text id={`${id}-quick-editor-title`} bold>Wait list tab</Text>
                        </HeaderWrapper>
                        <s.LineWrapper gap={12}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Text>
                                    Wait list <span style={{ fontFamily: 'monospace' }}>→</span> Calendar
                                </Text>
                                <Text style={{ fontSize: 12 }}>(Default status)</Text>
                            </div>
                            <Dropdown
                                id='table'
                                value={fromStatus}
                                options={formattedStatuses}
                                onChange={handleFromStatusChange}
                                width={160}
                                isV4Design
                                required
                            />
                        </s.LineWrapper>
                        <s.LineWrapper gap={12}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Text>
                                    Calendar <span style={{ fontFamily: 'monospace' }}>→</span> Wait list
                                </Text>
                                <Text style={{ fontSize: 12 }}>(Default status)</Text>
                            </div>
                            <Dropdown
                                id='table'
                                value={toStatus}
                                options={formattedStatuses}
                                onChange={handleToStatusChange}
                                width={160}
                                isV4Design
                                required
                            />
                        </s.LineWrapper>
                    </Container>
                    <ButtonFooter>
                        <Button id='cancel' buttonStyle='plain' onClick={handleCancel} value='Cancel' color={colors.blue}/>
                        <Button
                            id='apply'
                            buttonStyle='primary'
                            onClick={() => onClose({
                                fromWaitlistStatus: fromStatus.value as string,
                                toWaitlistStatus: toStatus.value as string,
                            })}
                            value='Apply'
                            disabled={!hasWaitlistChanges}
                        />
                    </ButtonFooter>
                </Container>
            </ClickOutside>
        </Popper>
    );
}

export default WaitlistTabEditor;