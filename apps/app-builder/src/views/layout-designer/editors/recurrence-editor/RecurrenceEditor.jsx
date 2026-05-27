import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { TextLine } from '@m-next/typeography';
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
      caption: 'RecurrenceWidget',
      hideCaption: false,
      name: 'RecurrenceWidget',
      visible: true,
      disabled: false,
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
    <RumComponentContextProvider componentName='RecurrenceEditor' /* context={analyticsContext} */>
      <s.Wrapper padding={16}>
        <TextLine>Edit the base configuration and styles of the recurrence widget.</TextLine>
        <Accordion id='display' caption='Display' variant='left' open borderless>
          <s.LineWrapper>
            <Toggle
              id='show-caption'
              checked={!control.hideCaption}
              onChange={(e) => handlePropertyChange('hideCaption', !e)}
              label='Show caption'
              width='100%'
              style={{ justifyContent: 'flex-start' }}
              labelStyle={{ flexBasis: '100%' }}
            />
          </s.LineWrapper>
          <CaptionInput
            id='label'
            label='Label'
            controlId={control.id}
            value={control.caption}
            onChange={handleCaptionChange}
          />

          <DefaultStateSelector control={control} onChange={onChange} />
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
