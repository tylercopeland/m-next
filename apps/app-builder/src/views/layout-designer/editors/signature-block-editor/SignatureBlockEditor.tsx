import React, { useMemo } from 'react';
import { Tooltip } from "react-tooltip";
import TextLine from '@m-next/typeography';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import Toggle from '@m-next/toggle';
import { BaseControl, ValidationRuleTypes } from '@m-next/runtime-interface';
import { Guid } from '@m-next/utilities';
import { Z_POPUP } from '@m-next/layout-canvas';
import Accordion from '../../../../components/accordion/Accordion';
import * as s from '../common/BlockEditor.styles';
import CaptionInput from '../common/components/caption-input/CaptionInput';
import EditorInput from '../common/components/editor-input/EditorInput';
import DefaultStateSelector from '../common/components/default-state-selector/DefaultStateSelector';
import ValidationRulesList, { ValidationRuleValue } from '../common/components/validation-rules-list/ValidationRulesList';
import SingleAction from '../common/components/action-list-section/SingleAction';

interface SignatureControl extends BaseControl {
    id: string;
    caption: string;
    name: string;
    hideCaption: boolean;
    hideCancel: boolean;
    acceptCaption: string;
    cancelCaption: string;
    onAccept: string;
    onCancel: string;
    validationRules: ValidationRuleValue[];
}

interface SignatureBlockEditorProps {
    control: SignatureControl;
    onChange: (control: SignatureControl) => void;
    onAddAction: (control: SignatureControl, eventName: string) => void;
}

function SignatureBlockEditor({ control, onChange, onAddAction }: SignatureBlockEditorProps) {

    const acceptEvent = useMemo(() => {
        if(control.onAccept){
            return { id: control.onAccept, value: 'Accept', label: 'Accept event' };
        }
        return undefined;
    }, [control.onAccept]);

    const cancelEvent = useMemo(() => {
        if(control.onCancel){
            return { id: control.onCancel, value: 'Cancel', label: 'Cancel event' };
        }
        return undefined;
    }, [control.onCancel]);

    const validationRules = useMemo(() =>
        (control.validationRules || []).filter((validationRule) =>
            (validationRule.rule === ValidationRuleTypes.Required) || (validationRule.rule === ValidationRuleTypes.MaliciousValues)),
    [control.validationRules])

    const handleLabelChange = (value: string, name: string) => {
        if (value) {
            const updatedControl = { ...control };
            updatedControl.caption = value;
            updatedControl.name = name;
            onChange(updatedControl);
        }
    };

    const handlePropertyChange = (property: string, value: string | boolean) => {
        const updated = { ...control, [property]: value };
        onChange(updated);
    };

    const handleAddAction = (property: string, eventName: string) => {
        const updated = { ...control, [property]: Guid.create() };
        onAddAction(updated, eventName);
    }

    const handleValidationChange = (newValues: ValidationRuleValue[]) => {
        const updatedRules = newValues;
        (control.validationRules || []).forEach((validationRule) => {
            if(validationRule.rule !== ValidationRuleTypes.Required && validationRule.rule !== ValidationRuleTypes.MaliciousValues){
                updatedRules.push(validationRule);
            }
        })
        const updated = { ...control, validationRules: updatedRules };
        onChange(updated);
    }

    return (
        <>
            <Tooltip id='editor-tooltip' opacity={1} style={{ zIndex: Z_POPUP.TOOLTIP, maxWidth: '240px', wordBreak: 'break-word' }} />
            <s.Wrapper>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <TextLine>Edit the base configuration and styles of the Signature widget.</TextLine>
                    <Accordion
                        id='display-section'
                        caption='Display'
                        variant='left'
                        open
                        borderless
                    >
                        <CaptionInput
                            id='label-input'
                            value={control.caption}
                            label='Label'
                            onChange={handleLabelChange}
                            controlId={control.id}
                        />
                        <s.LineWrapper style={{ gap: 8}}> 
                            <SvgIcon name='arrow-elbow' size={12} color={colors.grey}/>
                            <Toggle
                                id='show-label'
                                checked={!control.hideCaption}
                                onChange={(e: boolean) => handlePropertyChange('hideCaption', !e)}
                                label='Show label'
                                width='100%'
                                style={{ justifyContent: 'flex-start' }}
                                labelStyle={{ flexBasis: '100%' }}
                            />
                        </s.LineWrapper>
                        <EditorInput
                            id='accept-input'
                            controlId={control.id}
                            value={control.acceptCaption}
                            label='Accept button label'
                            onChange={(e: string | number) => handlePropertyChange('acceptCaption', String(e))}
                        />
                        <s.LineWrapper style={{ gap: 8}}> 
                            <SvgIcon name='arrow-elbow' size={12} color={colors.grey}/>
                            <SingleAction 
                                value={acceptEvent} 
                                action={{ value: 'Accept', label: 'Accept event', source: 'onAccept' }}
                                control={control} 
                                addLabel='Add Accept'
                                emptyMessage='No Accept event applied'
                                onAddAction={handleAddAction}
                            />
                        </s.LineWrapper>
                        <Toggle
                            id='show-cancel'
                            checked={!control.hideCancel}
                            label='Show Cancel button'
                            width='100%'
                            style={{ justifyContent: 'flex-start' }}
                            labelStyle={{ flexBasis: '100%' }}
                            onChange={(e: boolean) => handlePropertyChange('hideCancel', !e)}
                        />
                        { !control.hideCancel && (
                            <>
                                <EditorInput
                                        id='cancel-input'
                                        gap={8}
                                        controlId={control.id}
                                        value={control.cancelCaption}
                                        label='Cancel button label'
                                        onChange={(e: string | number) => handlePropertyChange('cancelCaption', String(e))}
                                        showChildIcon
                                />
                                <s.LineWrapper style={{ gap: 8}}> 
                                    <SvgIcon name='arrow-elbow' size={12} color={colors.grey}/>
                                    <SingleAction
                                        value={cancelEvent} 
                                        action={{ value: 'Cancel', label: 'Cancel event', source: 'onCancel' }}
                                        control={control} 
                                        addLabel='Add Cancel'
                                        emptyMessage='No Cancel event applied'
                                        onAddAction={handleAddAction}
                                    />
                                </s.LineWrapper>
                            </>
                        )}
                        <DefaultStateSelector control={control} onChange={onChange} />
                    </Accordion>
                    <s.SettingDivider/>
                    <ValidationRulesList
                        standardOptions={[ValidationRuleTypes.Required]}
                        values={validationRules}
                        onChange={handleValidationChange}
                    />
                </div>
            </s.Wrapper>
        </>
    );
}

export default SignatureBlockEditor;