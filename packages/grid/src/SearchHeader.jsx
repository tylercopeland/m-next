import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Sorting } from '@m-next/types';
import { breakpointNames, colors } from '@m-next/styles';
import Caption from '@m-next/caption';
import Container from '@m-next/container';
import SvgIcon from '@m-next/svg-icon';
import Popover from '@m-next/popover';
import * as s from './SearchHeader.styles';
import { STATUSES } from './utilities';
import Filter from './components/Header/Filter';
import Search from './components/Header/Search';
import Sort from './components/Header/Sort';
import Column from './ColumnPropType';
import ShowHideColumns from './components/Header/ShowHideColumns/ShowHideColumns';
import Menu from './components/Header/Menu/Menu';

const propTypes = {
  id: PropTypes.string,
  disabled: PropTypes.bool,
  caption: PropTypes.string,
  focusSearchInputOnLoad: PropTypes.bool,
  searchValue: PropTypes.string,
  searchable: PropTypes.bool,
  selectedView: PropTypes.string,
  showExport: PropTypes.bool,
  showInlineExport: PropTypes.bool,
  showViewFilter: PropTypes.bool,
  showReload: PropTypes.bool,
  viewFilters: PropTypes.oneOfType([
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
  onChangeView: PropTypes.func,
  onExport: PropTypes.func,
  onRefresh: PropTypes.func,
  hideCaption: PropTypes.bool,
  actionButton: PropTypes.instanceOf(Object),
  onSearch: PropTypes.func,
  showSelectedRecords: PropTypes.bool,
  controlStyle: PropTypes.instanceOf(Object),
  rowStatuses: PropTypes.arrayOf(PropTypes.number),
  totalRows: PropTypes.number,

  checked: PropTypes.bool,
  deletedRecordsCount: PropTypes.number,
  allRecordsOnOnePage: PropTypes.bool,
  totalRecords: PropTypes.number,
  halfChecked: PropTypes.bool,
  onSelectAll: PropTypes.func,
  selectedOnPage: PropTypes.number,
  newLinesAdded: PropTypes.bool,
  totalCheckboxesOnPage: PropTypes.number,
  searchStyle: PropTypes.instanceOf(Object),
  onChangeColumnSorting: PropTypes.func,
  columns: PropTypes.arrayOf(Column),
  fullColumnList: PropTypes.arrayOf(Column),
  sorting: Sorting,
  invertSelection: PropTypes.bool,
  selectedRecordIds: PropTypes.arrayOf(PropTypes.number),
  size: PropTypes.string,
  hasAdvancedSearch: PropTypes.bool,
  chipsFilterCount: PropTypes.number,
  onToggleAdvancedSearchDrawer: PropTypes.func,
  parentMaxWidth: PropTypes.number,
  showShowHideColumns: PropTypes.bool,
  activeColumns: PropTypes.arrayOf(Column),
  onChangeActiveColumns: PropTypes.func,
  customActions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ),
  onCustomActionClick: PropTypes.func,
  showSelectable: PropTypes.bool,
  allColumns: PropTypes.arrayOf(Column),
  isCustomViewEnabled: PropTypes.bool,
  egCustomViewsSaveButtonEnabled: PropTypes.bool,
  onClickShowSaveGridViewDialog: PropTypes.func,
  isAdminOrCustomizer: PropTypes.bool,
  defaultViewId: PropTypes.string,
  onToggleViewVisibility: PropTypes.func,
  onCustomViewsDragEnd: PropTypes.func,
  handleCustomViewsManageDoneClick: PropTypes.func,
  isMobile: PropTypes.bool,
  onSetDefaultView: PropTypes.func,
  isDesignMode: PropTypes.bool,
  isV4Design: PropTypes.bool,
};
function SearchHeader({
  id,
  showViewFilter,
  viewFilters,
  disabled,
  showSelectedRecords,
  selectedView,
  onChangeView,
  caption,
  hideCaption,
  controlStyle,
  actionButton,
  searchable,
  onSearch,
  searchValue,
  focusSearchInputOnLoad,
  showReload,
  onRefresh,
  showExport,
  showInlineExport,
  onExport,
  rowStatuses,
  totalRows,
  checked,
  deletedRecordsCount,
  allRecordsOnOnePage,
  totalRecords,
  halfChecked,
  onSelectAll,
  selectedOnPage,
  newLinesAdded,
  totalCheckboxesOnPage,
  searchStyle,
  onChangeColumnSorting,
  columns,
  sorting,
  selectedRecordIds,
  invertSelection,
  size,
  hasAdvancedSearch,
  chipsFilterCount,
  onToggleAdvancedSearchDrawer,
  parentMaxWidth,
  showShowHideColumns,
  onChangeActiveColumns,
  customActions,
  onCustomActionClick,
  fullColumnList,
  activeColumns,
  isCustomViewEnabled,
  egCustomViewsSaveButtonEnabled,
  onClickShowSaveGridViewDialog,
  isAdminOrCustomizer = false,
  defaultViewId,
  onToggleViewVisibility,
  onCustomViewsDragEnd,
  handleCustomViewsManageDoneClick,
  isMobile,
  onSetDefaultView,
  isDesignMode,
  isV4Design = false,
}) {
  const showSort = parentMaxWidth < 480 && typeof onChangeColumnSorting === 'function';
  const showShowHide = parentMaxWidth < 480 && showShowHideColumns;

  const anchorEl = useRef(null);

  const [sortOpen, setSortOpen] = useState(false);
  const [sortToggle, setSortToggle] = useState(false);
  const [showHideOpen, setShowHideOpen] = useState(false);
  const [showHideToggle, setShowHideToggle] = useState(false);

  const rowCount = useMemo(() => {
    let count = 0;
    if (totalRows > 0 && (!rowStatuses || rowStatuses.length === 0)) return totalRows;

    for (let i = 0; i < totalRows; i++) {
      if (
        !rowStatuses ||
        (rowStatuses[i] !== undefined && rowStatuses[i] !== null && rowStatuses[i] !== STATUSES.blank)
      ) {
        count += 1;
      }
    }
    return count;
  }, [rowStatuses, totalRows]);

  // Helper function to count total views in options array
  const getTotalViewCount = () => {
    if (Array.isArray(viewFilters) && viewFilters.length > 0 && Array.isArray(viewFilters[0])) {
      // Categorized options format: [categoryName, categoryOptions]
      return viewFilters.reduce((total, [, categoryOptions]) => total + categoryOptions.length, 0);
    }
    if (Array.isArray(viewFilters)) {
      // Flat array format
      return viewFilters.length;
    }
    return 0;
  };

  const handleSelectAll = (isChecked) => {
    onSelectAll(isChecked);
  };

  const handleLinkKeyPress = (e, linkName) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
      if (linkName === 'selectAll') handleSelectAll(true);
      if (linkName === 'clear') handleSelectAll(false);
    }
  };

  const handleCloseSort = () => {
    setSortOpen(false);
    setSortToggle(true);
    setTimeout(() => {
      setSortToggle(false);
    }, 100);
  };

  const handleOpenSort = () => {
    if (!sortOpen && !sortToggle) {
      setSortOpen(true);
      setSortToggle(true);
    }
  };

  const handleSortToggle = () => {
    if (sortOpen) handleCloseSort();
    else handleOpenSort();
  };

  const handleCloseShowHide = () => {
    setShowHideOpen(false);
    setShowHideToggle(true);
    setTimeout(() => {
      setShowHideToggle(false);
    }, 100);
  };

  const handleOpenShowHide = () => {
    if (!showHideOpen && !showHideToggle) {
      setShowHideOpen(true);
      setShowHideToggle(true);
    }
  };

  const handleShowHideToggle = () => {
    if (showHideOpen) handleCloseShowHide();
    else handleOpenShowHide();
  };

  const renderPartialSelectionHeader = () => {
    let count = selectedRecordIds.length;
    if (invertSelection && selectedRecordIds?.length > 0) count = totalRecords - selectedRecordIds.length;
    if (allRecordsOnOnePage) count = selectedOnPage;
    if (!allRecordsOnOnePage && newLinesAdded) count = selectedOnPage;

    let allRecords = '';
    if (allRecordsOnOnePage) allRecords = totalCheckboxesOnPage;
    if (!allRecordsOnOnePage && totalRecords - !!deletedRecordsCount) allRecords = totalRecords - deletedRecordsCount;

    // Add new active lines to total count
    if (newLinesAdded && !allRecordsOnOnePage && totalRecords > 0) {
      rowStatuses.forEach((status) => {
        if (status === STATUSES.new) {
          allRecords += 1;
        }
      });
    }

    let text = '1 record is selected. ';
    if (count > 1) {
      text = `${count} records are selected.`;
    }

    return (
      <s.SelectedHeader id={`${id}-HEADER-ROW-SELECTED`}>
        {text}
        {(allRecords > 1 || totalRows > 1) && (
          <s.SelectAllLink
            id={`${id}-HEADER-ROW-SELECTED-SELECT-ALL`}
            onKeyDown={(e) => handleLinkKeyPress(e, 'selectAll')}
            onClick={() => handleSelectAll(true)}
            tabIndex='0'
          >
            {' '}
            Select all {allRecords} records{' '}
          </s.SelectAllLink>
        )}
        {(allRecords > 1 || totalRows > 1) && <> or </>}
        <s.SelectAllLink
          id={`${id}-HEADER-ROW-SELECTED-SELECT-ALL`}
          onKeyDown={(e) => handleLinkKeyPress(e, 'clear')}
          onClick={() => handleSelectAll(false)}
          tabIndex='0'
        >
          {' '}
          Clear selection
        </s.SelectAllLink>
      </s.SelectedHeader>
    );
  };

  const renderAllSelectedHeader = () => {
    let allRecords = allRecordsOnOnePage ? totalCheckboxesOnPage : totalRecords;

    // Add new active lines to total count
    if (newLinesAdded && !allRecordsOnOnePage && totalRecords > 0) {
      rowStatuses.forEach((status) => {
        if (status === STATUSES.new) {
          allRecords += 1;
        }
      });
    }

    let text = '1 record is selected.';
    if (allRecords > 1) text = `All ${allRecords} records are selected.`;

    return (
      <s.SelectedHeader id={`${id}-HEADER-ROW-SELECTED`}>
        {text}{' '}
        <s.SelectAllLink
          id={`${id}-HEADER-ROW-SELECTED-SELECT-ALL`}
          onKeyDown={(e) => handleLinkKeyPress(e, 'clear')}
          onClick={() => handleSelectAll(false)}
          tabIndex='0'
        >
          {' '}
          Clear selection
        </s.SelectAllLink>
      </s.SelectedHeader>
    );
  };

  const renderSelectedHeaderText = () => {
    // Don't show selection header if grid is empty
    if (totalRows === 0) return '';

    // If 'Select all' checkbox is clicked OR all checkboxes are selected
    if (checked) {
      if (invertSelection) {
        if (selectedRecordIds?.length === 0) return renderAllSelectedHeader();
        if (deletedRecordsCount > 0 && selectedRecordIds.length === deletedRecordsCount)
          return renderAllSelectedHeader();
      }

      if (allRecordsOnOnePage) return renderAllSelectedHeader();
      if (!allRecordsOnOnePage && totalRecords === selectedRecordIds.length) return renderAllSelectedHeader();
      return renderPartialSelectionHeader();
    }

    // If 'Select all' checkbox is NOT clicked
    if (halfChecked) return renderPartialSelectionHeader();

    // At least one row is selected
    if (selectedRecordIds.length > 0) return renderPartialSelectionHeader();

    return '';
  };

  const render = () => {
    const renderFilter = () => (
      <Filter
        id={id}
        disabled={disabled || showSelectedRecords}
        selected={selectedView}
        options={viewFilters}
        onSelect={onChangeView}
        isCustomViewEnabled={isCustomViewEnabled}
        isAdminOrCustomizer={isAdminOrCustomizer}
        onClickShowSaveGridViewDialog={onClickShowSaveGridViewDialog}
        onToggleViewVisibility={onToggleViewVisibility}
        defaultViewId={defaultViewId}
        onCustomViewsDragEnd={onCustomViewsDragEnd}
        handleCustomViewsManageDoneClick={handleCustomViewsManageDoneClick}
        isMobile={isMobile}
        onSetDefaultView={onSetDefaultView}
        isDesignMode={isDesignMode}
      />
    );

    const renderCaption = () => (
      <Caption
        id={id}
        align={controlStyle && controlStyle.capAlign ? controlStyle.capAlign : null}
        color={controlStyle && controlStyle.capColor ? controlStyle.capColor : null}
        label={caption}
        style={{ marginTop: 8 }}
      />
    );

    const renderSearch = () => (
      <Search
        id={`${id}-SIMPLE-SEARCH-WRAPPER`}
        onSubmit={onSearch}
        initialSearch={searchValue}
        focusOnLoad={focusSearchInputOnLoad}
        disabled={disabled || showSelectedRecords}
      />
    );

    const renderShowHide = (returnCodeSnippet = false) => (
      <ShowHideColumns
        id={`${id}-GRID-COLUMN-SELECTION`}
        columns={fullColumnList}
        activeColumns={activeColumns}
        onChange={onChangeActiveColumns}
        returnCodeSnippet={returnCodeSnippet}
        isV4Design={isV4Design}
      />
    );

    const renderSort = (returnCodeSnippet = false) => (
      <Sort
        id={`${id}-sort`}
        columns={columns}
        sorting={sorting}
        onChangeColumnSorting={onChangeColumnSorting}
        disabled={disabled || showSelectedRecords}
        returnCodeSnippet={returnCodeSnippet}
      />
    );

    const renderAdvancedSearch = () => (
      <div style={{ position: 'relative' }}>
        <SvgIcon
          id={`${id}-advanced-search-icon`}
          name='filter-V4'
          size={16}
          onClick={onToggleAdvancedSearchDrawer}
          border
          isV4Design
          backgroundColor={colors.white}
          backgroundHoverColor={colors['grey-lighter']}
        />
        {egCustomViewsSaveButtonEnabled && chipsFilterCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -9,
              right: -7,
              padding: '1.5px 5px',
              backgroundColor: 'white',
              border: `1px solid ${colors['grey-light']}`,
              borderRadius: '50%',
              fontSize: 12,
            }}
          >
            {chipsFilterCount ?? 0}
          </span>
        )}
      </div>
    );

    const renderMenu = () => {
      const menu = () => (
        <Menu
          id={`${id}-grid-menu`}
          onExport={onExport}
          onRefresh={onRefresh}
          onSort={handleSortToggle}
          onShowHideColumns={handleShowHideToggle}
          showExport={showExport}
          showRefresh={showReload}
          showSort={showSort}
          showShowHide={showShowHide}
          rowCount={rowCount}
          size={size}
          disabled={disabled || showSelectedRecords}
          customActions={customActions}
          onCustomActionClick={onCustomActionClick}
        />
      );

      if (showSort || showShowHide) {
        return (
          <div id={`${id}-grid-menu-wrapper`} ref={anchorEl}>
            {menu()}
            <Popover
              id={`${id}-menu-sort`}
              open={sortOpen}
              anchorEl={anchorEl.current}
              onClose={handleCloseSort}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              marginVertical={12}
              inline={!isV4Design}
              relativeToParent={!isV4Design}
            >
              <Container id={`${id}-menu-sort`} role='menu' style={{ gap: '8px' }} padding={8} width={220}>
                {renderSort(true)}
              </Container>
            </Popover>
            <Popover
              id={`${id}-menu-show-hide`}
              open={showHideOpen}
              anchorEl={anchorEl.current}
              onClose={handleCloseShowHide}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              marginVertical={12}
              inline={!isV4Design}
              relativeToParent={!isV4Design}
            >
              <Container id={`${id}-menu-show-hide`} role='menu' style={{ gap: '8px' }} padding={8} width={220}>
                {renderShowHide(true)}
              </Container>
            </Popover>
          </div>
        );
      }
      return menu();
    };
    const hideSearchHeader =
      !showExport &&
      !showReload &&
      !searchable &&
      !onChangeColumnSorting &&
      !actionButton &&
      !showInlineExport &&
      !showShowHideColumns &&
      (viewFilters.length <= 1 || !showViewFilter) &&
      (!caption || hideCaption) &&
      (!customActions || customActions.length === 0);

    const showKebabMenu =
      showExport || showReload || showSort || showShowHide || (customActions && customActions.length > 0);

    if (hideSearchHeader) return null;
    if (!size && parentMaxWidth < 480) {
      return (
        <s.SmallHeaderWrapper parentMaxWidth={parentMaxWidth}>
          {((!isCustomViewEnabled && viewFilters.length > 1) || (isCustomViewEnabled && getTotalViewCount() > 1)) &&
            (showViewFilter || showKebabMenu) && (
              <s.SmallFilterWrapper>
                {showViewFilter && renderFilter()}
                {caption && !hideCaption && (!showViewFilter || viewFilters.length < 2) && renderCaption()}
                {actionButton && <s.ActionButtonWrapper>{actionButton}</s.ActionButtonWrapper>}
                {showKebabMenu && renderMenu()}
              </s.SmallFilterWrapper>
            )}
          <s.SmallSearchBarWrapper>
            {searchable && renderSearch()}
            {hasAdvancedSearch && searchable && renderAdvancedSearch()}
            {viewFilters.length === 1 && showKebabMenu && renderMenu()}
            {(selectedRecordIds.length > 0 || selectedOnPage > 0 || checked || halfChecked) && (
              <s.SelectedWrapper>{renderSelectedHeaderText()}</s.SelectedWrapper>
            )}
          </s.SmallSearchBarWrapper>
        </s.SmallHeaderWrapper>
      );
    }
    if (size === breakpointNames.xs) {
      return (
        <s.SearchHeaderWrapper size={size}>
          <s.FilterWrapper size={size}>
            {((!isCustomViewEnabled && viewFilters.length > 1) || (isCustomViewEnabled && getTotalViewCount() > 1)) &&
              showViewFilter &&
              renderFilter()}
            {caption && !hideCaption && (!showViewFilter || viewFilters.length < 2) && renderCaption()}
            {actionButton && <s.ActionButtonWrapper>{actionButton}</s.ActionButtonWrapper>}
          </s.FilterWrapper>
          <s.FillerSpacer />
          {(showExport || showReload || (customActions && customActions.length > 0)) && (
            <s.MenuWrapper size={size}>{renderMenu()}</s.MenuWrapper>
          )}
          <s.MobileBreak size={size} order={3} tabIndex={-1} />
          {searchable && (
            <s.SearchWrapper style={searchStyle} size={size}>
              {renderSearch()}
            </s.SearchWrapper>
          )}

          {onChangeColumnSorting && <s.SortWrapper size={size}>{renderSort()}</s.SortWrapper>}
          {showShowHideColumns && renderShowHide()}
          <s.MobileBreak size={size} order={6} tabIndex={-1} />

          <s.SelectedWrapper size={size}>{renderSelectedHeaderText()}</s.SelectedWrapper>
        </s.SearchHeaderWrapper>
      );
    }
    return (
      <s.SearchHeaderWrapper size={size}>
        <s.FilterWrapper size={size} searchable={searchable}>
          {((!isCustomViewEnabled && viewFilters.length > 1) || (isCustomViewEnabled && getTotalViewCount() > 1)) &&
            showViewFilter &&
            renderFilter()}
          {caption && !hideCaption && (!showViewFilter || viewFilters.length < 2) && renderCaption()}
          {actionButton && <s.ActionButtonWrapper>{actionButton}</s.ActionButtonWrapper>}
        </s.FilterWrapper>
        <s.SelectedWrapper size={size} searchable={searchable}>
          {renderSelectedHeaderText()}
        </s.SelectedWrapper>
        {searchable && (
          <s.SearchWrapper style={searchStyle} size={size}>
            {renderSearch()}
          </s.SearchWrapper>
        )}
        {hasAdvancedSearch && searchable && renderAdvancedSearch()}
        {onChangeColumnSorting && <s.SortWrapper size={size}>{renderSort()}</s.SortWrapper>}
        {showShowHideColumns && renderShowHide()}
        {showInlineExport && !showExport && (
          <SvgIcon
            id={`${id}-DOWNLOAD`}
            disabled={disabled}
            onClick={onExport}
            name='cloud-download'
            size={16}
            border
            backgroundColor={colors.white}
            backgroundHoverColor={colors['grey-lighter']}
          />
        )}
        {(showExport || showReload || (customActions && customActions.length > 0)) && (
          <s.MenuWrapper size={size}>{renderMenu()}</s.MenuWrapper>
        )}
      </s.SearchHeaderWrapper>
    );
  };

  return render();
}

SearchHeader.propTypes = propTypes;
export default SearchHeader;
