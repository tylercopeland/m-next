import * as React from 'react';
import { TIFFViewer } from 'react-tiff';
import PropTypes from 'prop-types';
import SvgIcon from '@m-next/svg-icon';
import * as s from './gallery.styles';

function Gallery({ disabled = false, isLoading = false, items = [], loadingItemCount = 4, size = 192, id = '' }) {
  const generateOpacities = (count) => Array.from({ length: count }, (_, index) => 1 - (index + 1) / (count + 1));

  const handleClick = (item) => {
    if (item.action && !disabled) item.action();
  };

  return (
    <s.Gallery id={id}>
      {isLoading && (
        <s.Items size={size} isLoading={isLoading} id={`${id}-ITEMS`}>
          {generateOpacities(loadingItemCount).map((opacity, index) => (
            <s.Thumbnail key={opacity} opacity={opacity} id={`${id}-${index}-ITEM-IMAGE-EMPTY`}>
              <s.EmptyImage>
                <SvgIcon size={32} name='picture' />
              </s.EmptyImage>
              <figcaption>Loading...</figcaption>
            </s.Thumbnail>
          ))}
        </s.Items>
      )}
      {!isLoading && !!items.length && (
        <s.Items size={size} id={`${id}-ITEMS`}>
          {items.map((item) => (
            <s.Thumbnail
              key={item.id}
              showActionCursor={!!item.action && !disabled}
              onClick={() => handleClick(item)}
              id={`${id}-ITEM-${item.id}`}
            >
              {item.imageURL &&
                (['tif', 'tiff'].includes(item.imageURL.split('.').pop().toLowerCase()) ? (
                  <s.TiffContainer ariaLabel={`image: ${item.caption}`}>
                    <TIFFViewer tabIndex='-1' title={item.tooltip} tiff={item.imageURL} />
                  </s.TiffContainer>
                ) : (
                  <img
                    src={item.imageURL}
                    title={item.tooltip}
                    alt='no description available'
                    id={`${id}-ITEM-IMAGE-${item.id}`}
                  />
                ))}
              {!item.imageURL && (
                <s.EmptyImage title={item.tooltip} id={`${id}-ITEM-IMAGE-EMPTY`}>
                  <SvgIcon size={32} name='picture' />
                </s.EmptyImage>
              )}
              {item.caption && (
                <figcaption title={item.caption} id={`${id}-ITEM-CAPTION-${item.id}`}>
                  {item.caption}
                </figcaption>
              )}
            </s.Thumbnail>
          ))}
        </s.Items>
      )}
    </s.Gallery>
  );
}

Gallery.propTypes = {
  id: PropTypes.string,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  loadingItemCount: PropTypes.number,
  size: PropTypes.number,
  items: PropTypes.arrayOf(
    PropTypes.exact({
      action: PropTypes.func,
      caption: PropTypes.string,
      id: PropTypes.string.isRequired,
      imageURL: PropTypes.string,
      tooltip: PropTypes.string,
    }),
  ),
};

export default Gallery;
