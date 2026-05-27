/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import * as s from './Pagination.styles';
import GoToPage from './GoToPage';

function Pagination({
  id,
  onClickMany,
  onClickNext,
  onClickPrevious,
  onPageSelect,
  pageNumber,
  perPage,
  rowStatuses,
  style,
  totalRecords,
  totalRows,
  isPartialCount,
  isMobile,
  hideRecordCount,
  disableGoToPage = true,
}) {
  const [pages, setPages] = useState(null);

  const [realPageNumber, setRealPageNumber] = useState(pageNumber);
  const [recordCount, setRecordCount] = useState(totalRecords || null);

  useEffect(() => {
    setRealPageNumber(totalRecords && !isPartialCount ? Math.min(pages, pageNumber) : pageNumber);
  }, [pageNumber, pages]);

  useEffect(() => {
    if (totalRecords === null) {
      let currentRecordCount = recordCount;
      const prevCount = realPageNumber * perPage - perPage;

      if (totalRows) {
        if (realPageNumber > 1) {
          currentRecordCount = totalRows + prevCount;
        } else {
          currentRecordCount = totalRows;
        }
      }

      setRecordCount(currentRecordCount);
      setPages(Math.ceil(currentRecordCount / perPage) || 1);
    } else {
      setPages(Math.ceil(totalRecords / perPage) || 1);
    }

    const hasNewRecords = rowStatuses.indexOf(3) > -1;
    if (hasNewRecords) {
      let recordCountCopy = recordCount;
      rowStatuses.forEach((item) => {
        if (item === 3) recordCountCopy += 1;
      });
      setRecordCount(recordCountCopy);
    }
  }, [totalRows, totalRecords]);

  useEffect(() => {
    setPages(Math.ceil(recordCount / perPage) !== 0 ? Math.ceil(recordCount / perPage) : 1);
  }, [perPage]);

  useEffect(() => {
    if (totalRecords !== null) {
      setRecordCount(totalRecords);
    }
    setPages(Math.ceil(totalRecords / perPage) !== 0 ? Math.ceil(totalRecords / perPage) : 1);
  }, [totalRecords]);

  const handleClickMany = () => {
    if (onClickMany) {
      onClickMany();
    }
  };

  const handleKeyPressMany = (e) => {
    // Enter or Space key press
    if (e.keyCode === 13 || e.keyCode === 32) {
      if (onClickMany) onClickMany();
    }
  };

  const handlePrevious = () => {
    if (onClickPrevious) {
      const prev = realPageNumber - 1 < 1 ? 1 : realPageNumber - 1;
      onClickPrevious(prev);
    }
  };

  const handleNext = () => {
    if (onClickNext) {
      const next = realPageNumber + 1 > pages && !isPartialCount ? pages : realPageNumber + 1;
      onClickNext(next);
    }
  };

  const renderRecordCount = useCallback(() => {
    if (totalRecords && !isPartialCount) {
      return <s.Text>{totalRecords} results</s.Text>;
    }
    return (
      <s.Text>
        <s.ManyLink id={`${id}-MORE`} onKeyDown={handleKeyPressMany} onClick={handleClickMany} tabIndex='0'>
          Many
        </s.ManyLink>
        &nbsp;results
      </s.Text>
    );
  }, [totalRecords, realPageNumber, perPage, pages, isPartialCount]);

  return hideRecordCount ? null : (
    <s.Container id={`${id}-PAGINATION`} style={style} isMobile={isMobile}>
      {pages === 1 && (
        <s.Text>
          {totalRecords || totalRows || 0} {totalRecords === 1 || totalRows === 1 ? 'result' : 'results'}{' '}
        </s.Text>
      )}
      {pages > 1 && (
        <>
          {pages > 5 && renderRecordCount()}
          {pages <= 5 && <s.Text>{recordCount || 0} results </s.Text>}
          <s.Button
            alt='Previous Page'
            id={`${id}-PREVIOUS`}
            disabled={realPageNumber === 1}
            onClick={handlePrevious}
            prev
            title='Previous Page'
          >
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
              <path d='M12,19.5a2.3,2.3,0,0,1-1.729-.78L.46,7.568A1.847,1.847,0,0,1,3.233,5.129l8.579,9.752a.25.25,0,0,0,.376,0l8.579-9.752A1.847,1.847,0,1,1,23.54,7.568L13.732,18.716A2.31,2.31,0,0,1,12,19.5Z' />
            </svg>
          </s.Button>
          {onPageSelect && (
            <GoToPage
              id={`${id}-GOTOPAGE`}
              totalRows={totalRows}
              totalRecords={totalRecords}
              pageNumber={realPageNumber}
              perPage={perPage}
              onPageSelect={onPageSelect}
              disabled={disableGoToPage}
            />
          )}
          <s.Button
            alt='Next Page'
            id={`${id}-NEXT`}
            disabled={realPageNumber === pages && !isPartialCount}
            onClick={handleNext}
            title='Next Page'
          >
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
              <path d='M12,19.5a2.3,2.3,0,0,1-1.729-.78L.46,7.568A1.847,1.847,0,0,1,3.233,5.129l8.579,9.752a.25.25,0,0,0,.376,0l8.579-9.752A1.847,1.847,0,1,1,23.54,7.568L13.732,18.716A2.31,2.31,0,0,1,12,19.5Z' />
            </svg>
          </s.Button>
        </>
      )}
    </s.Container>
  );
}

Pagination.defaultProps = {
  id: null,
  pageNumber: null,
  perPage: null,
  totalRecords: null,
  totalRows: null,
  isPartialCount: false,
  style: null,
  onClickMany: null,
  onClickNext: null,
  onClickPrevious: null,
  onPageSelect: null,
  isMobile: false,
};

Pagination.propTypes = {
  id: PropTypes.string,
  rowStatuses: PropTypes.instanceOf(Array),
  pageNumber: PropTypes.number,
  isPartialCount: PropTypes.bool,
  perPage: PropTypes.number,
  totalRecords: PropTypes.number,
  totalRows: PropTypes.number,
  style: PropTypes.instanceOf(Object),
  onClickMany: PropTypes.func,
  onClickNext: PropTypes.func,
  onClickPrevious: PropTypes.func,
  onPageSelect: PropTypes.func,
  isMobile: PropTypes.bool,
  hideRecordCount: PropTypes.bool,
  disableGoToPage: PropTypes.bool,
};

export default Pagination;
