import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@m-next/dialog';
import Button from '@m-next/button';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import * as s from './MigrateBlockedDialog.styles';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  unsupportedComponents: PropTypes.arrayOf(
    PropTypes.shape({
      componentType: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

/**
 * Dialog that appears when migration is blocked due to unsupported components.
 * Shows which components need to be removed/replaced before upgrading.
 */
function MigrateBlockedDialog({ isOpen, onClose, unsupportedComponents }) {
  return (
    <Dialog
      role='alertdialog'
      isOpen={isOpen}
      onClose={onClose}
      customStyles={s.modalStyles}
      hideDefaultHeader={true}
      hideDefaultBody={true}
      hideDefaultFooter={true}
    >
      <s.DialogWrapper>
        <s.DialogHeaderWrapper>
          <s.DialogHeaderTitle>
            <s.DialogHeaderText>Upgrade blocked</s.DialogHeaderText>
            <s.CloseButton onClick={onClose}>
              <SvgIcon size={16} name='x-icon' color={colors.grey} />
            </s.CloseButton>
          </s.DialogHeaderTitle>
          <s.Divider />
        </s.DialogHeaderWrapper>
        <s.DialogContent>
          <s.DialogText>This screen can't be upgraded because it contains unsupported components:</s.DialogText>
          <s.ComponentList>
            {unsupportedComponents.map((component) => (
              <s.ComponentListItem key={component.componentType}>{component.displayName}</s.ComponentListItem>
            ))}
          </s.ComponentList>
          <s.InstructionText>
            Update your screen by removing and/or replacing these components before upgrading.
          </s.InstructionText>
        </s.DialogContent>
        <s.DialogFooter>
          <Button
            id='migrate-blocked-back'
            value='Back'
            onClick={onClose}
            buttonStyle='primary'
            backgroundColor={colors.blue}
            borderColor={colors.blue}
            color={colors.white}
          />
        </s.DialogFooter>
      </s.DialogWrapper>
    </Dialog>
  );
}

MigrateBlockedDialog.propTypes = propTypes;

export default MigrateBlockedDialog;
