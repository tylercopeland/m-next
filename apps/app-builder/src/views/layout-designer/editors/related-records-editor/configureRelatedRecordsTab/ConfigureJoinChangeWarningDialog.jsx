import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@m-next/dialog';
import { Text, TextLine } from '@m-next/typeography';
import RadioGroup from '@m-next/radio-button';
import Button from '@m-next/button';
import * as s from './ConfigureJoinDialog.styles';

const propTypes = {
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  screenName: PropTypes.string,
};

function ConfigureJoinChangeWarningDialog({ onClose, onConfirm, screenName }) {
  const [selectedOption, setSelectedOption] = useState('replace');
  return (
    <Dialog id='join-change-warning' title='Manage linked fields' isOpen onClose={onClose}>
      <s.DialogContent>
        <s.DialogInnerContent>
          <TextLine gutterBottom={24}>
            Updating linked fields will break any customizations on the related app screen {screenName}.
          </TextLine>
          <TextLine gutterBottom={16}>To proceed, select how you want to modify the screen:</TextLine>
          <RadioGroup
            id='join-change-warning-options'
            name='join-change-warning-options'
            isV4Design
            bold
            options={[
              {
                id: 'replace',
                value: 'replace',
                label: 'Create a new screen',
                subtext: (
                  <Text style={{ marginLeft: 24, display: 'block' }}>
                    Generate a new screen with updated linked fields.
                  </Text>
                ),
              },
              {
                id: 'keep',
                value: 'keep',
                label: 'Maintain the current screen',
                subtext: (
                  <Text style={{ marginLeft: 24, display: 'block' }}>
                    Keep the existing screen and its current customizations, screen will required additional
                    customization to display correct records.
                  </Text>
                ),
              },
            ]}
            selectedValue={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          />
        </s.DialogInnerContent>
        <s.DialogFooter>
          <Button id='cancel-change' buttonStyle='ghost' value='Cancel' onClick={onClose} />
          <Button id='confirm-change' value='Confirm' onClick={() => onConfirm(selectedOption)} />
        </s.DialogFooter>
      </s.DialogContent>
    </Dialog>
  );
}

ConfigureJoinChangeWarningDialog.propTypes = propTypes;
export default ConfigureJoinChangeWarningDialog;
