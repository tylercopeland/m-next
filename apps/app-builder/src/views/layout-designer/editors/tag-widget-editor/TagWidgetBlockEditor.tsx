import React from 'react';
import { Tooltip } from "react-tooltip";
import TextLine from '@m-next/typeography';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import Toggle from '@m-next/toggle';
import { BaseControl } from '@m-next/runtime-interface';
import { Z_POPUP } from '@m-next/layout-canvas';
import Accordion from '../../../../components/accordion/Accordion';
import * as s from '../common/BlockEditor.styles';
import CaptionInput from '../common/components/caption-input/CaptionInput';
import DefaultStateSelector from '../common/components/default-state-selector/DefaultStateSelector';

interface TagWidgetControl extends BaseControl {
    id: string;
    caption: string;
    name: string;
    hideCaption: boolean;
}

interface TagWidgetBlockEditorProps {
    control: TagWidgetControl;
    onChange: (control: TagWidgetControl) => void;
}

function TagWidgetBlockEditor({ control, onChange }: TagWidgetBlockEditorProps) {

    const handleLabelChange = (value: string, name: string) => {
        if (value) {
            const updatedControl = { ...control };
            updatedControl.caption = value;
            updatedControl.name = name;
            onChange(updatedControl);
        }
    };

    const handleShowLabelChange = (value: boolean) => {
        const updatedControl = { ...control };
        updatedControl.hideCaption = !value;
        onChange(updatedControl);
    };

    return (
        <>
            <Tooltip id='editor-tooltip' opacity={1} style={{ zIndex: Z_POPUP.TOOLTIP, maxWidth: '240px', wordBreak: 'break-word' }} />
            <s.Wrapper>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <TextLine>Edit the base configuration and styles of the tags list.</TextLine>
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
                                onChange={handleShowLabelChange}
                                label='Show label'
                                width='100%'
                                style={{ justifyContent: 'flex-start' }}
                                labelStyle={{ flexBasis: '100%' }}
                            />
                        </s.LineWrapper>
                        <DefaultStateSelector control={control} onChange={onChange} />
                    </Accordion>
                </div>
            </s.Wrapper>
        </>
    );
}

export default TagWidgetBlockEditor;