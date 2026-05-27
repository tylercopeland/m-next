import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { Tooltip } from 'react-tooltip';
import { Text, TextLine } from '@m-next/typeography';
import { toCamelCase } from '@m-next/utilities';
import Toggle from '@m-next/toggle';

import { RumComponentContextProvider } from '../../../../common/rum/RumComponentContext';
import Accordion from '../../../../components/accordion/Accordion';
import DefaultStateSelector from '../common/components/default-state-selector/DefaultStateSelector';
import CaptionInput from '../common/components/caption-input/CaptionInput';
import * as s from '../common/BlockEditor.styles';

const RecurrenceEditor = ({ rawControl, onChange }) => {
  const control = useMemo(() => {
    const defaultControl = {
      caption: 'Attachments Widget',
      hideCaption: false,
      name: 'Attachments Widget',
      visible: true,
      disabled: false,
      enableEmailAttachment: true,
    };

    const merged = toCamelCase({ ...(rawControl ?? defaultControl) });
    return merged;
  }, [rawControl]);

  const handleCaptionChange = (newCaption, newName) => {
    const updated = { ...control, caption: newCaption, name: newName };
    onChange(updated);
  };

  const handlePropertyChange = (property, value) => {
    const updatedControl = { ...control, [property]: value };
    onChange(updatedControl);
  };

  return (
    <RumComponentContextProvider componentName='AttachmentsEditor'>
      <Tooltip id='editor-tooltip' opacity={1} style={{ zIndex: 9999, maxWidth: '240px', wordBreak: 'break-word'}} />
      <s.Wrapper padding={16}>
        <TextLine>Edit the base configuration and styles of the attachments widget.</TextLine>
        <Accordion id='display' caption='Display' variant='left' open borderless>
          <CaptionInput
            id='label'
            label='Label'
            controlId={control.id}
            value={control.caption}
            onChange={handleCaptionChange}
          />
          <DefaultStateSelector control={control} onChange={onChange} />
        </Accordion>
        <s.SettingDivider />
        <Accordion id='interactions' caption='Interactions' variant='left' open borderless>
          <s.LineWrapper>
            <Text
              tooltip='Allows attachments to be selected and included in emails.'
              tooltipId='editor-tooltip'
              tooltipHighlighting
            >
              Select attachments
            </Text>
            <Toggle
              id='enable-email-attachment'
              checked={control.enableEmailAttachment}
              onChange={(e) => handlePropertyChange('enableEmailAttachment', e)}
            />
          </s.LineWrapper>
        </Accordion>
      </s.Wrapper>
    </RumComponentContextProvider>
  );
};

RecurrenceEditor.propTypes = {
  rawControl: PropTypes.instanceOf(Object),
  onChange: PropTypes.func,
};

export default RecurrenceEditor;
