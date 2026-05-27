import React, { useEffect, useState, useRef, createContext } from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import * as s from './Body.styles';
import Loader from './Loader';
import NoResults from './NoResults';

export const RowHeightContext = createContext({ recentRowHeights: [], isLoading: false });

const propTypes = {
  id: PropTypes.string,
  showHeader: PropTypes.bool,
  isLoading: PropTypes.bool,
  totalRows: PropTypes.number,
  searchValue: PropTypes.string,
  emptyStateComponent: PropTypes.func,
  borderlessLoader: PropTypes.bool,
  loaderTopPadding: PropTypes.number,
  tableBodyBackgroundColor: PropTypes.string,
  draggable: PropTypes.bool,
  children: PropTypes.node,
  noSearchResults: PropTypes.bool,
  onViewAll: PropTypes.func,
  hasAdvancedSearch: PropTypes.bool,
};

function Body({
  id,
  showHeader,
  isLoading,
  totalRows,
  emptyStateComponent,
  borderlessLoader,
  loaderTopPadding,
  tableBodyBackgroundColor,
  draggable,
  children,
  noSearchResults,
  onViewAll,
  searchValue,
  hasAdvancedSearch,
}) {
  const tBodyRef = useRef(null);
  const [recentRowHeights, setRecentRowHeights] = useState([]);

  useEffect(() => {
    // Capture natural row heights from content when not loading
    // Heights are applied during render via Context in Cell.jsx
    if (tBodyRef.current && !isLoading) {
      const rows = tBodyRef.current.querySelectorAll('tr');
      const heights = Array.from(rows).map((row) => row.getBoundingClientRect().height);
      // Only update if we got valid heights (> 0)
      if (heights.length > 0 && heights.some((h) => h > 0)) {
        setRecentRowHeights(heights);
      }
    }
  }, [children, isLoading]);

  const renderDraggable = () => (
    <Droppable droppableId='droppable' type='ROW'>
      {(provided) => (
        <s.Tbody
          showHeader={showHeader}
          isLoading={isLoading}
          tableBodyBackgroundColor={tableBodyBackgroundColor}
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {isLoading && totalRows === 0 && (
            <s.LoaderRow id={`${id}-loading`} borderlessLoader={borderlessLoader}>
              <s.LoaderCell id={`${id}-LOADING-CELL`} loaderTopPadding={loaderTopPadding} colSpan='100'>
                <Loader />
              </s.LoaderCell>
            </s.LoaderRow>
          )}

          {noSearchResults && (
            <tr id={`${id}-NO-RESULTS-FOUND`}>
              {emptyStateComponent ? (
                emptyStateComponent()
              ) : (
                <NoResults
                  id={id}
                  onViewAll={onViewAll}
                  searchValue={searchValue}
                  hasAdvancedSearch={hasAdvancedSearch}
                />
              )}
            </tr>
          )}

          {totalRows > 0 && !noSearchResults && (
            <RowHeightContext.Provider value={{ recentRowHeights, isLoading }}>{children}</RowHeightContext.Provider>
          )}
          {provided.placeholder}
        </s.Tbody>
      )}
    </Droppable>
  );

  const render = () => (
    <s.Tbody
      ref={tBodyRef}
      showHeader={showHeader}
      isLoading={isLoading}
      tableBodyBackgroundColor={tableBodyBackgroundColor}
    >
      {isLoading && totalRows === 0 && (
        <s.LoaderRow id={`${id}-loading`} borderlessLoader={borderlessLoader}>
          <s.LoaderCell id={`${id}-LOADING-CELL`} loaderTopPadding={loaderTopPadding} colSpan='100'>
            <Loader />
          </s.LoaderCell>
        </s.LoaderRow>
      )}

      {noSearchResults && (
        <tr id={`${id}-NO-RESULTS-FOUND`}>
          {emptyStateComponent ? (
            emptyStateComponent()
          ) : (
            <NoResults id={id} onViewAll={onViewAll} searchValue={searchValue} hasAdvancedSearch={hasAdvancedSearch} />
          )}
        </tr>
      )}
      {totalRows > 0 && !noSearchResults && (
        <RowHeightContext.Provider value={{ recentRowHeights, isLoading }}>{children}</RowHeightContext.Provider>
      )}
    </s.Tbody>
  );

  return draggable ? renderDraggable() : render();
}

Body.propTypes = propTypes;
export default Body;
