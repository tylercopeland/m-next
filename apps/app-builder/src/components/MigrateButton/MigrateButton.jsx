import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@m-next/button';
import MigrateDialog from '../MigrateDialog/MigrateDialog';
import { useMigrateScreen } from '../../common/hooks/useMigrateScreen';

const propTypes = {
  disabled: PropTypes.bool,
};

function MigrateButton({ disabled = false }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isMigrating, migrateScreen } = useMigrateScreen();

  const handleButtonClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    await migrateScreen();
    // Dialog will stay open during migration and close automatically on navigation
  };

  const handleClose = () => {
    // Only allow closing if not currently migrating
    if (!isMigrating) {
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <Button
        id='migrate-button'
        value={isMigrating ? 'Upgrading...' : 'Upgrade'}
        onClick={handleButtonClick}
        disabled={disabled || isMigrating}
        isV4Design
        variant='secondary'
        width={120}
        widthType='fixed'
      />

      <MigrateDialog isOpen={isDialogOpen} onClose={handleClose} onConfirm={handleConfirm} isMigrating={isMigrating} />
    </>
  );
}

MigrateButton.propTypes = propTypes;

export default MigrateButton;
