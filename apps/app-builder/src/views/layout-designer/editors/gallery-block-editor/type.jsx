import PropTypes from 'prop-types';
import { ExpressionElement } from '@m-next/types';

export const GalleryFilterModel = PropTypes.shape({
  expression: PropTypes.arrayOf(ExpressionElement),
  id: PropTypes.string,
  name: PropTypes.string,
  sorting: PropTypes.arrayOf(
    PropTypes.shape({
      filterField: PropTypes.string,
      filterOrder: PropTypes.string,
    }),
  ),
});

export const GalleryModel = PropTypes.shape({
  id: PropTypes.string,
  caption: PropTypes.string,
  hideCaption: PropTypes.bool,
  name: PropTypes.string,
  onClick: PropTypes.string,
  filterDef: PropTypes.arrayOf(GalleryFilterModel),
  model: PropTypes.shape({
    imageField: PropTypes.string,
    captionField: PropTypes.string,
    baseTable: PropTypes.string,
    viewName: PropTypes.string,
    viewFilter: GalleryFilterModel,
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        field: PropTypes.string,
        visible: PropTypes.bool,
      }),
    ),
  }),
  visible: PropTypes.bool,
  disabled: PropTypes.bool,
});

export default GalleryModel;
