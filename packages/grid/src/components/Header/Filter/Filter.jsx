import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { IconMenuList, MenuItem } from '@m-next/menu';
import { colors } from '@m-next/styles';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import * as s from './Filter.styles';
import PortalTooltip from './PortalTooltip';

function Filter({
  disabled,
  id,
  options,
  selected,
  onSelect,
  isCustomViewEnabled,
  isAdminOrCustomizer,
  onClickShowSaveGridViewDialog,
  onToggleViewVisibility,
  defaultViewId,
  onCustomViewsDragEnd,
  handleCustomViewsManageDoneClick,
  isMobile,
  onSetDefaultView,
  isDesignMode,
}) {
  const [title, setTitle] = useState();
  const [active, setActive] = useState();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [flattenedOptions, setFlattenedOptions] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const standardCategoryName = 'Standard Views';
  const sharedCategoryName = 'Shared Views';
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [placeholderProps, setPlaceholderProps] = useState({});

  // Helper function to check if options are in categorized format
  const isCategorizedOptions = useCallback(
    () => Array.isArray(options) && options.length > 0 && Array.isArray(options[0]),
    [options],
  );

  // Helper function to check if a view is hidden
  const isViewHidden = useCallback(
    (viewId) => {
      // Check isVisible parameter in the options
      if (isCategorizedOptions()) {
        // Categorized options format: [categoryName, categoryOptions]
        const found = options.some(([, categoryOptions]) => {
          if (Array.isArray(categoryOptions)) {
            const option = categoryOptions.find((opt) => opt.id === viewId);
            return option && option.isVisible === false;
          }
          return false;
        });
        if (found) return true;
      } else if (Array.isArray(options)) {
        // Flat array format
        const option = options.find((opt) => opt.id === viewId);
        if (option && option.isVisible === false) {
          return true;
        }
      }

      return false;
    },
    [options, isCategorizedOptions],
  );

  // Helper function to filter options based on edit mode and visibility
  const shouldShowOption = useCallback(
    (opt) => {
      // In edit mode, show all items (visible and hidden)
      if (editMode) {
        return true;
      }
      // In normal mode, only show visible items
      return !isViewHidden(opt.id);
    },
    [editMode, isViewHidden],
  );

  useEffect(() => {
    // Flatten all options from categories for easy searching and keyboard navigation
    if (isCategorizedOptions()) {
      // Options is an array of [categoryName, categoryOptions] pairs
      const flattened = options.reduce((acc, [, categoryOptions]) => {
        const filteredCategoryOptions = categoryOptions.filter(shouldShowOption);
        return acc.concat(filteredCategoryOptions);
      }, []);
      setFlattenedOptions(flattened);
    } else if (Array.isArray(options)) {
      // Fallback: options is a simple array
      const filteredOptions = options.filter(shouldShowOption);
      setFlattenedOptions(filteredOptions);
    } else {
      setFlattenedOptions([]);
    }
  }, [options, editMode, isCategorizedOptions, shouldShowOption]);

  useEffect(() => {
    // if selected view is visible in flattened options, set title
    let opt = flattenedOptions.find((x) => x.id === selected);
    if (opt) {
      setTitle(opt.name);
      return;
    }

    // fallback: search all options (including hidden ones) to find the selected view
    if (isCategorizedOptions()) {
      // Categorized options format: [categoryName, categoryOptions]
      options.some(([, categoryOptions]) => {
        if (Array.isArray(categoryOptions)) {
          opt = categoryOptions.find((x) => x.id === selected);
          if (opt) {
            setTitle(opt.name);
            return true;
          }
        }
        return false;
      });
    } else if (Array.isArray(options)) {
      // Flat array format
      opt = options.find((x) => x.id === selected);
      if (opt) {
        setTitle(opt.name);
      }
    }
  }, [selected, flattenedOptions, options, isCategorizedOptions]);

  const handleSelect = (opt, e) => {
    if (!editMode) {
      if (onSelect) {
        onSelect(opt.id, true, e);
      }
      setOpen(false);
    }
  };

  const handleKeyPress = (e) => {
    const keyPressed = e.keyCode;
    const currentOptions = flattenedOptions;
    // 9 - tab
    // 13 - enter
    // 27 - escape

    // 32 - space
    // 35 - end
    // 36 - home
    // 38 - up
    // 40 - down

    if (keyPressed === 9 || keyPressed === 27) {
      setActive(null);
      setActiveIndex(-1);
    }

    if (activeIndex === -1 && (keyPressed === 13 || keyPressed === 32)) {
      if (currentOptions.length > 0) {
        setActive(currentOptions[0].id);
        setActiveIndex(0);
      }
    }

    if (keyPressed === 36 && currentOptions.length > 0) {
      setActive(currentOptions[0].id);
      setActiveIndex(0);
    }

    if (keyPressed === 35 && currentOptions.length > 0) {
      setActive(currentOptions[currentOptions.length - 1].id);
      setActiveIndex(currentOptions.length - 1);
    }

    if (activeIndex !== -1 && (keyPressed === 13 || keyPressed === 32)) {
      handleSelect(currentOptions[activeIndex], e);
      setActive(null);
      setActiveIndex(-1);
    }

    if (keyPressed === 40) {
      let index = activeIndex + 1;
      if (currentOptions.length === index) index = 0;
      if (currentOptions.length > 0) {
        setActive(currentOptions[index].id);
        setActiveIndex(index);
      }
    }
    if (keyPressed === 38) {
      let index = activeIndex - 1;
      if (index < 0) index = currentOptions.length - 1;
      if (currentOptions.length > 0) {
        setActive(currentOptions[index].id);
        setActiveIndex(index);
      }
    }
  };

  const handleManageViewsClick = (e) => {
    e.preventDefault();
    if (isDesignMode) return; // Disabled in design mode
    setEditMode(!editMode);

    // done button click to set isMaintainViewOrder to false for hidden views and update view order if reordered
    if (editMode && handleCustomViewsManageDoneClick) {
      handleCustomViewsManageDoneClick();
    }
  };

  const handleEditIconClick = (opt) => {
    if (onClickShowSaveGridViewDialog) {
      onClickShowSaveGridViewDialog(
        true,
        () => {
          setEditModalOpen(false); // Callback to close the modal
        },
        opt,
      );
      setEditModalOpen(true);
    }
  };

  const handleToggleViewVisibility = (viewId, isCurrentlyVisible) => {
    if (onToggleViewVisibility) {
      onToggleViewVisibility(viewId, !isCurrentlyVisible);
    }
  };

  const handleSetDefaultView = (viewId, setAsDefault) => {
    if (onSetDefaultView) {
      onSetDefaultView(viewId, setAsDefault);
    }
  };

  const isDefaultView = (viewId) => viewId === defaultViewId;

  // Helper function to render the eye icon for show/hide toggle
  const renderEyeIcon = (opt, isHidden) => {
    const isDefault = isDefaultView(opt.id);
    const eyeIconDisabled = isDefault && !isHidden; // Only functionally disable default views that are not hidden
    const shouldShowAsDisabled = eyeIconDisabled || isHidden; // Visually disable for both default and hidden

    let tooltipContent;
    if (eyeIconDisabled) {
      tooltipContent = 'Default view cannot be hidden.';
    } else if (isHidden) {
      tooltipContent = 'Show';
    } else {
      tooltipContent = 'Hide';
    }

    return (
      <PortalTooltip content={tooltipContent}>
        <s.StyledIcon
          name={isHidden ? 'eye-closed-V4' : 'eye-open-V4'}
          disabled={eyeIconDisabled}
          style={{ opacity: shouldShowAsDisabled ? 0.5 : 0.7 }}
          onClick={!eyeIconDisabled ? () => handleToggleViewVisibility(opt.id, !isHidden) : undefined}
        />
      </PortalTooltip>
    );
  };

  // Tooltip content for ManageViewsLink when disabled
  const manageViewsTooltipContent = isDesignMode
    ? "Personal and shared views can't be managed in the App Builder. Use the side properties panel to manage standard views."
    : '';

  const handleToggle = (value) => {
    // Don't allow toggle if there's exactly one option
    if (Array.isArray(options) && options.length === 1 && !Array.isArray(options[0])) {
      return;
    }

    if (value !== undefined) setOpen(value);
    setOpen(!open);
  };

  const categoriesWithOptions = useMemo(() => {
    if (isCategorizedOptions()) {
      return options
        .map(([categoryName, categoryOptions]) => [categoryName, categoryOptions.filter(shouldShowOption)])
        .filter(([, categoryOptions]) => categoryOptions.length > 0);
    }
    return [];
  }, [options, isCategorizedOptions, shouldShowOption]);

  // Check if "Standard Views" is the only category with options
  const isOnlyStandardViews = useMemo(
    () => categoriesWithOptions.length === 1 && categoriesWithOptions[0][0] === standardCategoryName,
    [categoriesWithOptions],
  );

  const handleDragEnd = (result) => {
    setPlaceholderProps({});
    if (!result.destination) {
      return;
    }

    if (onCustomViewsDragEnd) onCustomViewsDragEnd(result);
  };

  // react-beautiful-dnd internal attribute used for custom placeholder positioning
  const queryAttr = 'data-rbd-drag-handle-draggable-id';

  const handleDragUpdate = (update) => {
    if (!update.destination) {
      setPlaceholderProps({});
      return;
    }

    const { draggableId } = update;
    const destinationIndex = update.destination.index;

    const domQuery = `[${queryAttr}='${draggableId}']`;
    const draggedDOM = document.querySelector(domQuery);
    const parentNode = draggedDOM?.parentNode;

    if (!draggedDOM || !parentNode) {
      return;
    }

    const parentStyle = window.getComputedStyle(parentNode);
    const { clientHeight, clientWidth } = draggedDOM;
    const clientY =
      (parseFloat(parentStyle.paddingTop) || 0) +
      [...parentNode.children].slice(0, destinationIndex).reduce((total, curr) => {
        if (!curr) return total;
        const style = curr.currentStyle || window.getComputedStyle(curr);
        const marginBottom = parseFloat(style.marginBottom) || 0;
        return total + (curr.clientHeight || 0) + marginBottom;
      }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
      clientX: parseFloat(parentStyle.paddingLeft) || 0,
      droppableId: update.destination.droppableId,
    });
  };

  // behind a flag, EGCustomViews
  const renderOptions = () => {
    // Check if options is an array of [categoryName, categoryOptions] pairs
    if (isCategorizedOptions()) {
      // Filter categories and options based on edit mode and visibility
      const filteredOptions = options.map(([categoryName, categoryOptions]) => {
        const filteredCategoryOptions = categoryOptions.filter(shouldShowOption);
        return [categoryName, filteredCategoryOptions];
      });

      // Check if all filtered categories have no options
      const allCategoriesEmpty = filteredOptions.every(([, categoryOptions]) => categoryOptions.length === 0);

      if (allCategoriesEmpty) {
        return (
          <s.EmptyStateMessage>
            You have hidden all your views. Manage views to show all options and make them visible again.
          </s.EmptyStateMessage>
        );
      }

      return (
        <>
          <s.ManageViewsContainer>
            {isDesignMode ? (
              <PortalTooltip content={manageViewsTooltipContent}>
                <s.ManageViewsLink href='#' onClick={handleManageViewsClick} disabled>
                  Manage views
                </s.ManageViewsLink>
              </PortalTooltip>
            ) : (
              <s.ManageViewsLink href='#' onClick={handleManageViewsClick}>
                {editMode ? 'Done' : 'Manage views'}
              </s.ManageViewsLink>
            )}
          </s.ManageViewsContainer>
          <s.ViewsList>
            {filteredOptions.map(([categoryName, categoryOptions], optIndex) => {
              // Only render if category has options after filtering
              if (categoryOptions.length === 0) {
                return null;
              }

              return (
                <React.Fragment key={categoryName}>
                  {!isOnlyStandardViews && <s.GroupHeader>{categoryName}</s.GroupHeader>}
                  <DragDropContext onDragEnd={handleDragEnd} onDragUpdate={handleDragUpdate}>
                    <Droppable droppableId={`${id}-filter-droppable-${categoryName}`}>
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} style={{ position: 'relative' }}>
                          {categoryOptions.map((opt, index) => {
                            const isHidden = isViewHidden(opt.id);
                            const isDragDisabled =
                              !editMode || categoryName === standardCategoryName || isHidden || isMobile;
                            return (
                              <Draggable
                                key={opt.id}
                                draggableId={opt.id}
                                index={index}
                                isDragDisabled={isDragDisabled}
                              >
                                {(dragProvided, snapshot) => (
                                  <s.DraggableViewItem
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}
                                    style={dragProvided.draggableProps.style}
                                    isDragging={snapshot.isDragging}
                                    isDragDisabled={isDragDisabled}
                                    editMode={editMode}
                                  >
                                    <s.StyledMenuItem
                                      id={`${id}-${opt.id}`}
                                      key={opt.id}
                                      onClick={(e) => handleSelect(opt, e)}
                                      selected={opt.id === selected && !active}
                                      active={opt.id === active}
                                      isOnlyStandardViews={isOnlyStandardViews}
                                      disabled={isHidden}
                                      editMode={editMode}
                                      isDragDisabled={isDragDisabled}
                                    >
                                      <s.MenuItemContent>
                                        {editMode && !isDragDisabled && (
                                          <s.DragHandleIcon name='drag' size={12} isDragging={snapshot.isDragging} />
                                        )}
                                        <s.MenuItemText editMode={editMode} disabled={isHidden}>
                                          {opt.name}
                                        </s.MenuItemText>
                                        {editMode && (
                                          <s.IconsContainer
                                            style={{
                                              justifyContent:
                                                categoryName === standardCategoryName ? 'center' : undefined,
                                            }}
                                          >
                                            {/* Standard Views don't display edit icon, Shared Views do but disable it for non-admins */}
                                            {(() => {
                                              const showEditIcon = categoryName !== standardCategoryName;
                                              const isSharedViewForNonAdmin =
                                                categoryName === sharedCategoryName && !isAdminOrCustomizer;
                                              const editIconDisabled = isSharedViewForNonAdmin || isHidden;
                                              const tooltipText = isSharedViewForNonAdmin ? (
                                                <>
                                                  Editable only for <br />
                                                  author and admin
                                                </>
                                              ) : (
                                                'Edit'
                                              );

                                              return (
                                                showEditIcon && (
                                                  <PortalTooltip content={tooltipText}>
                                                    <s.StyledIcon
                                                      name='edit-V4'
                                                      disabled={editIconDisabled}
                                                      onClick={
                                                        !editIconDisabled ? () => handleEditIconClick(opt) : undefined
                                                      }
                                                    />
                                                  </PortalTooltip>
                                                )
                                              );
                                            })()}
                                            {isDefaultView(opt.id) ? (
                                              <PortalTooltip content='Default view'>
                                                <s.StyledIcon
                                                  name='star-filled-V4'
                                                  style={{ color: '#FDCB2E' }}
                                                  onClick={
                                                    !isHidden ? () => handleSetDefaultView(opt.id, false) : undefined
                                                  }
                                                />
                                              </PortalTooltip>
                                            ) : (
                                              <PortalTooltip
                                                content={
                                                  isHidden
                                                    ? 'Hidden views cannot be set as default.'
                                                    : 'Set as my default view'
                                                }
                                              >
                                                <s.StyledIcon
                                                  name='star-empty-V4'
                                                  disabled={isHidden}
                                                  onClick={
                                                    !isHidden ? () => handleSetDefaultView(opt.id, true) : undefined
                                                  }
                                                />
                                              </PortalTooltip>
                                            )}

                                            {/* Show/Hide toggle with proper tooltip and state */}
                                            {categoryName !== standardCategoryName && renderEyeIcon(opt, isHidden)}
                                          </s.IconsContainer>
                                        )}
                                      </s.MenuItemContent>
                                    </s.StyledMenuItem>
                                  </s.DraggableViewItem>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                          {categoryName !== standardCategoryName &&
                            placeholderProps.droppableId === `${id}-filter-droppable-${categoryName}` && (
                              <s.DropPlaceholder
                                style={{
                                  top: placeholderProps.clientY,
                                  left: placeholderProps.clientX,
                                  height: placeholderProps.clientHeight,
                                  width: placeholderProps.clientWidth,
                                }}
                              />
                            )}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  {optIndex < filteredOptions.length - 1 && <s.ViewsDivider />}
                </React.Fragment>
              );
            })}
          </s.ViewsList>
        </>
      );
    }

    // Fallback: render as simple flat list
    const optionsArray = Array.isArray(options) ? options : [];
    const filteredOptionsArray = optionsArray.filter(shouldShowOption);

    return filteredOptionsArray.map((opt) => {
      const isHidden = isViewHidden(opt.id);
      return (
        <s.StyledMenuItem
          id={`${id}-${opt.id}`}
          key={opt.id}
          onClick={(e) => handleSelect(opt, e)}
          selected={opt.id === selected && !active}
          active={opt.id === active}
          isOnlyStandardViews={false}
          disabled={isHidden}
        >
          <s.MenuItemContent>
            <s.MenuItemText editMode={editMode} disabled={isHidden}>
              {opt.name}
            </s.MenuItemText>
            {editMode && (
              <s.IconsContainer>
                {isDefaultView(opt.id) ? (
                  <PortalTooltip content='Default view'>
                    <s.StyledIcon
                      name='star-filled-V4'
                      style={{ color: '#FDCB2E' }}
                      onClick={!isHidden ? () => handleSetDefaultView(opt.id, false) : undefined}
                    />
                  </PortalTooltip>
                ) : (
                  <PortalTooltip
                    content={isHidden ? 'Hidden views cannot be set as default.' : 'Set as my default view'}
                  >
                    <s.StyledIcon
                      name='star-empty-V4'
                      disabled={isHidden}
                      onClick={!isHidden ? () => handleSetDefaultView(opt.id, true) : undefined}
                    />
                  </PortalTooltip>
                )}
              </s.IconsContainer>
            )}
          </s.MenuItemContent>
        </s.StyledMenuItem>
      );
    });
  };

  const renderIconMenuList = () => {
    // Check if EGCustomViews = true
    if (isCustomViewEnabled) {
      return (
        <IconMenuList
          id={`${id}-FILTER`}
          disabled={disabled}
          horizontalAlign='right'
          onKeyUp={handleKeyPress}
          inline
          relativeToParent
          open={open}
          onToggle={handleToggle}
          preventAutoClose={editModalOpen} // should stay open behind edit dialog
          marginThreshold={0}
          maxHeight={436}
          scrollable
          popoverStyle={{
            width: 320,
            maxHeight: '436px',
            overflow: 'hidden',
            borderRadius: '8px',
          }}
        >
          {renderOptions()}
        </IconMenuList>
      );
    }

    const optionsArray = Array.isArray(options) ? options : [];
    return (
      <IconMenuList
        id={`${id}-FILTER`}
        disabled={disabled}
        horizontalAlign='right'
        onKeyUp={handleKeyPress}
        inline
        relativeToParent
        open={open}
        onToggle={handleToggle}
        marginThreshold={0}
        maxHeight={300}
        popoverStyle={{ minWidth: 160 }}
      >
        {optionsArray.map((opt) => (
          <MenuItem
            id={`${id}-${opt.id}`}
            key={opt.id}
            onClick={(e) => handleSelect(opt, e)}
            selected={opt.id === selected && !active}
            active={opt.id === active}
          >
            {opt.name}
          </MenuItem>
        ))}
      </IconMenuList>
    );
  };

  return (
    <s.Wrapper isCustomViewEnabled={isCustomViewEnabled} backgroundHoverColor={colors['grey-lighter']}>
      <s.FilterName id={`${id}-FILTER-SELECTED`} onClick={handleToggle}>
        {title}
      </s.FilterName>
      {renderIconMenuList()}
    </s.Wrapper>
  );
}

Filter.defaultProps = {
  disabled: false,
  options: [],
  selected: null,
  onSelect: null,
  isAdminOrCustomizer: false,
  isCustomViewEnabled: false,
  onClickShowSaveGridViewDialog: null,
  onToggleViewVisibility: null,
  defaultViewId: null,
  isDesignMode: false,
};

Filter.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  options: PropTypes.oneOfType([
    // Flat array of options
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        columns: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
        sorting: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
        filtering: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
        enableDynamicDates: PropTypes.bool,
      }),
    ),
    // Array of [categoryName, categoryOptions] pairs for categorized options
    PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.string, // category name
          PropTypes.arrayOf(
            // category options
            PropTypes.shape({
              id: PropTypes.string,
              name: PropTypes.string,
              columns: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
              sorting: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
              filtering: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
              enableDynamicDates: PropTypes.bool,
            }),
          ),
        ]),
      ),
    ),
  ]),
  selected: PropTypes.string,
  onSelect: PropTypes.func,
  isCustomViewEnabled: PropTypes.bool,
  isAdminOrCustomizer: PropTypes.bool,
  onClickShowSaveGridViewDialog: PropTypes.func,
  onToggleViewVisibility: PropTypes.func,
  defaultViewId: PropTypes.string,
  onCustomViewsDragEnd: PropTypes.func,
  handleCustomViewsManageDoneClick: PropTypes.func,
  isMobile: PropTypes.bool,
  onSetDefaultView: PropTypes.func,
  isDesignMode: PropTypes.bool,
};

export default Filter;
