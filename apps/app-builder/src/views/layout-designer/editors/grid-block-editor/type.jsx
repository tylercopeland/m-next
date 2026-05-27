import { Field } from '@m-next/types';
import PropTypes, { instanceOf } from 'prop-types';

export const GridColumnModel = PropTypes.shape({
  controlId: PropTypes.string,
  header: PropTypes.string,
  field: PropTypes.string,
  fieldType: PropTypes.number,
  columnType: PropTypes.number,
  onChangeEvent: PropTypes.string,
  defaultValue: PropTypes.instanceOf(Object),
  readOnly: PropTypes.bool,
  canDelete: PropTypes.bool,
  isLocked: PropTypes.bool,
  cardColumnFields: PropTypes.arrayOf(
    PropTypes.shape({
      fldTypeId: PropTypes.number,
      label: PropTypes.string,
      table: PropTypes.string,
      format: PropTypes.shape({}),
    }),
  ),
  showOnMobile: PropTypes.bool,
  format: PropTypes.shape({}),
  validationRules: PropTypes.arrayOf(PropTypes.shape({})),
  control: PropTypes.instanceOf(Object),
  expression: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  hasColumnTotal: PropTypes.bool,
  formula: PropTypes.string,
});

export const GridViewModel = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  sorting: PropTypes.arrayOf(
    PropTypes.shape({
      filterField: PropTypes.string,
      filterOrder: PropTypes.string,
    }),
  ),
  filtering: PropTypes.arrayOf(instanceOf(Object)),
  columns: PropTypes.arrayOf(Field),
});

export const GridModel = PropTypes.shape({
  id: PropTypes.string,
  showSort: PropTypes.bool,
  showRefresh: PropTypes.bool,
  showExport: PropTypes.bool,
  isSearchable: PropTypes.bool,
  isSelectable: PropTypes.bool,
  canReorderColumns: PropTypes.bool,
  showDeleteColumn: PropTypes.bool,
  showGoToPage: PropTypes.bool,
  showDeleteConfirmation: PropTypes.bool,
  canAddMoreRows: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isResponsive: PropTypes.bool,
  paging: PropTypes.shape({
    pageSize: PropTypes.number,
  }),
  columns: PropTypes.arrayOf(GridColumnModel),
});

export default GridModel;
