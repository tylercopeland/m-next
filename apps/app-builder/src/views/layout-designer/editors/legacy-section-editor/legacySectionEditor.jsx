import React from 'react';

import { TextLine } from '@m-next/typeography';
import Toggle from '@m-next/toggle';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import { RumComponentContextProvider } from '../../../../common/rum/RumComponentContext';
import Accordion from '../../../../components/accordion/Accordion';

import * as s from '../common/BlockEditor.styles';
import DefaultStateSelector from '../common/components/default-state-selector/DefaultStateSelector';
import CaptionInput from '../common/components/caption-input/CaptionInput';

const LegacySectionEditor = ({ control, onChange }) => {
  const handlePropertyChange = (property, value) => {
    const updated = { ...control, [property]: value };
    onChange(updated);
  };

  const handleCaptionChange = (newCaption, newName) => {
    const updated = { ...control, caption: newCaption, name: newName };
    onChange(updated);
  };

  return (
    <RumComponentContextProvider componentName='LegacySectionEditor' /* context={analyticsContext} */>
      <s.Wrapper padding={16}>
        <TextLine>Editing the base configuration and styles of the section.</TextLine>
        <Accordion id='display' caption='Display' variant='left' open borderless>
          <CaptionInput
            id='label'
            label='Label'
            controlId={control.id}
            value={control.caption}
            onChange={handleCaptionChange}
            maxLength={50}
          />

          <s.LineWrapper gap={8}>
            <SvgIcon name='arrow-elbow' size={12} color={colors.grey} />
            <Toggle
              id='show-title'
              checked={control.hasHeader}
              onChange={(value) => handlePropertyChange('hasHeader', value)}
              label='Show Title'
              width='100%'
              style={{ justifyContent: 'flex-start' }}
              labelStyle={{ flexBasis: '100%' }}
            />
          </s.LineWrapper>
          <DefaultStateSelector control={control} onChange={onChange} />
        </Accordion>
      </s.Wrapper>
    </RumComponentContextProvider>
  );
};

export default LegacySectionEditor;
