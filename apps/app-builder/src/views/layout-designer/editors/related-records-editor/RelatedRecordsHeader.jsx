import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import SvgIcon from '@m-next/svg-icon';
import { Text, TextLine } from '@m-next/typeography';
import { useTheme } from '@mui/material';
import { IconMenuList, MenuItem } from '@m-next/menu';
import Dialog from '@m-next/dialog';
import { interactions } from '@m-next/utilities';
import Button from '@m-next/button';
import { colors } from '@m-next/styles';
import { useDeleteRibbonMutation, useDuplicateRibbonMutation } from '../../../../common/services/screenLayoutApi';
import { reloadRibbons, removeRibbonConfiguration } from '../../../../common/services/screenLayoutSlice';
import * as s from './RelatedRecordsHeader.styles';

const propTypes = {
  currentTab: PropTypes.shape({
    id: PropTypes.string,
    caption: PropTypes.string,
    visible: PropTypes.bool,
    isStock: PropTypes.bool,
  }),
  onSelect: PropTypes.func,
  onTabsSettingsChange: PropTypes.func,
  tabList: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
};

function RelatedRecordsHeader({ currentTab, onSelect, onTabsSettingsChange, tabList }) {
  const { content } = useTheme();
  const [active, setActive] = useState(-1);
  const [duplicateRibbon] = useDuplicateRibbonMutation();
  const [deleteRibbon] = useDeleteRibbonMutation();
  const { appId, screenId } = useParams();
  const [open, setOpen] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const dispatch = useDispatch();

  const selectedTab = useMemo(
    () => (currentTab ? tabList?.find((tab) => tab.id === currentTab.id) : null),
    [tabList, currentTab],
  );

  useEffect(() => {
    setActive(-1);
    setOpen(false);
  }, [currentTab]);

  const handleDuplicate = async () => {
    setOpen(false);
    try {
      await duplicateRibbon({ appId, screenId, ribbonId: selectedTab.id }).unwrap();
      dispatch(reloadRibbons());
    } catch (ex) {
      toast.error(`Error duplicating ribbon - ${ex.data?.message}`);
    }
    onSelect('tab-panel', null);
  };

  const handleToggleVisibility = () => {
    setOpen(false);
    const update = [...tabList];
    update.find((tab) => tab.id === selectedTab.id).visible = !selectedTab.visible;
    onTabsSettingsChange(update);
  };

  const handleDelete = async () => {
    setOpen(false);
    setShowDeleteWarning(false);
    try {
      await deleteRibbon({ appId, screenId, ribbonId: selectedTab.id }).unwrap();
      dispatch(removeRibbonConfiguration(selectedTab.id));
      dispatch(reloadRibbons());
    } catch (ex) {
      toast.error(
        `Error ${selectedTab.isStock ? 'reseting ribbon to default' : 'deleting ribbon'} - ${ex.data?.message}`,
      );
    }
    if (!selectedTab.isStock) {
      onSelect('tab-panel', null);
    }
  };

  const handleAdd = () => {
    onSelect('tab-panel', { id: 'new', caption: 'Custom Ribbon', visible: true });
  };

  const handleKeyPress = (e) => {
    const keyPressed = e.keyCode;

    if ([9, 13, 27, 32, 35, 36, 38, 40].includes(keyPressed)) {
      interactions.preventPropagation(e);
    }

    switch (keyPressed) {
      case 9:
      case 27:
        setActive(-1);
        setOpen(false);
        break;
      case 13:
      case 32:
        if (active === -1) setActive(0);
        else if (active === 0) handleDuplicate();
        else if (active === 1) handleToggleVisibility();
        else if (active === 2) handleDelete();
        setActive(-1);
        break;
      case 35:
        setActive(2);
        break;
      case 36:
        setActive(0);
        break;
      case 38:
        setActive(active === 0 ? 2 : active - 1);
        break;
      case 40:
        setActive(active === 2 ? 0 : active + 1);
        break;
      default:
        break;
    }
  };

  return (
    <s.HeaderWrapper>
      <SvgIcon name='screens-V4' color={selectedTab ? content.secondary : content.primary} size={16} />
      <TextLine
        color={selectedTab ? content.secondary : content.primary}
        style={{ flexGrow: 1 }}
        tooltip='Display related information within the<br/>context of a record, providing a<br/>comprehensive view of associated data'
        tooltipId='ribbon-management'
        tooltipPlace='left'
        fontSize='mediumLarge'
        bold
      >
        <Text
          onClick={selectedTab ? () => onSelect('tab-panel', null) : null}
          color={selectedTab ? content.secondary : content.primary}
          fontSize='mediumLarge'
        >
          App ribbons{' '}
        </Text>
        {selectedTab ? (
          <Text fontSize='mediumLarge' bold>
            / {selectedTab.caption}
          </Text>
        ) : (
          ''
        )}
      </TextLine>
      {!selectedTab && currentTab?.id !== 'new' && (
        <Button
          id='add-ribbon'
          icon={{ name: 'plus-V4', color: colors.white, size: 12 }}
          onClick={handleAdd}
          tooltip='Add related app'
          tooltipId='ribbon-management'
          tooltipPlace='left'
        />
      )}

      {selectedTab && (
        <IconMenuList
          id='ribbon-menu'
          inline
          relativeToParent
          icon='navigation-show-more'
          color={content.primary}
          size={16}
          iconRotation='transform: rotate(90deg)'
          onKeyUp={handleKeyPress}
          horizontalAlign='right'
          width={180}
          open={open}
          onToggle={setOpen}
        >
          <MenuItem id='duplicate' style={{ fontWeight: 400 }} onClick={() => handleDuplicate()} active={active === 0}>
            Duplicate
          </MenuItem>
          <MenuItem
            id='show-hide'
            style={{ fontWeight: 400 }}
            onClick={() => handleToggleVisibility()}
            active={active === 1}
          >
            {selectedTab.visible ? 'Hide' : 'Show'}
          </MenuItem>
          <MenuItem
            id='delete'
            style={{ fontWeight: 400 }}
            onClick={() => setShowDeleteWarning(true)}
            active={active === 2}
          >
            {selectedTab.isStock ? 'Reset to default settings' : 'Delete'}
          </MenuItem>
        </IconMenuList>
      )}
      {showDeleteWarning && (
        <Dialog
          id='delete-warning'
          title={selectedTab?.isStock ? 'Reset to default settings' : 'Delete app ribbon'}
          isOpen={showDeleteWarning}
          onClose={() => setShowDeleteWarning(false)}
          footer={{
            primaryButtonLabel: 'Ok',
            onPrimaryButtonClick: handleDelete,
            secondaryButtonLabel: 'Cancel',
            onSecondaryButtonClick: () => setShowDeleteWarning(false),
          }}
        >
          {selectedTab?.isStock ? (
            <s.DialogContent>
              <TextLine>Are you sure you want to reset the app ribbon to default settings?</TextLine>
              <TextLine>
                This will revert all configurations to their original state, and all changes will be lost.
              </TextLine>
              <TextLine>
                Click &quot;<Text bold>Ok</Text>&quot; to confirm or &quot;<Text bold>Cancel</Text>&quot; to go back.
              </TextLine>
            </s.DialogContent>
          ) : (
            <s.DialogContent>
              <TextLine>Are you sure you want to delete this app ribbon?</TextLine>
              <TextLine>
                This action cannot be undone, and all related configurations and data will be removed.
              </TextLine>
              <TextLine>
                Click &quot;<Text bold>Ok</Text>&quot; to confirm or &quot;<Text bold>Cancel</Text>&quot; to go back.
              </TextLine>
            </s.DialogContent>
          )}
        </Dialog>
      )}
    </s.HeaderWrapper>
  );
}

RelatedRecordsHeader.propTypes = propTypes;
export default RelatedRecordsHeader;
