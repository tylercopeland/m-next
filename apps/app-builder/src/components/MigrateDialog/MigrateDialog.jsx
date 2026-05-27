import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@m-next/dialog';
import Button from '@m-next/button';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import * as s from './MigrateDialog.styles';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isMigrating: PropTypes.bool,
};

/**
 * Dialog that confirms screen migration/upgrade to V4.
 * Shows information about what will happen during the upgrade.
 */
function MigrateDialog({ isOpen, onClose, onConfirm, isMigrating = false }) {
  const handleConfirm = () => {
    onConfirm();
    // Don't close the dialog - let the parent handle closing after migration completes
  };

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
            <s.DialogHeaderText>Confirm upgrade</s.DialogHeaderText>
            <s.CloseButton onClick={onClose} disabled={isMigrating}>
              <SvgIcon size={16} name='x-icon' color={colors.grey} />
            </s.CloseButton>
          </s.DialogHeaderTitle>
          <s.Divider />
        </s.DialogHeaderWrapper>
        <s.DialogContent>
          <s.DialogText>
            Upgrading will create a <strong>new version</strong> of this screen in App Builder.
          </s.DialogText>
          <s.BulletList>
            <s.BulletItem>Your original screen will remain unchanged.</s.BulletItem>
            <s.BulletItem>The new version will be available for editing in App Builder.</s.BulletItem>
            <s.BulletItem>Edits to the new version will not sync with the old version.</s.BulletItem>
          </s.BulletList>
          <s.DialogText>
            {/* <s.LearnMoreLink href="#" target="_blank">
              Check out all the new features in App Builder.
            </s.LearnMoreLink>
            <br />
            <br /> */}
            Are you ready to experience a faster, smarter way to build apps?
          </s.DialogText>
        </s.DialogContent>
        <s.DialogFooter>
          <Button
            id='migrate-dialog-cancel'
            value='Cancel'
            onClick={onClose}
            buttonStyle='ghost'
            borderColor={colors.blue}
            color={colors.blue}
            disabled={isMigrating}
          />
          <Button
            id='migrate-dialog-confirm'
            value={isMigrating ? 'Upgrading...' : 'Upgrade screen'}
            onClick={handleConfirm}
            buttonStyle='primary'
            backgroundColor={colors.blue}
            borderColor={colors.blue}
            color={colors.white}
            disabled={isMigrating}
          />
        </s.DialogFooter>
      </s.DialogWrapper>
    </Dialog>
  );
}

MigrateDialog.propTypes = propTypes;

export default MigrateDialog;
