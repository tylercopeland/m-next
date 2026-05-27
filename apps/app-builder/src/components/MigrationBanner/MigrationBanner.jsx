import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import Button from '@m-next/button';
import MigrateDialog from '../MigrateDialog/MigrateDialog';
import MigrateBlockedDialog from '../MigrateDialog/MigrateBlockedDialog';
import { useMigrateScreen } from '../../common/hooks/useMigrateScreen';
import * as s from './MigrationBanner.styles';

const propTypes = {
  disabled: PropTypes.bool,
  unsupportedComponents: PropTypes.arrayOf(
    PropTypes.shape({
      componentType: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    }),
  ),
};

function MigrationBanner({ disabled = false, unsupportedComponents = [] }) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isBlockedDialogOpen, setIsBlockedDialogOpen] = useState(false);
  const { isMigrating, migrateScreen } = useMigrateScreen();

  const handleUpgradeClick = () => {
    // Check if there are unsupported components blocking migration
    if (unsupportedComponents.length > 0) {
      setIsBlockedDialogOpen(true);
    } else {
      setIsConfirmDialogOpen(true);
    }
  };

  const handleConfirmMigrate = async () => {
    await migrateScreen();
    // Dialog will stay open during migration and close automatically on navigation
  };

  const handleClose = () => {
    // Only allow closing if not currently migrating
    if (!isMigrating) {
      setIsConfirmDialogOpen(false);
    }
  };

  return (
    <>
      <s.MigrationBanner>
        <s.BannerContent>
          <s.IconFrame>
            <SvgIcon size={16} name='arrow-up-circle' color='white' />
          </s.IconFrame>
          <s.BannerTextWrapper>
            <s.BannerText>
              <s.BannerTitle>Upgrade available</s.BannerTitle> - You are currently on a legacy version of our screens,
              upgrading will unlock full access to our new App Builder with enhanced features and functionality.
            </s.BannerText>
          </s.BannerTextWrapper>
          <Button
            id='migration-upgrade-button'
            value='Upgrade now'
            onClick={handleUpgradeClick}
            disabled={disabled}
            buttonStyle='primary'
            isV4Design
            backgroundColor='blue'
            color='#FFF'
            borderRadius='38px'
            fontSize='14px'
            style={{
              fontWeight: 600,
              lineHeight: '16px',
              fontStyle: 'normal',
              fontFamily: '"Source Sans Pro"',
              textAlign: 'center',
              fontFeatureSettings: '"liga" off, "clig" off',
            }}
          />
        </s.BannerContent>
      </s.MigrationBanner>

      <MigrateDialog
        isOpen={isConfirmDialogOpen}
        onClose={handleClose}
        onConfirm={handleConfirmMigrate}
        isMigrating={isMigrating}
      />

      <MigrateBlockedDialog
        isOpen={isBlockedDialogOpen}
        onClose={() => setIsBlockedDialogOpen(false)}
        unsupportedComponents={unsupportedComponents}
      />
    </>
  );
}

MigrationBanner.propTypes = propTypes;

export default MigrationBanner;
