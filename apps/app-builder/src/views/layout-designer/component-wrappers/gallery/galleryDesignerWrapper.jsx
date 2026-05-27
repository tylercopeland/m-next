import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Gallery from '@m-next/gallery';
import * as s from './galleryDesignerWrapper.styles';
import { selectActiveRecordId, selectControls } from '../../../../common/services/screenLayoutSlice';
import { useGetGalleryDataLegacyQuery } from '../../../../common/services/runtimeApi';
import Pagination from './Pagination';
import { selectScreenId } from '../../../../common/services/appSlice';

function GalleryDesignWrapper({ id, onControlClick }) {
  const activeRecordId = useSelector(selectActiveRecordId);
  const screenId = useSelector(selectScreenId);
  const control = useSelector((state) => selectControls(state)[id]);
  const [pageSize, setPageSize] = useState(20);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchString, setSearchString] = useState('');
  const [items, setItems] = useState([]);
  const [isMeasuring, setIsMeasuring] = useState(true);

  const galleryRef = useRef(null);

  const { data, isFetching } = useGetGalleryDataLegacyQuery(
    {
      id: control?.id,
      screenId,
      activeRecordId,
      body: {
        screenState: null,
        model: {
          ...control?.model,
          viewFilter: { ...control?.model?.viewFilter, searchString },
          paging: { pageSize, pageNumber },
        },
      },
    },
    { skip: !control || !control.model || !control.model.viewName || isMeasuring },
  );

  useEffect(() => {
    if (!control) {
      return;
    }
    setPageNumber(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [control?.model?.viewName, control?.model?.viewFilter, searchString]);

  useEffect(() => {
    if (galleryRef.current) {
      const { width } = galleryRef.current.getBoundingClientRect();
      let itemsPerRow = Math.floor(width / 200);
      if (itemsPerRow === 0) {
        itemsPerRow = 1;
      }

      setPageSize(itemsPerRow * 3);
      setPageNumber(1);
      setIsMeasuring(false);
    }
  }, [galleryRef]);

  useEffect(() => {
    if (data?.pageItems) {
      setItems(data.pageItems);
      setTotalItems(data.totalItems);
    }
  }, [data]);

  const handleKeyDown = ({ key, target }) => {
    if (key === 'Enter') setSearchString(target.value);
    else if (key === 'Escape') setSearchString('');
  };

  const handlePageChange = (page) => {
    setPageNumber(page);
  };

  // Check if gallery is not configured (no table or no image field on the table)
  const isNotConfigured = !control.model?.viewName || !control.model?.imageField;

  // If not configured, show empty state message
  if (isNotConfigured) {
    return (
      <s.EmptyWrapper ref={galleryRef}>
        <strong>Gallery not configured</strong>
        <span>Select a table with an image field in the right panel to configure</span>
      </s.EmptyWrapper>
    );
  }

  return (
    <s.GalleryWrapper ref={galleryRef}>
      <s.Header hasCaption={!control.hideCaption && control.caption}>
        {!control.hideCaption && control.caption && (
          <s.Caption id={`${id}-GALLERY-CAPTION`}>{control.caption}</s.Caption>
        )}
        <s.SeachBox
          id={`${id}-GALLERY-SEARCH-INPUT`}
          type='search'
          placeholder='Search'
          isMobile={false}
          onKeyDown={handleKeyDown}
          onFocus={() => onControlClick(control.id)}
        />
      </s.Header>
      <Gallery
        id={`${id}-GALLERY`}
        disabled={control.disabled}
        isLoading={isFetching}
        loadingItemCount={pageSize}
        items={items}
      />
      {!isFetching && items.length === 0 && <s.Empty id={`${id}-GALLERY-NO-RESULTS`}>No Results Found</s.Empty>}
      {totalItems > pageSize && (
        <s.PaginationWrapper>
          <Pagination
            id={`${id}-GALLERY`}
            pageNumber={pageNumber}
            perPage={pageSize}
            totalRecords={totalItems}
            onClickNext={() => {
              handlePageChange(pageNumber + 1);
            }}
            onClickPrevious={() => {
              handlePageChange(pageNumber - 1);
            }}
          />
        </s.PaginationWrapper>
      )}
    </s.GalleryWrapper>
  );
}

GalleryDesignWrapper.propTypes = {
  id: PropTypes.string.isRequired,
  onControlClick: PropTypes.func.isRequired,
};

export default GalleryDesignWrapper;
