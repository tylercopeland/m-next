import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BreadCrumbHeader from '@m-one/bread-crumbs';
import SvgIcon from '@m-one/svg-icon';
import { colors } from '@m-one/styles';
import { IconMenuList, MenuItem } from '@m-one/menu';
import { Tooltip } from 'react-tooltip';
import { useSelector } from 'react-redux';
import * as s from './SettingsHeader.styles';
import {
  selectControls,
  selectScreenProperties,
  selectLayoutV4,
  selectIsV4Screen,
  selectActionUpserts,
  selectLoadedScreenVersionId,
} from '../../../../../../common/services/screenLayoutSlice';
import { selectPublishStatus } from '../../../../../../common/services/appSlice';
import { hasControlReferences, containerOrChildrenHaveEvents } from '../control-references-utils';
import { getDeleteAction } from '../../utils/deleteControlHelper';
import { canDuplicateControl } from '../../utils/duplicateControlHelper';
import DeleteDialog, { ContainerDeleteBlockedDialog } from '../delete-dialog';

const KEY_CODES = {
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  END: 35,
  HOME: 36,
  UP: 38,
  DOWN: 40,
};

const propTypes = {
  controlId: PropTypes.string,
  // Breadcrumbs
  crumbs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
    }),
  ).isRequired,

  // Actions menu configuration
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    }),
  ),

  // Context info for dialog
  contextType: PropTypes.string,
  contextLabel: PropTypes.string,

  // Handlers
  onActionSelect: PropTypes.func,
  onControlPropertySelected: PropTypes.func,

  // Delete confirmation dialog properties
  showDeleteIcon: PropTypes.bool,
  showDuplicateIcon: PropTypes.bool,
  deleteDialogTitle: PropTypes.string,
  deleteDialogMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onDelete: PropTypes.func,

  // Duplicate handler
  onDuplicate: PropTypes.func,

  // Customization options
  menuWidth: PropTypes.string,

  // Other
  hideReferences: PropTypes.bool,
  iconName: PropTypes.string,
};

const defaultProps = {
  actions: [],
  contextType: 'component',
  contextLabel: '',
  onActionSelect: () => {},
  showDeleteIcon: false,
  showDuplicateIcon: false,
  deleteDialogTitle: 'Delete component',
  deleteDialogMessage: null,
  onDelete: () => {},
  onDuplicate: () => {},
  menuWidth: '200px',
  controlProperty: {},
  onControlPropertySelected: () => {},
  hideReferences: false,
  iconName: 'screens-V4',
};

function SettingsHeader({
  controlId,
  crumbs,
  actions,
  contextType,
  contextLabel,
  onActionSelect,
  showDeleteIcon,
  showDuplicateIcon,
  deleteDialogTitle,
  deleteDialogMessage,
  onDelete,
  onDuplicate,
  menuWidth,
  controlProperty,
  onControlPropertySelected,
  hideReferences,
  screenData,
  iconName,
}) {
  const controlList = useSelector(selectControls);
  const screenProperties = useSelector(selectScreenProperties);
  const layoutV4 = useSelector(selectLayoutV4);
  const isV4Screen = useSelector(selectIsV4Screen);
  const publishStatus = useSelector(selectPublishStatus);
  const allActionUpserts = useSelector(selectActionUpserts);
  const versionId = useSelector(selectLoadedScreenVersionId);
  const actionUpserts = allActionUpserts?.[versionId] || {};

  // For drill-down levels (breadcrumbs > 1), use publishStatus instead of isV4Screen
  // This allows column/view actions to work on legacy draft screens
  const isDrillDown = crumbs.length > 1;
  const canEditActions = isDrillDown ? publishStatus === 'Draft' : isV4Screen;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [containerBlockedDialogOpen, setContainerBlockedDialogOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [fullCrumbs, setFullCrumbs] = useState(crumbs);
  const [canDelete, setCanDelete] = useState(true);
  const [referencedChildren, setReferencedChildren] = useState([]);
  const [hasAnyReferences, setHasAnyReferences] = useState(false);
  const [isContainer, setIsContainer] = useState(false);
  const [canDuplicate, setCanDuplicate] = useState(true);
  const [duplicateTooltip, setDuplicateTooltip] = useState('Duplicate');
  const [containerOrChildrenWithEvents, setContainerOrChildrenWithEvents] = useState(false);

  // Handle Escape key to close dialogs (use capture phase to intercept before react-modal)
  useEffect(() => {
    if (!dialogOpen && !containerBlockedDialogOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (dialogOpen) {
          setDialogOpen(false);
          e.preventDefault();
          e.stopPropagation();
        }
        if (containerBlockedDialogOpen) {
          setContainerBlockedDialogOpen(false);
          e.preventDefault();
          e.stopPropagation();
        }
        // Remove focus from any focused element to prevent focus outline
        if (document.activeElement) {
          document.activeElement.blur();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, true); // true = capture phase
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [dialogOpen, containerBlockedDialogOpen]);

  const handleAction = (action) => {
    if (action.disabled) return;
    onActionSelect(action);
    setOpen(false);
  };

  const handleDeleteClick = () => {
    // For column/view deletion, skip grid-level reference checking.
    // The grid's references don't apply to deleting a sub-item (column or view).
    // Check both V2 path (controlProperty.selectedColumn/selectedView) and
    // V1 path (contextType === 'column'/'view' without selectedColumn set).
    if (
      controlProperty?.selectedColumn ||
      controlProperty?.selectedView ||
      contextType === 'column' ||
      contextType === 'view'
    ) {
      setDialogOpen(true);
      return;
    }

    const control = controlList[controlId];
    if (!control) return;

    // Use centralized helper to determine delete action
    const deleteAction = getDeleteAction({
      control,
      controlList,
      screenData,
      screenProperties,
      layoutV4,
      actionUpserts,
    });

    switch (deleteAction.action) {
      case 'blocked':
        // Should not reach here as button is disabled, but just in case
        break;
      case 'showBlockedDialog':
        setReferencedChildren(deleteAction.referencedChildren);
        setContainerBlockedDialogOpen(true);
        break;
      case 'showConfirmDialog':
        setIsContainer(deleteAction.isContainer);
        setDialogOpen(true);
        break;
      case 'delete':
      default:
        // Delete immediately if no confirmation needed or unknown action
        onDelete();
        break;
    }
  };

  const handleDelete = () => {
    onDelete();
  };

  const handleDuplicateClick = () => {
    if (canDuplicate && onDuplicate) {
      onDuplicate();
    }
  };

  const handleKeyPress = (e) => {
    const { keyCode } = e;

    // Handle closing menu
    if ([KEY_CODES.TAB, KEY_CODES.ESCAPE].includes(keyCode)) {
      setActiveIndex(-1);
      return;
    }

    // Handle menu item selection
    if (activeIndex !== -1 && [KEY_CODES.ENTER].includes(keyCode)) {
      handleAction(actions[activeIndex]);
      setActiveIndex(-1);
      setOpen(false);
      return;
    }

    // Handle initial menu item selection
    if (activeIndex === -1 && [KEY_CODES.ENTER].includes(keyCode)) {
      setActiveIndex(0);
      return;
    }

    // Handle navigation to start/end
    if (keyCode === KEY_CODES.HOME) setActiveIndex(0);
    if (keyCode === KEY_CODES.END) setActiveIndex(actions.length - 1);

    // Handle up/down navigation
    if (keyCode === KEY_CODES.DOWN) {
      setActiveIndex((prev) => (prev === -1 ? 0 : prev === actions.length - 1 ? 0 : prev + 1));
    }
    if (keyCode === KEY_CODES.UP) {
      setActiveIndex((prev) => (prev === -1 ? actions.length - 1 : prev === 0 ? actions.length - 1 : prev - 1));
    }
  };

  useEffect(() => {
    const updatedCrumbs = [...crumbs];
    if (controlProperty?.controlReferencesSelected) {
      updatedCrumbs[updatedCrumbs.length - 1].onClick = () =>
        onControlPropertySelected(controlId, { ...controlProperty, controlReferencesSelected: false });
      updatedCrumbs.push({
        id: 'control-references',
        label: 'References',
      });
    }
    setFullCrumbs(updatedCrumbs);
  }, [crumbs, controlProperty, onControlPropertySelected, controlId]);

  // Determine if we should render the actions menu
  const shouldRenderMenu = actions && actions.length > 0;

  // Check if the control has any references (for link icon and delete button state)
  useEffect(() => {
    if (controlId && controlList && screenData && screenProperties) {
      const control = controlList[controlId];
      if (control) {
        // When a column or view is selected, we're deleting that sub-item, not the control.
        // Columns/views are nested in the grid — NOT in controlList, NOT independently referenced.
        // The grid's references (Load, Row Click, etc.) don't apply to column/view deletion.
        // Check both V2 path (controlProperty.selectedColumn/selectedView) and
        // V1 path (contextType === 'column'/'view' without selectedColumn set).
        if (
          controlProperty?.selectedColumn ||
          controlProperty?.selectedView ||
          contextType === 'column' ||
          contextType === 'view'
        ) {
          setIsContainer(false);
          setContainerOrChildrenWithEvents(false);
          setHasAnyReferences(false);
          setCanDelete(true);
          setCanDuplicate(true);
          setDuplicateTooltip('Duplicate');
          return;
        }

        // Check if this is a container type
        const isContainerType = control.type === 'L-CON' || control.type === 'SEC';
        setIsContainer(isContainerType);

        // Check if control itself has references (for the link icon and delete button)
        const hasRefs = hasControlReferences(control, controlList, screenData, screenProperties);

        // If it's a container, check if the container or any children have events
        if (isContainerType && layoutV4) {
          const hasEvents = containerOrChildrenHaveEvents(control, controlList, screenData, layoutV4);
          setContainerOrChildrenWithEvents(hasEvents);
        } else {
          setContainerOrChildrenWithEvents(false);
        }

        // hasAnyReferences should ONLY reflect if the control itself has references
        // (not children's references - those only affect the delete modal shown)
        setHasAnyReferences(hasRefs);

        // Only disable delete button if the control ITSELF has direct references
        // If it's a container with children that have references, we allow clicking
        // the delete button but show the blocked dialog (no actual deletion happens)
        setCanDelete(!hasRefs);

        // Check if control can be duplicated
        const duplicateResult = canDuplicateControl({
          control,
          controlList,
          layoutV4,
          screenData,
        });

        setCanDuplicate(duplicateResult.canDuplicate);
        setDuplicateTooltip(duplicateResult.tooltipMessage || 'Duplicate');
      }
    }
  }, [controlId, controlList, screenData, screenProperties, layoutV4, controlProperty?.selectedColumn, controlProperty?.selectedView, contextType]);

  return (
    <s.HeaderWrapper>
      <Tooltip
        id='references-tooltip'
        opacity={1}
        place='left'
        style={s.referencesTooltipStyles}
        offset={8}
        float={false}
        positionStrategy='fixed'
      />
      <Tooltip
        id='delete-tooltip'
        opacity={1}
        place='left'
        style={s.deleteTooltipStyles}
        offset={8}
        float={false}
        positionStrategy='fixed'
      />
      <Tooltip
        id='delete-disabled-tooltip'
        opacity={1}
        place='left'
        style={s.deleteDisabledTooltipStyles}
        offset={8}
        float={false}
        positionStrategy='fixed'
      />
      <Tooltip
        id='duplicate-tooltip'
        opacity={1}
        place='left'
        style={s.duplicateTooltipStyles}
        offset={8}
        float={false}
        positionStrategy='fixed'
      />
      <Tooltip
        id='duplicate-disabled-tooltip'
        opacity={1}
        place='left'
        style={s.duplicateDisabledTooltipStyles}
        offset={8}
        float={false}
        positionStrategy='fixed'
      />
      <BreadCrumbHeader id='settings-header-breadcrumbs' crumbs={fullCrumbs} style={{ maxWidth: 278 }} iconName={iconName}/>
      <div style={{ flexGrow: 1 }} />

      {fullCrumbs.length === 1 && !hideReferences && (
        <SvgIcon
          name='link-2'
          color={colors.grey}
          hoverColor={colors['grey-darker']}
          size={16}
          onClick={() => onControlPropertySelected(controlId, { ...controlProperty, controlReferencesSelected: true })}
          tooltipId='references-tooltip'
          tooltip={hasAnyReferences ? 'Control references' : 'No control references'}
          disabled={!hasAnyReferences}
        />
      )}

      {showDuplicateIcon && (
        <SvgIcon
          name='duplicate-icon'
          color={canDuplicate ? colors.grey : colors['grey-light']}
          hoverColor={canDuplicate ? colors['grey-darker'] : colors['grey-light']}
          size={16}
          onClick={canDuplicate && canEditActions ? () => handleDuplicateClick() : undefined}
          disabled={!canDuplicate || !canEditActions}
          tooltip={duplicateTooltip}
          tooltipId={!canDuplicate && !canEditActions ? 'duplicate-disabled-tooltip' : 'duplicate-tooltip'}
          style={{ cursor: canDuplicate && canEditActions ? 'pointer' : 'not-allowed' }}
        />
      )}

      {showDeleteIcon && (
        <SvgIcon
          name='trash-V4'
          color={canDelete ? colors.grey : colors['grey-light']}
          hoverColor={canDelete ? colors['grey-darker'] : colors['grey-light']}
          size={16}
          onClick={canDelete && canEditActions ? () => handleDeleteClick() : undefined}
          disabled={!canDelete || !canEditActions}
          tooltip={
            !canDelete
              ? "Component cannot be deleted as it is referenced by other controls. Review control references first."
              : 'Delete'
          }
          tooltipId={!canDelete && !canEditActions ? 'delete-disabled-tooltip' : 'delete-tooltip'}
          style={{ cursor: canDelete && canEditActions ? 'pointer' : 'not-allowed' }}
        />
      )}

      {shouldRenderMenu && (
        <IconMenuList
          id='settings-header-menu'
          marginVertical={4}
          icon='navigation-show-more'
          iconBorder={false}
          horizontalAlign='right'
          onKeyUp={handleKeyPress}
          inline
          relativeToParent
          width={menuWidth}
          open={open}
          onToggle={setOpen}
        >
          {actions.map((action, index) => (
            <MenuItem
              key={action.value}
              id={`settings-header-menu-item-${action.value}`}
              onClick={() => handleAction(action)}
              disabled={action.disabled}
              active={index === activeIndex}
            >
              {action.label}
            </MenuItem>
          ))}
        </IconMenuList>
      )}

      <DeleteDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleDelete}
        title={isContainer && containerOrChildrenWithEvents ? 'Delete container' : deleteDialogTitle}
        message={
          deleteDialogMessage ||
          (isContainer && containerOrChildrenWithEvents ? (
            <>
              <p>
                Deleting this container will also remove the actions connected to all components within it. This cannot
                be undone.
              </p>
              <br />
              <p>Are you sure you want to delete?</p>
            </>
          ) : (
            <>
              <p>Deleting this component will also remove the actions connected to it. This cannot be undone.</p>
              <br />
              <p>Are you sure you want to delete?</p>
            </>
          ))
        }
        itemType={contextType}
        itemLabel={contextLabel}
      />

      <ContainerDeleteBlockedDialog
        isOpen={containerBlockedDialogOpen}
        onClose={() => setContainerBlockedDialogOpen(false)}
        referencedComponents={referencedChildren}
        onComponentClick={(controlId) => {
          onControlPropertySelected(controlId, null);
        }}
      />
    </s.HeaderWrapper>
  );
}

SettingsHeader.propTypes = propTypes;
SettingsHeader.defaultProps = defaultProps;

export default SettingsHeader;
